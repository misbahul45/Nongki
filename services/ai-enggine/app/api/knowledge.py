from fastapi import APIRouter

from app.events.ai_events import (
    AI_KNOWLEDGE_INDEX_COMPLETED,
    AI_KNOWLEDGE_INDEX_REQUESTED,
    publish_ai_event,
)
from app.infra.locks import knowledge_index_lock
from app.schemas.knowledge import KnowledgeProcessRequest, KnowledgeProcessResponse

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

@router.post("/process", response_model=KnowledgeProcessResponse)
async def process_knowledge(request: KnowledgeProcessRequest):
    """
    Endpoint untuk memproses knowledge.
    """
    business_id = str((request.metadata or {}).get("businessId") or "unknown")
    await publish_ai_event(
        AI_KNOWLEDGE_INDEX_REQUESTED,
        business_id,
        {"metadata": request.metadata or {}},
    )
    await publish_ai_event(
        AI_KNOWLEDGE_INDEX_COMPLETED,
        business_id,
        {"status": "not_implemented"},
    )
    return KnowledgeProcessResponse(
        status="not_implemented",
        message="This endpoint is scaffolded and will be implemented later."
    )

@router.post("/reindex")
async def reindex_knowledge(business_id: str = "unknown"):
    """
    Endpoint untuk reindex knowledge base.
    """
    lock = knowledge_index_lock(business_id)
    acquired = await lock.acquire()
    if not acquired:
        return {"status": "locked", "message": "Knowledge reindex already running."}
    try:
        await publish_ai_event(
            AI_KNOWLEDGE_INDEX_REQUESTED,
            business_id,
            {"reason": "manual_reindex"},
        )
    finally:
        await lock.release()
    return {
        "status": "not_implemented",
        "message": "This endpoint is scaffolded and will be implemented later."
    }
