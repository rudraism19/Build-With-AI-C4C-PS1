import logging
import sys
from app.core.config import settings


def setup_logging():
    """
    Configures structured logging for the application.
    """
    log_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)-7s | %(name)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    logger = logging.getLogger("jansetu.ai_service")
    return logger


logger = logging.getLogger("jansetu.ai_service")


def get_logger(name: str = "jansetu.ai_service"):
    """
    Returns named logger child or root app logger.
    """
    if name == "jansetu.ai_service":
        return logger
    return logging.getLogger(f"jansetu.ai_service.{name}")
