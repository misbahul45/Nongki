from __future__ import annotations

from typing import Any

from app.infra.rabbitmq import publish_event


async def publish(
    routing_key: str,
    payload: dict[str, Any],
    *,
    business_id: str | None = None,
    correlation_id: str | None = None,
) -> None:
    await publish_event(
        routing_key,
        routing_key,
        payload,
        business_id=business_id,
        correlation_id=correlation_id,
    )
