"""
Tool untuk product_search.
"""
from app.tools.base import BaseTool

class ProductSearchTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="product_search",
            description="Placeholder description for product_search"
        )

    async def execute(self, **kwargs):
        return {"status": "not_implemented"}
