# MVP Endpoints Plan

## Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

## Businesses & Onboarding
- GET /onboarding
- POST /onboarding/answer
- PATCH /onboarding/steps/:stepKey

## WhatsApp
- POST /whatsapp/session/start
- GET /whatsapp/session/qr
- GET /whatsapp/session/status

## Conversations & Messages
- GET /conversations
- GET /conversations/:id
- POST /conversations/:id/messages
- POST /conversations/:id/takeover

## Reservations & Orders
- GET /reservations
- POST /reservations
- GET /orders
- POST /orders

## Internal AI Endpoints
- GET /internal/ai/businesses/:businessId/context
- POST /internal/ai/agent-runs
- POST /internal/ai/tool-executions
