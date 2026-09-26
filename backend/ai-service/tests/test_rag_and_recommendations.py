import asyncio
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import get_settings
from app.services.embedding_service import get_embedding_service
from app.services.rag_service import get_rag_service

client = TestClient(app)
settings = get_settings()
AUTH_HEADERS = {"X-Service-Key": settings.INTERNAL_SERVICE_KEY}


def test_embedding_generation():
    service = get_embedding_service()
    vec = asyncio.run(service.get_embedding("Drinking water supply pipeline broken in Thatipur ward"))
    assert len(vec) == 768
    # Test unit vector normalization: sum(x^2) ~ 1.0
    norm_sq = sum(x * x for x in vec)
    assert abs(norm_sq - 1.0) < 0.05


def test_rag_ingest_and_search_pipeline():
    # 1. Ingest policy doc
    doc_payload = {
        "title": "National Urban Water Security Mission 2024 [DEMO DATA]",
        "department": "Ministry of Housing and Urban Affairs",
        "content": (
            "Municipal bodies shall provide a minimum of 135 liters per capita per day of treated water. "
            "Pipelines exceeding 25 years in service must be audited annually for structural integrity and leakages. "
            "Grants are available for distribution network rehabilitation in low-income wards."
        ),
        "source_url": "https://mohua.gov.in/water-mission-demo",
    }
    ingest_res = client.post("/api/v1/rag/ingest", headers=AUTH_HEADERS, json=doc_payload)
    assert ingest_res.status_code == 201
    data = ingest_res.json()
    assert data["title"] == doc_payload["title"]
    assert data["chunks_count"] >= 1

    # 2. Search policy chunks
    search_payload = {
        "query": "drinking water pipeline leakage and rehabilitation grants",
        "top_k": 3,
        "match_threshold": 0.01,
    }
    search_res = client.post("/api/v1/rag/search", headers=AUTH_HEADERS, json=search_payload)
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert len(search_data["results"]) >= 1
    assert search_data["results"][0]["similarity"] > 0.0


def test_recommendation_generation_pipeline():
    req_payload = {
        "area_id": "a0000000-0000-0000-0000-000000000002",
        "area_name": "Gwalior District",
        "sector": "WATER",
        "affected_population": 45000,
        "priority_score": 78.5,
        "priority_factors": {
            "demand": 85.0,
            "infrastructure_gap": 72.0,
            "population_impact": 70.0,
            "development_deficit": 80.0,
            "investment_gap": 65.0,
        },
        "evidence": [
            "18 validated citizen grievances in Thatipur cluster",
            "Treatment capacity 35% below peak summer demand",
            "Zero capital expenditure recorded in current fiscal cycle",
        ],
    }
    res = client.post(
        "/api/v1/recommendations/generate",
        headers=AUTH_HEADERS,
        json=req_payload,
    )
    assert res.status_code == 200
    rec = res.json()
    assert rec["sector"] == "WATER"
    assert rec["affected_population"] == 45000
    assert len(rec["recommended_action"]) > 10
    assert len(rec["evidence"]) >= 1
    assert rec["confidence"] >= 0.8
