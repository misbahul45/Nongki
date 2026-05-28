"""
Tool untuk notification_create.
"""
from app.tools.base import BaseTool

class NotificationCreateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="notification_create",
            description="Placeholder description for notification_create"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
