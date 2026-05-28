"""
Tool untuk payment_create.
"""
from app.tools.base import BaseTool

class PaymentCreateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="payment_create",
            description="Placeholder description for payment_create"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
