# Message Flow

## Core Principle

WA Worker does NOT create customers, conversations, reservations, orders, or reminders.
WA Worker ONLY receives and sends WhatsApp messages. All business logic and persistence happen in services/api.

## Incoming Message Flow

```
[WhatsApp] --Baileys messages.upsert--> [WA Worker]
                                              |
                                    1. Normalize phone (08xx → 628xx)
                                    2. Normalize message type
                                    3. Extract text / media content
                                    4. Attach waMessageId
                                    5. Build normalized payload
                                    6. POST to API /internal/wa/incoming-message
                                              |
                                         [services/api]
                                     (store, process, route)
```

### Normalization Steps

1. **Phone**: Convert local format (08xxx) to international (628xxx). Strip non-digit characters.
2. **Message Type**: Map Baileys message type to normalized type: text, image, document, audio, video, sticker, location.
3. **Content**: Extract text body. For media, download and store temporarily, then provide mediaUrl.
4. **Metadata**: Attach waMessageId, timestamp, sender info.

## Outgoing Message Flow

```
[services/api]
      |
POST /messages/send
      |
[WA Worker]
      |
1. Validate payload (schema)
2. Validate target phone format
3. Find active session
4. Send via Baileys socket
5. Return delivery result
6. Optionally notify API of status
      |
[WhatsApp]
```

## Media Flow

- Incoming media: Download via Baileys → store temporarily in `storage/media/{businessId}/` → provide local path → forward metadata to API.
- Outgoing media: Receive mediaUrl from API → download if needed → send via Baileys.
- Media files are stored temporarily and may be cleaned up after processing.
- For MVP, media handling is basic — no cloud upload, no transcoding.

## Idempotency

- Incoming messages carry a `waMessageId` (unique WhatsApp message ID).
- API is responsible for deduplication by `waMessageId`.
- WA Worker may retry sending events to API if the request fails (with backoff).
- Outgoing messages should carry an idempotency key if the API requires dedup.
