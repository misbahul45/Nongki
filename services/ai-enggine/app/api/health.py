from fastapi import APIRouter

from app.infra import rabbitmq
from app.infra.redis_client import ping as redis_ping

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "ok", "service": "nongki-ai-engine"}


@router.get("/health/ready")
async def ready_check():
    checks = {
        "redis": "ok" if await redis_ping() else "error",
        "rabbitmq": "ok" if rabbitmq.ready() else "error",
    }
    status = "ok" if all(value == "ok" for value in checks.values()) else "degraded"
    return {
        "status": status,
        "service": "nongki-ai-engine",
        "checks": checks,
    }
