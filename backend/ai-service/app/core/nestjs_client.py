from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger


class NestJSClient:
    """
    HTTP client for future communication with the JanSetu NestJS backend.
    """

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or settings.NESTJS_BASE_URL).rstrip("/")
        self._client: Optional[httpx.AsyncClient] = None

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=httpx.Timeout(10.0, connect=5.0),
                headers={"User-Agent": f"JanSetu-AI-Service/{settings.APP_VERSION}"},
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            logger.debug("Closed NestJS HTTP client connection")


# Shared singleton instance
nestjs_client = NestJSClient()
