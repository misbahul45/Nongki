from __future__ import annotations

import uuid

from app.infra.redis_client import client


class RedisLock:
    def __init__(self, key: str, ttl_seconds: int = 300) -> None:
        self.key = key
        self.ttl_seconds = ttl_seconds
        self.token = str(uuid.uuid4())

    async def acquire(self) -> bool:
        return bool(await client.set(self.key, self.token, ex=self.ttl_seconds, nx=True))

    async def release(self) -> None:
        current = await client.get(self.key)
        if current == self.token:
            await client.delete(self.key)


def knowledge_index_lock(business_id: str) -> RedisLock:
    return RedisLock(f"lock:ai-knowledge-index:{business_id}", 900)


def document_index_lock(document_id: str) -> RedisLock:
    return RedisLock(f"lock:ai-document-index:{document_id}", 900)
