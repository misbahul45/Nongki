import type { NormalizedIncomingMessage, MessageType } from "./whatsapp.types.js"

export function normalizeKey(key: { remoteJid?: string | null }): string | null {
  if (!key.remoteJid) return null
  const jid = key.remoteJid
  const parts = jid.split("@")
  return parts[0] ?? null
}

export function detectMessageType(msg: Record<string, unknown>): MessageType {
  if (msg.conversation || msg.extendedTextMessage) return "text"
  if (msg.imageMessage) return "image"
  if (msg.audioMessage) return "audio"
  if (msg.videoMessage) return "video"
  if (msg.documentMessage) return "document"
  return "unknown"
}

export function extractText(msg: Record<string, unknown>): string | undefined {
  if (typeof msg.conversation === "string") return msg.conversation
  const ext = msg.extendedTextMessage as { text?: string } | undefined
  if (ext?.text) return ext.text
  const img = msg.imageMessage as { caption?: string } | undefined
  if (img?.caption) return img.caption
  const vid = msg.videoMessage as { caption?: string } | undefined
  if (vid?.caption) return vid.caption
  return undefined
}

export function normalizeIncomingMessage(
  businessId: string,
  msg: Record<string, unknown>,
): NormalizedIncomingMessage | null {
  const key = msg.key as { remoteJid?: string; participant?: string } | undefined
  if (!key) return null

  const rawFrom = key.participant || key.remoteJid
  if (!rawFrom) return null

  const from = normalizeKey({ remoteJid: rawFrom })
  if (!from) return null

  const messageContent = (msg.message as Record<string, unknown>) || {}
  const messageType = detectMessageType(messageContent)
  const text = extractText(messageContent)

  return {
    businessId,
    from,
    messageType,
    text,
    raw: msg,
  }
}
