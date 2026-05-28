# Baileys Flow

## Start Session

```
API calls WA Worker start session
↓
WA Worker creates Baileys socket
↓
Baileys emits QR
↓
WA Worker stores QR temporarily
↓
WA Worker sends session-status to API
↓
Web dashboard fetches QR from API
↓
User scans QR
↓
Baileys connected
↓
WA Worker sends connected status to API
```

## Incoming Message

```
Customer sends WhatsApp message
↓
Baileys receives messages.upsert
↓
WA Worker extracts message
↓
WA Worker normalizes payload
↓
WA Worker sends incoming-message event to API
↓
API stores customer/conversation/message
↓
API calls AI Engine
↓
API sends AI reply command to WA Worker
↓
WA Worker sends reply via Baileys
```

## Outgoing Message

```
API sends POST /messages/send to WA Worker
↓
WA Worker validates payload
↓
WA Worker finds active session
↓
WA Worker sends message via Baileys
↓
WA Worker returns message status
↓
WA Worker optionally notifies API
```

## Disconnect / Reconnect

```
Baileys connection closed
↓
WA Worker detects reason
↓
If reconnect enabled, retry
↓
WA Worker sends disconnected/error status to API
↓
Dashboard shows reconnect required if needed
```

## Events Handled

| Event | Action |
|-------|--------|
| messages.upsert | Extract incoming message, normalize, forward to API |
| connection.update | Update session state, notify API |
| creds.update | Persist updated credentials |
| messages.update | Track message delivery status |
| contacts.update | Notify API of contact updates |
