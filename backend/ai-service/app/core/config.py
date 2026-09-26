from functools import lru_cache
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    APP_NAME: str = "JanSetu AI Service"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    NESTJS_BASE_URL: str = "http://localhost:3000"
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # AI Provider API Keys & Config
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    SARVAM_API_KEY: str = ""

    # Supabase & Data Ingestion Security
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    INTERNAL_SERVICE_KEY: str = "jansetu-internal-secret-key"

    # Reliable CDN URLs for Swagger UI & ReDoc (avoids blocked jsDelivr in India)
    SWAGGER_JS_URL: str = (
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.js"
    )
    SWAGGER_CSS_URL: str = (
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css"
    )
    REDOC_JS_URL: str = (
        "https://cdnjs.cloudflare.com/ajax/libs/redoc/2.1.5/redoc.standalone.min.js"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, tuple)):
            return [str(i).strip() for i in v if str(i).strip()]
        return ["http://localhost:3000", "http://localhost:5173"]


@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached singleton instance of Settings.
    """
    return Settings()


settings = get_settings()
