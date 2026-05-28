from fastapi import APIRouter
from app.schemas.onboarding import OnboardingAgentRequest, OnboardingAgentResponse

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

@router.post("/respond", response_model=OnboardingAgentResponse)
async def onboarding_respond(request: OnboardingAgentRequest):
    """
    Endpoint untuk onboarding agent.
    """
    return OnboardingAgentResponse(
        status="not_implemented",
        message="This endpoint is scaffolded and will be implemented later."
    )
