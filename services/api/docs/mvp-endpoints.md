=# Ningki/Nongki — MVP API Goal & Implementation Roadmap

> Dokumen ini fokus untuk mengejar **MVP bagian `services/api`** berdasarkan Prisma DB model dan flow ekosistem microservice. Prinsip utamanya: **API adalah satu-satunya service yang boleh akses PostgreSQL langsung**. `apps/web`, `services/ai-engine`, dan `services/wa-worker` hanya boleh komunikasi lewat HTTP contract ke `services/api`.

---

## 1. MVP Goal

### 1.1 Goal utama MVP

MVP Ningki/Nongki adalah sistem **AI WhatsApp assistant untuk bisnis F&B/service kecil** yang bisa:

1. Membuat workspace bisnis dari proses register.
2. Mengarahkan owner melewati onboarding bisnis.
3. Menyimpan knowledge bisnis seperti menu, FAQ, promo, jam buka, lokasi, policy reservasi, dan policy order.
4. Menghubungkan WhatsApp bisnis melalui `wa-worker`.
5. Menerima pesan customer WhatsApp.
6. Menyimpan customer, conversation, dan message history.
7. Meminta AI membalas customer berdasarkan context bisnis + knowledge.
8. Membuat reservasi sederhana via AI.
9. Membuat order sederhana via AI.
10. Melakukan human handoff jika AI tidak bisa menjawab atau customer minta admin.
11. Memberi dashboard data minimum untuk admin: inbox, customer, knowledge, reservation, order, handoff, notification.

### 1.2 Definisi sukses MVP

MVP dianggap sukses kalau demo bisa menunjukkan flow ini end-to-end:

```txt
Owner register
→ workspace bisnis dibuat
→ onboarding basic selesai
→ upload/input menu dan FAQ
→ WhatsApp connected
→ bot enabled
→ customer chat WhatsApp
→ AI jawab berdasarkan menu/FAQ
→ customer buat reservasi/order
→ data masuk dashboard admin
→ jika customer minta admin, bot stop dan admin bisa balas manual
```

### 1.3 Bukan goal MVP

Fitur berikut **ditunda setelah MVP** agar backend bisa cepat selesai:

- AstraPay QRIS production-ready.
- Google Sheets OAuth production-ready.
- Multi-role permission detail yang kompleks.
- Analytics advanced.
- Billing/subscription SaaS.
- Omnichannel selain WhatsApp.
- Full vector database hosted. Untuk MVP cukup FAISS lokal di `ai-engine`.
- Full notification realtime pakai websocket. Untuk MVP boleh polling.
- Complex campaign/promo automation.

---

## 2. Arsitektur Ekosistem

```txt
apps/web
  ↓ REST API public/admin
services/api
  ↓ HTTP internal
services/ai-engine
  ↔ FAISS local per businessId

services/wa-worker
  ↓ HTTP internal event
services/api
  ↓ HTTP internal send command
services/wa-worker
```

### 2.1 Aturan mutlak service

| Service | Boleh akses DB langsung? | Tanggung jawab |
|---|---:|---|
| `services/api` | Ya | Owner utama PostgreSQL, auth, business logic, transaction, audit, API contract |
| `apps/web` | Tidak | UI dashboard/onboarding, hanya panggil API |
| `services/ai-engine` | Tidak | Agent reasoning, knowledge processing, FAISS, tool call via API |
| `services/wa-worker` | Tidak | Baileys session, QR, receive/send WhatsApp, event ke API |

### 2.2 Prinsip tenant isolation

Semua query data bisnis wajib memakai `businessId`.

Contoh:

```ts
where: {
  id: reservationId,
  businessId: ctx.businessId,
}
```

Tidak boleh query entity tenant-sensitive hanya berdasarkan `id`.

---

## 3. Scope Modul MVP API

### P0 — Wajib untuk demo end-to-end

| Modul | Status MVP | Tujuan |
|---|---|---|
| Auth | Wajib | Register, login, session user |
| Business Workspace | Wajib | Create/read/update workspace bisnis |
| Onboarding | Wajib | Step setup bisnis sampai ready |
| Agent Settings | Wajib | Persona, tone, auto reply, handoff rule |
| Knowledge | Wajib | Input/upload knowledge dan indexing ke AI |
| WhatsApp Session | Wajib | Start session, QR, status connected, enable bot |
| Customer | Wajib | Upsert customer dari WhatsApp, list CRM basic |
| Conversation & Message | Wajib | Inbox admin, history, send admin reply |
| AI Internal Contract | Wajib | API menerima result AI dan menyediakan context |
| Reservation | Wajib | Create/list/confirm/cancel reservasi |
| Order | Wajib | Create/list/update order sederhana |
| Human Handoff | Wajib | AI stop, admin takeover, return to AI |
| Notification | Wajib basic | Admin alert untuk handoff/reservation/order/error |
| Audit Log | Wajib basic | Catat action penting |

### P1 — Setelah P0 stabil

| Modul | Status | Tujuan |
|---|---|---|
| Product Category/Product CRUD lengkap | P1 tapi bisa sebagian P0 | Menu structured untuk AI/order |
| Reminder Cron | P1 | Reminder reservasi/payment/admin task |
| File upload storage real | P1 | Local dulu, cloud nanti |
| Spreadsheet Sync | P1 | Export customers/orders/reservations |
| Payment Manual/QRIS mock | P1 | Payment status tracking tanpa AstraPay production |

### P2 — Post-MVP

| Modul | Tujuan |
|---|---|
| AstraPay real callback | Production payment |
| Google Sheets OAuth real | Production sync |
| Advanced analytics | Insight bisnis |
| Team permission detail | RBAC granular |
| Multi-agent observability advanced | Debug production |

---

## 4. Data Model MVP yang Dipakai

### 4.1 Core identity & workspace

- `users`
- `businesses`
- `business_members`

Dipakai untuk auth, workspace, ownership, dan akses dashboard.

### 4.2 Onboarding & agent config

- `business_onboarding`
- `onboarding_steps`
- `agent_settings`

Dipakai untuk guided setup dan menentukan apakah bot boleh aktif.

### 4.3 WhatsApp & chat

- `whatsapp_sessions`
- `customers`
- `conversations`
- `messages`

Dipakai untuk menerima pesan, menyimpan history, inbox admin, dan state human takeover.

### 4.4 Knowledge & menu

- `files`
- `knowledge_documents`
- `knowledge_chunks`
- `product_categories`
- `products`

Dipakai untuk RAG dan order structured.

### 4.5 Business transaction

- `reservations`
- `orders`
- `order_items`
- `payments` optional/mock MVP

Dipakai untuk outcome bisnis dari chat AI.

### 4.6 Ops & observability

- `human_handoffs`
- `notifications`
- `agent_runs`
- `tool_executions`
- `audit_logs`
- `webhook_events`
- `cron_jobs` optional P1

Dipakai untuk audit, debugging, dan admin alert.

---

## 5. End-to-End Flow MVP

## 5.1 Register workspace

```txt
POST /auth/register
→ users
→ businesses
→ business_members
→ business_onboarding
→ onboarding_steps
→ agent_settings
```

Semua insert harus dalam satu Prisma transaction.

### Output minimal

```json
{
  "user": { "id": "uuid", "name": "Owner", "email": "owner@mail.com" },
  "business": { "id": "uuid", "name": "Kopi Senja", "status": "onboarding" },
  "accessToken": "jwt-or-session-token"
}
```

---

## 5.2 Onboarding guided setup

```txt
GET /onboarding
POST /onboarding/answer
POST /onboarding/check-readiness
```

MVP onboarding tidak harus terlalu AI-heavy. Bisa dibuat hybrid:

- API simpan jawaban user di `onboarding_steps.data`.
- API update `businesses`, `agent_settings`, `business_onboarding` sesuai step.
- Untuk step yang perlu AI, API forward ke `ai-engine`.

### Step wajib MVP

| Step | Wajib? | Output |
|---|---:|---|
| `business_profile` | Ya | name, type, phone, address |
| `business_goal` | Ya | mainGoal, needsReservation, needsOrder |
| `menu_upload` | Ya | minimal 1 knowledge/menu indexed atau product created |
| `opening_hours` | Ya | businessRules.openingHours |
| `location` | Ya | address/googleMapsUrl |
| `reservation_policy` | Conditional | businessRules.reservationPolicy |
| `order_policy` | Conditional | businessRules.orderPolicy |
| `faq` | Ya | knowledge doc FAQ/manual |
| `agent_persona` | Ya | persona, tone |
| `human_handoff_rule` | Ya | handoffRules |
| `whatsapp_connect` | Ya | whatsapp_sessions connected |
| `bot_test` | Optional MVP | test AI reply |
| `go_live` | Ya | bot enabled |

---

## 5.3 Knowledge setup

Ada dua jalur MVP:

### Jalur A — Manual text knowledge

```txt
POST /knowledge/documents
```

Untuk MVP paling cepat, buat input manual text:

```json
{
  "title": "FAQ Kopi Senja",
  "documentType": "faq",
  "sourceType": "manual",
  "content": "Jam buka 08.00-22.00..."
}
```

API insert `knowledge_documents` status `processing`, lalu trigger AI:

```txt
POST /internal/ai/knowledge/process
```

Setelah AI selesai:

```txt
PATCH /internal/knowledge/documents/:documentId/indexed
```

### Jalur B — Upload file

```txt
POST /knowledge/documents/upload
```

API insert:

```txt
files
knowledge_documents
```

Lalu trigger AI extraction/indexing.

Untuk kejar MVP, manual text knowledge harus selesai dulu sebelum upload file kompleks.

---

## 5.4 WhatsApp connect

```txt
POST /whatsapp/session/start
GET /whatsapp/session
POST /internal/wa/session-status
POST /whatsapp/bot/enable
POST /whatsapp/bot/disable
```

Flow:

```txt
Admin start session
→ API create whatsapp_sessions status=qr_pending
→ API call wa-worker /sessions/{businessId}/start
→ wa-worker return qrCode
→ API update qrCode
→ Web polling session
→ QR scanned
→ wa-worker call API /internal/wa/session-status connected
→ API set readyForWhatsapp true
→ Admin enable bot
```

---

## 5.5 Incoming WhatsApp message

```txt
POST /internal/wa/incoming-message
```

API responsibility:

1. Cek `waMessageId` idempotency.
2. Cek `businesses.status=active`.
3. Cek `whatsapp_sessions.botEnabled=true`.
4. Upsert `customers` by `businessId + waPhone`.
5. Upsert active `conversations`.
6. Insert inbound `messages`.
7. Jika `conversation.humanTakeover=true`, stop AI dan notify admin.
8. Jika AI aktif, call `ai-engine`.

---

## 5.6 AI reply result

```txt
POST /internal/ai/reply
```

API responsibility:

1. Insert `agent_runs`.
2. Insert `tool_executions` jika ada.
3. Insert outbound AI `messages`.
4. Update `conversations.lastMessage`, `lastAiReplyAt`.
5. Update `customers.leadStatus` jika intent mengarah ke lead stage tertentu.
6. Call `wa-worker /messages/send`.

---

## 5.7 Reservation via AI tool

AI tidak boleh insert DB langsung. AI memanggil API tool endpoint:

```txt
POST /internal/tools/reservations
```

API insert:

```txt
reservations
customers.totalReservations++
customers.leadStatus=reserved
notifications type=new_reservation
```

Admin dashboard:

```txt
GET /reservations
POST /reservations/:id/confirm
POST /reservations/:id/cancel
```

---

## 5.8 Order via AI tool

AI memanggil API tool endpoint:

```txt
POST /internal/tools/orders
```

API transaction:

```txt
orders
order_items
orders.totalAmount
customers.totalOrders++
customers.leadStatus=ordered
notifications type=new_order
```

Admin dashboard:

```txt
GET /orders
PATCH /orders/:id/status
```

---

## 5.9 Human handoff

AI memanggil:

```txt
POST /internal/tools/handoffs
```

API transaction:

```txt
conversations.humanTakeover=true
conversations.aiEnabled=false
conversations.status=human_takeover
human_handoffs status=open
notifications type=new_handoff
```

Admin reply:

```txt
POST /conversations/:id/messages
```

Return to AI:

```txt
POST /conversations/:id/return-to-ai
```

---

# 6. API Endpoint Blueprint

## 6.1 Auth API

### `POST /auth/register`

Purpose: buat user + business workspace + seed onboarding.

Request:

```json
{
  "name": "Owner Kopi",
  "email": "owner@mail.com",
  "password": "secret123",
  "businessName": "Kopi Senja",
  "businessType": "coffee_shop"
}
```

Writes:

- `users`
- `businesses`
- `business_members`
- `business_onboarding`
- `onboarding_steps`
- `agent_settings`

### `POST /auth/login`

Purpose: login owner/admin.

Request:

```json
{
  "email": "owner@mail.com",
  "password": "secret123"
}
```

Writes:

- `users.lastLoginAt`
- `audit_logs` optional MVP

### `GET /auth/me`

Purpose: return current user + active business.

---

## 6.2 Business API

### `GET /businesses/current`

Return workspace aktif user.

### `PATCH /businesses/current`

Update profile bisnis.

Request:

```json
{
  "name": "Kopi Senja",
  "type": "coffee_shop",
  "description": "Coffee shop cozy",
  "phone": "628123",
  "address": "Surabaya",
  "googleMapsUrl": "https://maps.google.com/..."
}
```

Writes:

- `businesses`
- `audit_logs`

---

## 6.3 Onboarding API

### `GET /onboarding`

Return:

- `business_onboarding`
- list `onboarding_steps`
- readiness flags

### `POST /onboarding/answer`

Request:

```json
{
  "stepKey": "business_profile",
  "answer": {
    "name": "Kopi Senja",
    "phone": "628123",
    "address": "Surabaya"
  }
}
```

Writes based on step:

- `onboarding_steps`
- `business_onboarding`
- `businesses`
- `agent_settings`
- `audit_logs`

### `POST /onboarding/check-readiness`

Rules MVP:

- Required onboarding steps completed.
- Minimal one `knowledge_documents.status=indexed` OR minimal one product available.
- WhatsApp session connected.
- Agent settings exists.

If valid:

```txt
business_onboarding.readyForBotActivation=true
businesses.status=active
```

---

## 6.4 Agent Settings API

### `GET /agent-settings`

Return persona/tone/rules.

### `PATCH /agent-settings`

Request:

```json
{
  "agentName": "Ningki",
  "persona": "Asisten ramah untuk coffee shop",
  "tone": "friendly",
  "language": "id",
  "humanTakeoverEnabled": true,
  "maxUnknownAttempts": 2,
  "businessRules": {
    "openingHours": "08.00-22.00",
    "reservationPolicy": "Reservasi minimal H-1",
    "orderPolicy": "Takeaway bisa diproses 15 menit"
  },
  "handoffRules": {
    "handoffWhen": ["complaint", "refund_request", "unknown_answer"]
  }
}
```

---

## 6.5 Knowledge API

### `GET /knowledge/documents`

Query:

```txt
?status=indexed&documentType=faq
```

### `POST /knowledge/documents`

Manual knowledge text.

Request:

```json
{
  "title": "Menu dan FAQ",
  "documentType": "faq",
  "sourceType": "manual",
  "content": "Menu: Kopi Susu 18000..."
}
```

Writes:

- `knowledge_documents.status=processing`
- trigger AI indexing

### `POST /knowledge/documents/upload`

Multipart upload.

Writes:

- `files`
- `knowledge_documents`

### `GET /knowledge/documents/:id`

Return document + chunks summary.

### `DELETE /knowledge/documents/:id`

Soft delete:

- `knowledge_documents.deletedAt`
- optional set status `archived`

### `POST /knowledge/reindex`

Trigger all business documents reindex.

---

## 6.6 Product/Menu API

### `GET /products`

Return product list with category.

### `POST /product-categories`

Request:

```json
{
  "name": "Coffee",
  "description": "Minuman kopi"
}
```

### `POST /products`

Request:

```json
{
  "categoryId": "uuid",
  "name": "Iced Latte",
  "description": "Espresso, susu, ice",
  "price": 22000,
  "isAvailable": true
}
```

### `PATCH /products/:id`

Update product.

### `DELETE /products/:id`

Soft delete product.

---

## 6.7 WhatsApp API

### `GET /whatsapp/session`

Return current session.

### `POST /whatsapp/session/start`

Writes:

- `whatsapp_sessions.status=qr_pending`
- calls `wa-worker`

### `POST /whatsapp/session/refresh-qr`

Optional MVP if QR expired.

### `POST /whatsapp/bot/enable`

Validation:

- `business_onboarding.readyForBotActivation=true`
- `whatsapp_sessions.status=connected`

Writes:

- `whatsapp_sessions.botEnabled=true`
- `agent_settings.autoReplyEnabled=true`
- `businesses.status=active`

### `POST /whatsapp/bot/disable`

Writes:

- `whatsapp_sessions.botEnabled=false`
- `agent_settings.autoReplyEnabled=false`

---

## 6.8 Customer API

### `GET /customers`

Query:

```txt
?leadStatus=hot_lead&search=andi&page=1&limit=20
```

### `GET /customers/:id`

Return profile + latest conversations + tags.

### `PATCH /customers/:id`

Admin update name, notes, leadStatus.

Request:

```json
{
  "name": "Andi",
  "leadStatus": "hot_lead",
  "notes": "Sering pesan iced latte"
}
```

---

## 6.9 Conversation & Message API

### `GET /conversations`

Query:

```txt
?status=open&humanTakeover=true&page=1&limit=20
```

Return list inbox.

### `GET /conversations/:id`

Return detail conversation + messages.

### `GET /conversations/:id/messages`

Paginated messages.

### `POST /conversations/:id/messages`

Admin sends manual reply.

Request:

```json
{
  "text": "Halo Kak, saya admin yang bantu ya."
}
```

Writes:

- `messages.senderType=admin`
- `conversations.lastAdminReplyAt`
- call `wa-worker /messages/send`

### `POST /conversations/:id/takeover`

Admin manually takeover.

### `POST /conversations/:id/return-to-ai`

Admin resolves handoff and enables AI.

---

## 6.10 Reservation API

### `GET /reservations`

Query:

```txt
?status=pending&date=2026-05-29
```

### `GET /reservations/:id`

### `POST /reservations`

Admin manual create reservation.

### `POST /reservations/:id/confirm`

Writes:

- `reservations.status=confirmed`
- `notifications`
- `audit_logs`

### `POST /reservations/:id/cancel`

Writes:

- `reservations.status=cancelled`
- `reservations.cancelledAt`

---

## 6.11 Order API

### `GET /orders`

Query:

```txt
?status=pending_confirmation&paymentStatus=unpaid
```

### `GET /orders/:id`

### `POST /orders`

Admin manual create order.

### `PATCH /orders/:id/status`

Request:

```json
{
  "status": "confirmed"
}
```

### `POST /orders/:id/cancel`

---

## 6.12 Human Handoff API

### `GET /handoffs`

Query:

```txt
?status=open
```

### `GET /handoffs/:id`

### `POST /handoffs/:id/assign`

Request:

```json
{
  "assignedUserId": "uuid"
}
```

### `POST /handoffs/:id/resolve`

Writes:

- `human_handoffs.status=resolved`
- `human_handoffs.resolvedAt`
- `conversations.humanTakeover=false`
- `conversations.aiEnabled=true`

---

## 6.13 Notification API

### `GET /notifications`

### `POST /notifications/:id/read`

### `POST /notifications/read-all`

---

## 6.14 Internal API for wa-worker

All endpoints below should require internal token header:

```txt
X-Internal-Token: <INTERNAL_API_TOKEN>
```

### `POST /internal/wa/session-status`

Request:

```json
{
  "businessId": "uuid",
  "sessionName": "default",
  "status": "connected",
  "phoneNumber": "628123"
}
```

### `POST /internal/wa/incoming-message`

Request:

```json
{
  "businessId": "uuid",
  "waMessageId": "wamid.xxx",
  "fromPhone": "628111",
  "customerName": "Andi",
  "messageType": "text",
  "text": "Mau reservasi besok 4 orang",
  "mediaUrl": null,
  "timestamp": "2026-05-29T10:00:00.000Z"
}
```

### `POST /internal/wa/message-status`

Optional MVP.

Request:

```json
{
  "businessId": "uuid",
  "waMessageId": "wamid.xxx",
  "status": "delivered"
}
```

---

## 6.15 Internal API for ai-engine

All internal AI endpoints require internal token.

### `GET /internal/context/:businessId`

Return:

- business profile
- agent settings
- active products
- active knowledge doc summary

### `GET /internal/customers/:customerId`

Return customer profile.

### `GET /internal/conversations/:conversationId/history`

Query:

```txt
?limit=20
```

### `POST /internal/knowledge/search`

API can proxy to AI, or AI can search FAISS locally based on its own index. For MVP recommended:

- AI owns FAISS search.
- API only stores document/chunk metadata.

If needed:

```json
{
  "businessId": "uuid",
  "query": "jam buka",
  "limit": 5
}
```

### `POST /internal/ai/reply`

Request:

```json
{
  "businessId": "uuid",
  "conversationId": "uuid",
  "customerId": "uuid",
  "replyText": "Bisa Kak, untuk reservasi besok jam berapa?",
  "intent": "make_reservation",
  "agentRun": {
    "agentType": "whatsapp_customer_agent",
    "input": "Mau reservasi besok 4 orang",
    "output": "Bisa Kak...",
    "status": "success",
    "tokensInput": 100,
    "tokensOutput": 40,
    "latencyMs": 1500
  },
  "toolsExecuted": []
}
```

---

## 6.16 Internal Tool API for ai-engine

### `POST /internal/tools/reservations`

Request:

```json
{
  "businessId": "uuid",
  "customerId": "uuid",
  "conversationId": "uuid",
  "reservationDate": "2026-05-30",
  "reservationTime": "19:00",
  "guestCount": 4,
  "customerName": "Andi",
  "customerPhone": "628111",
  "notes": "Meja indoor"
}
```

### `POST /internal/tools/orders`

Request:

```json
{
  "businessId": "uuid",
  "customerId": "uuid",
  "conversationId": "uuid",
  "fulfillmentType": "takeaway",
  "items": [
    {
      "productId": "uuid",
      "productName": "Iced Latte",
      "quantity": 2,
      "unitPrice": 22000,
      "notes": "less ice"
    }
  ],
  "notes": "Ambil jam 16.00"
}
```

### `POST /internal/tools/handoffs`

Request:

```json
{
  "businessId": "uuid",
  "conversationId": "uuid",
  "customerId": "uuid",
  "reason": "customer_requested_admin",
  "summary": "Customer meminta bicara dengan admin terkait komplain pesanan."
}
```

---

# 7. Service Layer Structure untuk `services/api`

Rekomendasi folder agar cepat rapi:

```txt
services/api/src
├── app.ts
├── server.ts
├── config
│   ├── env.ts
│   └── cors.ts
├── lib
│   ├── prisma.ts
│   ├── hash.ts
│   ├── jwt.ts
│   ├── response.ts
│   └── errors.ts
├── middlewares
│   ├── auth.middleware.ts
│   ├── business-context.middleware.ts
│   ├── internal-auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── modules
│   ├── auth
│   ├── businesses
│   ├── onboarding
│   ├── agent-settings
│   ├── knowledge
│   ├── products
│   ├── whatsapp
│   ├── customers
│   ├── conversations
│   ├── reservations
│   ├── orders
│   ├── handoffs
│   ├── notifications
│   ├── internal-wa
│   ├── internal-ai
│   └── audit
├── integrations
│   ├── ai-engine.client.ts
│   └── wa-worker.client.ts
└── jobs
    └── reminder.job.ts
```

Setiap module minimal punya:

```txt
*.route.ts
*.controller.ts
*.service.ts
*.repo.ts
*.schema.ts
*.types.ts
```

---

# 8. Implementation Priority

## Sprint 1 — Foundation API

Target: auth + workspace siap.

Checklist:

- Prisma connect PostgreSQL.
- Global error handler.
- Response wrapper.
- Auth middleware.
- Internal token middleware.
- Register transaction.
- Login/me.
- Business current profile.
- Seed onboarding steps.

Done when:

```txt
POST /auth/register berhasil membuat user + business + onboarding lengkap.
GET /auth/me bisa return active business.
```

---

## Sprint 2 — Onboarding + Agent Settings

Target: owner bisa isi setup bisnis.

Checklist:

- GET onboarding state.
- POST onboarding answer.
- Update businesses dari business_profile/location.
- Update business_onboarding flags dari business_goal.
- Update agent_settings dari agent_persona/handoff_rule.
- Check readiness.

Done when:

```txt
Owner bisa menyelesaikan onboarding sampai menunggu WhatsApp/knowledge readiness.
```

---

## Sprint 3 — Knowledge + Product/Menu

Target: AI punya sumber jawaban.

Checklist:

- Manual knowledge create.
- Upload metadata file basic.
- Internal indexed callback.
- Product category CRUD.
- Product CRUD.
- Knowledge list/detail/delete.

Done when:

```txt
Minimal 1 knowledge indexed atau menu product tersedia untuk business.
```

---

## Sprint 4 — WhatsApp Integration Contract

Target: API siap dihubungkan ke `wa-worker`.

Checklist:

- Start session.
- Session status internal callback.
- Bot enable/disable.
- Incoming message endpoint.
- Idempotency by waMessageId.
- Customer upsert.
- Conversation upsert.
- Message insert.

Done when:

```txt
wa-worker bisa kirim incoming message dan data masuk customers/conversations/messages.
```

---

## Sprint 5 — AI Contract + Chat Reply

Target: API siap dihubungkan ke `ai-engine`.

Checklist:

- API call ai-engine `/ai/agent/run` setelah incoming message.
- Internal context endpoints.
- Internal AI reply endpoint.
- Insert agent_runs/tool_executions.
- Insert outbound AI message.
- Send reply command to wa-worker.

Done when:

```txt
Customer kirim chat → API simpan → AI reply → API simpan reply → wa-worker kirim balik.
```

---

## Sprint 6 — Reservation, Order, Handoff

Target: AI bisa menghasilkan business outcome.

Checklist:

- Internal create reservation tool.
- Reservation admin list/confirm/cancel.
- Internal create order tool.
- Order admin list/status/cancel.
- Internal human handoff tool.
- Admin takeover/reply/return-to-ai.
- Notification basic.

Done when:

```txt
Customer bisa reservasi/order dari chat dan admin bisa ambil alih chat.
```

---

# 9. Minimal Validation Rules

## 9.1 Auth

- Email unique.
- Password minimal 8 char.
- User inactive/suspended tidak boleh login.

## 9.2 Business

- `businessId` selalu dari auth context, bukan dari body public API.
- Slug unique.

## 9.3 Internal endpoints

- Wajib `X-Internal-Token`.
- Tetap validasi `businessId` exists.

## 9.4 WhatsApp message

- `waMessageId` idempotent.
- `fromPhone` normalized.
- Skip AI jika `humanTakeover=true`.
- Skip AI jika bot disabled.

## 9.5 Reservation

- `guestCount > 0`.
- `reservationDate` tidak boleh masa lalu.
- `reservationNumber` unique per business.

## 9.6 Order

- Items minimal 1.
- Quantity > 0.
- Total dihitung server-side, jangan percaya total dari client/AI.

## 9.7 Knowledge

- `documentType` harus enum valid.
- `sourceType=manual` wajib ada `content`.
- `sourceType=pdf/image/spreadsheet` wajib ada file.

---

# 10. Standard Response Format

Semua API response gunakan format konsisten:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": null
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

Pagination:

```json
{
  "success": true,
  "message": "OK",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 11. Critical Transaction Boundaries

## 11.1 Register transaction

```txt
users
businesses
business_members
business_onboarding
onboarding_steps
agent_settings
```

## 11.2 Incoming message transaction

```txt
customers upsert
conversations upsert
messages inbound insert
conversations lastMessage update
```

## 11.3 AI reply transaction

```txt
agent_runs insert
tool_executions insert many
messages outbound insert
conversations update
customers leadStatus update optional
```

## 11.4 Create reservation transaction

```txt
reservations insert
customers update
notifications insert
audit_logs insert
```

## 11.5 Create order transaction

```txt
orders insert
order_items insert many
orders total update
customers update
notifications insert
audit_logs insert
```

## 11.6 Handoff transaction

```txt
conversations update
human_handoffs insert
notifications insert
audit_logs insert
```

---

# 12. MVP Environment Variables

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
INTERNAL_API_TOKEN=change-me
AI_ENGINE_BASE_URL=http://localhost:8000
WA_WORKER_BASE_URL=http://localhost:5000
FILE_STORAGE_PROVIDER=local
FILE_UPLOAD_DIR=./uploads
```

Optional P1:

```env
ASTRAPAY_CLIENT_ID=
ASTRAPAY_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

# 13. MVP API Done Definition

API MVP selesai kalau semua ini bisa diuji:

```txt
[ ] Register owner membuat workspace dan onboarding seed.
[ ] Login owner mendapat akses dashboard.
[ ] Owner update business profile.
[ ] Owner isi onboarding step.
[ ] Owner input knowledge manual.
[ ] AI callback bisa mark knowledge indexed.
[ ] Owner tambah product/menu.
[ ] Owner start WhatsApp session dan menerima QR.
[ ] wa-worker callback connected mengubah session status.
[ ] Owner enable bot.
[ ] wa-worker kirim incoming message.
[ ] API upsert customer/conversation/message.
[ ] API memanggil AI engine.
[ ] AI reply callback tersimpan di messages.
[ ] API mengirim command send message ke wa-worker.
[ ] AI tool create reservation berhasil.
[ ] AI tool create order berhasil.
[ ] AI tool human handoff berhasil.
[ ] Admin bisa balas manual dari conversation.
[ ] Admin bisa return conversation to AI.
[ ] Admin bisa list customers, conversations, reservations, orders, handoffs.
```

---

# 14. Endpoint Priority Checklist

## P0 endpoint list

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /businesses/current
PATCH  /businesses/current

GET    /onboarding
POST   /onboarding/answer
POST   /onboarding/check-readiness

GET    /agent-settings
PATCH  /agent-settings

GET    /knowledge/documents
POST   /knowledge/documents
POST   /knowledge/documents/upload
GET    /knowledge/documents/:id
DELETE /knowledge/documents/:id
PATCH  /internal/knowledge/documents/:id/indexed

GET    /product-categories
POST   /product-categories
PATCH  /product-categories/:id
DELETE /product-categories/:id
GET    /products
POST   /products
PATCH  /products/:id
DELETE /products/:id

GET    /whatsapp/session
POST   /whatsapp/session/start
POST   /whatsapp/bot/enable
POST   /whatsapp/bot/disable

GET    /customers
GET    /customers/:id
PATCH  /customers/:id

GET    /conversations
GET    /conversations/:id
GET    /conversations/:id/messages
POST   /conversations/:id/messages
POST   /conversations/:id/takeover
POST   /conversations/:id/return-to-ai

GET    /reservations
GET    /reservations/:id
POST   /reservations
POST   /reservations/:id/confirm
POST   /reservations/:id/cancel

GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id/status
POST   /orders/:id/cancel

GET    /handoffs
GET    /handoffs/:id
POST   /handoffs/:id/assign
POST   /handoffs/:id/resolve

GET    /notifications
POST   /notifications/:id/read
POST   /notifications/read-all

POST   /internal/wa/session-status
POST   /internal/wa/incoming-message
POST   /internal/wa/message-status

GET    /internal/context/:businessId
GET    /internal/customers/:customerId
GET    /internal/conversations/:conversationId/history
POST   /internal/ai/reply
POST   /internal/tools/reservations
POST   /internal/tools/orders
POST   /internal/tools/handoffs
```

---

# 15. Best Next Build Order

Urutan paling aman agar tidak kebanyakan refactor:

```txt
1. Setup API foundation
2. Auth + business transaction
3. Business context middleware
4. Onboarding seed + answer
5. Agent settings
6. Knowledge manual text
7. Product/menu CRUD
8. WhatsApp session contract
9. Incoming message persistence
10. AI context endpoints
11. AI reply callback
12. Admin inbox reply
13. Reservation tool + dashboard
14. Order tool + dashboard
15. Handoff tool + dashboard
16. Notification basic
17. Audit logs basic
18. Polish validation + test
```

---

# 16. Catatan Teknis Penting

1. Jangan biarkan `ai-engine` dan `wa-worker` import Prisma.
2. Jangan kirim `businessId` dari frontend untuk public dashboard API. Ambil dari auth/session membership.
3. Internal endpoint boleh menerima `businessId`, tapi wajib internal token.
4. Semua create/update penting tulis `audit_logs`.
5. Semua AI execution tulis `agent_runs` dan `tool_executions`.
6. Semua WhatsApp incoming message wajib idempotency by `waMessageId`.
7. Semua money amount pakai integer rupiah, bukan float.
8. Untuk MVP payment cukup status manual/mock; jangan kejar AstraPay dulu kalau P0 belum selesai.
9. Untuk MVP upload file boleh local; yang penting metadata `files` dan `knowledge_documents` benar.
10. Untuk MVP realtime dashboard boleh polling setiap 3-5 detik.

---

# 17. MVP North Star

Jangan bangun semua fitur enterprise. Fokus ke satu pengalaman utama:

> **Pemilik bisnis bisa setup Ningki, connect WhatsApp, lalu customer bisa chat, tanya menu/FAQ, buat reservasi/order, dan admin bisa ambil alih kalau perlu.**

Kalau flow itu sudah jalan stabil, baru masuk payment, spreadsheet, reminder advanced, analytics, dan permission detail.