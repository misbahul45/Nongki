from pydantic import BaseModel
from typing import Optional
from app.schemas.common import BaseResponse

class CRMSummaryRequest(BaseModel):
    customer_id: str

class CRMSummaryResponse(BaseResponse):
    summary: Optional[str] = None
