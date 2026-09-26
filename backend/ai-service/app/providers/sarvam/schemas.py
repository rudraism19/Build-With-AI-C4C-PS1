from typing import Optional
from pydantic import BaseModel, Field


class SarvamSTTRequest(BaseModel):
    """
    Request model for Sarvam Speech-to-Text.
    """

    audio_base64: Optional[str] = Field(
        default=None, description="Base64 encoded audio string"
    )
    language_code: Optional[str] = Field(
        default="unknown", description="Language hint, e.g. 'hi-IN', 'en-IN', 'unknown'"
    )
    model: str = Field(
        default="saaras:v1", description="Sarvam Speech-to-text model name"
    )


class SarvamSTTResponse(BaseModel):
    """
    Response model from Sarvam Speech-to-Text.
    """

    transcript: str = Field(..., description="Transcribed citizen speech")
    language_code: Optional[str] = Field(
        default=None, description="Detected audio language code"
    )
