"""
Tool untuk order_update.
"""
from app.tools.base import BaseTool

class OrderUpdateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="order_update",
            description="Placeholder description for order_update"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
