from enum import Enum
from typing import Any, Dict, Optional
import uuid
from pydantic import BaseModel, Field, field_validator, model_validator


class InputType(str, Enum):
    TEXT = "TEXT"
    VOICE = "VOICE"


class ComplaintProcessRequest(BaseModel):
    """
    Request payload to initiate AI processing on a citizen complaint.
    """

    complaint_id: str = Field(
        ...,
        description="Unique UUID identifier of the complaint",
        examples=["d3b07384-d113-494b-9c8e-32f2ec4e5e4f"],
    )
    text: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Complaint text content (required when input_type is TEXT)",
        examples=["There is no drinking water supply in our village for the last five days."],
    )
    language: str = Field(
        default="en",
        min_length=2,
        max_length=10,
        description="ISO language code (e.g. 'en', 'hi')",
        examples=["en"],
    )
    input_type: InputType = Field(
        default=InputType.TEXT,
        description="Source input format: TEXT or VOICE",
        examples=[InputType.TEXT],
    )
    audio_base64: Optional[str] = Field(
        default=None,
        description="Optional base64-encoded audio data when input_type is VOICE",
    )

    @field_validator("complaint_id")
    @classmethod
    def validate_uuid(cls, v: str) -> str:
        try:
            uuid.UUID(str(v))
            return str(v)
        except ValueError:
            raise ValueError(f"'{v}' is not a valid UUID format")

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean:
            raise ValueError("language cannot be empty")
        return clean

    @model_validator(mode="after")
    def validate_text_for_input_type(self) -> "ComplaintProcessRequest":
        if self.input_type == InputType.TEXT:
            if not self.text or not self.text.strip():
                raise ValueError("text is required and cannot be empty when input_type is TEXT")
            self.text = self.text.strip()
        return self


class ComplaintProcessResponse(BaseModel):
    """
    Structured response returned after AI processing pipeline.
    """

    complaint_id: str = Field(
        ...,
        description="Complaint identifier",
        examples=["d3b07384-d113-494b-9c8e-32f2ec4e5e4f"],
    )
    status: str = Field(
        default="processed",
        description="Processing status ('processed' or 'failed')",
        examples=["processed"],
    )
    category: Optional[str] = Field(
        default=None,
        description="AI-classified category (WATER, ROADS, ELECTRICITY, SANITATION, HEALTHCARE, EDUCATION, TRANSPORT, AGRICULTURE, OTHER)",
        examples=["WATER"],
    )
    severity: Optional[str] = Field(
        default=None,
        description="AI-evaluated severity (LOW, MEDIUM, HIGH, CRITICAL)",
        examples=["HIGH"],
    )
    summary: Optional[str] = Field(
        default=None,
        description="AI-generated concise summary",
        examples=["Water supply outage reported in sector 4 for five days"],
    )
    entities: Dict[str, Any] = Field(
        default_factory=dict,
        description="Extracted named entities: locations, departments, dates, issue details",
        examples=[{"location": "Sector 4", "department": "Jal Nigam", "duration": "5 days"}],
    )
    language: str = Field(
        ...,
        description="Detected or confirmed complaint language",
        examples=["en"],
    )
    confidence: Optional[float] = Field(
        default=None,
        description="Overall model confidence score (0.0 - 1.0)",
        examples=[0.92],
    )
