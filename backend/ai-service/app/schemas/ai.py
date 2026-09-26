from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field, field_validator


class CivicCategory(str, Enum):
    WATER = "WATER"
    ROADS = "ROADS"
    ELECTRICITY = "ELECTRICITY"
    SANITATION = "SANITATION"
    HEALTHCARE = "HEALTHCARE"
    EDUCATION = "EDUCATION"
    TRANSPORT = "TRANSPORT"
    AGRICULTURE = "AGRICULTURE"
    OTHER = "OTHER"


class CivicSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class GeminiAnalysisOutput(BaseModel):
    """
    Validated structured extraction returned by Gemini.
    """

    category: CivicCategory = Field(
        ...,
        description="Standardized civic category",
    )
    severity: CivicSeverity = Field(
        ...,
        description="Assessed issue urgency/severity",
    )
    summary: str = Field(
        ...,
        min_length=5,
        max_length=500,
        description="Concise summary in English of the civic issue",
    )
    entities: Dict[str, Any] = Field(
        default_factory=dict,
        description="Extracted entities such as location, department, duration, key problem",
    )
    detected_language: str = Field(
        default="en",
        description="ISO 639-1 code of the original text",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="AI confidence score between 0.0 and 1.0",
    )

    @field_validator("confidence")
    @classmethod
    def clamp_confidence(cls, v: float) -> float:
        return round(max(0.0, min(1.0, float(v))), 2)


class SarvamTranscriptionOutput(BaseModel):
    """
    Output model for speech-to-text transcriptions.
    """

    transcript: str = Field(..., description="Transcribed text from audio")
    language_code: Optional[str] = Field(
        default=None, description="Language identified by speech model"
    )
