from pydantic import BaseModel
from typing import Optional, List
from app.schemas.common import BaseResponse

class KnowledgeProcessRequest(BaseModel):
    content: str
    metadata: Optional[dict] = None

class KnowledgeProcessResponse(BaseResponse):
    document_id: Optional[str] = None
