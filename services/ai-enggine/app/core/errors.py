"""
Custom exceptions untuk AI Engine.
"""


class AIEngineError(Exception):
    """Base exception untuk AI Engine."""


class AgentError(AIEngineError):
    """Error saat agent execution."""


class RAGError(AIEngineError):
    """Error saat RAG pipeline."""


class ToolError(AIEngineError):
    """Error saat tool execution."""


class GuardrailError(AIEngineError):
    """Error saat guardrail check."""
