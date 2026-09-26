# JanSetu AI — AI Service (FastAPI)

Production-grade, asynchronous Python AI microservice for the **JanSetu AI** citizen governance platform.

In **Phase 2**, this service establishes the contract, validation pipeline, and modular architecture for AI processing before integrating Sarvam AI and Google Gemini in future phases.

---

## Architecture Overview

```text
Request (Citizen Complaint)
       ↓
Pydantic Request Validation (UUID, Multilingual, InputType)
       ↓
FastAPI Router (/api/v1/complaints/process)
       ↓
Complaint Service (Pipeline Coordinator)
       ↓
Future AI Pipeline:
  [Sarvam Audio Transcription] → [Gemini Classifier] → [Entity Extractor] → [Vector Duplicate Detection]
       ↓
Structured Response Contract
```

---

## Tech Stack

* **Python**: 3.11+
* **Framework**: FastAPI
* **Server**: Uvicorn
* **Validation**: Pydantic v2 & `pydantic-settings`
* **HTTP Client**: `httpx` (async client for NestJS communication)
* **Testing**: `pytest` & FastAPI `TestClient`

---

## Directory Structure

```text
ai-service/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py         # GET /api/v1/health
│   │   │   └── complaints.py     # POST /api/v1/complaints/process
│   │   └── router.py             # Combines versioned routes
│   ├── core/
│   │   ├── config.py             # Pydantic Settings & environment variables
│   │   ├── logging.py            # Structured logging configuration
│   │   └── nestjs_client.py      # Async HTTP client wrapper for NestJS
│   ├── schemas/
│   │   └── complaint.py          # Request and Response Pydantic models
│   ├── services/
│   │   └── complaint_service.py  # Business logic & pipeline coordinator
│   └── main.py                   # FastAPI initialization, CORS, lifespan, exception handling
├── tests/
│   └── test_api.py               # Automated endpoint & contract tests
├── .env.example                  # Template environment variables
├── requirements.txt              # Production and testing dependencies
└── README.md
```

---

## Getting Started

### 1. Create and Activate Virtual Environment

```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration:
```env
APP_NAME=JanSetu AI Service
APP_VERSION=1.0.0
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000
NESTJS_BASE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Run the Service

```bash
uvicorn app.main:app --reload --port 8000
```

Verify service availability:
* Root status: [http://localhost:8000](http://localhost:8000)
* Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
* Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
* ReDoc UI: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Running Automated Tests

```bash
pytest -v
```

---

## API Endpoints

### 1. Root Status
* **Method**: `GET /`
* **Response**: `{"message": "JanSetu AI Service is running"}`

### 2. Health Check
* **Method**: `GET /api/v1/health`
* **Response**:
```json
{
  "status": "ok",
  "service": "jansetu-ai-service",
  "version": "1.0.0"
}
```

### 3. Process Complaint
* **Method**: `POST /api/v1/complaints/process`
* **Request Body**:
```json
{
  "complaint_id": "d3b07384-d113-494b-9c8e-32f2ec4e5e4f",
  "text": "There is no drinking water supply in our village for the last five days.",
  "language": "en",
  "input_type": "TEXT"
}
```
* **Response (200 OK)**:
```json
{
  "complaint_id": "d3b07384-d113-494b-9c8e-32f2ec4e5e4f",
  "status": "received",
  "category": null,
  "severity": null,
  "summary": null,
  "entities": {},
  "language": "en",
  "confidence": null
}
```
