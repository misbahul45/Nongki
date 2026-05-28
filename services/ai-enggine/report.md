Berikut format `.md` yang bisa langsung kamu copy sebagai dokumen pemahaman **ekosistem `services/ai-enggine`** berdasarkan model database kamu. Database kamu sudah punya pondasi penting untuk AI: `AgentRun`, `ToolExecution`, `KnowledgeDocument`, `KnowledgeChunk`, `Conversation`, `Message`, `Customer`, `Reservation`, `Order`, `Reminder`, `HumanHandoff`, `Notification`, sampai `Payment` untuk future payment flow. 

````md
# AI Engine Ecosystem - Ningki / Nongki

## 1. Gambaran Besar

`services/ai-enggine` adalah otak AI dari sistem Ningki.

AI Engine tidak bertugas menyimpan semua data secara langsung ke database tanpa kontrol. AI Engine bertugas:

1. Menerima request dari `services/api`.
2. Membaca konteks bisnis.
3. Membaca riwayat percakapan.
4. Mengambil knowledge dari RAG.
5. Menentukan intent customer.
6. Memutuskan apakah perlu memakai tool.
7. Memanggil tool internal API.
8. Menghasilkan balasan WhatsApp.
9. Menghasilkan structured action.
10. Mencatat `agent_runs`.
11. Mencatat `tool_executions`.
12. Melakukan human handoff jika perlu.

AI Engine harus selalu berjalan dengan prinsip:

> AI boleh berpikir dan memberi rekomendasi, tapi perubahan data bisnis harus lewat tool yang terkontrol.

---

# 2. Posisi AI Engine dalam Arsitektur

```txt
Customer WhatsApp
↓
services/wa-worker
↓
services/api
↓
services/ai-enggine
↓
LangGraph Agent
↓
Tool Calling
↓
services/api
↓
Database PostgreSQL
````

## Tanggung jawab service

### services/wa-worker

* Terhubung ke WhatsApp via Baileys.
* Menerima pesan.
* Mengirim balasan.
* Mengelola QR/session.
* Tidak melakukan AI reasoning.
* Tidak melakukan business logic berat.

### services/api

* Main backend.
* Auth.
* Database.
* CRM.
* Business logic.
* Validasi tenant.
* Menyediakan internal tools untuk AI.
* Menyimpan message, customer, order, reservation, reminder.

### services/ai-enggine

* AI reasoning.
* Intent classification.
* RAG retrieval.
* LangGraph workflow.
* Tool planning.
* Response generation.
* Agent logging.
* Safety guardrail.

---

# 3. Prinsip Utama AI Engine

## 3.1 Tenant Isolation

Semua request AI wajib membawa:

```json
{
  "business_id": "uuid"
}
```

AI tidak boleh melakukan retrieval, tool call, atau membaca conversation tanpa `business_id`.

Rule:

```txt
business_id wajib ada di semua:
- agent state
- tool input
- RAG query
- API call
- log agent run
- log tool execution
```

## 3.2 AI Tidak Boleh Direct Database Write Sembarangan

AI Engine idealnya tidak langsung update database utama. AI Engine memanggil API internal:

```txt
POST /internal/tools/customer/update
POST /internal/tools/reservation/create
POST /internal/tools/order/create
POST /internal/tools/reminder/create
POST /internal/tools/handoff/create
```

Alasannya:

* Validasi tetap di API.
* Tenant isolation tetap kuat.
* Audit log lebih mudah.
* Tool execution bisa dilacak.
* Business rule tidak tersebar.

## 3.3 Semua Tool Call Harus Dicatat

Setiap tool call harus masuk tabel:

```txt
tool_executions
```

Minimal data:

```json
{
  "business_id": "uuid",
  "agent_run_id": "uuid",
  "conversation_id": "uuid",
  "tool_name": "create_reservation_tool",
  "input": {},
  "output": {},
  "status": "success",
  "latency_ms": 123
}
```

## 3.4 Semua Agent Run Harus Dicatat

Setiap request AI harus masuk tabel:

```txt
agent_runs
```

Agent type:

```txt
onboarding_agent
knowledge_agent
whatsapp_customer_agent
crm_assistant_agent
```

Status:

```txt
running
success
failed
interrupted
```

---

# 4. Struktur Folder AI Engine

Gunakan struktur ini:

```txt
services/ai-enggine/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── health.py
│   │   ├── onboarding.py
│   │   ├── whatsapp_agent.py
│   │   ├── knowledge.py
│   │   ├── crm_assistant.py
│   │   └── tools.py
│   ├── agents/
│   │   ├── onboarding_agent/
│   │   │   ├── graph.py
│   │   │   ├── nodes.py
│   │   │   ├── prompts.py
│   │   │   └── state.py
│   │   ├── whatsapp_customer_agent/
│   │   │   ├── graph.py
│   │   │   ├── nodes.py
│   │   │   ├── prompts.py
│   │   │   ├── state.py
│   │   │   └── intent.py
│   │   ├── knowledge_agent/
│   │   │   ├── graph.py
│   │   │   ├── nodes.py
│   │   │   ├── prompts.py
│   │   │   └── state.py
│   │   └── crm_assistant_agent/
│   │       ├── graph.py
│   │       ├── nodes.py
│   │       ├── prompts.py
│   │       └── state.py
│   ├── rag/
│   │   ├── loader.py
│   │   ├── extractor.py
│   │   ├── splitter.py
│   │   ├── embeddings.py
│   │   ├── vectorstore.py
│   │   ├── retriever.py
│   │   └── indexer.py
│   ├── tools/
│   │   ├── base.py
│   │   ├── knowledge_search.py
│   │   ├── product_search.py
│   │   ├── customer_update.py
│   │   ├── conversation_summary.py
│   │   ├── reservation_create.py
│   │   ├── reservation_update.py
│   │   ├── order_create.py
│   │   ├── order_update.py
│   │   ├── reminder_create.py
│   │   ├── human_handoff.py
│   │   ├── notification_create.py
│   │   ├── spreadsheet_sync.py
│   │   ├── payment_create.py
│   │   └── bot_readiness.py
│   ├── schemas/
│   │   ├── common.py
│   │   ├── agent.py
│   │   ├── onboarding.py
│   │   ├── whatsapp.py
│   │   ├── knowledge.py
│   │   ├── tools.py
│   │   ├── crm.py
│   │   ├── reservation.py
│   │   ├── order.py
│   │   └── reminder.py
│   ├── services/
│   │   ├── api_client.py
│   │   ├── agent_run_service.py
│   │   ├── tool_execution_service.py
│   │   ├── memory_service.py
│   │   ├── business_context_service.py
│   │   ├── knowledge_service.py
│   │   └── guardrail_service.py
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   ├── security.py
│   │   ├── llm.py
│   │   └── errors.py
│   └── tests/
│       ├── test_whatsapp_agent.py
│       ├── test_onboarding_agent.py
│       ├── test_knowledge_agent.py
│       ├── test_tools.py
│       └── test_rag.py
├── pyproject.toml
├── uv.lock
├── README.md
└── .env.example
```

---

# 5. Environment Variables

```env
APP_ENV=development
APP_NAME=ningki-ai-enggine
APP_PORT=8000

API_BASE_URL=http://localhost:3000
API_INTERNAL_TOKEN=change_me

GEMINI_API_KEY=change_me
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

FAISS_INDEX_DIR=./storage/faiss
UPLOAD_TMP_DIR=./storage/tmp

REDIS_URL=redis://localhost:6379

LOG_LEVEL=info
```

---

# 6. API Endpoint di AI Engine

## 6.1 Health

```txt
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "ai-enggine"
}
```

---

## 6.2 WhatsApp Agent Respond

Dipanggil oleh `services/api` ketika ada pesan customer baru.

```txt
POST /agent/whatsapp/respond
```

Request:

```json
{
  "business_id": "uuid",
  "conversation_id": "uuid",
  "customer_id": "uuid",
  "message_id": "uuid",
  "customer_message": "Ada menu apa aja?",
  "metadata": {
    "wa_phone": "628xxxx",
    "customer_name": "Budi"
  }
}
```

Response:

```json
{
  "reply": "Halo kak 😊 Untuk menu kami ada Espresso, Americano, Latte, dan Matcha Latte...",
  "intent": "ask_menu",
  "needs_human": false,
  "tool_calls": [
    {
      "tool_name": "knowledge_search_tool",
      "status": "success"
    }
  ],
  "agent_run_id": "uuid"
}
```

---

## 6.3 Onboarding Agent

```txt
POST /agent/onboarding/respond
```

Request:

```json
{
  "business_id": "uuid",
  "user_message": "Saya punya coffee shop kecil, mau bot bantu reservasi dan jawab menu",
  "current_step": "business_goal",
  "onboarding_context": {}
}
```

Response:

```json
{
  "reply": "Siap, berarti fokus utama bot kamu adalah jawab menu dan bantu reservasi. Sekarang boleh upload menu terbaru kamu?",
  "next_step": "menu_upload",
  "completed_steps": ["business_goal"],
  "missing_steps": ["menu_upload", "opening_hours", "location", "faq"],
  "ready_for_whatsapp": false,
  "structured_data": {
    "needs_reservation": true,
    "needs_order": false,
    "main_goal": ["answer_menu", "reservation"]
  }
}
```

---

## 6.4 Knowledge Process

```txt
POST /knowledge/process
```

Request:

```json
{
  "business_id": "uuid",
  "document_id": "uuid"
}
```

Response:

```json
{
  "document_id": "uuid",
  "status": "indexed",
  "document_type": "menu",
  "chunks_count": 12,
  "needs_review": false
}
```

---

## 6.5 Knowledge Reindex

```txt
POST /knowledge/reindex
```

Request:

```json
{
  "business_id": "uuid",
  "document_ids": ["uuid"]
}
```

Response:

```json
{
  "status": "success",
  "indexed_documents": 1,
  "indexed_chunks": 20
}
```

---

## 6.6 CRM Assistant Summary

```txt
POST /agent/crm/summary
```

Request:

```json
{
  "business_id": "uuid",
  "conversation_id": "uuid",
  "customer_id": "uuid"
}
```

Response:

```json
{
  "summary": "Customer bertanya menu dan tertarik reservasi untuk 4 orang besok malam.",
  "lead_status": "interested",
  "recommended_tags": ["reservation_candidate"],
  "recommended_follow_up": "Follow up dalam 1 jam jika belum konfirmasi."
}
```

---

# 7. Agent Types

Berdasarkan enum database:

```txt
AgentType:
- onboarding_agent
- whatsapp_customer_agent
- crm_assistant_agent
- knowledge_agent
```

## 7.1 Onboarding Agent

### Tujuan

Membantu owner/admin coffee shop melakukan setup bisnis.

### Input utama

* Business profile.
* Onboarding step.
* Jawaban user.
* Status checklist.
* Data yang sudah lengkap.
* Data yang masih kurang.

### Output utama

* Pertanyaan berikutnya.
* Structured onboarding data.
* Completed steps.
* Missing steps.
* Readiness status.

### Tabel terkait

```txt
businesses
business_onboarding
onboarding_steps
agent_settings
knowledge_documents
whatsapp_sessions
agent_runs
tool_executions
```

---

## 7.2 Knowledge Agent

### Tujuan

Memproses data bisnis menjadi knowledge base.

### Input utama

* File menu.
* FAQ manual.
* Promo.
* Jam buka.
* Lokasi.
* Policy reservasi.
* Policy order.

### Output utama

* Document type.
* Extracted data.
* Chunks.
* Review status.
* Missing fields.

### Tabel terkait

```txt
knowledge_documents
knowledge_chunks
files
products
product_categories
agent_runs
tool_executions
```

---

## 7.3 WhatsApp Customer Agent

### Tujuan

Membalas customer WhatsApp dan menjalankan action CRM.

### Input utama

* Incoming customer message.
* Business context.
* Agent settings.
* Conversation history.
* Customer profile.
* Retrieved knowledge.
* Product data.
* Reservation/order state.

### Output utama

* Reply WhatsApp.
* Intent.
* Tool calls.
* Human handoff status.
* Reminder action.
* CRM update.

### Tabel terkait

```txt
businesses
agent_settings
whatsapp_sessions
customers
conversations
messages
knowledge_documents
knowledge_chunks
products
orders
order_items
reservations
reminders
human_handoffs
notifications
agent_runs
tool_executions
```

---

## 7.4 CRM Assistant Agent

### Tujuan

Membantu admin memahami customer dan percakapan.

### Input utama

* Conversation history.
* Customer profile.
* Orders.
* Reservations.
* Messages.

### Output utama

* Summary.
* Lead status.
* Recommended tags.
* Recommended reminder.
* Needs admin attention.

### Tabel terkait

```txt
customers
customer_tags
customer_tag_assignments
conversations
messages
orders
reservations
reminders
agent_runs
tool_executions
```

---

# 8. LangGraph Flow

## 8.1 WhatsApp Customer Agent Graph

```txt
START
↓
create_agent_run
↓
load_business_context
↓
load_agent_settings
↓
load_customer_profile
↓
load_conversation_history
↓
check_bot_enabled
↓
check_human_takeover
↓
classify_intent
↓
retrieve_knowledge
↓
decide_action
↓
tool_router
↓
execute_tools
↓
generate_reply
↓
apply_guardrails
↓
save_agent_result
↓
END
```

## Jika bot disabled

```txt
check_bot_enabled
↓
return no_reply
```

## Jika human takeover aktif

```txt
check_human_takeover
↓
save_inbound_only
↓
notify_admin
↓
return no_reply
```

## Jika tidak tahu jawaban

```txt
classify_intent / retrieve_knowledge
↓
unknown or low confidence
↓
human_handoff_tool
↓
generate polite fallback reply
```

---

## 8.2 Onboarding Agent Graph

```txt
START
↓
create_agent_run
↓
load_business_onboarding
↓
load_onboarding_steps
↓
understand_user_answer
↓
update_structured_onboarding
↓
decide_next_step
↓
check_readiness
↓
generate_onboarding_reply
↓
save_agent_result
↓
END
```

---

## 8.3 Knowledge Agent Graph

```txt
START
↓
create_agent_run
↓
load_document
↓
extract_text
↓
classify_document_type
↓
extract_structured_data
↓
validate_document_quality
↓
split_chunks
↓
create_embeddings
↓
save_faiss_index
↓
save_knowledge_chunks
↓
mark_document_indexed_or_needs_review
↓
save_agent_result
↓
END
```

---

## 8.4 CRM Assistant Graph

```txt
START
↓
create_agent_run
↓
load_customer_profile
↓
load_conversation_history
↓
load_orders_and_reservations
↓
summarize_conversation
↓
classify_lead_status
↓
recommend_tags
↓
recommend_follow_up
↓
save_summary
↓
END
```

---

# 9. Agent State Schema

## 9.1 WhatsAppCustomerAgentState

```py
class WhatsAppCustomerAgentState(TypedDict):
    business_id: str
    conversation_id: str
    customer_id: str
    message_id: str
    customer_message: str

    business_context: dict
    agent_settings: dict
    customer_profile: dict
    conversation_history: list[dict]
    retrieved_knowledge: list[dict]

    intent: str | None
    confidence: float
    missing_slots: list[str]

    planned_tools: list[dict]
    tool_results: list[dict]

    needs_human: bool
    human_handoff_reason: str | None

    final_reply: str | None
    no_reply: bool

    agent_run_id: str | None
    error: str | None
```

---

## 9.2 OnboardingAgentState

```py
class OnboardingAgentState(TypedDict):
    business_id: str
    user_message: str
    current_step: str | None

    business_onboarding: dict
    onboarding_steps: list[dict]

    extracted_data: dict
    completed_steps: list[str]
    missing_steps: list[str]
    next_step: str | None

    ready_for_whatsapp: bool
    ready_for_bot_activation: bool

    reply: str | None
    agent_run_id: str | None
    error: str | None
```

---

## 9.3 KnowledgeAgentState

```py
class KnowledgeAgentState(TypedDict):
    business_id: str
    document_id: str

    document: dict
    file: dict | None
    raw_text: str | None
    extracted_text: str | None

    document_type: str | None
    extracted_data: dict
    chunks: list[dict]

    needs_review: bool
    review_notes: str | None

    indexed: bool
    agent_run_id: str | None
    error: str | None
```

---

## 9.4 CRMAssistantState

```py
class CRMAssistantState(TypedDict):
    business_id: str
    conversation_id: str
    customer_id: str

    customer_profile: dict
    conversation_history: list[dict]
    orders: list[dict]
    reservations: list[dict]

    summary: str | None
    lead_status: str | None
    recommended_tags: list[str]
    recommended_follow_up: str | None
    needs_admin_attention: bool

    agent_run_id: str | None
    error: str | None
```

---

# 10. Intent yang Harus Dikenali

```txt
greeting
ask_menu
ask_price
ask_promo
ask_location
ask_opening_hours
make_order
make_reservation
modify_order
cancel_order
complaint
ask_payment
ask_delivery
ask_admin
unknown
```

## Intent Mapping ke Tool

| Intent            | Tool Utama                        | Human Approval        |
| ----------------- | --------------------------------- | --------------------- |
| greeting          | none / knowledge_search           | no                    |
| ask_menu          | product_search / knowledge_search | no                    |
| ask_price         | product_search                    | no                    |
| ask_promo         | knowledge_search                  | no                    |
| ask_location      | knowledge_search                  | no                    |
| ask_opening_hours | knowledge_search                  | no                    |
| make_order        | product_search + create_order     | confirmation customer |
| make_reservation  | create_reservation                | confirmation customer |
| modify_order      | update_order                      | maybe                 |
| cancel_order      | update_order / handoff            | yes if paid           |
| complaint         | human_handoff                     | yes                   |
| ask_payment       | knowledge_search / payment_status | no                    |
| ask_delivery      | knowledge_search                  | no                    |
| ask_admin         | human_handoff                     | yes                   |
| unknown           | human_handoff after max attempts  | yes                   |

---

# 11. Tooling Ecosystem

AI Engine membutuhkan tools berikut.

---

# 12. Base Tool Standard

Semua tool harus punya struktur standar:

```py
class ToolResult(BaseModel):
    success: bool
    tool_name: str
    data: dict = {}
    error: str | None = None
    needs_human: bool = False
    user_message: str | None = None
```

Setiap tool wajib:

1. Validasi input pakai Pydantic.
2. Wajib punya `business_id`.
3. Wajib mencatat `tool_executions`.
4. Wajib return structured JSON.
5. Tidak boleh lempar error mentah ke LLM.
6. Tidak boleh mengambil data lintas tenant.
7. Harus punya timeout.
8. Harus idempotent jika action penting.

---

# 13. Tool List Lengkap

## 13.1 knowledge_search_tool

### Tujuan

Mencari jawaban dari knowledge base bisnis.

### Kapan dipakai

* Customer tanya menu umum.
* Customer tanya lokasi.
* Customer tanya jam buka.
* Customer tanya promo.
* Customer tanya FAQ.
* Customer tanya aturan reservasi/order/payment.

### Input

```json
{
  "business_id": "uuid",
  "query": "menu kopi susu",
  "document_types": ["menu", "faq"],
  "top_k": 5
}
```

### Output

```json
{
  "success": true,
  "tool_name": "knowledge_search_tool",
  "data": {
    "results": [
      {
        "chunk_text": "Kopi Susu Gula Aren Rp20.000",
        "document_id": "uuid",
        "document_type": "menu",
        "score": 0.89
      }
    ]
  }
}
```

### Tabel terkait

```txt
knowledge_documents
knowledge_chunks
tool_executions
```

### Guardrail

* Query wajib filter `business_id`.
* Jangan return chunk dari business lain.
* Jika tidak ada hasil cukup relevan, return empty result.
* Jangan mengarang jawaban.

---

## 13.2 product_search_tool

### Tujuan

Mencari produk/menu structured dari tabel `products`.

### Kapan dipakai

* Customer tanya menu.
* Customer tanya harga.
* Customer ingin order.
* Customer tanya ketersediaan.

### Input

```json
{
  "business_id": "uuid",
  "keyword": "latte",
  "only_available": true
}
```

### Output

```json
{
  "success": true,
  "tool_name": "product_search_tool",
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Cafe Latte",
        "description": "Espresso dengan susu",
        "price": 25000,
        "currency": "IDR",
        "is_available": true,
        "category": "Coffee"
      }
    ]
  }
}
```

### Tabel terkait

```txt
products
product_categories
tool_executions
```

### Guardrail

* Jangan tampilkan produk `is_available = false` kecuali admin minta.
* Jika harga tidak ada, jangan karang.
* Jika produk tidak ditemukan, tawarkan admin atau menu lain.

---

## 13.3 update_customer_tool

### Tujuan

Update data customer dari percakapan.

### Kapan dipakai

* Customer menyebut nama.
* Customer memberi email.
* Customer menunjukkan minat beli.
* Customer komplain.
* Customer sudah order/reservasi.
* Customer perlu tag.

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid",
  "name": "Budi",
  "email": null,
  "lead_status": "interested",
  "notes": "Tertarik reservasi untuk 4 orang",
  "tags": ["reservation_candidate"]
}
```

### Output

```json
{
  "success": true,
  "tool_name": "update_customer_tool",
  "data": {
    "customer_id": "uuid",
    "updated_fields": ["name", "lead_status", "notes"]
  }
}
```

### Tabel terkait

```txt
customers
customer_tags
customer_tag_assignments
tool_executions
audit_logs
```

### Guardrail

* Jangan overwrite nama lama jika confidence rendah.
* Jangan hapus notes manual admin.
* Tag harus per `business_id`.

---

## 13.4 get_customer_profile_tool

### Tujuan

Mengambil profil customer untuk personalisasi.

### Kapan dipakai

* Sebelum generate reply.
* Saat CRM assistant membuat summary.
* Saat agent ingin tahu riwayat order/reservasi.

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "get_customer_profile_tool",
  "data": {
    "customer": {
      "id": "uuid",
      "name": "Budi",
      "wa_phone": "628xxx",
      "lead_status": "reserved",
      "total_orders": 2,
      "total_reservations": 1,
      "notes": "Suka latte less sugar"
    },
    "tags": ["VIP"],
    "recent_orders": [],
    "recent_reservations": []
  }
}
```

### Tabel terkait

```txt
customers
customer_tags
customer_tag_assignments
orders
reservations
```

---

## 13.5 get_conversation_history_tool

### Tujuan

Mengambil riwayat percakapan.

### Kapan dipakai

* Sebelum membalas customer.
* Untuk summary.
* Untuk memahami slot yang sudah dikumpulkan.

### Input

```json
{
  "business_id": "uuid",
  "conversation_id": "uuid",
  "limit": 20
}
```

### Output

```json
{
  "success": true,
  "tool_name": "get_conversation_history_tool",
  "data": {
    "messages": [
      {
        "sender_type": "customer",
        "content": "Mau reservasi besok",
        "created_at": "2026-05-29T10:00:00Z"
      }
    ]
  }
}
```

### Tabel terkait

```txt
conversations
messages
```

---

## 13.6 create_reservation_tool

### Tujuan

Membuat reservasi dari percakapan WhatsApp.

### Kapan dipakai

Setelah customer mengonfirmasi detail:

* nama
* tanggal
* jam
* jumlah orang

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid",
  "conversation_id": "uuid",
  "customer_name": "Budi",
  "customer_phone": "628xxx",
  "reservation_date": "2026-05-30",
  "reservation_time": "19:00",
  "guest_count": 4,
  "notes": "Indoor kalau ada"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "create_reservation_tool",
  "data": {
    "reservation_id": "uuid",
    "reservation_number": "RSV-0001",
    "status": "pending",
    "reservation_date": "2026-05-30",
    "reservation_time": "19:00",
    "guest_count": 4
  },
  "user_message": "Reservasi kakak sudah kami catat untuk 4 orang tanggal 30 Mei jam 19.00."
}
```

### Tabel terkait

```txt
reservations
customers
conversations
reminders
notifications
tool_executions
audit_logs
```

### Side effect

Setelah reservasi dibuat, sistem bisa otomatis buat reminder:

```txt
- reminder customer H-1
- reminder admin 30 menit sebelum reservasi
```

### Guardrail

* Jangan buat reservasi jika slot belum lengkap.
* Harus minta konfirmasi customer dulu.
* Jika tanggal/jam ambigu, tanya ulang.
* Jika kebijakan reservasi tidak tersedia, gunakan human handoff.

---

## 13.7 update_reservation_tool

### Tujuan

Mengubah status reservasi.

### Kapan dipakai

* Customer ingin cancel.
* Admin ingin confirm.
* Admin ingin complete.
* Customer minta ubah jam.

### Input

```json
{
  "business_id": "uuid",
  "reservation_id": "uuid",
  "status": "confirmed",
  "notes": "Dikonfirmasi oleh admin"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "update_reservation_tool",
  "data": {
    "reservation_id": "uuid",
    "status": "confirmed"
  }
}
```

### Tabel terkait

```txt
reservations
audit_logs
tool_executions
```

### Guardrail

* Perubahan besar sebaiknya butuh admin approval.
* AI boleh cancel hanya jika customer jelas meminta dan policy mengizinkan.
* Jika ragu, human handoff.

---

## 13.8 create_order_tool

### Tujuan

Membuat order dari percakapan.

### Kapan dipakai

Setelah customer mengonfirmasi:

* item
* jumlah
* fulfillment type
* pickup/delivery detail jika perlu

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid",
  "conversation_id": "uuid",
  "fulfillment_type": "takeaway",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Cafe Latte",
      "quantity": 2,
      "unit_price": 25000,
      "notes": "less sugar"
    }
  ],
  "pickup_time": "2026-05-29T17:00:00+07:00",
  "delivery_address": null,
  "notes": "Ambil sore"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "create_order_tool",
  "data": {
    "order_id": "uuid",
    "order_number": "ORD-0001",
    "status": "pending_confirmation",
    "total_amount": 50000,
    "payment_status": "unpaid"
  },
  "user_message": "Order kakak sudah kami catat. Totalnya Rp50.000."
}
```

### Tabel terkait

```txt
orders
order_items
products
customers
conversations
reminders
tool_executions
audit_logs
```

### Guardrail

* Jangan buat order jika item belum jelas.
* Jangan buat order jika harga tidak ditemukan.
* Minta konfirmasi customer sebelum create.
* Jika request diskon custom, human handoff.

---

## 13.9 update_order_tool

### Tujuan

Update status order.

### Kapan dipakai

* Admin confirm order.
* Order preparing.
* Order ready.
* Order complete.
* Customer cancel.

### Input

```json
{
  "business_id": "uuid",
  "order_id": "uuid",
  "status": "confirmed",
  "payment_status": "waiting_payment",
  "notes": "Menunggu pembayaran"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "update_order_tool",
  "data": {
    "order_id": "uuid",
    "status": "confirmed",
    "payment_status": "waiting_payment"
  }
}
```

### Tabel terkait

```txt
orders
audit_logs
tool_executions
```

### Guardrail

* Cancel order paid harus human approval.
* Refund harus human handoff.
* Jangan ubah status paid tanpa payment callback/manual admin.

---

## 13.10 create_reminder_tool

### Tujuan

Membuat reminder untuk admin atau customer.

### Kapan dipakai

* Customer belum konfirmasi order.
* Customer booking reservasi.
* Customer belum bayar.
* Admin perlu follow up.
* Customer perlu diingatkan H-1.

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid",
  "conversation_id": "uuid",
  "reservation_id": "uuid",
  "order_id": null,
  "type": "reservation_confirmation",
  "title": "Reminder reservasi Budi",
  "description": "Kirim reminder H-1 untuk reservasi 4 orang.",
  "scheduled_at": "2026-05-29T09:00:00+07:00",
  "channel": "whatsapp",
  "created_by": "ai"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "create_reminder_tool",
  "data": {
    "reminder_id": "uuid",
    "status": "scheduled",
    "scheduled_at": "2026-05-29T09:00:00+07:00"
  }
}
```

### Tabel terkait

```txt
reminders
notifications
tool_executions
audit_logs
```

### Guardrail

* Jangan spam.
* Maksimal reminder customer per hari.
* Jangan kirim di luar jam wajar.
* Reminder promosi harus hati-hati.
* Reminder customer hanya jika ada konteks jelas.

---

## 13.11 human_handoff_tool

### Tujuan

Mengalihkan percakapan ke admin manusia.

### Kapan dipakai

* Customer minta admin.
* Komplain.
* Refund.
* Request sensitif.
* AI tidak tahu jawaban.
* Bot gagal memahami setelah beberapa percobaan.
* Perubahan order/reservasi berisiko.

### Input

```json
{
  "business_id": "uuid",
  "conversation_id": "uuid",
  "customer_id": "uuid",
  "reason": "complaint",
  "summary": "Customer komplain pesanan salah dan meminta solusi admin."
}
```

### Output

```json
{
  "success": true,
  "tool_name": "human_handoff_tool",
  "data": {
    "handoff_id": "uuid",
    "conversation_status": "human_takeover",
    "human_takeover": true
  },
  "user_message": "Baik kak, aku teruskan ke admin manusia ya. Mohon tunggu sebentar 🙏"
}
```

### Tabel terkait

```txt
human_handoffs
conversations
notifications
tool_executions
audit_logs
```

### Side effect

* Set `conversations.human_takeover = true`
* Set `conversations.status = human_takeover`
* Create notification `new_handoff`
* Bot berhenti auto-reply sampai admin return to AI

---

## 13.12 create_notification_tool

### Tujuan

Membuat notifikasi dashboard.

### Kapan dipakai

* WhatsApp disconnected.
* New handoff.
* New reservation.
* New order.
* Reminder due.
* Bot error.

### Input

```json
{
  "business_id": "uuid",
  "user_id": null,
  "type": "new_reservation",
  "title": "Reservasi baru",
  "message": "Budi membuat reservasi untuk 4 orang jam 19.00",
  "metadata": {
    "reservation_id": "uuid"
  }
}
```

### Output

```json
{
  "success": true,
  "tool_name": "create_notification_tool",
  "data": {
    "notification_id": "uuid"
  }
}
```

### Tabel terkait

```txt
notifications
tool_executions
```

---

## 13.13 summarize_conversation_tool

### Tujuan

Meringkas percakapan untuk admin dan CRM.

### Kapan dipakai

* Setelah percakapan cukup panjang.
* Saat human handoff.
* Saat admin buka conversation.
* Saat lead status perlu update.

### Input

```json
{
  "business_id": "uuid",
  "conversation_id": "uuid",
  "customer_id": "uuid"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "summarize_conversation_tool",
  "data": {
    "summary": "Customer bertanya menu latte dan ingin reservasi besok malam.",
    "intent": "make_reservation",
    "lead_status": "interested",
    "recommended_tags": ["reservation_candidate"],
    "needs_admin_attention": false
  }
}
```

### Tabel terkait

```txt
conversations
messages
customers
customer_tags
customer_tag_assignments
tool_executions
```

---

## 13.14 spreadsheet_sync_tool

### Tujuan

Mengirim data CRM ke Google Sheets.

### Kapan dipakai

* Setelah reservation dibuat.
* Setelah order dibuat.
* Setelah customer dibuat.
* Manual sync dari dashboard.
* Auto sync enabled.

### Input

```json
{
  "business_id": "uuid",
  "entity_type": "reservation",
  "entity_id": "uuid"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "spreadsheet_sync_tool",
  "data": {
    "sync_log_id": "uuid",
    "status": "pending"
  }
}
```

### Tabel terkait

```txt
integrations
spreadsheet_configs
spreadsheet_sync_logs
tool_executions
```

### Guardrail

* Spreadsheet bukan source of truth.
* MVP hanya one-way export.
* Jika sync gagal, jangan gagalkan order/reservation.
* Catat error di `spreadsheet_sync_logs`.

---

## 13.15 check_bot_readiness_tool

### Tujuan

Mengecek apakah bot boleh aktif.

### Kapan dipakai

* Setelah onboarding step berubah.
* Sebelum user enable bot.
* Sebelum WhatsApp connect.
* Saat onboarding agent selesai.

### Input

```json
{
  "business_id": "uuid"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "check_bot_readiness_tool",
  "data": {
    "ready_for_whatsapp": true,
    "ready_for_bot_activation": false,
    "missing_steps": ["whatsapp_connect", "bot_test"],
    "completed_steps": [
      "business_profile",
      "menu_upload",
      "opening_hours",
      "location",
      "faq",
      "agent_persona"
    ]
  }
}
```

### Tabel terkait

```txt
business_onboarding
onboarding_steps
knowledge_documents
whatsapp_sessions
agent_settings
tool_executions
```

### Readiness rule

Bot baru boleh aktif jika:

```txt
- business_profile completed
- opening_hours completed
- location completed
- minimal satu knowledge document indexed
- agent_persona completed
- whatsapp_session connected
- bot_test completed
```

---

## 13.16 create_payment_tool

### Tujuan

Future tool untuk membuat payment QRIS/manual.

### Status

Bukan fokus MVP awal, tapi schema sudah ada.

### Kapan dipakai

* Order butuh pembayaran.
* Reservation deposit.
* Event/pre-order.

### Input

```json
{
  "business_id": "uuid",
  "customer_id": "uuid",
  "conversation_id": "uuid",
  "order_id": "uuid",
  "reservation_id": null,
  "amount": 50000,
  "method": "qris",
  "provider": "astrapay"
}
```

### Output

```json
{
  "success": true,
  "tool_name": "create_payment_tool",
  "data": {
    "payment_id": "uuid",
    "status": "waiting_payment",
    "amount": 50000,
    "qr_image_url": "https://..."
  }
}
```

### Tabel terkait

```txt
payments
payment_events
orders
reservations
tool_executions
```

### Guardrail

* AI tidak boleh menandai paid sendiri.
* Paid hanya dari admin manual atau payment callback.
* Refund harus human handoff.

---

# 14. Prompt Utama AI

## 14.1 WhatsApp Customer Agent Prompt

```md
Kamu adalah Ningki, AI WhatsApp CRM Agent untuk {{business_name}}.

Tugasmu membalas customer WhatsApp secara cepat, ramah, natural, dan akurat berdasarkan data bisnis yang tersedia.

Konteks bisnis:
- Nama bisnis: {{business_name}}
- Tipe bisnis: {{business_type}}
- Alamat: {{business_address}}
- Jam buka: {{opening_hours}}
- Tone brand: {{agent_tone}}
- Persona AI: {{agent_persona}}

Aturan utama:
1. Jawab hanya berdasarkan knowledge base, CRM, product database, reservation data, order data, atau tool resmi.
2. Jangan mengarang harga, menu, promo, stok, jadwal, atau kebijakan.
3. Jika informasi tidak tersedia, bilang jujur dan tawarkan hubungkan ke admin.
4. Gunakan bahasa WhatsApp yang natural, singkat, dan ramah.
5. Jangan menyebut LangChain, LangGraph, FAISS, Baileys, FastAPI, database, atau tool internal.
6. Untuk order/reservasi, kumpulkan data yang kurang secara bertahap.
7. Sebelum membuat order/reservasi final, ringkas ulang dan minta konfirmasi customer.
8. Jika customer minta admin manusia, eskalasi.
9. Jika customer marah, komplain berat, refund, diskon khusus, atau masalah sensitif, eskalasi.
10. Jika percakapan butuh follow-up, buat reminder.
11. Simpan informasi penting customer ke CRM.
12. Jangan mengubah status paid/refunded tanpa tool resmi.

Gaya balasan:
- Bahasa Indonesia
- Natural seperti admin WhatsApp
- Pendek
- Ramah
- Tidak kaku
- Emoji maksimal 1-2 jika cocok

Input:
Customer message: {{customer_message}}
Conversation history: {{conversation_history}}
Customer profile: {{customer_profile}}
Retrieved knowledge: {{retrieved_knowledge}}
Available tools: {{available_tools}}

Output:
Balasan WhatsApp terbaik atau tool action jika dibutuhkan.
```

---

## 14.2 Onboarding Agent Prompt

```md
Kamu adalah Ningki Onboarding Agent.

Tugasmu membantu owner coffee shop menyiapkan WhatsApp AI CRM mereka.

Kamu harus:
1. Bertanya satu hal dalam satu waktu.
2. Menggunakan bahasa Indonesia sederhana.
3. Tidak memakai istilah teknis seperti RAG, vector, embedding, API, database.
4. Mengumpulkan data minimum sebelum bot aktif:
   - nama bisnis
   - tipe bisnis
   - jam buka
   - lokasi
   - menu/produk utama
   - FAQ dasar
   - aturan reservasi/order jika ada
   - persona AI
   - aturan kapan harus panggil admin manusia
5. Menuntun user upload/input data satu per satu.
6. Menghasilkan structured output untuk sistem.
7. Jika data belum lengkap, jelaskan data yang kurang.
8. Jika data cukup, beri status ready_for_whatsapp.

Output internal:
{
  "next_question": "",
  "completed_steps": [],
  "missing_steps": [],
  "suggested_documents": [],
  "ready_for_whatsapp": false,
  "ready_for_bot_activation": false,
  "structured_data": {}
}
```

---

## 14.3 Knowledge Agent Prompt

```md
Kamu adalah Ningki Knowledge Agent.

Tugasmu memproses data bisnis coffee shop menjadi knowledge base yang rapi.

Aturan:
1. Jangan mengarang informasi.
2. Jika harga/menu tidak jelas, tandai needs_review.
3. Jika dokumen tidak relevan, tandai rejected.
4. Klasifikasi jenis dokumen:
   - menu
   - price_list
   - opening_hours
   - location
   - reservation_policy
   - order_policy
   - payment_policy
   - promo
   - faq
   - brand_tone
   - admin_policy
   - other
5. Extract informasi penting.
6. Beri rekomendasi data yang masih kurang.
7. Pecah konten menjadi chunk yang enak untuk RAG.

Output:
{
  "document_type": "",
  "extracted_data": {},
  "missing_fields": [],
  "needs_review": false,
  "review_notes": "",
  "chunks": []
}
```

---

## 14.4 CRM Assistant Prompt

```md
Kamu adalah Ningki CRM Assistant.

Tugasmu membantu admin memahami customer dan percakapan WhatsApp.

Kamu harus:
1. Membuat ringkasan percakapan.
2. Menentukan intent utama customer.
3. Menilai lead status.
4. Memberi rekomendasi tag.
5. Memberi rekomendasi follow-up.
6. Menentukan apakah butuh perhatian admin.

Lead status yang tersedia:
- new
- interested
- hot_lead
- reserved
- ordered
- inactive
- complaint
- need_admin

Output:
{
  "summary": "",
  "customer_intent": "",
  "lead_status": "",
  "recommended_tags": [],
  "recommended_follow_up": "",
  "needs_admin_attention": false,
  "reason": ""
}
```

---

# 15. Guardrail Rules

## 15.1 Anti Hallucination

AI tidak boleh:

```txt
- Mengarang harga
- Mengarang menu
- Mengarang promo
- Mengarang stok
- Mengarang jam buka
- Mengarang kebijakan refund
- Mengarang link pembayaran
- Mengarang status paid
```

Jika data tidak ada:

```txt
"Maaf kak, untuk info itu aku belum punya datanya. Aku bisa teruskan ke admin ya."
```

## 15.2 Human Handoff Wajib

Trigger human handoff:

```txt
- Customer minta admin/manusia
- Customer komplain
- Customer marah
- Refund
- Diskon custom
- Pertanyaan tidak ada di knowledge base
- AI tidak paham setelah max_unknown_attempts
- Order paid ingin dibatalkan
- Pembayaran bermasalah
- Permintaan sensitif
```

## 15.3 Bot Disabled Rule

Jika:

```txt
agent_settings.auto_reply_enabled = false
```

Maka AI tidak boleh reply otomatis.

## 15.4 Human Takeover Rule

Jika:

```txt
conversations.human_takeover = true
```

Maka AI tidak boleh reply otomatis.

AI hanya boleh:

```txt
- save inbound message
- notify admin
- no reply
```

---

# 16. RAG Ecosystem

## 16.1 Knowledge Source

Sumber knowledge:

```txt
knowledge_documents
knowledge_chunks
products
product_categories
agent_settings
businesses
```

## 16.2 Indexing Flow

```txt
knowledge_document created
↓
status = processing
↓
extract text
↓
classify document type
↓
split chunks
↓
create embedding
↓
save FAISS index
↓
save knowledge_chunks
↓
status = indexed / needs_review / failed
```

## 16.3 FAISS Storage Strategy

Direkomendasikan per business:

```txt
storage/faiss/{business_id}/index.faiss
storage/faiss/{business_id}/metadata.json
```

Alasan:

* Tenant isolation lebih aman.
* Retrieval lebih cepat.
* Risiko data leakage lebih kecil.

## 16.4 Retrieval Flow

```txt
query + business_id
↓
load FAISS index for business_id
↓
similarity search
↓
filter metadata business_id
↓
return top_k chunks
```

## 16.5 Chunk Metadata

```json
{
  "business_id": "uuid",
  "document_id": "uuid",
  "document_type": "menu",
  "chunk_id": "uuid",
  "chunk_index": 0,
  "source_type": "pdf"
}
```

---

# 17. Memory System

AI memory tidak perlu terlalu kompleks di MVP.

Gunakan:

```txt
- conversation history dari messages
- customer profile dari customers
- summary dari conversations.summary
- metadata di conversations.metadata
```

## Context yang dimuat sebelum reply

```txt
business profile
agent settings
customer profile
last 20 messages
conversation summary
active order draft jika ada
active reservation draft jika ada
relevant knowledge chunks
```

---

# 18. Error Handling

## Jika LLM error

Return ke API:

```json
{
  "reply": null,
  "needs_human": true,
  "error": "LLM_ERROR"
}
```

Lalu API bisa:

* Create notification `bot_error`
* Optional handoff ke admin
* Jangan kirim jawaban ngawur

## Jika tool error

Tool harus return:

```json
{
  "success": false,
  "tool_name": "create_reservation_tool",
  "error": "Reservation date is invalid",
  "needs_human": false
}
```

AI boleh tanya ulang jika error validasi.

Jika error sistem, human handoff.

## Jika RAG empty

AI harus fallback:

```txt
"Maaf kak, aku belum punya info itu. Mau aku teruskan ke admin?"
```

---

# 19. Logging Requirement

## AgentRun

Dibuat saat agent mulai.

```txt
status = running
```

Update setelah selesai:

```txt
status = success / failed / interrupted
output = final reply
intent = detected intent
latency_ms = total time
```

## ToolExecution

Dibuat setiap tool dipanggil.

```txt
status = running
```

Update setelah selesai:

```txt
status = success / failed
input = tool input
output = tool result
latency_ms = execution time
```

---

# 20. Internal API Client

AI Engine butuh `api_client.py`.

Fungsi:

```py
class ApiClient:
    async def create_agent_run(...)
    async def complete_agent_run(...)
    async def create_tool_execution(...)
    async def complete_tool_execution(...)

    async def get_business_context(...)
    async def get_agent_settings(...)
    async def get_customer_profile(...)
    async def get_conversation_history(...)

    async def search_products(...)
    async def create_reservation(...)
    async def update_reservation(...)
    async def create_order(...)
    async def update_order(...)
    async def update_customer(...)
    async def create_reminder(...)
    async def create_handoff(...)
    async def create_notification(...)
    async def check_bot_readiness(...)
```

Semua request ke `services/api` wajib pakai internal token:

```txt
Authorization: Bearer {API_INTERNAL_TOKEN}
```

---

# 21. Tool Execution Pattern

Pattern standar:

```txt
Agent decides tool
↓
AI Engine create tool_execution log
↓
AI Engine calls services/api internal endpoint
↓
API validates business_id and payload
↓
API writes database
↓
API returns structured result
↓
AI Engine updates tool_execution log
↓
AI continues graph
```

---

# 22. Internal Tool Endpoints di services/api

AI Engine butuh endpoint internal ini:

```txt
GET  /internal/ai/businesses/:businessId/context
GET  /internal/ai/businesses/:businessId/agent-settings
GET  /internal/ai/customers/:customerId/profile
GET  /internal/ai/conversations/:conversationId/history

POST /internal/ai/agent-runs
PATCH /internal/ai/agent-runs/:id

POST /internal/ai/tool-executions
PATCH /internal/ai/tool-executions/:id

POST /internal/tools/customers/update
POST /internal/tools/reservations/create
PATCH /internal/tools/reservations/:id
POST /internal/tools/orders/create
PATCH /internal/tools/orders/:id
POST /internal/tools/reminders/create
POST /internal/tools/handoffs/create
POST /internal/tools/notifications/create
POST /internal/tools/spreadsheet-sync
POST /internal/tools/bot-readiness/check
```

---

# 23. Development Priority AI Engine

## Phase 1: Foundation

```txt
- FastAPI setup
- uv setup
- config
- logging
- health endpoint
- API client
- schemas
```

## Phase 2: Agent Run + Tool Execution

```txt
- create_agent_run
- complete_agent_run
- create_tool_execution
- complete_tool_execution
- base tool class
```

## Phase 3: RAG

```txt
- document loader
- text extractor
- splitter
- embedding
- FAISS index per business
- retriever
```

## Phase 4: Knowledge Agent

```txt
- process document
- classify document
- extract structured info
- save chunks
- update document status
```

## Phase 5: WhatsApp Customer Agent

```txt
- LangGraph state
- load context node
- intent classifier node
- RAG retrieval node
- tool router node
- response generator node
- guardrail node
```

## Phase 6: Core Tools

```txt
- knowledge_search_tool
- product_search_tool
- update_customer_tool
- create_reservation_tool
- create_order_tool
- create_reminder_tool
- human_handoff_tool
```

## Phase 7: Onboarding Agent

```txt
- onboarding graph
- step detection
- readiness checker
- onboarding reply generator
```

## Phase 8: CRM Assistant

```txt
- summarize conversation
- lead status classifier
- tag recommendation
- follow-up recommendation
```

## Phase 9: Polish

```txt
- tests
- error handling
- retries
- observability
- prompt QA
```

---

# 24. Testing Scenarios

## 24.1 Ask Menu

Input:

```txt
Ada menu apa aja kak?
```

Expected:

```txt
intent = ask_menu
tool = knowledge_search_tool / product_search_tool
reply contains menu from DB/knowledge
no hallucination
```

## 24.2 Reservation Complete

Input:

```txt
Mau reservasi 4 orang besok jam 7 malam atas nama Budi
```

Expected:

```txt
intent = make_reservation
slots complete
ask confirmation
after confirmed: create_reservation_tool
create reminder
reply confirmation
```

## 24.3 Missing Reservation Slot

Input:

```txt
Mau booking meja
```

Expected:

```txt
intent = make_reservation
missing_slots = date, time, guest_count, name
reply asks one or two missing fields
no reservation created yet
```

## 24.4 Complaint

Input:

```txt
Kopi saya salah, saya kecewa
```

Expected:

```txt
intent = complaint
human_handoff_tool called
conversation human_takeover true
notification created
bot reply polite handoff
```

## 24.5 Unknown Info

Input:

```txt
Owner kamu lulusan mana?
```

Expected:

```txt
intent = unknown
no hallucination
reply fallback
possibly handoff
```

## 24.6 Human Takeover Active

Condition:

```txt
conversation.human_takeover = true
```

Input:

```txt
Halo?
```

Expected:

```txt
AI no reply
message saved by API
admin notified
```

---

# 25. Output Minimal dari AI Engine ke API

Untuk WhatsApp reply:

```json
{
  "agent_run_id": "uuid",
  "conversation_id": "uuid",
  "customer_id": "uuid",
  "intent": "ask_menu",
  "reply": "Ini menu kami kak...",
  "needs_human": false,
  "human_handoff_id": null,
  "tool_calls": [
    {
      "tool_name": "product_search_tool",
      "status": "success"
    }
  ],
  "metadata": {
    "confidence": 0.91
  }
}
```

Jika no reply:

```json
{
  "agent_run_id": "uuid",
  "reply": null,
  "no_reply": true,
  "reason": "human_takeover_active"
}
```

Jika error:

```json
{
  "agent_run_id": "uuid",
  "reply": null,
  "needs_human": true,
  "error": "LLM_ERROR"
}
```

---

# 26. Kesimpulan Ekosistem AI Engine

AI Engine Ningki harus dibangun sebagai sistem agentic yang aman, terkontrol, dan terintegrasi dengan CRM.

Komponen wajib:

```txt
1. FastAPI service
2. LangGraph agent orchestration
3. Gemini LLM
4. RAG with FAISS per business
5. Agent run logging
6. Tool execution logging
7. Tool calling via services/api
8. Guardrail anti hallucination
9. Human handoff
10. CRM update tools
11. Reservation/order/reminder tools
12. Knowledge processing pipeline
13. Onboarding agent
14. CRM assistant agent
```

Fokus MVP:

```txt
- onboarding_agent
- knowledge_agent
- whatsapp_customer_agent
- knowledge_search_tool
- product_search_tool
- update_customer_tool
- create_reservation_tool
- create_order_tool
- create_reminder_tool
- human_handoff_tool
```

Jangan fokus dulu ke:

```txt
- advanced analytics
- omnichannel
- complex payment
- autonomous refund
- broadcast besar-besaran
- multi-branch kompleks
```

AI Engine yang benar bukan sekadar chatbot.

AI Engine Ningki adalah:

> Otak agentic yang membaca konteks bisnis, mencari knowledge, menjalankan tool CRM, menjaga keamanan jawaban, dan memastikan WhatsApp coffee shop bisa berjalan lebih cepat tanpa kehilangan kontrol manusia.

```
```
