"""
Tool untuk human_handoff.
"""
from app.tools.base import BaseTool

class HumanHandoffTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="human_handoff",
            description="Placeholder description for human_handoff"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
