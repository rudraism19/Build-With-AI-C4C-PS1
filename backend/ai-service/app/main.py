from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html

from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.core.nestjs_client import nestjs_client
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifecycle management (startup and graceful shutdown).
    """
    setup_logging()
    logger.info(
        f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]"
    )
    logger.info(f"Targeting NestJS backend at: {settings.NESTJS_BASE_URL}")
    if settings.GEMINI_API_KEY:
        logger.info(f"Gemini AI provider configured with model: {settings.GEMINI_MODEL}")
    else:
        logger.info("Gemini AI provider operating in local baseline heuristic mode (GEMINI_API_KEY not set)")
    if settings.SARVAM_API_KEY:
        logger.info("Sarvam AI Speech-to-text provider configured")
    else:
        logger.info("Sarvam AI operating in local mock mode (SARVAM_API_KEY not set)")

    yield
    logger.info("Shutting down JanSetu AI Service...")
    await nestjs_client.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "JanSetu AI Service — AI & ML Processing Layer for Citizen Governance. "
        "Provides contract validation, multilingual processing, voice support, "
        "and intelligent complaint triage."
    ),
    docs_url=None,  # Custom documentation routes mounted below with Cloudflare CDN
    redoc_url=None,
    lifespan=lifespan,
)

# ------------------------------------------------------------------------------
# Reliable Swagger UI & ReDoc Documentation Routes (Fixes blank page from blocked jsDelivr)
# ------------------------------------------------------------------------------
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html() -> HTMLResponse:
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        swagger_js_url=settings.SWAGGER_JS_URL,
        swagger_css_url=settings.SWAGGER_CSS_URL,
    )


@app.get("/redoc", include_in_schema=False)
async def custom_redoc_html() -> HTMLResponse:
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - ReDoc",
        redoc_js_url=settings.REDOC_JS_URL,
    )


# ------------------------------------------------------------------------------
# CORS Middleware
# ------------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------------------
# Exception Handlers (Safe responses without leaking internals or stack traces)
# ------------------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append(f"{loc}: {msg}")

    logger.warning(
        f"Validation error on {request.method} {request.url.path}: {errors}"
    )
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Bad Request",
            "message": "Request validation failed",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )


# ------------------------------------------------------------------------------
# Root Endpoint (GET /)
# ------------------------------------------------------------------------------
@app.get(
    "/",
    tags=["Root"],
    summary="Root service status",
    description="Returns service status greeting.",
)
async def root():
    return {"message": "JanSetu AI Service is running"}


# ------------------------------------------------------------------------------
# Mount Versioned API Router (/api/v1)
# ------------------------------------------------------------------------------
app.include_router(api_router, prefix="/api/v1")
