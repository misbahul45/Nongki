from fastapi import APIRouter
from app.schemas.knowledge import KnowledgeProcessRequest, KnowledgeProcessResponse

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

@router.post("/process", response_model=KnowledgeProcessResponse)
async def process_knowledge(request: KnowledgeProcessRequest):
    """
    Endpoint untuk memproses knowledge.
    """
    return KnowledgeProcessResponse(
        status="not_implemented",
        message="This endpoint is scaffolded and will be implemented later."
    )

@router.post("/reindex")
async def reindex_knowledge():
    """
    Endpoint untuk reindex knowledge base.
    """
    return {
        "status": "not_implemented",
        "message": "This endpoint is scaffolded and will be implemented later."
    }
