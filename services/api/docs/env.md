# Environment Variables

## Configuration
- API membaca root `.env` dari path `../../.env`.
- Konfigurasi divalidasi saat startup di `src/env.ts`.

## Essential Vars
- `DATABASE_URL`: Koneksi PostgreSQL.
- `JWT_SECRET`: Secret untuk token user.
- `API_INTERNAL_TOKEN`: Token untuk keamanan internal API.
- `AI_ENGINE_URL`: Base URL AI Engine service.
- `WA_WORKER_URL`: Base URL WA Worker service.
