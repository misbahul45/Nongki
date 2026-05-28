# Session Management

## Session Storage

- Sessions are stored per businessId + sessionName combination.
- MVP uses file-based session storage in `storage/sessions/`.
- Session files must NOT be committed to version control.

### Path Pattern

```
storage/sessions/{businessId}/{sessionName}/
```

### Media Storage Path

```
storage/media/{businessId}/
```

## Session Lifecycle

| State | Description |
|-------|-------------|
| not_connected | No session exists for this business |
| qr_pending | Baileys is waiting for QR scan |
| connecting | QR scanned, establishing connection |
| connected | WhatsApp session is active |
| disconnected | Connection lost (may auto-reconnect) |
| expired | QR expired or session expired |
| error | Session encountered an unrecoverable error |

## QR Handling

- QR codes have a TTL (default 60 seconds, configurable via `WA_QR_TTL_SECONDS`).
- QR is stored temporarily in memory only — never persisted to disk.
- If QR expires, the user must request a new QR via the start/reconnect endpoint.
- QR is delivered to the API as a base64 string or data URL.

## Reconnection

- Auto-reconnect is enabled by default (`WA_RECONNECT_ENABLED=true`).
- On disconnect, WA Worker will attempt to reconnect with exponential backoff.
- Configurable: `WA_RECONNECT_MAX_ATTEMPTS`, `WA_RECONNECT_BASE_DELAY_MS`, `WA_RECONNECT_MAX_DELAY_MS`.
- WA Worker notifies API of connection status changes.
- If max reconnect attempts are exhausted, session enters "disconnected" state.

## Logout

- Logout endpoint (`POST /sessions/:businessId/logout`) deletes session files.
- After logout, session state resets to "not_connected".
- A new QR scan is required to use WhatsApp again.

## Security

- Session files contain sensitive authentication credentials.
- Storage directory must be excluded from version control (.gitignore).
- Session files should be treated as secrets.
