from pydantic import BaseModel
from typing import Optional
from app.schemas.common import BaseResponse

class WhatsAppAgentRequest(BaseModel):
    phone_number: str
    message: str

class WhatsAppAgentResponse(BaseResponse):
    reply: Optional[str] = None
