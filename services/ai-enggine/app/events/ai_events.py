from __future__ import annotations

from app.events.event_bus import publish

AI_AGENT_RUN_STARTED = "ai.agent.run_started"
AI_AGENT_RUN_COMPLETED = "ai.agent.run_completed"
AI_AGENT_RUN_FAILED = "ai.agent.run_failed"
AI_KNOWLEDGE_INDEX_REQUESTED = "ai.knowledge.index_requested"
AI_KNOWLEDGE_INDEX_COMPLETED = "ai.knowledge.index_completed"
AI_KNOWLEDGE_INDEX_FAILED = "ai.knowledge.index_failed"


async def publish_ai_event(
    routing_key: str,
    business_id: str,
    payload: dict[str, object],
    correlation_id: str | None = None,
) -> None:
    await publish(routing_key, payload, business_id=business_id, correlation_id=correlation_id)
