from pydantic import BaseModel
from typing import Any, Optional

class BaseToolInput(BaseModel):
    tool_name: str
    arguments: dict

class ToolResult(BaseModel):
    output: Any
    error: Optional[str] = None
