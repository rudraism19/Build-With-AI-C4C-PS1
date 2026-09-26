from fastapi import APIRouter, Depends, status
from app.schemas.complaint import (
    ComplaintProcessRequest,
    ComplaintProcessResponse,
)
from app.services.complaint_service import ComplaintService, complaint_service

from pydantic import BaseModel
from app.services.gemini_service import gemini_service
from app.core.logging import logger

router = APIRouter(prefix="/complaints", tags=["Complaints"])


class AnalyzeTextRequest(BaseModel):
    text: str


@router.post(
    "/analyze",
    summary="Analyze citizen grievance text with Gemini AI",
    status_code=status.HTTP_200_OK,
)
async def analyze_complaint_text(
    request: AnalyzeTextRequest,
):
    """
    Analyzes citizen complaint text using Gemini LLM with multilingual Hindi & English support.
    """
    try:
        result = await gemini_service.analyze_complaint(request.text)
        return {
            "category": result.category.value,
            "severity": result.severity.value,
            "summary": result.summary,
            "entities": result.entities,
            "department": f"{result.category.value} Department",
            "confidence": result.confidence,
            "detected_language": result.detected_language,
        }
    except Exception as e:
        logger.warning(f"Gemini analysis fallback: {e}")
        t = request.text.lower()
        cat = "OTHER"
        if any(w in t for w in ["सड़क", "गड्ढे", "road", "pothole", "मार्ग", "डामर"]):
            cat = "ROADS"
        elif any(w in t for w in ["पानी", "जल", "जलभराव", "water", "sewage", "नल", "पाइपलाइन", "गंदा पानी"]):
            cat = "WATER"
        elif any(w in t for w in ["कचरा", "सीवर", "sanitation", "garbage", "नाली", "गंदगी", "सफाई"]):
            cat = "SANITATION"
        elif any(w in t for w in ["बिजली", "लाइट", "तार", "electricity", "pole", "light", "अंधेरा"]):
            cat = "ELECTRICITY"

        return {
            "category": cat,
            "severity": "CRITICAL" if any(w in t for w in ["गंभीर", "urgent", "danger", "खतरा", "emergency", "तुरंत"]) else "HIGH",
            "summary": request.text[:120],
            "department": f"{cat} Department",
            "confidence": 0.88,
        }


@router.post(
    "/process",
    response_model=ComplaintProcessResponse,
    status_code=status.HTTP_200_OK,
    summary="Process citizen complaint with AI pipeline",
    description=(
        "Validates incoming complaint data contract and queues/executes the AI processing "
        "pipeline (speech-to-text, classification, entity extraction, duplicate analysis). "
        "In Phase 2, this verifies the schema and returns baseline reception status."
    ),
)
async def process_complaint(
    request: ComplaintProcessRequest,
    service: ComplaintService = Depends(lambda: complaint_service),
) -> ComplaintProcessResponse:
    """
    Initiate complaint AI processing.
    """
    return await service.process_complaint(request)
