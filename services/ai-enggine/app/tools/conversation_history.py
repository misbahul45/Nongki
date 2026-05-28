"""
Tool untuk conversation_history.
"""
from app.tools.base import BaseTool

class ConversationHistoryTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="conversation_history",
            description="Placeholder description for conversation_history"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
