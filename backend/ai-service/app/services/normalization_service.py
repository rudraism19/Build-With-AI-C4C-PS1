import re
from typing import Optional
from app.schemas.ingestion import CanonicalSector, ProjectStatus


class NormalizationService:
    """
    Normalizes government data fields to canonical JanSetu governance domain standards.
    Preserves raw data integrity while mapping values to structured enums.
    """

    SECTOR_MAPPING = {
        # Water
        "water": CanonicalSector.WATER,
        "water supply": CanonicalSector.WATER,
        "drinking water": CanonicalSector.WATER,
        "jal": CanonicalSector.WATER,
        "jal nigam": CanonicalSector.WATER,
        "jal jeevan": CanonicalSector.WATER,
        "pipeline": CanonicalSector.WATER,
        "tubewell": CanonicalSector.WATER,
        # Roads
        "road": CanonicalSector.ROADS,
        "roads": CanonicalSector.ROADS,
        "highway": CanonicalSector.ROADS,
        "sadak": CanonicalSector.ROADS,
        "street": CanonicalSector.ROADS,
        "pwd": CanonicalSector.ROADS,
        "pothole": CanonicalSector.ROADS,
        "potholes": CanonicalSector.ROADS,
        "bridge": CanonicalSector.ROADS,
        # Electricity
        "electricity": CanonicalSector.ELECTRICITY,
        "power": CanonicalSector.ELECTRICITY,
        "energy": CanonicalSector.ELECTRICITY,
        "bijli": CanonicalSector.ELECTRICITY,
        "transformer": CanonicalSector.ELECTRICITY,
        "grid": CanonicalSector.ELECTRICITY,
        "street light": CanonicalSector.ELECTRICITY,
        "streetlights": CanonicalSector.ELECTRICITY,
        # Sanitation
        "sanitation": CanonicalSector.SANITATION,
        "waste": CanonicalSector.SANITATION,
        "garbage": CanonicalSector.SANITATION,
        "drainage": CanonicalSector.SANITATION,
        "sewage": CanonicalSector.SANITATION,
        "swachh": CanonicalSector.SANITATION,
        "safai": CanonicalSector.SANITATION,
        "cleaning": CanonicalSector.SANITATION,
        # Healthcare
        "health": CanonicalSector.HEALTHCARE,
        "healthcare": CanonicalSector.HEALTHCARE,
        "hospital": CanonicalSector.HEALTHCARE,
        "medical": CanonicalSector.HEALTHCARE,
        "clinic": CanonicalSector.HEALTHCARE,
        "phc": CanonicalSector.HEALTHCARE,
        "chc": CanonicalSector.HEALTHCARE,
        "dispensary": CanonicalSector.HEALTHCARE,
        "swasthya": CanonicalSector.HEALTHCARE,
        # Education
        "education": CanonicalSector.EDUCATION,
        "school": CanonicalSector.EDUCATION,
        "college": CanonicalSector.EDUCATION,
        "shiksha": CanonicalSector.EDUCATION,
        "vidyalaya": CanonicalSector.EDUCATION,
        "university": CanonicalSector.EDUCATION,
        # Transport
        "transport": CanonicalSector.TRANSPORT,
        "transit": CanonicalSector.TRANSPORT,
        "bus": CanonicalSector.TRANSPORT,
        "traffic": CanonicalSector.TRANSPORT,
        # Digital Connectivity
        "digital": CanonicalSector.DIGITAL_CONNECTIVITY,
        "internet": CanonicalSector.DIGITAL_CONNECTIVITY,
        "broadband": CanonicalSector.DIGITAL_CONNECTIVITY,
        "telecom": CanonicalSector.DIGITAL_CONNECTIVITY,
        "fiber": CanonicalSector.DIGITAL_CONNECTIVITY,
        "digital_connectivity": CanonicalSector.DIGITAL_CONNECTIVITY,
        # Agriculture
        "agriculture": CanonicalSector.AGRICULTURE,
        "farming": CanonicalSector.AGRICULTURE,
        "kisan": CanonicalSector.AGRICULTURE,
        "krishi": CanonicalSector.AGRICULTURE,
        "irrigation": CanonicalSector.AGRICULTURE,
    }

    PROJECT_STATUS_MAPPING = {
        "planned": ProjectStatus.PLANNED,
        "proposed": ProjectStatus.PLANNED,
        "sanctioned": ProjectStatus.PLANNED,
        "approved": ProjectStatus.PLANNED,
        "not started": ProjectStatus.PLANNED,
        "ongoing": ProjectStatus.ONGOING,
        "in progress": ProjectStatus.ONGOING,
        "active": ProjectStatus.ONGOING,
        "under construction": ProjectStatus.ONGOING,
        "wip": ProjectStatus.ONGOING,
        "completed": ProjectStatus.COMPLETED,
        "done": ProjectStatus.COMPLETED,
        "finished": ProjectStatus.COMPLETED,
        "cancelled": ProjectStatus.CANCELLED,
        "dropped": ProjectStatus.CANCELLED,
        "abandoned": ProjectStatus.CANCELLED,
    }

    @classmethod
    def normalize_sector(cls, raw_sector: str) -> CanonicalSector:
        """
        Normalizes arbitrary sector names to canonical sectors.
        """
        if not raw_sector:
            return CanonicalSector.OTHER

        cleaned = raw_sector.strip().lower()

        # Check exact key match
        if cleaned in cls.SECTOR_MAPPING:
            return cls.SECTOR_MAPPING[cleaned]

        # Check word-boundary match (sorted by longest phrase first)
        for key, canonical in sorted(cls.SECTOR_MAPPING.items(), key=lambda x: -len(x[0])):
            if re.search(r"\b" + re.escape(key) + r"\b", cleaned):
                return canonical

        # Check enum value match directly
        try:
            return CanonicalSector(raw_sector.strip().upper())
        except ValueError:
            return CanonicalSector.OTHER

    @classmethod
    def normalize_financial_year(cls, raw_fy: str) -> str:
        """
        Normalizes variations like '2023-24', '23-24', 'FY 2023-2024' into canonical 'YYYY-YYYY'.
        """
        if not raw_fy:
            return "2023-2024"

        cleaned = re.sub(r"[^\d\-]", "", raw_fy.strip())

        # Match 4-digit - 4-digit (e.g. 2023-2024)
        m = re.match(r"^(\d{4})-(\d{4})$", cleaned)
        if m:
            return f"{m.group(1)}-{m.group(2)}"

        # Match 4-digit - 2-digit (e.g. 2023-24)
        m = re.match(r"^(\d{4})-(\d{2})$", cleaned)
        if m:
            start_yr = int(m.group(1))
            end_yr = (start_yr // 100) * 100 + int(m.group(2))
            return f"{start_yr}-{end_yr}"

        # Match 2-digit - 2-digit (e.g. 23-24)
        m = re.match(r"^(\d{2})-(\d{2})$", cleaned)
        if m:
            start_yr = 2000 + int(m.group(1))
            end_yr = 2000 + int(m.group(2))
            return f"{start_yr}-{end_yr}"

        # Match single year (e.g. 2023)
        m = re.match(r"^(\d{4})$", cleaned)
        if m:
            start_yr = int(m.group(1))
            return f"{start_yr}-{start_yr + 1}"

        return raw_fy.strip().upper()

    @classmethod
    def normalize_project_status(cls, raw_status: Optional[str]) -> ProjectStatus:
        """
        Normalizes project status strings.
        """
        if not raw_status:
            return ProjectStatus.PLANNED

        cleaned = raw_status.strip().lower()
        if cleaned in cls.PROJECT_STATUS_MAPPING:
            return cls.PROJECT_STATUS_MAPPING[cleaned]

        try:
            return ProjectStatus(raw_status.strip().upper())
        except ValueError:
            return ProjectStatus.PLANNED

    @classmethod
    def clean_area_name(cls, raw_name: Optional[str]) -> str:
        """
        Cleans area names by removing redundant administrative suffixes.
        E.g., "Gwalior District" -> "GWALIOR"
        """
        if not raw_name:
            return ""

        cleaned = raw_name.strip()
        cleaned = re.sub(r"(?i)\s+(district|dist|zila|zilla|taluk|tehsil|mandal|block|ward|nagar|city)$", "", cleaned)
        return cleaned.strip().upper()
