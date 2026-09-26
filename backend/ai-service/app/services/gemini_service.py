import time
from typing import Optional
from app.core.logging import logger
from app.providers.gemini.client import GeminiClient
from app.schemas.ai import GeminiAnalysisOutput


class GeminiService:
    """
    Service coordinating complaint intelligence, classification, and summarization via Google Gemini.
    """

    def __init__(self, client: Optional[GeminiClient] = None):
        self.client = client or GeminiClient()

    async def analyze_complaint(self, text: str) -> GeminiAnalysisOutput:
        """
        Invokes Gemini model with structured output constraint.
        """
        start_time = time.time()
        logger.info("Complaint analysis dispatched to Gemini AI provider")

        try:
            result = await self.client.analyze_complaint(text)
            latency_ms = round((time.time() - start_time) * 1000, 2)
            logger.info(
                f"Gemini analysis completed in {latency_ms}ms: "
                f"category={result.category}, severity={result.severity}, confidence={result.confidence}"
            )
            return result
        except Exception as err:
            latency_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(f"Gemini analysis failed in {latency_ms}ms: {err}")
            raise


gemini_service = GeminiService()
