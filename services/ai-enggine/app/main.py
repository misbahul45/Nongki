"""
FastAPI application entry point untuk Ningki AI Engine.
Mendaftarkan semua router API.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import crm_assistant, health, knowledge, onboarding, tools, whatsapp_agent
from app.infra import rabbitmq
from app.infra.redis_client import close as close_redis
from app.infra.redis_client import ping as redis_ping


@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_ping()
    await rabbitmq.connect()
    try:
        yield
    finally:
        await rabbitmq.close()
        await close_redis()


app = FastAPI(title="Ningki AI Engine", version="0.1.0", lifespan=lifespan)

app.include_router(health.router)
app.include_router(onboarding.router, prefix="/agent")
app.include_router(whatsapp_agent.router, prefix="/agent")
app.include_router(knowledge.router)
app.include_router(crm_assistant.router, prefix="/agent")
app.include_router(tools.router, prefix="/tools")
