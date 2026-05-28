"""
Tool untuk reservation_create.
"""
from app.tools.base import BaseTool

class ReservationCreateTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="reservation_create",
            description="Placeholder description for reservation_create"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
