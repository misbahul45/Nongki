from pydantic import BaseModel
from typing import Optional, Dict, Any

class AgentRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    message: str
    metadata: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    reply: str
    session_id: str
    metadata: Optional[Dict[str, Any]] = None
