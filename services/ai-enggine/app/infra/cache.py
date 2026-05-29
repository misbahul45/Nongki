from __future__ import annotations

from typing import Optional

from app.core.logging import logger
from app.infra.redis_client import client


async def get(key: str) -> Optional[str]:
    try:
        return await client.get(key)
    except Exception as exc:
        logger.warning("redis_get_failed", key=key, error=str(exc))
        return None


async def set_value(key: str, value: str, ttl_seconds: int | None = None) -> None:
    try:
        await client.set(key, value, ex=ttl_seconds)
    except Exception as exc:
        logger.warning("redis_set_failed", key=key, error=str(exc))


async def claim(key: str, ttl_seconds: int) -> bool:
    try:
        return bool(await client.set(key, "1", ex=ttl_seconds, nx=True))
    except Exception as exc:
        logger.warning("redis_claim_failed", key=key, error=str(exc))
        return True
