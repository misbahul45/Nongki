"""
Tool untuk order_create.
"""
from app.tools.base import BaseTool

class OrderCreateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="order_create",
            description="Placeholder description for order_create"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
