---

## 1. Service Architecture

```mermaid
flowchart LR
  subgraph CLIENT["Client Layer"]
    WEB["apps/web<br/>Dashboard + Onboarding UI"]
    CUSTOMER["Customer WhatsApp"]
  end

  subgraph CORE["Backend Ecosystem"]
    API["services/api<br/>Main API + Prisma + Cron"]
    AI["services/ai-engine<br/>LangGraph Agent + FAISS"]
    WA["services/wa-worker<br/>Baileys WhatsApp Gateway"]
  end

  subgraph DATA["Data Layer"]
    DB[("PostgreSQL<br/>Prisma Models")]
    FAISS[("FAISS Local Index<br/>businessId namespace")]
    STORAGE[("File Storage<br/>menu / faq / promo docs")]
  end

  subgraph EXTERNAL["External Integrations"]
    SHEETS["Google Sheets"]
    PAYMENT["AstraPay QRIS"]
    WHATSAPP["WhatsApp Network"]
  end

  WEB -->|"REST API"| API
  CUSTOMER -->|"chat message"| WHATSAPP
  WHATSAPP --> WA

  WA -->|"internal HTTP only"| API
  API -->|"internal HTTP only"| AI
  AI -->|"internal HTTP tools"| API

  API -->|"Prisma read/write"| DB
  API -->|"upload metadata + file url"| STORAGE
  AI -->|"read/write vector index"| FAISS

  API -->|"sync orders/reservations/customers"| SHEETS
  API -->|"generate QRIS + webhook callback"| PAYMENT
  API -->|"send message command"| WA
  WA -->|"send outbound WA"| WHATSAPP

  classDef api fill:#f4f4f4,stroke:#333,stroke-width:2px;
  classDef data fill:#fff,stroke:#333,stroke-width:1px;
  class API api;
  class DB,FAISS,STORAGE data;
```

---

## 2. MVP Goal Flow — From Register to Live Bot

```mermaid
flowchart TD
  A["User Register"] --> B["Create User"]
  B --> C["Create Business Workspace"]
  C --> D["Seed Business Member"]
  D --> E["Create Business Onboarding"]
  E --> F["Seed Onboarding Steps"]
  F --> G["Create Default Agent Settings"]

  G --> H["User completes onboarding"]
  H --> I["Upload knowledge docs<br/>menu / FAQ / promo"]
  I --> J["API stores File + KnowledgeDocument"]
  J --> K["AI Engine extracts, chunks, embeds"]
  K --> L["API stores KnowledgeChunks<br/>status=indexed"]

  L --> M["Connect WhatsApp"]
  M --> N["WA Worker returns QR"]
  N --> O["User scans QR"]
  O --> P["WhatsappSession connected"]

  P --> Q["Check Readiness"]
  Q --> R{"Ready?"}
  R -->|"No"| H
  R -->|"Yes"| S["Business active<br/>Bot activation allowed"]

  S --> T["Enable Bot"]
  T --> U["Customer sends WhatsApp message"]
  U --> V["AI replies using business knowledge"]
  V --> W["MVP Success:<br/>AI can answer, reserve, order, handoff"]
```

---

## 3. Register + Workspace Transaction

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Web as apps/web
  participant API as services/api
  participant DB as PostgreSQL

  User->>Web: Submit register form
  Web->>API: POST /auth/register
  API->>DB: BEGIN TRANSACTION
  API->>DB: INSERT users
  API->>DB: INSERT businesses status=onboarding
  API->>DB: INSERT business_members role=owner
  API->>DB: INSERT business_onboarding progress=0
  API->>DB: INSERT onboarding_steps default steps
  API->>DB: INSERT agent_settings default Ningki
  API->>DB: COMMIT
  API-->>Web: accessToken + business profile
  Web-->>User: Redirect to onboarding
```

---

## 4. Onboarding Guided Setup

```mermaid
sequenceDiagram
  autonumber
  actor Owner
  participant Web as apps/web
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL

  Owner->>Web: Answer onboarding step
  Web->>API: POST /onboarding/answer
  API->>DB: Read business_onboarding
  API->>DB: Read onboarding_steps
  API->>DB: Read agent_settings
  API->>AI: POST /ai/onboarding/process
  AI-->>API: parsed data + next step + flags
  API->>DB: Update onboarding_steps status=completed
  API->>DB: Update business_onboarding currentStep/progress/needs*
  API->>DB: Update agent_settings when needed
  API->>DB: Insert audit_logs
  API-->>Web: nextStep + progressPercent
  Web-->>Owner: Show next onboarding step
```

---

## 5. Knowledge Upload + Indexing

```mermaid
sequenceDiagram
  autonumber
  actor Owner
  participant Web as apps/web
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL
  participant Store as File Storage
  participant FAISS as FAISS Index

  Owner->>Web: Upload menu / FAQ / promo file
  Web->>API: POST /knowledge/documents/upload
  API->>Store: Save file
  API->>DB: INSERT files
  API->>DB: INSERT knowledge_documents status=draft
  API->>AI: POST /ai/knowledge/process {businessId, documentId}
  AI->>API: GET /internal/knowledge/{documentId}
  API-->>AI: fileUrl + metadata
  AI->>AI: Extract text
  AI->>AI: Classify documentType
  AI->>AI: Chunk text
  AI->>FAISS: Store embeddings namespaced by businessId
  AI-->>API: extractedText + chunks + embeddingRefs
  API->>DB: UPDATE knowledge_documents status=indexed
  API->>DB: INSERT knowledge_chunks
  API->>DB: INSERT audit_logs action=KNOWLEDGE_INDEXED
  API-->>Web: document indexed
```

---

## 6. WhatsApp Connect + Bot Enable

```mermaid
sequenceDiagram
  autonumber
  actor Owner
  participant Web as apps/web
  participant API as services/api
  participant WA as services/wa-worker
  participant DB as PostgreSQL

  Owner->>Web: Click connect WhatsApp
  Web->>API: POST /whatsapp/session/start
  API->>DB: INSERT whatsapp_sessions status=qr_pending
  API->>WA: POST /sessions/{businessId}/start
  WA-->>API: qrCode + qrExpiresAt
  API->>DB: UPDATE whatsapp_sessions qrCode
  API->>DB: INSERT notifications QR ready
  API-->>Web: QR code

  Owner->>Web: Scan QR from WhatsApp app
  WA->>API: POST /internal/wa/session-status connected
  API->>DB: UPDATE whatsapp_sessions status=connected
  API->>DB: UPDATE business_onboarding readyForWhatsapp=true
  API->>DB: UPDATE onboarding_steps whatsapp_connect=completed
  API->>DB: INSERT audit_logs WHATSAPP_CONNECTED

  Owner->>Web: Enable bot
  Web->>API: POST /whatsapp/bot/enable
  API->>DB: Check readyForBotActivation=true
  API->>DB: UPDATE whatsapp_sessions botEnabled=true
  API->>DB: UPDATE agent_settings autoReplyEnabled=true
  API-->>Web: bot enabled
```

---

## 7. Incoming WhatsApp Message + AI Reply

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  participant WAApp as WhatsApp
  participant Worker as services/wa-worker
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL
  participant FAISS as FAISS

  Customer->>WAApp: Send message
  WAApp->>Worker: Incoming Baileys event
  Worker->>API: POST /internal/wa/incoming-message

  API->>DB: Read whatsapp_sessions botEnabled
  API->>DB: Read businesses status=active
  API->>DB: Check messages.waMessageId idempotency
  API->>DB: UPSERT customers by businessId + waPhone
  API->>DB: UPSERT active conversations
  API->>DB: INSERT messages inbound customer

  alt humanTakeover=true or aiEnabled=false
    API->>DB: INSERT notifications new message for admin
    API-->>Worker: skip AI reply
  else bot active
    API->>AI: POST /ai/agent/run
    AI->>API: GET /internal/context/{businessId}
    AI->>API: GET /internal/customers/{customerId}
    AI->>API: GET /internal/conversations/{conversationId}/history
    AI->>FAISS: Search knowledge by businessId namespace
    AI->>API: GET /internal/products/{businessId}
    AI->>AI: classify intent + decide action + generate reply
    AI-->>API: replyText + intent + toolsExecuted + usage
    API->>DB: INSERT agent_runs
    API->>DB: INSERT tool_executions
    API->>DB: INSERT messages outbound ai
    API->>DB: UPDATE conversations lastMessage/lastAiReplyAt
    API->>DB: UPDATE customers leadStatus if needed
    API->>Worker: POST /messages/send
    Worker->>WAApp: Send AI reply
    WAApp-->>Customer: Receive reply
  end
```

---

## 8. AI Agent Internal Graph

```mermaid
flowchart TD
  A["receive_message"] --> B["load_business_context"]
  B --> C["load_customer_profile"]
  C --> D["load_conversation_history"]
  D --> E["check_human_takeover"]

  E --> F{"Human takeover?"}
  F -->|"Yes"| G["stop_ai_reply<br/>notify admin"]
  F -->|"No"| H["classify_intent"]

  H --> I["retrieve_knowledge<br/>FAISS by businessId"]
  I --> J["decide_action"]
  J --> K{"Need tool?"}

  K -->|"No"| L["generate_reply"]
  K -->|"Yes"| M["tool_router"]

  M --> N{"Tool type"}
  N -->|"reservation"| O["create_reservation_tool"]
  N -->|"order"| P["create_order_tool"]
  N -->|"payment"| Q["create_payment_qris_tool"]
  N -->|"handoff"| R["human_handoff_tool"]
  N -->|"knowledge"| S["knowledge_search_tool"]```mermaid


  O --> T["execute_tool via services/api"]
  P --> T
  Q --> T
  R --> T
  S --> T

  T --> U["save_state"]
  U --> L
  L --> V["return_reply_to_api"]
```

---

## 9. Reservation via AI Tool

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL
  participant WA as services/wa-worker

  Customer->>API: Message: "reservasi besok 4 orang"
  API->>AI: POST /ai/agent/run
  AI->>AI: Detect intent make_reservation
  AI->>AI: Slot filling date/time/guestCount/name

  alt slot incomplete
    AI-->>API: ask missing information
    API->>DB: INSERT outbound AI message
    API->>WA: send question
  else slot complete
    AI->>API: POST /internal/tools/reservations
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT reservations status=pending
    API->>DB: UPDATE customers leadStatus=reserved totalReservations++
    API->>DB: INSERT reminders H-1 confirmation
    API->>DB: INSERT reminders admin task
    API->>DB: INSERT audit_logs RESERVATION_CREATED
    API->>DB: COMMIT
    API-->>AI: reservationNumber + status
    AI-->>API: confirmation reply
    API->>DB: INSERT agent_runs + tool_executions
    API->>DB: INSERT messages outbound ai
    API->>WA: send confirmation
  end
```

---

## 10. Order via AI Tool

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL
  participant WA as services/wa-worker

  Customer->>API: Message: "pesan 2 iced latte takeaway"
  API->>AI: POST /ai/agent/run
  AI->>API: GET /internal/products/{businessId}
  AI->>AI: Detect intent create_order
  AI->>AI: Match item + quantity + fulfillmentType

  alt item unclear
    AI-->>API: ask clarification
    API->>WA: send clarification
  else order clear
    AI->>API: POST /internal/tools/orders
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT orders status=draft paymentStatus=unpaid
    API->>DB: INSERT order_items
    API->>DB: UPDATE orders totalAmount
    API->>DB: UPDATE customers totalOrders++
    API->>DB: COMMIT
    API-->>AI: orderNumber + totalAmount
    AI-->>API: order summary + ask confirmation
    API->>DB: INSERT messages outbound ai
    API->>WA: send order summary
  end

  Customer->>API: Message: "iya confirm"
  API->>AI: POST /ai/agent/run
  AI->>API: POST /internal/tools/orders/{id}/confirm
  API->>DB: UPDATE orders status=pending_confirmation
  API->>DB: INSERT reminders payment_follow_up
  AI-->>API: confirmation reply
  API->>WA: send confirmation
```

---

## 11. Human Handoff Flow

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  actor Admin
  participant API as services/api
  participant AI as services/ai-engine
  participant DB as PostgreSQL
  participant WA as services/wa-worker
  participant Web as apps/web

  Customer->>API: Message asks admin / complaint / unknown answer
  API->>AI: POST /ai/agent/run
  AI->>AI: Detect handoff reason
  AI->>API: POST /internal/tools/handoffs
  API->>DB: BEGIN TRANSACTION
  API->>DB: UPDATE conversations humanTakeover=true aiEnabled=false
  API->>DB: INSERT human_handoffs status=open
  API->>DB: INSERT notifications type=new_handoff
  API->>DB: COMMIT
  API->>WA: send "menghubungkan ke admin"
  API-->>Web: Admin sees new handoff

  Admin->>Web: Reply from inbox
  Web->>API: POST /conversations/{id}/messages
  API->>DB: INSERT messages senderType=admin outbound
  API->>DB: UPDATE conversations lastAdminReplyAt
  API->>WA: send admin message

  Admin->>Web: Return to AI
  Web->>API: POST /conversations/{id}/return-to-ai
  API->>DB: UPDATE conversations humanTakeover=false aiEnabled=true
  API->>DB: UPDATE human_handoffs status=resolved
  API->>DB: INSERT audit_logs HANDOFF_RESOLVED
```

---

## 12. API Module Dependency Map

```mermaid
flowchart TD
  AUTH["auth module"] --> BUSINESS["business module"]
  BUSINESS --> MEMBER["business-member module"]
  BUSINESS --> ONBOARD["onboarding module"]
  BUSINESS --> AGENT["agent-settings module"]

  BUSINESS --> WHATSAPP["whatsapp module"]
  BUSINESS --> KNOWLEDGE["knowledge module"]
  BUSINESS --> CUSTOMER["customer/crm module"]
  BUSINESS --> PRODUCT["product module"]

  CUSTOMER --> CONV["conversation module"]
  CONV --> MESSAGE["message module"]
  CONV --> HANDOFF["human-handoff module"]

  PRODUCT --> ORDER["order module"]
  CUSTOMER --> ORDER
  CUSTOMER --> RESERVATION["reservation module"]
  CONV --> ORDER
  CONV --> RESERVATION

  ORDER --> PAYMENT["payment module"]
  RESERVATION --> PAYMENT

  ORDER --> REMINDER["reminder module"]
  RESERVATION --> REMINDER
  CUSTOMER --> REMINDER

  BUSINESS --> INTEGRATION["integration module"]
  INTEGRATION --> SHEET["spreadsheet-sync module"]

  BUSINESS --> NOTIF["notification module"]
  BUSINESS --> AUDIT["audit-log module"]
  BUSINESS --> INTERNAL["internal-api module"]

  INTERNAL --> AIHOOK["ai-engine contract"]
  INTERNAL --> WAHOOK["wa-worker contract"]

  AIHOOK --> AGENTRUN["agent-run module"]
  AIHOOK --> TOOLLOG["tool-execution module"]

  classDef p0 fill:#f4f4f4,stroke:#111,stroke-width:2px;
  class AUTH,BUSINESS,ONBOARD,AGENT,WHATSAPP,KNOWLEDGE,CUSTOMER,CONV,MESSAGE,PRODUCT,ORDER,RESERVATION,HANDOFF,INTERNAL p0;
```

---

## 13. MVP Endpoint Group Map

```mermaid
mindmap
  root((services/api MVP))
    Auth
      POST /auth/register
      POST /auth/login
      GET /auth/me
      POST /auth/logout
    Business
      GET /businesses/current
      PATCH /businesses/current
      GET /businesses/current/overview
    Onboarding
      GET /onboarding
      POST /onboarding/answer
      PATCH /onboarding/steps/:stepKey
      POST /onboarding/check-readiness
    Knowledge
      POST /knowledge/documents/upload
      GET /knowledge/documents
      GET /knowledge/documents/:id
      DELETE /knowledge/documents/:id
      POST /knowledge/reindex
    WhatsApp
      POST /whatsapp/session/start
      GET /whatsapp/session
      POST /whatsapp/bot/enable
      POST /whatsapp/bot/disable
    CRM
      GET /customers
      GET /customers/:id
      PATCH /customers/:id
      POST /customers/:id/tags
    Conversations
      GET /conversations
      GET /conversations/:id
      POST /conversations/:id/messages
      POST /conversations/:id/return-to-ai
    Products
      GET /products
      POST /products
      PATCH /products/:id
      DELETE /products/:id
    Reservations
      GET /reservations
      POST /reservations
      POST /reservations/:id/confirm
      POST /reservations/:id/cancel
    Orders
      GET /orders
      POST /orders
      POST /orders/:id/confirm
      PATCH /orders/:id/status
    Internal WA
      POST /internal/wa/incoming-message
      POST /internal/wa/session-status
      POST /internal/wa/message-status
    Internal AI
      GET /internal/context/:businessId
      GET /internal/conversations/:id/history
      GET /internal/products/:businessId
      GET /internal/knowledge/search
      POST /internal/ai/reply
    Internal Tools
      POST /internal/tools/reservations
      POST /internal/tools/orders
      POST /internal/tools/handoffs
```

---

## 14. Database Domain Map

```mermaid
erDiagram
  User ||--o{ Business : owns
  User ||--o{ BusinessMember : joins
  Business ||--o{ BusinessMember : has
  Business ||--|| BusinessOnboarding : has
  Business ||--o{ OnboardingStep : has
  Business ||--|| AgentSettings : configures
  Business ||--o{ WhatsappSession : connects

  Business ||--o{ Customer : has
  Customer ||--o{ Conversation : starts
  Conversation ||--o{ Message : contains
  Customer ||--o{ Message : sends

  Business ||--o{ KnowledgeDocument : owns
  KnowledgeDocument ||--o{ KnowledgeChunk : chunks
  Business ||--o{ ProductCategory : has
  ProductCategory ||--o{ Product : contains
  Product ||--o{ OrderItem : selected

  Customer ||--o{ Order : creates
  Order ||--o{ OrderItem : contains
  Customer ||--o{ Reservation : books
  Conversation ||--o{ Order : may_create
  Conversation ||--o{ Reservation : may_create

  Order ||--o{ Payment : paid_by
  Reservation ||--o{ Payment : paid_by
  Payment ||--o{ PaymentEvent : logs

  Customer ||--o{ Reminder : receives
  Order ||--o{ Reminder : schedules
  Reservation ||--o{ Reminder : schedules

  Conversation ||--o{ HumanHandoff : escalates
  Customer ||--o{ HumanHandoff : needs_help

  Business ||--o{ AgentRun : logs
  AgentRun ||--o{ ToolExecution : executes
  Conversation ||--o{ AgentRun : triggers
  Conversation ||--o{ ToolExecution : relates

  Business ||--o{ Notification : emits
  Business ||--o{ AuditLog : records
  Business ||--o{ WebhookEvent : receives
  Business ||--o{ File : stores
```

---

## 15. MVP Backend Build Order

```mermaid
gantt
  title Ningki/Nongki MVP API Build Order
  dateFormat  YYYY-MM-DD
  axisFormat  %d %b

  section Foundation
  Project setup + env + Prisma wiring        :a1, 2026-05-29, 2d
  Auth + business workspace transaction      :a2, after a1, 3d
  Business tenant guard + middleware         :a3, after a1, 3d

  section Onboarding
  Onboarding steps API                       :b1, after a2, 3d
  Agent settings API                         :b2, after b1, 2d
  Readiness checker                          :b3, after b2, 2d

  section Knowledge
  File upload + KnowledgeDocument            :c1, after b1, 3d
  Internal AI knowledge callback             :c2, after c1, 2d
  Knowledge list/reindex/delete              :c3, after c2, 2d

  section WhatsApp
  WhatsApp session API                       :d1, after b3, 3d
  Internal WA session-status webhook         :d2, after d1, 2d
  Bot enable/disable                         :d3, after d2, 1d

  section Conversation Core
  Customer upsert                            :e1, after d2, 2d
  Conversation upsert                        :e2, after e1, 2d
  Message inbound/outbound                   :e3, after e2, 2d
  Internal incoming-message endpoint         :e4, after e3, 2d

  section AI Contract
  Internal context endpoints                 :f1, after e2, 3d
  AI reply callback                          :f2, after f1, 2d
  Agent run + tool execution logs            :f3, after f2, 2d

  section Business Tools
  Product API                                :g1, after c1, 3d
  Reservation API + AI tool                  :g2, after f2, 3d
  Order API + AI tool                        :g3, after g1, 3d
  Human handoff API + AI tool                :g4, after f2, 3d

  section MVP Polish
  Notifications                              :h1, after g2, 2d
  Audit logs                                 :h2, after g3, 2d
  Dashboard overview                         :h3, after g4, 2d
  End-to-end test                            :h4, after h3, 3d
```

---

## 16. MVP Success State

```mermaid
flowchart LR
  A["Owner can register"] --> B["Business workspace created"]
  B --> C["Onboarding completed"]
  C --> D["Knowledge indexed"]
  D --> E["WhatsApp connected"]
  E --> F["Bot enabled"]
  F --> G["Customer sends message"]
  G --> H["API saves customer/conversation/message"]
  H --> I["AI gets context + knowledge"]
  I --> J["AI replies"]
  J --> K["WA Worker sends reply"]
  K --> L["Admin can view inbox"]
  L --> M["AI can create reservation/order"]
  M --> N["AI can handoff to admin"]
```