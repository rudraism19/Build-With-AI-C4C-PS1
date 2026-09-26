import json
import re
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.schemas.ai import GeminiAnalysisOutput
from app.providers.gemini.prompts import (
    GEMINI_SYSTEM_INSTRUCTION,
    build_analysis_prompt,
)


class GeminiClient:
    """
    Client for Google Gemini REST API using structured JSON output mode.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL or "gemini-1.5-flash"
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def analyze_complaint(self, text: str) -> GeminiAnalysisOutput:
        """
        Sends the complaint text to Gemini and validates the structured JSON output.
        Falls back to rule-based analysis if no API key is provided.
        """
        if not self.api_key or self.api_key.strip() == "":
            logger.warning(
                "GEMINI_API_KEY is not configured. Utilizing local baseline heuristic engine."
            )
            return self._heuristic_analysis(text)

        url = f"{self.base_url}/{self.model}:generateContent"
        params = {"key": self.api_key}

        payload = {
            "system_instruction": {
                "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": build_analysis_prompt(text)}],
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.1,
                "max_output_tokens": 1024,
            },
        }

        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=5.0)) as client:
            try:
                response = await client.post(url, params=params, json=payload)

                if response.status_code != 200:
                    error_msg = response.text
                    logger.error(
                        f"Gemini API returned HTTP {response.status_code}: {self._sanitize_error(error_msg)}"
                    )
                    raise RuntimeError(f"Gemini API error (HTTP {response.status_code})")

                data = response.json()
                raw_text = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )

                if not raw_text:
                    raise ValueError("Gemini returned empty candidate content")

                # Strip potential markdown formatting if returned
                cleaned_json = self._clean_json_string(raw_text)
                parsed_dict = json.loads(cleaned_json)

                # Validate with Pydantic
                return GeminiAnalysisOutput(**parsed_dict)

            except httpx.TimeoutException:
                logger.error("Gemini API call timed out after 20 seconds")
                raise TimeoutError("Gemini service request timed out")
            except json.JSONDecodeError as err:
                logger.error(f"Failed to decode Gemini JSON response: {err}")
                raise ValueError("Invalid JSON returned by AI model")

    def _clean_json_string(self, text: str) -> str:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def _sanitize_error(self, message: str) -> str:
        if self.api_key:
            return message.replace(self.api_key, "[REDACTED_API_KEY]")
        return message

    def _heuristic_analysis(self, text: str) -> GeminiAnalysisOutput:
        """
        Deterministic, offline analysis fallback when GEMINI_API_KEY is omitted.
        Guarantees local testing and pipeline contracts function without remote credentials.
        """
        lower = text.lower()

        # Category heuristics
        category = "OTHER"
        if any(w in lower for w in ["water", "pani", "paani", "leak", "pipeline", "नल", "जल", "borewell", "drainage"]):
            category = "WATER"
        elif any(w in lower for w in ["road", "sadak", "pothole", "gaddha", "street", "सड़क", "highway"]):
            category = "ROADS"
        elif any(w in lower for w in ["light", "electricity", "bijli", "power", "transformer", "बिजली", "voltage"]):
            category = "ELECTRICITY"
        elif any(w in lower for w in ["garbage", "kachra", "safai", "waste", "drain", "कचरा", "सफाई", "sanitation"]):
            category = "SANITATION"
        elif any(w in lower for w in ["hospital", "doctor", "medicine", "dawa", "ambulance", "अस्पताल", "स्वास्थ्य"]):
            category = "HEALTHCARE"
        elif any(w in lower for w in ["school", "teacher", "padhai", "vidyalaya", "स्कूल", "शिक्षा"]):
            category = "EDUCATION"
        elif any(w in lower for w in ["bus", "traffic", "transport", "बस", "परिवहन"]):
            category = "TRANSPORT"
        elif any(w in lower for w in ["kisan", "crop", "fertilizer", "kheti", "किसान", "फसल"]):
            category = "AGRICULTURE"

        # Severity heuristics
        severity = "MEDIUM"
        if any(w in lower for w in ["critical", "emergency", "danger", "hazard", "spark", "flood", "death", "आपातकालीन", "खतरा"]):
            severity = "CRITICAL"
        elif any(w in lower for w in ["high", "urgent", "five days", "week", "heavy", "गंभीर", "तुरंत"]):
            severity = "HIGH"
        elif any(w in lower for w in ["minor", "low", "slow", "छोटा", "सुझाव"]):
            severity = "LOW"

        # Language heuristic
        detected_lang = "en"
        if re.search(r"[\u0900-\u097F]", text):
            detected_lang = "hi"

        summary = text[:150] + ("..." if len(text) > 150 else "")

        return GeminiAnalysisOutput(
            category=category,
            severity=severity,
            summary=summary,
            entities={
                "source": "heuristic_fallback",
                "issue": category.lower(),
            },
            detected_language=detected_lang,
            confidence=0.85,
        )
