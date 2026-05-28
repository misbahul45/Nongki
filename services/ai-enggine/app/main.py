"""
FastAPI application entry point untuk Ningki AI Engine.
Mendaftarkan semua router API.
"""

from fastapi import FastAPI

from app.api import health, onboarding, whatsapp_agent, knowledge, crm_assistant, tools

app = FastAPI(title="Ningki AI Engine", version="0.1.0")

app.include_router(health.router)
app.include_router(onboarding.router, prefix="/agent")
app.include_router(whatsapp_agent.router, prefix="/agent")
app.include_router(knowledge.router)
app.include_router(crm_assistant.router, prefix="/agent")
app.include_router(tools.router, prefix="/tools")
