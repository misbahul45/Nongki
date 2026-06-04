Berikut dokumentasi database MVP yang bisa kamu taruh sebagai file `DATABASE_MVP_FLOW.md`.

---

# Database MVP Flow — Nongki App

Dokumentasi ini menjelaskan tabel database yang benar-benar dibutuhkan untuk MVP Nongki App, beserta interaksi antar tabel pada setiap flow utama: onboarding, WhatsApp connection, AI reply, CRM, order/reservasi, pembayaran QRIS AstraPay, human takeover, dan notifikasi. Prinsip utama sistem: hanya `services/api` yang boleh menulis ke database; `apps/web`, `services/wa-worker`, dan `services/ai-engine` harus melewati API. Ini sesuai dengan arsitektur awal kamu yang menempatkan API sebagai pemilik utama database dan semua service lain hanya berinteraksi lewat HTTP/internal API. 

---

## 1. Prinsip Database MVP

Database MVP Nongki menggunakan pola **multi-tenant** berbasis `businessId`. Setiap data penting seperti customer, conversation, message, order, reservation, payment, knowledge, dan agent log harus selalu membawa `businessId`.

Prinsip wajib:

```text
1. Semua mutasi data hanya lewat services/api.
2. Frontend tidak boleh akses database langsung.
3. WA Worker tidak boleh akses database langsung.
4. AI Engine tidak boleh akses database langsung.
5. Semua query tenant wajib filter businessId.
6. AI hanya boleh mengubah data lewat tool API yang tervalidasi.
7. Payment webhook wajib idempotent agar tidak double-process.
8. Knowledge vector FAISS wajib dipisah per businessId.
```

Catatan: di schema kamu pakai **MySQL**, jadi dokumentasi final sebaiknya konsisten pakai MySQL, bukan PostgreSQL.

---

# 2. Daftar Tabel MVP

## A. User, Tenant, dan Onboarding

### 1. `users`

Menyimpan akun owner/admin yang login ke Nongki App.

Dipakai untuk:

```text
- Register owner
- Login dashboard
- Relasi ke business
- Relasi ke business_members
- Notifikasi user
- Audit log user action
```

Interaksi MVP:

```text
Register → insert users
Login → read users
Dashboard profile → read users
Audit action → relation userId
```

---

### 2. `refresh_tokens`

Menyimpan token login jangka panjang.

Dipakai untuk:

```text
- Refresh session user
- Logout / revoke token
- Keamanan autentikasi
```

Interaksi MVP:

```text
Login → insert refresh_tokens
Refresh session → read tokenHash
Logout → update revokedAt
```

---

### 3. `businesses`

Menyimpan workspace bisnis/UMKM.

Ini adalah tabel tenant utama. Hampir semua tabel lain terhubung ke `businessId`.

Dipakai untuk:

```text
- Identitas UMKM
- Status onboarding / active
- Timezone dan currency
- Relasi ke owner
- Tenant isolation
```

Interaksi MVP:

```text
Register owner → insert businesses
Onboarding selesai → update status=active
Incoming WhatsApp message → read business status
Payment QRIS → read business/payment configuration
Dashboard → read business detail
```

Field penting:

```text
id
ownerId
name
slug
type
timezone
currency
status
```

---

### 4. `business_members`

Menyimpan relasi user dengan bisnis.

Dipakai untuk:

```text
- Menentukan owner/admin/staff
- Permission dashboard
- Target notifikasi admin
```

Interaksi MVP:

```text
Register owner → insert business_members role=owner
Dashboard access → read business_members
Notification owner/admin → read members by businessId
```

---

### 5. `business_onboarding`

Menyimpan progres onboarding bisnis.

Dipakai untuk:

```text
- Tracking setup awal
- Menentukan apakah WhatsApp sudah siap
- Menentukan apakah bot boleh diaktifkan
```

Interaksi MVP:

```text
Register → insert business_onboarding
Onboarding answer → update progressPercent/currentStep
WhatsApp connected → update readyForWhatsapp=true
Readiness check → update readyForBotActivation=true
Go live → business status active
```

Field penting:

```text
businessId
currentStep
progressPercent
readyForWhatsapp
readyForBotActivation
needsReservation
needsOrder
needsHumanTakeover
```

---

### 6. `onboarding_steps`

Menyimpan step onboarding per bisnis.

Dipakai untuk:

```text
- Business profile
- Menu upload
- Opening hours
- Agent persona
- WhatsApp connect
- Bot test
- Go live
```

Interaksi MVP:

```text
Register → seed onboarding_steps
User complete step → update status=completed
Check readiness → read required completed steps
WhatsApp connected → update whatsapp_connect completed
```

---

### 7. `agent_settings`

Menyimpan konfigurasi AI assistant Ningki per bisnis.

Dipakai untuk:

```text
- Nama agent
- Persona
- Tone
- Bahasa
- Auto reply enabled
- Human takeover rule
- Business rules
- Allowed tools
```

Interaksi MVP:

```text
Register → insert default agent_settings
Onboarding persona → update persona/tone/businessRules
Enable bot → update autoReplyEnabled=true
AI reply → read agent_settings
Human takeover → read maxUnknownAttempts/handoffRules
```

Field penting:

```text
businessId
agentName
persona
tone
language
autoReplyEnabled
humanTakeoverEnabled
maxUnknownAttempts
businessRules
allowedTools
```

---

# 3. WhatsApp dan CRM Tables

## 8. `whatsapp_sessions`

Menyimpan koneksi WhatsApp bisnis.

Dipakai untuk:

```text
- QR pairing
- Status connected/disconnected
- Nomor WhatsApp bisnis
- Status bot enabled
```

Interaksi MVP:

```text
Start session → insert whatsapp_sessions status=qr_pending
Generate QR → update qrCode, qrExpiresAt
QR scanned → update status=connected, phoneNumber
Enable bot → update botEnabled=true
Incoming message → read botEnabled/status
Disconnected → update status=disconnected
```

Field penting:

```text
businessId
sessionName
phoneNumber
status
qrCode
qrExpiresAt
sessionDataEncrypted
botEnabled
```

Catatan penting: di schema kamu ada typo:

```prisma
model WhatsappSession {@db.Char(36)Char(36)
```

Harus diperbaiki menjadi:

```prisma
model WhatsappSession {
```

---

## 9. `customers`

Menyimpan profil pelanggan dari WhatsApp.

Dipakai untuk:

```text
- Customer 360 sederhana
- Identitas pelanggan
- Lead status
- Total interaksi
- Total order/reservasi
```

Interaksi MVP:

```text
Incoming message → upsert customer by businessId + waPhone
AI detect intent → update leadStatus
Order created → update totalOrders
Reservation created → update totalReservations
Dashboard CRM → read customers
```

Field penting:

```text
businessId
waPhone
waName
name
leadStatus
lastMessageAt
totalInteractions
totalOrders
totalReservations
notes
metadata
```

Index penting:

```text
unique(businessId, waPhone)
index(businessId, leadStatus)
index(businessId, lastMessageAt)
```

---

## 10. `conversations`

Menyimpan thread percakapan customer.

Dipakai untuk:

```text
- Inbox dashboard
- Status conversation
- Human takeover
- AI enabled per conversation
- Summary chat
```

Interaksi MVP:

```text
Incoming message → upsert/open conversation
AI reply → update lastMessage, lastAiReplyAt
Admin reply → update lastAdminReplyAt
Human takeover → update humanTakeover=true, aiEnabled=false
Return to AI → update humanTakeover=false, aiEnabled=true
Close conversation → update status=closed
```

Field penting:

```text
businessId
customerId
channel
status
aiEnabled
humanTakeover
assignedUserId
lastMessage
lastMessageAt
lastAiReplyAt
lastAdminReplyAt
summary
```

---

## 11. `messages`

Menyimpan semua pesan inbound dan outbound.

Dipakai untuk:

```text
- Chat history
- AI context
- Idempotency WhatsApp
- Dashboard inbox
- Audit percakapan
```

Interaksi MVP:

```text
Customer message → insert inbound message
Idempotency check → read by waMessageId
AI reply → insert outbound message senderType=ai
Admin reply → insert outbound message senderType=admin
Dashboard inbox → read messages by conversationId
```

Field penting:

```text
businessId
conversationId
customerId
senderType
messageType
content
mediaUrl
waMessageId
direction
status
metadata
```

Catatan penting: untuk idempotency WhatsApp, sebaiknya tambahkan unique:

```prisma
@@unique([businessId, waMessageId])
```

Karena sekarang baru ada index biasa. Kalau `waMessageId` bisa null, pastikan handling-nya aman di MySQL.

---

# 4. Knowledge Base dan AI Tables

## 12. `files`

Menyimpan metadata file upload.

Dipakai untuk:

```text
- Upload menu
- Upload FAQ
- Upload promo
- Upload dokumen knowledge
```

Interaksi MVP:

```text
Upload file → insert files
Create knowledge document → relation fileId
AI process document → read file metadata/path
```

Field penting:

```text
businessId
uploadedBy
filename
originalName
mimeType
sizeBytes
storageProvider
storagePath
publicUrl
```

---

## 13. `knowledge_documents`

Menyimpan dokumen knowledge bisnis.

Dipakai untuk:

```text
- Menu
- FAQ
- Promo
- Opening hours
- Location
- Reservation policy
- Order policy
- Brand tone
```

Interaksi MVP:

```text
Upload document → insert status=draft
AI processing started → update status=processing
AI indexed → update status=indexed, extractedText
AI failed → update status=failed
AI reply → read indexed documents indirectly via search API
```

Field penting:

```text
businessId
title
documentType
sourceType
content
fileId
status
extractedText
metadata
```

---

## 14. `knowledge_chunks`

Menyimpan potongan teks hasil indexing knowledge.

Dipakai untuk:

```text
- RAG search
- Mapping chunk ke FAISS vector
- Menjaga knowledge tetap per businessId
```

Interaksi MVP:

```text
AI process document → insert chunks
AI search knowledge → read chunks by embeddingRef/result
Reindex → delete old chunks, insert new chunks
```

Field penting:

```text
businessId
documentId
chunkText
chunkIndex
embeddingRef
vectorStore
metadata
```

Catatan: embedding vector tidak perlu disimpan di MySQL untuk MVP. Cukup simpan `embeddingRef`, sedangkan vector asli disimpan di FAISS dengan namespace `businessId`.

---

## 15. `agent_runs`

Menyimpan log setiap eksekusi AI.

Dipakai untuk:

```text
- Debug AI reply
- Hitung token usage
- Observability
- Evaluasi intent
```

Interaksi MVP:

```text
AI run started → insert status=running
AI success → update/insert status=success, output, intent, token usage
AI failed → update status=failed, errorMessage
Dashboard logs → read agent_runs
```

Field penting:

```text
businessId
conversationId
customerId
agentType
input
output
intent
status
errorMessage
tokensInput
tokensOutput
latencyMs
metadata
```

---

## 16. `tool_executions`

Menyimpan log tool yang dipanggil AI.

Dipakai untuk:

```text
- create_order
- create_reservation
- create_payment_qris
- human_handoff
- knowledge_search
```

Interaksi MVP:

```text
AI calls tool → insert tool_executions
Tool success → update status=success, output
Tool failed → update status=failed, errorMessage
Audit AI action → read tool_executions
```

Field penting:

```text
businessId
agentRunId
conversationId
toolName
input
output
status
errorMessage
latencyMs
```

---

# 5. Product, Order, Reservation

## 17. `product_categories`

Menyimpan kategori menu/produk.

Dipakai untuk:

```text
- Kategori minuman
- Kategori makanan
- Kategori promo
```

Interaksi MVP:

```text
Owner create category → insert
Dashboard menu → read
AI product lookup → read by businessId
```

Field penting:

```text
businessId
name
description
sortOrder
```

---

## 18. `products`

Menyimpan menu/produk UMKM.

Dipakai untuk:

```text
- AI menjawab pertanyaan menu
- AI membuat order
- Dashboard menu
```

Interaksi MVP:

```text
Owner create menu → insert products
AI read menu → read available products
Order item created → productId optional relation
Update availability → update isAvailable
```

Field penting:

```text
businessId
categoryId
name
description
price
currency
isAvailable
imageUrl
metadata
```

---

## 19. `orders`

Menyimpan order customer.

Dipakai untuk:

```text
- Order dari percakapan WhatsApp
- Status order
- Payment status
- Dashboard order
```

Interaksi MVP:

```text
AI create_order_tool → insert order status=draft
Order item inserted → update totalAmount
Customer confirms → update status=pending_confirmation
QRIS generated → update paymentStatus=waiting_payment
Payment success → update paymentStatus=paid
Order completed → update status=completed
```

Field penting:

```text
businessId
customerId
conversationId
orderNumber
status
fulfillmentType
totalAmount
currency
paymentStatus
pickupTime
deliveryAddress
notes
metadata
```

Index penting:

```text
unique(businessId, orderNumber)
index(businessId, status)
```

---

## 20. `order_items`

Menyimpan item dalam order.

Dipakai untuk:

```text
- Detail produk yang dipesan
- Perhitungan total order
```

Interaksi MVP:

```text
Create order → insert order_items
Calculate total → sum subtotal
Dashboard order detail → read by orderId
```

Field penting:

```text
businessId
orderId
productId
productName
quantity
unitPrice
subtotal
notes
```

---

## 21. `reservations`

Menyimpan reservasi customer.

Dipakai untuk:

```text
- Reservasi dari WhatsApp
- Konfirmasi admin
- Payment reservation jika diperlukan
```

Interaksi MVP:

```text
AI create_reservation_tool → insert reservation status=pending
Admin confirm → update status=confirmed
Payment success → update status=confirmed
Cancel → update status=cancelled
Dashboard reservation → read by businessId
```

Field penting:

```text
businessId
customerId
conversationId
reservationNumber
reservationDate
reservationTime
guestCount
customerName
customerPhone
status
notes
```

Index penting:

```text
unique(businessId, reservationNumber)
index(businessId, reservationDate)
index(businessId, status)
```

---

# 6. Payment dan AstraPay QRIS

## 22. `integrations`

Menyimpan credential integrasi third-party per bisnis.

Dipakai untuk:

```text
- AstraPay merchant credential
- Status integrasi
- Access token encrypted
```

Interaksi MVP:

```text
Owner/admin setup AstraPay → insert integrations provider=astrapay
Generate QRIS → read integration credentials
Credential expired/error → update status
```

Field penting:

```text
businessId
provider
status
accessTokenEncrypted
refreshTokenEncrypted
expiresAt
metadata
```

Catatan: untuk MVP, metadata bisa menyimpan:

```json
{
  "merchantId": "xxx",
  "partnerId": "xxx",
  "environment": "sandbox"
}
```

---

## 23. `payments`

Menyimpan transaksi pembayaran.

Dipakai untuk:

```text
- QRIS order
- QRIS reservasi
- QRIS top-up kredit AI jika nanti dipakai
- Status paid/unpaid/expired
```

Interaksi MVP:

```text
Create payment QRIS → insert status=waiting_payment
AstraPay callback success → update status=paid
QR expired → update status=expired
Payment failed → update status=failed
Dashboard payment → read by orderId/reservationId
```

Field penting:

```text
businessId
orderId
reservationId
customerId
conversationId
provider
method
status
amount
currency
merchantReferenceNo
providerReferenceNo
qrContent
qrImageUrl
expiresAt
paidAt
rawRequest
rawResponse
rawCallback
```

Index penting:

```text
unique(merchantReferenceNo)
index(businessId, status)
index(orderId)
index(reservationId)
```

Catatan penting: `merchantReferenceNo` harus unik karena dipakai untuk idempotency dan mapping callback AstraPay.

---

## 24. `payment_events`

Menyimpan riwayat event dari satu payment.

Dipakai untuk:

```text
- QR generated
- Payment received
- QR expired
- Payment failed
```

Interaksi MVP:

```text
QRIS generated → insert eventType=qr_generated
Webhook paid → insert eventType=payment_received
QR expired → insert eventType=qr_expired
Failed callback → insert eventType=payment_failed
```

Field penting:

```text
businessId
paymentId
eventType
payload
createdAt
```

---

## 25. `webhook_events`

Menyimpan log webhook masuk dan request eksternal.

Dipakai untuk:

```text
- Callback AstraPay
- Event WhatsApp/Baileys jika diperlukan
- Idempotency webhook
- Debug integrasi
```

Interaksi MVP:

```text
AstraPay callback received → insert webhook_events status=received
If already processed → return 200 skip
Validation success → update/insert status=processed
Validation failed → update status=failed
Ignored event → status=ignored
```

Field penting:

```text
businessId
provider
eventType
externalId
payload
status
processedAt
errorMessage
```

Catatan penting: untuk idempotency, sebaiknya tambahkan unique:

```prisma
@@unique([provider, externalId])
```

Karena sekarang hanya index. Ini penting agar callback yang sama tidak diproses dobel saat retry dari payment provider.

---

# 7. Human Takeover dan Notification

## 26. `human_handoffs`

Menyimpan kasus ketika AI menyerahkan percakapan ke admin.

Dipakai untuk:

```text
- Customer minta admin
- Komplain
- Refund request
- AI gagal menjawab
- Sensitive request
```

Interaksi MVP:

```text
AI calls human_handoff_tool → insert human_handoffs status=open
Conversation takeover → update conversations humanTakeover=true
Admin assigned → update assignedUserId/status=assigned
Resolved → update status=resolved, resolvedAt
Return to AI → close handoff
```

Field penting:

```text
businessId
conversationId
customerId
reason
summary
status
assignedUserId
resolvedAt
```

---

## 27. `notifications`

Menyimpan notifikasi dashboard/admin.

Dipakai untuk:

```text
- WhatsApp QR ready
- WhatsApp disconnected
- New handoff
- New order
- New reservation
- Payment paid
- Bot error
```

Interaksi MVP:

```text
QR ready → insert notification system
Payment paid → insert notification new_order/new_reservation
Human handoff → insert notification new_handoff
Reminder due → insert notification reminder_due
Dashboard read → update isRead=true
```

Field penting:

```text
businessId
userId
type
title
message
isRead
metadata
readAt
```

---

## 28. `reminders`

Menyimpan reminder sederhana.

Dipakai untuk:

```text
- Payment follow-up
- Reservation confirmation
- Admin task
```

Interaksi MVP:

```text
Order waiting payment → insert payment_follow_up
Reservation created → insert reservation_confirmation
Cron due → read scheduled reminders
Sent → update status=sent
Payment paid → cancel payment_follow_up
```

Field penting:

```text
businessId
customerId
conversationId
reservationId
orderId
type
title
description
scheduledAt
status
channel
createdBy
sentAt
completedAt
```

Catatan MVP: jangan buat reminder terlalu kompleks dulu. Cukup:

```text
payment_follow_up
reservation_confirmation
admin_task
```

---

# 8. Audit dan Observability

## 29. `audit_logs`

Menyimpan log aksi penting manusia/sistem.

Dipakai untuk:

```text
- User login/logout
- Bot enabled/disabled
- WhatsApp connected
- Order status changed
- Payment status changed
- Reservation confirmed
- Handoff resolved
```

Interaksi MVP:

```text
Important action → insert audit_logs
Dashboard audit → read by businessId
```

Field penting:

```text
businessId
userId
action
entityType
entityId
oldData
newData
ipAddress
userAgent
```

---

## 30. `cron_jobs`

Menyimpan log eksekusi cron.

Dipakai untuk:

```text
- QR expired job
- Reminder job
```

Interaksi MVP:

```text
Cron start → insert status=running
Cron success → update status=success, result
Cron failed → update status=failed, errorMessage
```

Field penting:

```text
jobName
status
startedAt
finishedAt
result
errorMessage
```

Catatan MVP: tabel ini opsional. Kalau mau cepat, log cron bisa pakai application logger dulu. Tapi kalau kamu ingin observability rapi, tetap pakai.

---

# 9. Flow Interaksi Database MVP

## Flow 1 — Register dan Workspace

Trigger:

```text
Owner register dari web
```

Service:

```text
apps/web → services/api → MySQL
```

Database transaction:

```text
insert users
insert businesses status=onboarding
insert business_members role=owner
insert business_onboarding progressPercent=0
insert onboarding_steps default step
insert agent_settings default Ningki
insert audit_logs action=BUSINESS_REGISTERED
```

Output:

```text
Owner punya akun, workspace bisnis, onboarding progress, dan default Ningki AI settings.
```

---

## Flow 2 — Onboarding Business

Trigger:

```text
Owner mengisi setup bisnis
```

Database read:

```text
business_onboarding
onboarding_steps
agent_settings
businesses
```

Database write:

```text
update onboarding_steps status=completed
update business_onboarding currentStep/progressPercent/needs*
update businesses profile fields
update agent_settings persona/tone/businessRules
insert audit_logs action=ONBOARDING_STEP_COMPLETED
```

Output:

```text
Data bisnis dan konfigurasi Ningki mulai siap digunakan.
```

---

## Flow 3 — Upload Knowledge

Trigger:

```text
Owner upload menu/FAQ/promo
```

Database write awal:

```text
insert files
insert knowledge_documents status=draft
```

AI process:

```text
api → ai-engine → extract text → chunk → embedding → FAISS namespace businessId
```

Database write hasil:

```text
update knowledge_documents status=indexed, extractedText
insert knowledge_chunks chunkText, chunkIndex, embeddingRef
insert audit_logs action=KNOWLEDGE_INDEXED
```

Output:

```text
Ningki bisa menjawab pertanyaan customer berdasarkan knowledge bisnis.
```

---

## Flow 4 — Connect WhatsApp

Trigger:

```text
Owner klik Hubungkan WhatsApp
```

Database write:

```text
insert whatsapp_sessions status=qr_pending
update whatsapp_sessions qrCode, qrExpiresAt
insert notifications QR siap di-scan
```

Saat QR scanned:

```text
update whatsapp_sessions status=connected, phoneNumber, lastConnectedAt
update business_onboarding readyForWhatsapp=true
update onboarding_steps whatsapp_connect=completed
insert audit_logs action=WHATSAPP_CONNECTED
```

Saat bot enabled:

```text
update whatsapp_sessions botEnabled=true
update agent_settings autoReplyEnabled=true
insert audit_logs action=BOT_ENABLED
```

Output:

```text
WhatsApp bisnis terhubung dan Ningki siap menerima pesan.
```

---

## Flow 5 — Incoming Customer Message

Trigger:

```text
Customer mengirim WhatsApp ke nomor bisnis
```

Database read:

```text
whatsapp_sessions → cek botEnabled dan connected
businesses → cek status active
messages → cek waMessageId untuk idempotency
```

Database write transaction:

```text
upsert customers by businessId + waPhone
upsert conversations active/open
insert messages inbound customer
```

Jika human takeover aktif:

```text
skip AI
insert notifications jika perlu
```

Jika AI aktif:

```text
send context to ai-engine
```

Output:

```text
Pesan customer aman tersimpan sebagai data CRM.
```

---

## Flow 6 — Ningki AI Reply

Trigger:

```text
Pesan customer diteruskan ke ai-engine
```

AI membaca context via API:

```text
agent_settings
businesses
customers
conversations history
knowledge search
products
reservations active
```

Database write setelah AI selesai:

```text
insert agent_runs status=success
insert tool_executions jika ada tool dipanggil
insert messages outbound senderType=ai
update conversations lastMessage, lastMessageAt, lastAiReplyAt
update customers leadStatus jika intent berubah
```

Output:

```text
Ningki membalas customer dan semua proses AI tercatat.
```

---

## Flow 7 — Human Takeover

Trigger:

```text
Customer minta admin / komplain / AI gagal jawab
```

Database write:

```text
update conversations humanTakeover=true, aiEnabled=false, status=human_takeover
insert human_handoffs reason, summary, status=open
insert notifications type=new_handoff
insert tool_executions human_handoff_tool
```

Admin reply:

```text
insert messages senderType=admin, direction=outbound
update conversations lastAdminReplyAt
```

Return to AI:

```text
update conversations humanTakeover=false, aiEnabled=true, status=open
update human_handoffs status=resolved, resolvedAt
insert audit_logs action=HANDOFF_RESOLVED
```

Output:

```text
AI berhenti membalas sampai admin mengembalikan percakapan ke AI.
```

---

## Flow 8 — Create Order

Trigger:

```text
Customer ingin order lewat WhatsApp
```

Database write transaction:

```text
insert orders status=draft, paymentStatus=unpaid
insert order_items
update orders totalAmount
update customers totalOrders++
insert tool_executions create_order_tool
```

Setelah customer konfirmasi:

```text
update orders status=pending_confirmation
insert reminders type=payment_follow_up
```

Output:

```text
Order terbentuk dari percakapan WhatsApp dan siap dibayar.
```

---

## Flow 9 — Create Reservation

Trigger:

```text
Customer ingin reservasi lewat WhatsApp
```

Database write transaction:

```text
insert reservations status=pending
update customers leadStatus=reserved, totalReservations++
insert reminders reservation_confirmation/admin_task
insert tool_executions create_reservation_tool
insert audit_logs action=RESERVATION_CREATED
```

Admin confirm:

```text
update reservations status=confirmed
insert notifications type=new_reservation
insert audit_logs action=RESERVATION_CONFIRMED
```

Output:

```text
Reservasi terbentuk dan bisa dikonfirmasi admin.
```

---

## Flow 10 — Generate QRIS AstraPay

Trigger:

```text
Order/reservation perlu pembayaran
```

Database read:

```text
orders/reservations → ambil totalAmount
businesses → ambil businessId
integrations → ambil AstraPay credential
```

External call:

```text
services/api → AstraPay generate QRIS
```

Database write:

```text
insert payments status=waiting_payment, merchantReferenceNo, qrContent, expiresAt
insert payment_events eventType=qr_generated
update orders paymentStatus=waiting_payment
insert webhook_events outgoing request log
insert tool_executions create_payment_qris_tool
```

Output:

```text
QRIS dibuat dan dikirim ke customer melalui WhatsApp.
```

---

## Flow 11 — AstraPay Webhook Paid

Trigger:

```text
AstraPay mengirim callback pembayaran berhasil
```

Database read:

```text
webhook_events → cek externalId sudah diproses atau belum
payments → find by merchantReferenceNo
businesses/integrations → validasi business/merchant
```

Validasi:

```text
signature valid
amount cocok
businessId cocok
payment belum paid
merchantReferenceNo belum diproses
```

Database write transaction:

```text
update payments status=paid, paidAt, providerReferenceNo, rawCallback
insert payment_events eventType=payment_received
update orders paymentStatus=paid jika payment order
update reservations status=confirmed jika payment reservation
insert/update webhook_events status=processed
cancel reminders payment_follow_up
insert notifications new_order/new_reservation/payment_paid
insert audit_logs action=PAYMENT_PAID
```

Output:

```text
Status order/reservasi otomatis paid tanpa konfirmasi manual owner.
```

---

## Flow 12 — QRIS Expired

Trigger:

```text
Cron mengecek payment waiting_payment yang sudah melewati expiresAt
```

Database read:

```text
payments where status=waiting_payment and expiresAt < now()
```

Database write:

```text
update payments status=expired
insert payment_events eventType=qr_expired
update orders paymentStatus=failed jika terkait order
insert/update cron_jobs
```

Output:

```text
QR expired tidak dianggap paid dan customer bisa diminta generate QR baru.
```

---

## Flow 13 — Reminder Cron

Trigger:

```text
Cron berjalan tiap 1 menit
```

Database read:

```text
reminders status=scheduled and scheduledAt <= now()
businesses active
customers waPhone
whatsapp_sessions botEnabled
```

Database write:

```text
send via wa-worker jika channel=whatsapp
insert notifications jika channel=admin_notification
update reminders status=sent/sentAt
insert/update cron_jobs
```

Output:

```text
Reminder pembayaran/reservasi/admin berjalan otomatis.
```

---

# 10. Tabel yang Sebaiknya Ditunda dari MVP

Tabel berikut sudah boleh tetap ada di schema, tapi fitur dan interaksinya bisa ditunda:

```text
customer_tags
customer_tag_assignments
spreadsheet_configs
spreadsheet_sync_logs
advanced campaign table
advanced RFM scoring table
disbursement table
mitra/affiliate table
```

Alasannya: MVP cukup membuktikan core loop dulu:

```text
WhatsApp → AI Reply → CRM Data → Order/Reservation → QRIS Payment → Owner Notification
```

---

# 11. Relasi MVP Paling Penting

```text
users
  → businesses
  → business_members

businesses
  → agent_settings
  → whatsapp_sessions
  → customers
  → conversations
  → messages
  → knowledge_documents
  → knowledge_chunks
  → products
  → orders
  → reservations
  → payments
  → notifications
  → audit_logs

customers
  → conversations
  → messages
  → orders
  → reservations
  → payments

conversations
  → messages
  → agent_runs
  → tool_executions
  → human_handoffs
  → orders
  → reservations
  → payments

orders
  → order_items
  → payments
  → reminders

reservations
  → payments
  → reminders

payments
  → payment_events
  → webhook_events
```

---

# 12. Checklist Keamanan Database MVP

Wajib diterapkan sebelum demo/MVP:

```text
[ ] Semua tabel tenant punya businessId.
[ ] Semua API query wajib filter businessId.
[ ] Tidak ada direct DB access dari wa-worker.
[ ] Tidak ada direct DB access dari ai-engine.
[ ] Payment merchantReferenceNo unique.
[ ] Webhook provider + externalId unique.
[ ] WhatsApp waMessageId idempotent per businessId.
[ ] Credential AstraPay disimpan encrypted.
[ ] sessionDataEncrypted benar-benar encrypted.
[ ] rawCallback/rawRequest jangan berisi secret sensitif.
[ ] Semua status payment diproses dalam transaction.
[ ] Human takeover mematikan AI reply.
[ ] Knowledge FAISS dipisah per businessId.
[ ] Audit log untuk aksi penting.
```

---

# 13. Minimal Database Setup untuk MVP

Kalau mau benar-benar fokus MVP, tabel yang wajib dimigrate dan dipakai dulu:

```text
users
refresh_tokens
businesses
business_members
business_onboarding
onboarding_steps
agent_settings

whatsapp_sessions
customers
conversations
messages

files
knowledge_documents
knowledge_chunks

product_categories
products
orders
order_items
reservations

integrations
payments
payment_events
webhook_events

human_handoffs
notifications
reminders
agent_runs
tool_executions
audit_logs
```

Opsional:

```text
cron_jobs
```

Tunda:

```text
customer_tags
customer_tag_assignments
spreadsheet_configs
spreadsheet_sync_logs
```

---

# 14. Kesimpulan MVP

Database kamu sudah cukup kuat untuk MVP. Struktur yang paling penting sudah tersedia: tenant isolation lewat `businessId`, WhatsApp session, customer CRM, conversation/message history, knowledge base, AI run logging, order/reservation, QRIS payment, webhook event, human handoff, notification, dan audit log. Flow database kamu juga sudah jelas bahwa incoming WhatsApp message diproses oleh API, disimpan sebagai customer/conversation/message, lalu diteruskan ke AI engine jika bot aktif. 

Fokus implementasi MVP sebaiknya dikunci pada satu loop utama:

```text
Owner onboarding
→ connect WhatsApp
→ upload knowledge/menu
→ customer chat
→ Ningki reply
→ order/reservasi
→ QRIS payment
→ webhook paid
→ owner notification
```

Kalau loop ini jalan stabil, Nongki sudah layak disebut MVP.
