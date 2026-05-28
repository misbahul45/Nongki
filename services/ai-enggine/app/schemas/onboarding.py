from pydantic import BaseModel
from typing import Optional
from app.schemas.common import BaseResponse

class OnboardingAgentRequest(BaseModel):
    user_id: str
    data: dict

class OnboardingAgentResponse(BaseResponse):
    pass
