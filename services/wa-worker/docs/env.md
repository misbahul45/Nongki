# Environment Variables — WA Worker

## Overview

WA Worker reads environment variables from the root `.env` file (`../../.env` relative to services/wa-worker).

This file documents the subset of env vars that WA Worker uses.

## Env Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `WA_WORKER_PORT` | `4000` | Port for WA Worker HTTP server |
| `HOST` | `0.0.0.0` | Host to bind to |
| `API_URL` | `http://localhost:3000` | Base URL of services/api |
| `API_INTERNAL_TOKEN` | — | Token for API to authenticate requests to WA Worker |
| `WA_WORKER_INTERNAL_TOKEN` | — | Token for WA Worker to authenticate requests to API |
| `WA_SESSION_DIR` | `./storage/sessions` | Session file storage path |
| `WA_MEDIA_DIR` | `./storage/media` | Media file storage path |
| `WA_DEFAULT_SESSION_NAME` | `default` | Default session name if not specified |
| `WA_QR_TTL_SECONDS` | `60` | QR code TTL in seconds |
| `WA_RECONNECT_ENABLED` | `true` | Enable auto-reconnect |
| `WA_RECONNECT_MAX_ATTEMPTS` | `10` | Max reconnect attempts |
| `WA_RECONNECT_BASE_DELAY_MS` | `1000` | Initial reconnect delay |
| `WA_RECONNECT_MAX_DELAY_MS` | `30000` | Max reconnect delay |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL (future) |
| `LOG_LEVEL` | `info` | Pino log level |
| `PRETTY_LOG` | `true` | Pretty-print logs in development |

## Important Notes

- WA Worker reads root `.env` from `../../.env` — do NOT create a separate `.env` in services/wa-worker.
- The `.env.example` file in services/wa-worker serves as documentation only.
- Secrets (tokens, API keys) must be kept in `.env` and never committed.
- Sensitive variables:
  - `API_INTERNAL_TOKEN`
  - `WA_WORKER_INTERNAL_TOKEN`
- Session storage directory should be excluded from version control.

## .gitignore Recommendation

Add to `services/wa-worker/.gitignore`:

```gitignore
.env
.env.*
!.env.example
storage/sessions/
storage/media/
```

Do NOT modify the root `.gitignore` unless explicitly asked.
