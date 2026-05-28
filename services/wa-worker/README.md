# Ningki WA Worker

WhatsApp engine service for Ningki.

## Responsibilities

- Connect WhatsApp via Baileys
- Generate QR login
- Manage WhatsApp sessions
- Receive incoming messages
- Normalize WhatsApp payload
- Send incoming events to services/api
- Send outgoing messages from services/api
- Handle reconnect and session status
- Basic media handling

## Not Responsibilities

- AI reasoning
- CRM business logic
- Database write
- Reservation/order logic
- Reminder logic

## Tech Stack

- Node.js
- TypeScript
- Fastify
- Baileys
- Zod
- Pino

## Env

WA Worker uses env vars documented in `.env.example`.
Root `.env` at `../../.env` is read at runtime.
Do NOT edit root `.env` automatically.

## MVP Priority

1. Health endpoint
2. Start WhatsApp session
3. Generate QR
4. Session status
5. Incoming message normalization
6. Send message
7. Disconnect/reconnect
8. Notify API

## Project Structure

```
src/
├── server.ts          # Entry point
├── app.ts             # Fastify app factory
├── routes.ts          # Route registration
├── env.ts             # Env loader
├── baileys/           # Baileys integration
├── modules/           # Feature modules
├── clients/           # API client
├── queues/            # Queue placeholders
├── middlewares/       # Fastify middlewares
├── plugins/           # Fastify plugins
├── schemas/           # Zod schemas
├── lib/               # Utilities
└── types/             # TypeScript types
docs/                  # Documentation
tests/                 # Test placeholders
storage/               # Session and media storage
```
