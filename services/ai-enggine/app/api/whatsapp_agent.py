from fastapi import APIRouter

from app.events.ai_events import (
    AI_AGENT_RUN_COMPLETED,
    AI_AGENT_RUN_STARTED,
    publish_ai_event,
)
from app.infra.cache import claim
from app.schemas.whatsapp import WhatsAppAgentRequest, WhatsAppAgentResponse

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

@router.post("/respond", response_model=WhatsAppAgentResponse)
async def whatsapp_respond(request: WhatsAppAgentRequest):
    """
    Endpoint untuk WhatsApp customer agent.
    """
    message_id = f"{request.phone_number}:{hash(request.message)}"
    business_id = "unknown"
    if not await claim(f"ai:run:{message_id}", 60 * 60):
        return WhatsAppAgentResponse(status="duplicate", message="Duplicate agent run ignored.")

    await publish_ai_event(
        AI_AGENT_RUN_STARTED,
        business_id,
        {"messageId": message_id, "phoneNumber": request.phone_number},
    )
    await publish_ai_event(
        AI_AGENT_RUN_COMPLETED,
        business_id,
        {"messageId": message_id, "status": "not_implemented"},
    )
    return WhatsAppAgentResponse(
        status="not_implemented",
        message="This endpoint is scaffolded and will be implemented later."
    )
