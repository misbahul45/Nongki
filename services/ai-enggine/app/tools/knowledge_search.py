"""
Tool untuk knowledge_search.
"""
from app.tools.base import BaseTool

class KnowledgeSearchTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="knowledge_search",
            description="Placeholder description for knowledge_search"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
