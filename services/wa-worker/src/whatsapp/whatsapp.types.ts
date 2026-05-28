export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "qr"
  | "connected"
  | "disconnected"
  | "error"

export type MessageType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "document"
  | "unknown"

export type NormalizedIncomingMessage = {
  businessId: string
  from: string
  messageType: MessageType
  text: string | undefined
  raw: unknown
}

export type SessionState = {
  businessId: string
  status: ConnectionStatus
  qr: string | null
  phoneNumber: string | null
  updatedAt: string
}
