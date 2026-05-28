import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  type WASocket,
} from "@whiskeysockets/baileys"

import path from "node:path"
import fs from "node:fs"
import { env } from "../config/env.js"
import { logger } from "../core/logger.js"
import { apiClient } from "../core/http-client.js"
import { normalizeIncomingMessage } from "./message.normalizer.js"
import type { ConnectionStatus, SessionState } from "./whatsapp.types.js"

class SessionManager {
  private sessions = new Map<string, { socket: WASocket; state: SessionState }>()

  private getAuthDir(businessId: string): string {
    return path.resolve(env.WHATSAPP_AUTH_DIR, businessId)
  }

  private updateStatus(businessId: string, status: ConnectionStatus, extra?: Partial<SessionState>) {
    const session = this.sessions.get(businessId)
    if (session) {
      session.state = {
        ...session.state,
        status,
        updatedAt: new Date().toISOString(),
        ...extra,
      }
    }
  }

  private getStatus(businessId: string): SessionState {
    const existing = this.sessions.get(businessId)?.state
    if (existing) return existing
    return {
      businessId,
      status: "idle",
      qr: null,
      phoneNumber: null,
      updatedAt: new Date().toISOString(),
    }
  }

  private async callbackIncomingMessage(businessId: string, msg: Record<string, unknown>) {
    try {
      const normalized = normalizeIncomingMessage(businessId, msg)
      if (!normalized) return

      await apiClient.post("/api/internal/wa/messages/inbound", normalized)
    } catch (error) {
      logger.error({ err: error, businessId }, "Failed to callback incoming message to API")
    }
  }

  async startSession(businessId: string): Promise<SessionState> {
    const existing = this.sessions.get(businessId)
    if (existing?.state.status === "connected" || existing?.state.status === "connecting") {
      return existing.state
    }

    const authDir = this.getAuthDir(businessId)
    fs.mkdirSync(authDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    const { version } = await fetchLatestBaileysVersion()

    const socket = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      syncFullHistory: false,
      browser: ["Nongki WA Worker", "Chrome", "22"],
    })

    const session: SessionState = {
      businessId,
      status: "connecting",
      qr: null,
      phoneNumber: null,
      updatedAt: new Date().toISOString(),
    }

    this.sessions.set(businessId, { socket, state: session })

    socket.ev.on("creds.update", saveCreds)

    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        this.updateStatus(businessId, "qr", { qr })
      }

      if (connection === "connecting") {
        this.updateStatus(businessId, "connecting")
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } })?.output?.statusCode
        const isLoggedOut = statusCode === DisconnectReason.loggedOut

        if (isLoggedOut) {
          this.sessions.delete(businessId)
        }
        this.updateStatus(businessId, "disconnected")
      }

      if (connection === "open") {
        const phoneNumber: string | null = socket.user?.id
          ? socket.user.id.split("@")[0] ?? null
          : null

        this.updateStatus(businessId, "connected", {
          qr: null,
          phoneNumber,
        })
      }
    })

    socket.ev.on("messages.upsert", async (m) => {
      for (const msg of m.messages) {
        if (msg.key?.fromMe) continue
        await this.callbackIncomingMessage(businessId, msg as unknown as Record<string, unknown>)
      }
    })

    return this.getStatus(businessId)
  }

  getSessionStatus(businessId: string): SessionState {
    return this.getStatus(businessId)
  }

  async stopSession(businessId: string): Promise<SessionState> {
    const session = this.sessions.get(businessId)
    if (session?.socket) {
      session.socket.end(undefined)
      session.socket.ws?.close()
    }
    this.updateStatus(businessId, "disconnected")
    return this.getStatus(businessId)
  }

  async sendTextMessage(
    businessId: string,
    to: string,
    text: string,
  ): Promise<{ messageId: string } | null> {
    const session = this.sessions.get(businessId)
    if (!session || session.state.status !== "connected") {
      return null
    }

    const jid = `${to}@s.whatsapp.net`
    const result = await session.socket.sendMessage(jid, { text })
    if (!result) return { messageId: "unknown" }
    return { messageId: result.key?.id ?? "unknown" }
  }

  async sendPresence(businessId: string, to: string, state: "composing" | "paused") {
    const session = this.sessions.get(businessId)
    if (!session || session.state.status !== "connected") return

    const jid = `${to}@s.whatsapp.net`
    const presence = state === "composing" ? "composing" : "paused"
    await session.socket.sendPresenceUpdate(presence, jid)
  }
}

export const sessionManager = new SessionManager()
