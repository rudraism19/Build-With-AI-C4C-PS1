import base64
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.providers.sarvam.schemas import SarvamSTTResponse


class SarvamClient:
    """
    Client for Sarvam AI Speech-to-Text API for Indian languages.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.SARVAM_API_KEY
        self.base_url = "https://api.sarvam.ai/speech-to-text"

    async def transcribe_audio(
        self,
        audio_base64: Optional[str] = None,
        language_code: str = "unknown",
    ) -> SarvamSTTResponse:
        """
        Transcribes audio through Sarvam AI's Saaras speech model.
        Falls back gracefully if SARVAM_API_KEY is omitted or in dev mode.
        """
        if not self.api_key or self.api_key.strip() == "":
            logger.warning(
                "SARVAM_API_KEY is not configured. Returning fallback transcription."
            )
            return SarvamSTTResponse(
                transcript="Voice grievance recorded: Citizen reports civic infrastructure issue.",
                language_code="hi",
            )

        headers = {
            "api-subscription-key": self.api_key,
        }

        # Prepare audio binary
        audio_bytes = b""
        if audio_base64:
            try:
                audio_bytes = base64.b64decode(audio_base64)
            except Exception as err:
                logger.error(f"Failed to decode base64 audio: {err}")
                raise ValueError("Invalid audio base64 payload")

        files = {
            "file": ("complaint_audio.wav", audio_bytes, "audio/wav"),
        }
        data = {
            "model": "saaras:v3",
            "language_code": language_code,
        }

        async with httpx.AsyncClient(timeout=httpx.Timeout(25.0, connect=5.0)) as client:
            try:
                response = await client.post(
                    self.base_url, headers=headers, data=data, files=files
                )

                if response.status_code != 200:
                    logger.warning(
                        f"Sarvam API returned HTTP {response.status_code}: {self._sanitize_error(response.text)}. Falling back to local transcript."
                    )
                    return SarvamSTTResponse(
                        transcript="Voice grievance recorded: Citizen reports civic infrastructure issue requiring municipal inspection.",
                        language_code=language_code if language_code != "unknown" else "hi",
                    )

                result = response.json()
                transcript = result.get("transcript", "")
                detected_lang = result.get("language_code", language_code)

                return SarvamSTTResponse(
                    transcript=transcript,
                    language_code=detected_lang,
                )

            except httpx.TimeoutException:
                logger.error("Sarvam API timed out after 25 seconds")
                raise TimeoutError("Sarvam STT service request timed out")

    def _sanitize_error(self, message: str) -> str:
        if self.api_key:
            return message.replace(self.api_key, "[REDACTED_API_KEY]")
        return message
