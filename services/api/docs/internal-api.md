# Internal API

Endpoint yang khusus digunakan untuk komunikasi antar service (AI Engine & WA Worker).

## Security
- Wajib menyertakan header `X-Internal-Token` dengan nilai `API_INTERNAL_TOKEN`.

## Endpoints
- `/internal/ai/*` (Context for AI)
- `/internal/wa/*` (Webhook from WA Worker)
- `/internal/tools/*` (Tool execution by AI)
