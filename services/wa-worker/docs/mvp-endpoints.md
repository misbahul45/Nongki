# MVP Endpoints — WA Worker

## Health

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "wa-worker"
}
```

## Sessions

### Start Session

```
POST /sessions/:businessId/start
```

Start a new WhatsApp session for a business. Returns QR code if successful.

### Get Session Status

```
GET /sessions/:businessId/status
```

Returns the current status of the WhatsApp session.

### Get QR Code

```
GET /sessions/:businessId/qr
```

Returns the current QR code (if status is qr_pending).

### Disconnect

```
POST /sessions/:businessId/disconnect
```

Disconnect the WhatsApp session (without deleting session files).

### Reconnect

```
POST /sessions/:businessId/reconnect
```

Force reconnect the WhatsApp session.

### Logout

```
POST /sessions/:businessId/logout
```

Disconnect and delete session files. Requires re-scanning QR.

## Messages

### Send Text Message

```
POST /messages/send
```

Body:
```json
{
  "businessId": "string",
  "toPhone": "string",
  "text": "string",
  "sessionName": "string (optional)"
}
```

### Send Media Message

```
POST /messages/send-media
```

Body (multipart or JSON with mediaUrl):
```json
{
  "businessId": "string",
  "toPhone": "string",
  "messageType": "image | document",
  "mediaUrl": "string",
  "fileName": "string (optional)",
  "caption": "string (optional)"
}
```

### Get Message Status

```
GET /messages/:messageId/status
```

Returns the delivery status of a previously sent message.

## Internal Endpoints (Protected by Internal Token)

### Get Session Status (Internal)

```
GET /internal/sessions/:businessId/status
```

### Start Session (Internal)

```
POST /internal/sessions/:businessId/start
```

### Send Message (Internal)

```
POST /internal/messages/send
```

## Events Sent to API

WA Worker sends these events to services/api:

| Method | Endpoint | Event |
|--------|----------|-------|
| POST | `{API_URL}/internal/wa/incoming-message` | New incoming WhatsApp message |
| POST | `{API_URL}/internal/wa/session-status` | Session status change |
| POST | `{API_URL}/internal/wa/message-status` | Message delivery status update |
| POST | `{API_URL}/internal/wa/error` | Error notification |
