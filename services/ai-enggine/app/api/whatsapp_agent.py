from fastapi import APIRouter
from app.schemas.whatsapp import WhatsAppAgentRequest, WhatsAppAgentResponse

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

@router.post("/respond", response_model=WhatsAppAgentResponse)
async def whatsapp_respond(request: WhatsAppAgentRequest):
    """
    Endpoint untuk WhatsApp customer agent.
    """
    return WhatsAppAgentResponse(
        status="not_implemented",
        message="This endpoint is scaffolded and will be implemented later."
    )
