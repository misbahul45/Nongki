from fastapi import APIRouter
from app.schemas.crm import CRMSummaryRequest, CRMSummaryResponse

router = APIRouter(prefix="/crm", tags=["crm"])

@router.post("/summary", response_model=CRMSummaryResponse)
async def crm_summary(request: CRMSummaryRequest):
    """
    Endpoint untuk CRM assistant summary.
    """
    return CRMSummaryResponse(
        summary="This endpoint is scaffolded and will be implemented later."
    )
