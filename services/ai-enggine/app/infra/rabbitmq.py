from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any

import aio_pika
from aio_pika.abc import AbstractRobustChannel, AbstractRobustConnection

from app.core.config import settings
from app.core.logging import logger

connection: AbstractRobustConnection | None = None
channel: AbstractRobustChannel | None = None


def get_event_exchange_name() -> str:
    exchange_name = getattr(settings, "event_exchange", None) or "nongki.events"

    if not exchange_name.strip():
        exchange_name = "nongki.events"

    return exchange_name


async def connect() -> None:
    global connection, channel

    try:
        event_exchange = get_event_exchange_name()

        connection = await aio_pika.connect_robust(settings.rabbitmq_url)
        channel = await connection.channel(publisher_confirms=True)

        exchange = await channel.declare_exchange(
            event_exchange,
            aio_pika.ExchangeType.TOPIC,
            durable=True,
        )

        commands = await channel.declare_queue(
            "nongki.ai.commands",
            durable=True,
        )

        await commands.bind(
            exchange,
            routing_key="ai.command.*",
        )

        logger.info(
            "rabbitmq_connected",
            exchange=event_exchange,
            queue="nongki.ai.commands",
        )

    except Exception as exc:
        logger.warning("rabbitmq_connect_failed", error=str(exc))
        connection = None
        channel = None


def ready() -> bool:
    return channel is not None


async def publish_event(
    event_name: str,
    routing_key: str,
    payload: dict[str, Any],
    *,
    business_id: str | None = None,
    correlation_id: str | None = None,
    actor_id: str | None = None,
) -> None:
    if channel is None:
        return

    event_id = str(uuid.uuid4())
    event_exchange = get_event_exchange_name()

    envelope = {
        "eventId": event_id,
        "eventName": event_name,
        "routingKey": routing_key,
        "version": 1,
        "producer": settings.event_producer_ai,
        "occurredAt": datetime.now(timezone.utc).isoformat(),
        "correlationId": correlation_id,
        "tenant": {"businessId": business_id},
        "actor": {"type": "service", "id": actor_id},
        "payload": payload,
    }

    try:
        exchange = await channel.get_exchange(event_exchange)

        await exchange.publish(
            aio_pika.Message(
                body=json.dumps(envelope).encode("utf-8"),
                content_type="application/json",
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                message_id=event_id,
                correlation_id=correlation_id,
            ),
            routing_key=routing_key,
        )

    except Exception as exc:
        logger.warning(
            "rabbitmq_publish_failed",
            event_id=event_id,
            routing_key=routing_key,
            business_id=business_id,
            exchange=event_exchange,
            error=str(exc),
        )


async def close() -> None:
    global connection, channel

    if connection is not None:
        await connection.close()

    connection = None
    channel = None