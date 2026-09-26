import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import get_settings
from app.schemas.ingestion import CanonicalSector, DatasetType, ProjectStatus
from app.services.normalization_service import NormalizationService

client = TestClient(app)
settings = get_settings()
AUTH_HEADERS = {"X-Service-Key": settings.INTERNAL_SERVICE_KEY}


# ------------------------------------------------------------------------------
# Normalization Service Tests
# ------------------------------------------------------------------------------
def test_sector_normalization():
    assert NormalizationService.normalize_sector("Water Supply") == CanonicalSector.WATER
    assert NormalizationService.normalize_sector("jal nigam") == CanonicalSector.WATER
    assert NormalizationService.normalize_sector("PWD Highway Roads") == CanonicalSector.ROADS
    assert NormalizationService.normalize_sector("Transformer repair") == CanonicalSector.ELECTRICITY
    assert NormalizationService.normalize_sector("Swachh Bharat garbage") == CanonicalSector.SANITATION
    assert NormalizationService.normalize_sector("PHC Clinic Bed") == CanonicalSector.HEALTHCARE
    assert NormalizationService.normalize_sector("Primary School") == CanonicalSector.EDUCATION
    assert NormalizationService.normalize_sector("Bus depot") == CanonicalSector.TRANSPORT
    assert NormalizationService.normalize_sector("Broadband fiber") == CanonicalSector.DIGITAL_CONNECTIVITY
    assert NormalizationService.normalize_sector("Kisan Krishi Irrigation") == CanonicalSector.AGRICULTURE
    assert NormalizationService.normalize_sector("Random Unknown Service") == CanonicalSector.OTHER


def test_financial_year_normalization():
    assert NormalizationService.normalize_financial_year("2023-24") == "2023-2024"
    assert NormalizationService.normalize_financial_year("2023-2024") == "2023-2024"
    assert NormalizationService.normalize_financial_year("FY 23-24") == "2023-2024"
    assert NormalizationService.normalize_financial_year("2024") == "2024-2025"


def test_project_status_normalization():
    assert NormalizationService.normalize_project_status("Sanctioned") == ProjectStatus.PLANNED
    assert NormalizationService.normalize_project_status("Under Construction") == ProjectStatus.ONGOING
    assert NormalizationService.normalize_project_status("Finished") == ProjectStatus.COMPLETED
    assert NormalizationService.normalize_project_status("Abandoned") == ProjectStatus.CANCELLED


def test_area_name_cleaning():
    assert NormalizationService.clean_area_name("Gwalior District") == "GWALIOR"
    assert NormalizationService.clean_area_name("Bhopal Zila") == "BHOPAL"
    assert NormalizationService.clean_area_name("Morar Block") == "MORAR"


# ------------------------------------------------------------------------------
# API Authentication Tests
# ------------------------------------------------------------------------------
def test_ingest_endpoint_requires_auth():
    """Verify endpoint rejects requests without service key (401 Unauthorized)"""
    res = client.post(
        "/api/v1/ingest/raw",
        json={
            "csv_content": "area_code,population,data_year\nGWL-DIST,2000000,2023",
            "dataset_type": "DEMOGRAPHIC",
        },
    )
    assert res.status_code == 401
    assert "Unauthorized" in res.json()["detail"]


# ------------------------------------------------------------------------------
# CSV Ingestion Pipeline & Quality Report Tests
# ------------------------------------------------------------------------------
def test_demographic_csv_ingestion_success():
    csv_data = (
        "area_name,population,male_population,female_population,households,literacy_rate,data_year,source\n"
        "Gwalior District,2032036,1090123,941913,380000,77.94,2023,Census Demo\n"
        "Gwalior District,2050000,1100000,950000,385000,78.50,2024,Survey Demo\n"
    )

    res = client.post(
        "/api/v1/ingest/raw",
        headers=AUTH_HEADERS,
        json={
            "csv_content": csv_data,
            "dataset_type": "DEMOGRAPHIC",
            "file_name": "demo_test.csv",
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert data["records_received"] == 2
    assert data["records_valid"] == 2
    assert data["records_rejected"] == 0
    assert data["status"] == "COMPLETED"

    # Verify quality report
    qr = data["quality_report"]
    assert qr["completeness_score"] > 90.0
    assert qr["validity_score"] == 100.0
    assert qr["records_valid"] == 2

    # Verify job can be retrieved
    job_id = data["job_id"]
    job_res = client.get(f"/api/v1/ingest/jobs/{job_id}", headers=AUTH_HEADERS)
    assert job_res.status_code == 200
    assert job_res.json()["job_id"] == job_id


def test_validation_rule_rejections():
    """
    Tests row-level validation rule rejections:
    1. Demographics: literacy_rate > 100 rejected.
    2. Investment: spent_amount > allocated_amount rejected.
    """
    # 1. Invalid Demographic (literacy rate 150%)
    invalid_demo_csv = (
        "area_name,population,literacy_rate,data_year\n"
        "Gwalior District,200000,150.0,2023\n"
    )
    res_demo = client.post(
        "/api/v1/ingest/raw",
        headers=AUTH_HEADERS,
        json={
            "csv_content": invalid_demo_csv,
            "dataset_type": "DEMOGRAPHIC",
        },
    )
    assert res_demo.status_code == 201
    assert res_demo.json()["records_rejected"] == 1
    assert res_demo.json()["status"] == "FAILED"

    # 2. Invalid Investment (spent > allocated)
    invalid_inv_csv = (
        "area_name,sector,project_name,allocated_amount,spent_amount,financial_year\n"
        "Gwalior District,Water Supply,Pipeline Expansion,50000.00,80000.00,2023-24\n"
    )
    res_inv = client.post(
        "/api/v1/ingest/raw",
        headers=AUTH_HEADERS,
        json={
            "csv_content": invalid_inv_csv,
            "dataset_type": "INVESTMENT",
        },
    )
    assert res_inv.status_code == 201
    inv_data = res_inv.json()
    assert inv_data["records_rejected"] == 1
    assert "spent_amount" in inv_data["quality_report"]["validation_errors"][0]["errors"][0]


def test_infrastructure_ingestion_and_normalization():
    infra_csv = (
        "area_name,sector,asset_type,asset_count,coverage_value,capacity_value,condition_score,access_score,data_year\n"
        "Gwalior District,drinking water,treatment plant,5,78.5,150.0,85.0,90.0,2024\n"
        "Gwalior District,sadak,highway stretch,12,65.0,0.0,72.0,80.0,2024\n"
    )
    res = client.post(
        "/api/v1/ingest/raw",
        headers=AUTH_HEADERS,
        json={
            "csv_content": infra_csv,
            "dataset_type": "INFRASTRUCTURE",
            "file_name": "infra_test.csv",
        },
    )
    assert res.status_code == 201
    assert res.json()["records_valid"] == 2
    assert res.json()["status"] == "COMPLETED"
