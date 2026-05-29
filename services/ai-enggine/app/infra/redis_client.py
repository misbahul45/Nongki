from __future__ import annotations

import redis.asyncio as redis

from app.core.config import settings
from app.core.logging import logger

client = redis.from_url(settings.redis_url, decode_responses=True)


async def ping() -> bool:
    try:
        return bool(await client.ping())
    except Exception as exc:
        logger.warning("redis_ping_failed", error=str(exc))
        return False


async def close() -> None:
    await client.aclose()
