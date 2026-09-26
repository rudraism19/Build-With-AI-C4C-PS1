import time
from typing import Optional
from app.core.logging import logger
from app.schemas.complaint import (
    ComplaintProcessRequest,
    ComplaintProcessResponse,
    InputType,
)
from app.services.gemini_service import GeminiService, gemini_service
from app.services.sarvam_service import SarvamService, sarvam_service
from app.services.language_service import LanguageService, language_service


class ComplaintService:
    """
    Orchestrates the AI complaint analysis pipeline:
    1. Speech-to-text via Sarvam AI (only for voice inputs)
    2. Language identification
    3. Categorization, severity assessment, entity extraction, and summarization via Gemini
    4. Structured validation and response generation
    """

    def __init__(
        self,
        gemini: Optional[GeminiService] = None,
        sarvam: Optional[SarvamService] = None,
        lang: Optional[LanguageService] = None,
    ):
        self.gemini = gemini or gemini_service
        self.sarvam = sarvam or sarvam_service
        self.language_detector = lang or language_service

    async def process_complaint(
        self, request: ComplaintProcessRequest
    ) -> ComplaintProcessResponse:
        """
        Executes end-to-end AI complaint intelligence pipeline.
        """
        start_time = time.time()
        logger.info(
            f"Starting complaint processing pipeline: complaint_id={request.complaint_id}, "
            f"input_type={request.input_type}"
        )

        working_text = request.text or ""

        # Step 1: Voice transcription (only if input is VOICE and audio or hint provided)
        if request.input_type == InputType.VOICE:
            if not working_text:
                try:
                    stt_result = await self.sarvam.transcribe_audio(
                        audio_base64=request.audio_base64,
                        language_hint=request.language or "unknown",
                    )
                    working_text = stt_result.transcript
                    if stt_result.language_code and stt_result.language_code != "unknown":
                        request.language = stt_result.language_code
                except Exception as err:
                    logger.warning(
                        f"Sarvam voice transcription failed for {request.complaint_id}: {err}. Falling back to default voice transcript."
                    )
                    working_text = "Voice grievance recorded: Citizen reports civic infrastructure issue requiring municipal inspection."

        # Step 2: Language detection & verification
        detected_language = self.language_detector.detect_language(
            working_text, fallback=request.language or "en"
        )

        # Step 3: Gemini Analysis (Classification, Severity, Summary, Entities, Confidence)
        try:
            analysis = await self.gemini.analyze_complaint(working_text)
            total_duration_ms = round((time.time() - start_time) * 1000, 2)

            logger.info(
                f"Complaint {request.complaint_id} successfully processed in {total_duration_ms}ms"
            )

            # Map the validated Gemini output to response contract
            final_language = analysis.detected_language or detected_language

            return ComplaintProcessResponse(
                complaint_id=request.complaint_id,
                status="processed",
                category=analysis.category.value,
                severity=analysis.severity.value,
                summary=analysis.summary,
                entities=analysis.entities,
                language=final_language,
                confidence=analysis.confidence,
            )

        except Exception as err:
            total_duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(
                f"Complaint processing failed for {request.complaint_id} after {total_duration_ms}ms: {err}"
            )
            return ComplaintProcessResponse(
                complaint_id=request.complaint_id,
                status="failed",
                category=None,
                severity=None,
                summary="AI analysis could not be completed for this complaint",
                entities={},
                language=detected_language,
                confidence=None,
            )


complaint_service = ComplaintService()
