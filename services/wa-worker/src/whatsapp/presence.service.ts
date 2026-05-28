import type { WASocket } from "@whiskeysockets/baileys"

export type PresenceState = "composing" | "paused"

export async function sendPresence(
  socket: WASocket,
  jid: string,
  state: PresenceState,
): Promise<void> {
  const presence = state === "composing" ? "composing" : "paused"
  await socket.sendPresenceUpdate(presence, jid)
}
