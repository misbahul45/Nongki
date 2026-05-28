from fastapi import APIRouter

router = APIRouter(tags=["tools"])

@router.post("/debug")
async def debug_tools():
    """
    Endpoint untuk debug internal tool testing.
    """
    return {
        "status": "not_implemented",
        "message": "This endpoint is scaffolded and will be implemented later."
    }
