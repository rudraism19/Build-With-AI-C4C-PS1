import time
from typing import Optional
from app.core.logging import logger
from app.providers.sarvam.client import SarvamClient
from app.schemas.ai import SarvamTranscriptionOutput


class SarvamService:
    """
    Service coordinating Indian language speech-to-text processing via Sarvam AI.
    """

    def __init__(self, client: Optional[SarvamClient] = None):
        self.client = client or SarvamClient()

    async def transcribe_audio(
        self,
        audio_base64: Optional[str] = None,
        language_hint: str = "unknown",
    ) -> SarvamTranscriptionOutput:
        """
        Transcribes voice input into text.
        """
        start_time = time.time()
        logger.info(
            f"Speech transcription initiated with Sarvam AI (lang_hint={language_hint})"
        )

        try:
            result = await self.client.transcribe_audio(
                audio_base64=audio_base64,
                language_code=language_hint,
            )
            latency_ms = round((time.time() - start_time) * 1000, 2)
            logger.info(
                f"Sarvam AI speech transcription completed in {latency_ms}ms"
            )
            return SarvamTranscriptionOutput(
                transcript=result.transcript,
                language_code=result.language_code,
            )
        except Exception as err:
            latency_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(
                f"Sarvam AI speech transcription failed in {latency_ms}ms: {err}"
            )
            raise


sarvam_service = SarvamService()
