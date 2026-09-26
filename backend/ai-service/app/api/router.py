from fastapi import APIRouter
from app.api.routes import health, complaints, ingestion, rag, recommendations, voice

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(voice.router)
api_router.include_router(complaints.router)
api_router.include_router(ingestion.router)
api_router.include_router(rag.router)
api_router.include_router(recommendations.router)
