# API Overview

## Role of services/api
- Pusat business logic platform Ningki.
- Menjembatani Apps Web, AI Engine, dan WA Worker.
- Menyimpan data di PostgreSQL melalui Prisma.
- Bertanggung jawab atas Tenant Isolation (Business ID).

## Core Principles
- Semua data harus difilter berdasarkan `business_id`.
- Komunikasi antar service menggunakan token internal.
- Validasi ketat menggunakan Zod di setiap endpoint.
