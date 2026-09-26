from typing import Optional
from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.core.config import get_settings
from app.schemas.ingestion import DataImportJobResponse, DataQualityReport, DatasetType
from app.services.ingestion_service import IngestionService, get_ingestion_service

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & Government Data"])


def verify_service_access(
    x_service_key: Optional[str] = Header(None, alias="X-Service-Key"),
    authorization: Optional[str] = Header(None),
):
    """
    Protects government data ingestion endpoints from unauthorized public citizen access.
    Validates either X-Service-Key or Bearer token against configured internal keys.
    """
    settings = get_settings()
    allowed_keys = {
        settings.INTERNAL_SERVICE_KEY,
        settings.SUPABASE_SERVICE_ROLE_KEY,
    }
    allowed_keys.discard("")  # discard empty strings

    token = None
    if x_service_key:
        token = x_service_key.strip()
    elif authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()

    if not token or token not in allowed_keys:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Access to government dataset ingestion requires a valid service key.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True


class RawCsvIngestRequest(BaseModel):
    csv_content: str
    dataset_type: DatasetType
    file_name: str = "raw_data.csv"
    data_source_id: Optional[str] = None
    source_name: Optional[str] = None


@router.post(
    "/csv",
    response_model=DataImportJobResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest government CSV dataset (File Upload)",
    description="Securely ingest demographic, infrastructure, or investment CSV data. Validates schema, normalizes values, and creates quality report.",
    dependencies=[Depends(verify_service_access)],
)
async def ingest_csv_file(
    file: UploadFile = File(..., description="CSV file containing government data"),
    dataset_type: DatasetType = Form(..., description="Type: DEMOGRAPHIC | INFRASTRUCTURE | INVESTMENT"),
    data_source_id: Optional[str] = Form(None, description="Optional registered data source UUID"),
    source_name: Optional[str] = Form(None, description="Optional data source name"),
    service: IngestionService = Depends(get_ingestion_service),
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only CSV files (.csv) are accepted.",
        )

    content_bytes = await file.read()
    try:
        content_str = content_bytes.decode("utf-8-sig")  # handle UTF-8 BOM if present
    except UnicodeDecodeError:
        content_str = content_bytes.decode("latin-1")

    return await service.ingest_csv(
        content=content_str,
        dataset_type=dataset_type,
        file_name=file.filename,
        data_source_id=data_source_id,
        source_name=source_name,
    )


@router.post(
    "/raw",
    response_model=DataImportJobResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest government CSV text (JSON payload)",
    description="Alternative ingestion endpoint accepting raw CSV text in JSON body.",
    dependencies=[Depends(verify_service_access)],
)
async def ingest_raw_csv(
    payload: RawCsvIngestRequest,
    service: IngestionService = Depends(get_ingestion_service),
):
    return await service.ingest_csv(
        content=payload.csv_content,
        dataset_type=payload.dataset_type,
        file_name=payload.file_name,
        data_source_id=payload.data_source_id,
        source_name=payload.source_name,
    )


@router.get(
    "/jobs/{job_id}",
    response_model=DataImportJobResponse,
    summary="Get import job status and details",
    description="Retrieve execution details, record counts, and status for a specific data import job.",
    dependencies=[Depends(verify_service_access)],
)
async def get_import_job(
    job_id: str,
    service: IngestionService = Depends(get_ingestion_service),
):
    job = service.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job with ID '{job_id}' not found.",
        )
    return job


@router.get(
    "/quality-report/{job_id}",
    response_model=DataQualityReport,
    summary="Get data quality report",
    description="Retrieve data completeness, validity, duplicate count, and validation errors for an import job.",
    dependencies=[Depends(verify_service_access)],
)
async def get_quality_report(
    job_id: str,
    service: IngestionService = Depends(get_ingestion_service),
):
    job = service.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job with ID '{job_id}' not found.",
        )
    return job.get("quality_report")
