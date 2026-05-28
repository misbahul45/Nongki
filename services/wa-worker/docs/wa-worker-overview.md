# WA Worker Overview

## Role

WA Worker is the WhatsApp protocol engine for Ningki. It handles all direct communication with WhatsApp via the Baileys library.

## Responsibilities

- Connect to WhatsApp using Baileys
- Generate QR codes for authentication
- Manage WhatsApp sessions per business
- Maintain reconnection on disconnect
- Receive incoming messages from WhatsApp
- Normalize incoming message payloads
- Forward normalized messages to services/api
- Receive send-message commands from services/api
- Send outgoing messages to WhatsApp
- Report session status changes to services/api
- Basic media handling (download, temporary storage)

## Boundaries (NOT Responsibilities)

- **No AI reasoning** — that belongs in services/ai-enggine
- **No CRM business logic** — customers, conversations, orders, reservations, reminders are handled by services/api
- **No direct database access** — all persistence goes through services/api
- **No payment processing**
- **No complex media processing** (e.g., transcoding)

## Relationship with services/api

```
[WhatsApp] <--Baileys--> [WA Worker] <--HTTP--> [services/api]
```

- WA Worker sends incoming messages to API (POST /internal/wa/incoming-message)
- WA Worker sends session status to API (POST /internal/wa/session-status)
- WA Worker sends message delivery status to API (POST /internal/wa/message-status)
- API sends send-message commands to WA Worker (POST /messages/send)

## Communication Pattern

- WA Worker is an HTTP server that exposes endpoints for API
- WA Worker also acts as an HTTP client that POSTs events to API
- All internal communication uses internal tokens for authentication

## MVP Boundaries

For MVP, WA Worker focuses on:
1. Health check
2. Start WhatsApp session
3. Generate QR
4. Report session status
5. Receive incoming messages
6. Normalize and forward to API
7. Send outgoing messages
8. Basic disconnect/reconnect
9. Notify API of status changes
