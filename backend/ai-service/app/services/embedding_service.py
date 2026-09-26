import hashlib
import math
from typing import List, Optional
import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("embedding_service")


class EmbeddingService:
    """
    Generates 768-dimensional text embeddings for policy document chunks and queries.
    Uses Gemini text-embedding-004 when GEMINI_API_KEY is configured,
    and falls back to deterministic unit-normalized hashing for test/offline resilience.
    """

    DIMENSION = 768

    def __init__(self):
        self.settings = get_settings()

    async def get_embedding(self, text: str) -> List[float]:
        """
        Generates 768-dimensional float embedding for a given text chunk.
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            return [0.0] * self.DIMENSION

        # Attempt Gemini embedding if API key is configured
        if self.settings.GEMINI_API_KEY:
            try:
                url = (
                    f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"text-embedding-004:embedContent?key={self.settings.GEMINI_API_KEY}"
                )
                payload = {
                    "model": "models/text-embedding-004",
                    "content": {"parts": [{"text": cleaned_text[:2048]}]},
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        values = data.get("embedding", {}).get("values", [])
                        if len(values) == self.DIMENSION:
                            return values
                    logger.warning(
                        f"Gemini embedding API returned status {resp.status_code}: {resp.text[:200]}"
                    )
            except Exception as e:
                logger.warning(f"Gemini embedding call failed, falling back to deterministic: {e}")

        # Deterministic semantic-hash fallback
        return self._generate_deterministic_embedding(cleaned_text)

    def _generate_deterministic_embedding(self, text: str) -> List[float]:
        """
        Generates a deterministic 768-dimensional unit vector based on word n-grams and hashing.
        Allows offline unit tests and database insertions to operate with real vector cosine math.
        """
        vec = [0.0] * self.DIMENSION
        tokens = text.lower().split()
        if not tokens:
            return vec

        for idx, token in enumerate(tokens):
            h = int(hashlib.sha256(token.encode("utf-8")).hexdigest()[:8], 16)
            dim_idx = h % self.DIMENSION
            weight = 1.0 / (idx + 1.0) ** 0.5
            vec[dim_idx] += weight

            # Bigram if available
            if idx > 0:
                bigram = f"{tokens[idx - 1]}_{token}"
                bh = int(hashlib.sha256(bigram.encode("utf-8")).hexdigest()[:8], 16)
                b_dim = bh % self.DIMENSION
                vec[b_dim] += 1.5 * weight

        # Normalize to unit vector
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0.0:
            vec = [round(x / norm, 6) for x in vec]
        return vec


_embedding_service_instance: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    global _embedding_service_instance
    if _embedding_service_instance is None:
        _embedding_service_instance = EmbeddingService()
    return _embedding_service_instance
