import re


class LanguageService:
    """
    Lightweight, fast language detector for Indian scripts and English.
    """

    # Unicode ranges for major Indian scripts
    SCRIPT_RANGES = {
        "hi": r"[\u0900-\u097F]",  # Devanagari (Hindi, Marathi, Sanskrit)
        "bn": r"[\u0980-\u09FF]",  # Bengali
        "pa": r"[\u0A00-\u0A7F]",  # Gurmukhi (Punjabi)
        "gu": r"[\u0A80-\u0AFF]",  # Gujarati
        "or": r"[\u0B00-\u0B7F]",  # Odia
        "ta": r"[\u0B80-\u0BFF]",  # Tamil
        "te": r"[\u0C00-\u0C7F]",  # Telugu
        "kn": r"[\u0C80-\u0CFF]",  # Kannada
        "ml": r"[\u0D00-\u0D7F]",  # Malayalam
    }

    def detect_language(self, text: str, fallback: str = "en") -> str:
        """
        Identifies whether text is in an Indic script or English.
        """
        if not text:
            return fallback

        for lang, pattern in self.SCRIPT_RANGES.items():
            if re.search(pattern, text):
                return lang

        return fallback


language_service = LanguageService()
