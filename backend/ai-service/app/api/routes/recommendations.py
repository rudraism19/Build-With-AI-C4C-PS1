from fastapi import APIRouter, Depends, status
from app.api.routes.ingestion import verify_service_access
from app.schemas.recommendation import (
    DevelopmentRecommendationOutput,
    RecommendationGenerateRequest,
)
from app.services.recommendation_service import (
    RecommendationService,
    get_recommendation_service,
)

router = APIRouter(prefix="/recommendations", tags=["AI Development Recommendations"])


@router.post(
    "/generate",
    response_model=DevelopmentRecommendationOutput,
    status_code=status.HTTP_200_OK,
    summary="Generate evidence-grounded development recommendation",
    description="Fuses hotspot evidence, priority score, and policy guidelines to generate actionable governance recommendations.",
    dependencies=[Depends(verify_service_access)],
)
async def generate_recommendation(
    req: RecommendationGenerateRequest,
    service: RecommendationService = Depends(get_recommendation_service),
):
    return await service.generate_recommendation(req)
