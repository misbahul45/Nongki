"""
Tool untuk reminder_create.
"""
from app.tools.base import BaseTool

class ReminderCreateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="reminder_create",
            description="Placeholder description for reminder_create"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
