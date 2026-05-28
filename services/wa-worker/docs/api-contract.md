# API Contract — WA Worker ↔ services/api

## Incoming WhatsApp Message (WA Worker → API)

```
POST {API_URL}/internal/wa/incoming-message
```

```typescript
type IncomingWhatsAppMessage = {
  businessId: string
  sessionId?: string
  sessionName: string
  waMessageId: string
  fromPhone: string
  customerName?: string
  messageType: "text" | "image" | "document" | "audio" | "video" | "sticker" | "location"
  text?: string
  mediaUrl?: string
  mediaMimeType?: string
  timestamp: string
  raw?: unknown
}
```

## Outgoing Message (API → WA Worker)

```
POST /messages/send
```

```typescript
type OutgoingWhatsAppMessage = {
  businessId: string
  sessionName?: string
  toPhone: string
  messageType: "text" | "image" | "document"
  text?: string
  mediaUrl?: string
  fileName?: string
  metadata?: Record<string, unknown>
}
```

## Session Status Event (WA Worker → API)

```
POST {API_URL}/internal/wa/session-status
```

```typescript
type WhatsappSessionStatusEvent = {
  businessId: string
  sessionName: string
  status:
    | "not_connected"
    | "qr_pending"
    | "connecting"
    | "connected"
    | "disconnected"
    | "expired"
    | "error"
  phoneNumber?: string
  qrCode?: string
  qrExpiresAt?: string
  reason?: string
  timestamp: string
}
```

## Message Delivery Status (WA Worker → API)

```
POST {API_URL}/internal/wa/message-status
```

```typescript
type MessageStatusEvent = {
  businessId: string
  waMessageId: string
  status: "sent" | "delivered" | "read" | "failed"
  timestamp: string
  error?: string
}
```

## Error Notification (WA Worker → API)

```
POST {API_URL}/internal/wa/error
```

```typescript
type ErrorEvent = {
  businessId: string
  sessionName: string
  errorType: "connection" | "send" | "auth" | "media" | "unknown"
  message: string
  timestamp: string
  details?: unknown
}
```
