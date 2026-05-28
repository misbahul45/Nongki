# Database Flow — Ningki/Nongki Microservice Ecosystem

Dokumen ini menjelaskan bagaimana setiap layer microservice berinteraksi dengan database, tabel apa yang ditulis dan dibaca di setiap tahap, serta bagaimana data mengalir dari satu service ke service lain.

---

## Arsitektur Service dan Kepemilikan DB

```
apps/web          → hanya baca/tulis via REST ke services/api
services/api      → pemilik utama semua tabel PostgreSQL via Prisma
services/ai-engine → baca/tulis ke api via HTTP internal, punya FAISS lokal
services/wa-worker → baca/tulis ke api via HTTP internal, tidak akses DB langsung
```

Tidak ada service selain `services/api` yang boleh akses PostgreSQL secara langsung. Semua mutasi data melewati `api`.

---

## 1. Flow Registrasi dan Pembuatan Workspace

**Trigger:** User membuka web dan mengisi form register.

**Service:** `apps/web` → `services/api`

```
POST /auth/register
```

**Tabel yang ditulis secara berurutan:**

```
1. users              → buat record user baru (email, passwordHash, status=active)
2. businesses         → buat workspace bisnis (ownerId=userId, status=onboarding)
3. business_members   → tambah owner sebagai member (role=owner)
4. business_onboarding → buat record onboarding kosong (progressPercent=0)
5. onboarding_steps   → seed 15 baris step dengan status=pending
6. agent_settings     → buat default settings (agentName=Ningki, tone=friendly)
```

Semua ini terjadi dalam satu database transaction. Jika salah satu gagal, semua rollback.

---

## 2. Flow Onboarding — AI Guided Setup

**Trigger:** User login pertama kali, diarahkan ke halaman onboarding.

**Service:** `apps/web` → `services/api` → `services/ai-engine`

### 2a. User menjawab pertanyaan onboarding

```
POST /onboarding/answer
```

**Tabel yang dibaca:**
```
business_onboarding   → cek current_step dan progress saat ini
onboarding_steps      → cek step mana yang pending/in_progress
agent_settings        → baca konfigurasi bisnis yang sudah ada
```

**api mengirim ke ai-engine:**
```
POST /ai/onboarding/process
body: { businessId, stepKey, userAnswer, conversationHistory }
```

**ai-engine memproses dan mengembalikan respons ke api.**

**Tabel yang ditulis:**
```
onboarding_steps      → update status step (in_progress → completed)
business_onboarding   → update currentStep, progressPercent, flag needs*
agent_settings        → update persona, tone, businessRules jika step agent_persona
audit_logs            → catat action=ONBOARDING_STEP_COMPLETED
```

### 2b. User upload dokumen (menu, FAQ, promo)

```
POST /knowledge/documents/upload
```

**Tabel yang ditulis:**
```
files                 → simpan metadata file (storagePath, mimeType, sizeBytes)
knowledge_documents   → buat record dokumen (status=draft)
```

**api lalu trigger ai-engine untuk proses dokumen:**
```
POST /ai/knowledge/process
body: { businessId, documentId }
```

**ai-engine:**
- Ekstrak teks dari PDF/gambar
- Klasifikasi documentType
- Potong teks menjadi chunk
- Generate embedding dan simpan ke FAISS dengan key `businessId:documentId`

**api menerima hasil dari ai-engine dan menulis:**
```
knowledge_documents   → update status=indexed, extractedText
knowledge_chunks      → insert N baris chunk (chunkText, chunkIndex, embeddingRef)
audit_logs            → catat action=KNOWLEDGE_INDEXED
```

### 2c. Cek readiness sebelum bot aktif

```
POST /onboarding/check-readiness
```

**Tabel yang dibaca:**
```
onboarding_steps      → hitung step required yang sudah completed
business_onboarding   → baca flag readyForWhatsapp
knowledge_documents   → pastikan ada minimal 1 dokumen status=indexed
whatsapp_sessions     → cek apakah session sudah connected
```

**Tabel yang ditulis (jika semua syarat terpenuhi):**
```
business_onboarding   → set readyForBotActivation=true
businesses            → update status=active
```

---

## 3. Flow Koneksi WhatsApp

**Trigger:** User klik "Hubungkan WhatsApp" di halaman onboarding atau WhatsApp settings.

**Service:** `apps/web` → `services/api` → `services/wa-worker`

### 3a. Mulai sesi

```
POST /whatsapp/session/start
```

**api menulis:**
```
whatsapp_sessions     → buat record baru (status=qr_pending, businessId)
```

**api kirim ke wa-worker:**
```
POST /sessions/{businessId}/start
```

**wa-worker** membuat sesi Baileys, generate QR code, kirim balik ke api.

**api update:**
```
whatsapp_sessions     → update qrCode, qrExpiresAt, status=qr_pending
notifications         → buat notif type=system "QR siap di-scan"
```

### 3b. QR di-scan user

**wa-worker** mendeteksi QR berhasil di-scan, kirim event ke api:
```
POST /internal/wa/session-status
body: { businessId, status: "connected", phoneNumber }
```

**api menulis:**
```
whatsapp_sessions     → update status=connected, phoneNumber, lastConnectedAt
business_onboarding   → set readyForWhatsapp=true
onboarding_steps      → update step whatsapp_connect menjadi completed
audit_logs            → catat action=WHATSAPP_CONNECTED
```

### 3c. Aktifkan bot

```
POST /whatsapp/bot/enable
```

**Syarat:** readyForBotActivation harus true.

**api menulis:**
```
whatsapp_sessions     → set botEnabled=true
agent_settings        → set autoReplyEnabled=true
audit_logs            → catat action=BOT_ENABLED
```

---

## 4. Flow Pesan Masuk dari Customer WhatsApp

**Trigger:** Customer mengirim pesan ke nomor WhatsApp bisnis.

**Service:** `wa-worker` → `services/api` → `services/ai-engine` → `services/api` → `wa-worker`

### 4a. wa-worker menerima pesan

wa-worker menerima event dari Baileys, normalisasi pesan, kirim ke api:

```
POST /internal/wa/incoming-message
body: {
  businessId, waMessageId, fromPhone, customerName,
  messageType, text, mediaUrl, timestamp
}
```

### 4b. api memproses pesan masuk

**Tabel yang dibaca:**
```
whatsapp_sessions     → pastikan botEnabled=true untuk businessId ini
businesses            → cek status=active
```

**Idempotency check:**
```
messages              → cek apakah waMessageId sudah ada, jika ada skip
```

**Tabel yang ditulis (dalam transaction):**
```
customers             → upsert by (businessId + waPhone)
                        jika baru: buat record, leadStatus=new
                        jika ada: update lastMessageAt, totalInteractions++
conversations         → upsert conversation aktif untuk customer ini
                        jika humanTakeover=true: skip ke step notif admin
messages              → insert pesan inbound (direction=inbound, senderType=customer)
```

### 4c. api kirim ke ai-engine (jika bot aktif dan tidak human takeover)

```
POST /ai/agent/run
body: {
  businessId, conversationId, customerId,
  messageText, messageType, mediaUrl
}
```

**ai-engine membaca dari api (via HTTP):**
```
GET /internal/context/{businessId}   → agent_settings, businesses
GET /internal/customers/{customerId} → customer profile, leadStatus
GET /internal/conversations/{conversationId}/history → N pesan terakhir
GET /internal/knowledge/search       → query FAISS dengan businessId filter
GET /internal/products/{businessId}  → daftar produk available
GET /internal/reservations/active    → reservasi aktif customer
```

**ai-engine menjalankan LangGraph:**
```
receive_message
→ load_business_context
→ load_customer_profile
→ load_conversation_history
→ check_human_takeover
→ classify_intent
→ retrieve_knowledge       ← query FAISS, filter businessId
→ decide_action
→ tool_router
→ execute_tool
→ generate_reply
→ save_state
→ return_reply
```

**ai-engine kirim hasil ke api:**
```
POST /internal/ai/reply
body: {
  businessId, conversationId, customerId,
  replyText, intent, toolsExecuted, agentRunId,
  tokensInput, tokensOutput, latencyMs
}
```

### 4d. api menyimpan hasil AI dan trigger wa-worker

**Tabel yang ditulis:**
```
agent_runs            → insert log run (agentType, input, output, intent, status=success)
tool_executions       → insert per tool yang dipanggil (toolName, input, output)
messages              → insert pesan outbound (senderType=ai, direction=outbound)
conversations         → update lastMessage, lastMessageAt, lastAiReplyAt
customers             → update leadStatus jika intent menunjukkan perubahan stage
```

**api kirim ke wa-worker:**
```
POST /messages/send
body: { businessId, toPhone, messageType, text }
```

**wa-worker** mengirim ke WhatsApp via Baileys.

---

## 5. Flow Reservasi via AI

**Trigger:** Customer mengetik intent reservasi (contoh: "reservasi besok 4 orang").

### 5a. ai-engine mendeteksi intent make_reservation

ai-engine melakukan slot filling melalui beberapa turn percakapan. Setiap turn mengikuti Flow 4 di atas (simpan pesan, jalankan AI, balas).

Setelah semua slot terpenuhi (date, time, guestCount, customerName), ai-engine memanggil tool:

```
create_reservation_tool
input: {
  businessId, customerId, conversationId,
  reservationDate, reservationTime, guestCount, notes
}
```

**api (dipanggil oleh ai-engine via tool) menulis:**
```
reservations          → insert baris baru (status=pending, reservationNumber auto-generate)
customers             → update leadStatus=reserved, totalReservations++
```

**api lalu otomatis membuat reminders:**
```
reminders             → insert reminder H-1 (type=reservation_confirmation, channel=whatsapp, scheduledAt=H-1 09:00)
reminders             → insert reminder untuk admin (type=admin_task, channel=admin_notification, scheduledAt=1 jam sebelum reservasi)
```

**api juga menulis:**
```
tool_executions       → log eksekusi create_reservation_tool
audit_logs            → catat action=RESERVATION_CREATED
```

**Spreadsheet sync (jika diaktifkan):**
```
spreadsheet_sync_logs → insert log pending untuk entity reservations
```
Worker mengambil log pending dan push ke Google Sheets, update status=success/failed.

### 5b. Admin konfirmasi reservasi di dashboard

```
POST /reservations/{id}/confirm
```

**Tabel yang ditulis:**
```
reservations          → update status=confirmed
notifications         → buat notif type=new_reservation untuk semua admin
audit_logs            → catat action=RESERVATION_CONFIRMED, userId=adminId
```

ai-engine (dipanggil via api) generate pesan konfirmasi dan kirim ke customer melalui Flow 4d.

---

## 6. Flow Order via AI

**Trigger:** Customer mengetik intent order (contoh: "pesan 2 iced latte takeaway").

### 6a. ai-engine memanggil tool create_order

Setelah slot filling selesai (items, quantity, fulfillmentType):

**api menulis (dalam transaction):**
```
orders                → insert order baru (status=draft, paymentStatus=unpaid)
order_items           → insert per item (productName, quantity, unitPrice, subtotal)
orders                → update totalAmount = sum(subtotal)
customers             → update totalOrders++
```

### 6b. Konfirmasi order ke customer

ai-engine generate ringkasan order dan minta konfirmasi customer. Setelah customer konfirmasi:

**api menulis:**
```
orders                → update status=pending_confirmation
reminders             → insert reminder payment_follow_up jika order belum bayar dalam 10 menit
```

---

## 7. Flow Pembayaran AstraPay QRIS

**Trigger:** Order/reservasi perlu dibayar, ai-engine memanggil create_payment_qris_tool.

### 7a. Generate QRIS

**api membaca:**
```
orders / reservations → ambil totalAmount, orderNumber
businesses            → ambil businessId untuk merchantId AstraPay
integrations          → ambil AstraPay credentials (accessToken encrypted)
```

**api memanggil AstraPay API:**
```
POST https://api.astrapay.com/v1/qris/generate
header: Authorization, X-TIMESTAMP, X-SIGNATURE, X-PARTNER-ID, X-EXTERNAL-ID
body: { partnerReferenceNo, amount, merchantId, validityPeriod }
```

**api menulis:**
```
payments              → insert baru (status=waiting_payment, merchantReferenceNo, qrContent, expiresAt)
                        rawRequest = body yang dikirim ke AstraPay
                        rawResponse = response dari AstraPay (referenceNo, qrContent)
payment_events        → insert event (eventType=qr_generated)
orders                → update paymentStatus=waiting_payment
webhook_events        → insert record outgoing request log
```

ai-engine generate pesan dengan QR image URL dan kirim ke customer melalui wa-worker.

### 7b. Customer membayar dan AstraPay kirim callback

```
POST /webhooks/astrapay/qris
header: X-SIGNATURE, X-TIMESTAMP, X-PARTNER-ID
body: { partnerReferenceNo, referenceNo, latestTransactionStatus, amount, ... }
```

**api memproses callback:**

**Idempotency check:**
```
webhook_events        → cek apakah externalId (partnerReferenceNo) sudah diproses
```

Jika sudah → return 200, skip proses.

**Tabel yang dibaca:**
```
payments              → find by merchantReferenceNo
businesses            → validasi businessId cocok dengan merchantId di callback
```

**Validasi:**
- Signature valid
- Amount cocok
- businessId cocok
- Status belum paid (cegah double-process)

**Tabel yang ditulis (jika validasi lolos, dalam transaction):**
```
payments              → update status=paid, paidAt=now(), providerReferenceNo, rawCallback
payment_events        → insert event (eventType=payment_received, payload=raw callback)
orders                → update paymentStatus=paid (jika payment terkait order)
reservations          → update status=confirmed jika payment terkait reservasi
webhook_events        → insert log callback dengan status=processed
```

**Setelah transaction commit:**
```
reminders             → cancel semua payment_follow_up yang scheduled untuk payment ini
notifications         → buat notif type=new_order atau new_reservation untuk admin
```

**api trigger ai-engine** untuk generate pesan konfirmasi pembayaran ke customer.

**ai-engine** generate pesan → api → wa-worker → customer WhatsApp.

**Jika ada spreadsheet sync:**
```
spreadsheet_sync_logs → insert log pending untuk orders/reservations yang berubah
```

### 7c. QR Expired

Cron job berjalan setiap menit:
```
SELECT * FROM payments WHERE status=waiting_payment AND expires_at < now()
```

**Tabel yang ditulis:**
```
payments              → update status=expired
payment_events        → insert event (eventType=qr_expired)
orders                → update paymentStatus=failed (jika terkait order)
cron_jobs             → update result dan finishedAt
```

**api trigger ai-engine** generate pesan ke customer tawaran buat QR baru.

---

## 8. Flow Human Takeover

**Trigger:** Customer ketik "admin" / "minta tolong" / ai-engine gagal answer setelah maxUnknownAttempts kali.

### 8a. ai-engine memanggil human_handoff_tool

**api menulis (dalam transaction):**
```
conversations         → set humanTakeover=true, aiEnabled=false, status=human_takeover
human_handoffs        → insert baru (reason, summary dari AI, status=open)
notifications         → insert notif type=new_handoff untuk semua admin business
```

**wa-worker** mengirim pesan ke customer: "Menghubungkan ke admin, mohon tunggu sebentar."

Bot berhenti membalas. Semua pesan masuk tetap disimpan di `messages` tapi tidak diteruskan ke ai-engine.

### 8b. Admin membalas dari dashboard inbox

```
POST /conversations/{id}/messages
body: { text }
```

**Tabel yang ditulis:**
```
messages              → insert pesan (senderType=admin, direction=outbound)
conversations         → update lastAdminReplyAt
```

**api** kirim ke wa-worker, wa-worker kirim ke customer WhatsApp.

### 8c. Admin kembalikan ke AI

```
POST /conversations/{id}/return-to-ai
```

**Tabel yang ditulis:**
```
conversations         → set humanTakeover=false, aiEnabled=true, status=open
human_handoffs        → update status=resolved, resolvedAt=now()
audit_logs            → catat action=HANDOFF_RESOLVED
```

---

## 9. Flow Reminder Cron

**Trigger:** Cron job berjalan setiap 1 menit di `services/api`.

### 9a. Ambil reminder yang jatuh tempo

```
SELECT * FROM reminders
WHERE status=scheduled
AND scheduled_at <= now()
AND business_id IN (SELECT id FROM businesses WHERE status=active)
ORDER BY scheduled_at ASC
LIMIT 100
```

### 9b. Proses per reminder

**Tabel yang dibaca:**
```
businesses            → cek timezone dan jam operasional (via agent_settings.businessRules)
customers             → ambil waPhone jika channel=whatsapp
whatsapp_sessions     → pastikan botEnabled=true jika channel=whatsapp
```

**Jika channel=whatsapp:**

api kirim ke wa-worker → wa-worker kirim pesan ke customer.

**Jika channel=admin_notification:**

```
notifications         → insert notif untuk semua member business
```

**Tabel yang ditulis setelah kirim:**
```
reminders             → update status=sent, sentAt=now()
cron_jobs             → update result (jumlah reminder diproses)
```

**Jika gagal kirim:**
```
reminders             → update status=failed
cron_jobs             → catat errorMessage
```

---

## 10. Flow Spreadsheet Export (Google Sheets)

**Trigger:** Entity dibuat/diupdate dan `autoSyncEnabled=true`, atau admin klik sync manual.

### 10a. Trigger sync

Setiap kali ada perubahan di `orders`, `reservations`, `customers`, atau `reminders`, api menulis:

```
spreadsheet_sync_logs → insert baru (entityType, entityId, status=pending)
```

### 10b. Worker memproses sync log

Cron atau background job membaca:

```
SELECT * FROM spreadsheet_sync_logs
WHERE status=pending
ORDER BY created_at ASC
LIMIT 50
```

**Tabel yang dibaca:**
```
spreadsheet_configs   → ambil spreadsheetId, sheetName, syncFlags
integrations          → ambil Google OAuth token (accessTokenEncrypted)
orders/reservations/customers → ambil data yang akan disync
```

**api memanggil Google Sheets API:**
```
POST https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}:append
```

**Tabel yang ditulis:**
```
spreadsheet_sync_logs → update status=success/failed, syncedAt=now(), errorMessage jika gagal
```

---

## 11. Flow Knowledge Reindex

**Trigger:** Admin edit/hapus dokumen atau klik tombol "Reindex" di dashboard.

```
POST /knowledge/reindex
```

**api menulis:**
```
knowledge_documents   → update status=processing untuk semua dokumen businessId
knowledge_chunks      → hapus semua chunk lama untuk businessId ini
```

**api kirim ke ai-engine:**
```
POST /ai/knowledge/reindex
body: { businessId }
```

**ai-engine:**
- Hapus FAISS index untuk businessId
- Loop semua dokumen status=processing
- Re-extract, re-chunk, re-embed
- Simpan FAISS baru

**ai-engine kirim hasil ke api per dokumen:**
```
PATCH /internal/knowledge/{documentId}/indexed
body: { chunks: [...], embeddingRefs: [...] }
```

**api menulis:**
```
knowledge_chunks      → insert chunk baru
knowledge_documents   → update status=indexed / failed
audit_logs            → catat action=KNOWLEDGE_REINDEXED
```

---

## 12. Flow Audit dan Observability

Setiap action penting di seluruh flow di atas meninggalkan jejak di tabel berikut:

**audit_logs** — ditulis oleh `services/api` untuk setiap:
- Perubahan status entitas utama (order, reservation, payment, conversation)
- Aktivasi/deaktivasi bot
- Login/logout user
- Koneksi/diskoneksi WhatsApp
- Onboarding step completed

**agent_runs** — ditulis setiap kali LangGraph dijalankan, berisi intent, token usage, latency.

**tool_executions** — ditulis setiap kali AI memanggil tool (create_reservation, create_payment, dsb).

**webhook_events** — ditulis untuk setiap:
- Incoming callback dari AstraPay
- Incoming event dari WhatsApp/Baileys
- Outgoing request ke AstraPay (opsional untuk debugging)

**cron_jobs** — ditulis setiap kali cron reminder atau sync berjalan.

---

## Ringkasan Kepemilikan Tabel per Service

| Tabel | Ditulis oleh | Dibaca oleh |
|---|---|---|
| users, businesses, business_members | api | api, web |
| business_onboarding, onboarding_steps | api (dipicu oleh ai-engine hasil) | api, ai-engine, web |
| agent_settings | api | api, ai-engine |
| whatsapp_sessions | api (event dari wa-worker) | api, wa-worker, web |
| customers, conversations, messages | api | api, ai-engine, web |
| customer_tags, customer_tag_assignments | api | api, web |
| knowledge_documents, knowledge_chunks | api (data dari ai-engine) | api, ai-engine |
| product_categories, products | api | api, ai-engine, web |
| orders, order_items | api (dipicu ai-engine tool) | api, web |
| reservations | api (dipicu ai-engine tool) | api, web |
| reminders | api (dipicu ai-engine tool + cron) | api (cron), web |
| payments, payment_events | api | api, web |
| integrations, spreadsheet_configs | api | api |
| spreadsheet_sync_logs | api (cron) | api |
| human_handoffs | api (dipicu ai-engine tool) | api, web |
| agent_runs, tool_executions | api (dari hasil ai-engine) | api, web |
| notifications | api | api, web |
| audit_logs | api | api, web |
| files | api | api, ai-engine |
| webhook_events | api | api |
| cron_jobs | api (cron runner) | api |

**Aturan mutlak:**
- wa-worker tidak pernah akses PostgreSQL langsung
- ai-engine tidak pernah akses PostgreSQL langsung
- Semua mutasi data harus melalui `services/api`
- Setiap query harus menyertakan filter `businessId` untuk tenant isolation
- FAISS index harus di-namespace per businessId agar knowledge tidak bocor antar tenant