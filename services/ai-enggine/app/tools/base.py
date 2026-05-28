"""
Base class untuk semua tool di AI Engine.
"""
from typing import Any, Dict

class BaseTool:
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    async def execute(self, **kwargs) -> Any:
        raise NotImplementedError
