"""
Tool untuk conversation_summary.
"""
from app.tools.base import BaseTool

class ConversationSummaryTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="conversation_summary",
            description="Placeholder description for conversation_summary"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
