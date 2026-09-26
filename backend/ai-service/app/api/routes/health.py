from fastapi import APIRouter, status
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "jansetu-ai-service"
    version: str = "1.0.0"


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Returns the operational status, service name, and version of the AI Service.",
)
async def check_health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="jansetu-ai-service",
        version=settings.APP_VERSION,
    )
