import csv
import io
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.ingestion import (
    CanonicalSector,
    DataImportJobResponse,
    DataQualityReport,
    DatasetType,
    DemographicRowInput,
    ImportJobStatus,
    InfrastructureRowInput,
    InvestmentRowInput,
)
from app.services.normalization_service import NormalizationService

logger = get_logger("ingestion_service")


class IngestionService:
    """
    Handles CSV ingestion, schema validation, canonical normalization,
    quality metrics computation, staging, and persistence to Supabase.
    """

    def __init__(self):
        self.settings = get_settings()
        self._area_cache: Dict[str, str] = {}  # code/name -> area_id
        self._in_memory_jobs: Dict[str, Dict[str, Any]] = {}

    def _get_supabase_headers(self) -> Dict[str, str]:
        return {
            "apikey": self.settings.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {self.settings.SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def _resolve_area_id(self, client: httpx.AsyncClient, row: Dict[str, Any]) -> Optional[str]:
        """
        Resolves administrative_area_id by UUID, code, or name from Supabase.
        """
        # 1. Direct UUID
        raw_id = row.get("administrative_area_id") or row.get("area_id")
        if raw_id:
            try:
                return str(uuid.UUID(str(raw_id).strip()))
            except ValueError:
                pass

        code = str(row.get("area_code") or row.get("code") or "").strip().upper()
        if code and code in self._area_cache:
            return self._area_cache[code]

        name = str(row.get("area_name") or row.get("district") or row.get("name") or "").strip()
        cleaned_name = NormalizationService.clean_area_name(name)
        if cleaned_name and cleaned_name in self._area_cache:
            return self._area_cache[cleaned_name]

        # Query Supabase if URL and key configured
        if self.settings.SUPABASE_URL and self.settings.SUPABASE_SERVICE_ROLE_KEY:
            try:
                # Try code match first
                if code:
                    res = await client.get(
                        f"{self.settings.SUPABASE_URL}/rest/v1/administrative_areas",
                        params={"code": f"eq.{code}", "select": "id,code,name"},
                        headers=self._get_supabase_headers(),
                        timeout=5.0,
                    )
                    if res.status_code == 200:
                        records = res.json()
                        if records:
                            area_id = records[0]["id"]
                            self._area_cache[code] = area_id
                            return area_id

                # Try name match
                if cleaned_name:
                    res = await client.get(
                        f"{self.settings.SUPABASE_URL}/rest/v1/administrative_areas",
                        params={"name": f"ilike.%{cleaned_name}%", "select": "id,code,name"},
                        headers=self._get_supabase_headers(),
                        timeout=5.0,
                    )
                    if res.status_code == 200:
                        records = res.json()
                        if records:
                            area_id = records[0]["id"]
                            self._area_cache[cleaned_name] = area_id
                            return area_id
            except Exception as e:
                logger.warning(f"Error resolving administrative area from Supabase: {e}")

        # Fallback default demo UUID if name/code is Gwalior
        if "GWALIOR" in code or "GWALIOR" in cleaned_name:
            return "a0000000-0000-0000-0000-000000000002"

        return None

    def _normalize_csv_header(self, header: str) -> str:
        return header.strip().lower().replace(" ", "_").replace("-", "_")

    async def ingest_csv(
        self,
        content: str,
        dataset_type: DatasetType,
        file_name: str = "upload.csv",
        data_source_id: Optional[str] = None,
        source_name: Optional[str] = None,
    ) -> DataImportJobResponse:
        """
        Parses CSV, validates each row against Pydantic domain models,
        normalizes sectors/financial years, computes quality metrics,
        and saves import job summary.
        """
        job_id = str(uuid.uuid4())
        started_at = datetime.now(timezone.utc)

        reader = csv.DictReader(io.StringIO(content))
        if not reader.fieldnames:
            return DataImportJobResponse(
                job_id=job_id,
                data_source_id=data_source_id,
                dataset_type=dataset_type,
                file_name=file_name,
                status=ImportJobStatus.FAILED,
                records_received=0,
                records_valid=0,
                records_rejected=0,
                started_at=started_at,
                completed_at=datetime.now(timezone.utc),
                error_message="Empty CSV or missing headers",
                quality_report=DataQualityReport(
                    dataset_type=dataset_type,
                    file_name=file_name,
                    records_received=0,
                    records_valid=0,
                    records_rejected=0,
                    completeness_score=0.0,
                    validity_score=0.0,
                    duplicate_count=0,
                    validation_errors=[{"error": "Empty CSV file"}],
                ),
            )

        valid_records: List[Dict[str, Any]] = []
        staging_records: List[Dict[str, Any]] = []
        validation_errors: List[Dict[str, Any]] = []
        seen_keys = set()
        duplicate_count = 0
        total_cells = 0
        populated_cells = 0
        row_idx = 0

        async with httpx.AsyncClient() as client:
            for raw_row in reader:
                row_idx += 1
                clean_row = {
                    self._normalize_csv_header(k): v.strip() if isinstance(v, str) else v
                    for k, v in raw_row.items()
                    if k is not None
                }

                # Cell-level completeness tracking
                total_cells += len(clean_row)
                populated_cells += sum(1 for v in clean_row.values() if v is not None and str(v).strip() != "")

                # Resolve administrative area
                area_id = await self._resolve_area_id(client, clean_row)
                if area_id:
                    clean_row["administrative_area_id"] = area_id

                is_valid = True
                row_errors = []
                validated_data: Optional[Dict[str, Any]] = None

                # Domain Validation & Normalization
                if dataset_type == DatasetType.DEMOGRAPHIC:
                    try:
                        pydantic_row = DemographicRowInput(**clean_row)
                        validated_data = pydantic_row.model_dump(exclude_none=True)
                        if area_id:
                            validated_data["administrative_area_id"] = area_id

                        # Duplicate check by area + year
                        dup_key = f"{area_id}_{pydantic_row.data_year}"
                        if dup_key in seen_keys:
                            duplicate_count += 1
                        seen_keys.add(dup_key)
                    except Exception as exc:
                        is_valid = False
                        row_errors.append(str(exc))

                elif dataset_type == DatasetType.INFRASTRUCTURE:
                    try:
                        pydantic_row = InfrastructureRowInput(**clean_row)
                        canonical_sector = NormalizationService.normalize_sector(pydantic_row.sector)
                        validated_data = pydantic_row.model_dump(exclude_none=True)
                        validated_data["sector"] = canonical_sector.value
                        if area_id:
                            validated_data["administrative_area_id"] = area_id

                        dup_key = f"{area_id}_{canonical_sector.value}_{pydantic_row.asset_type}_{pydantic_row.data_year}"
                        if dup_key in seen_keys:
                            duplicate_count += 1
                        seen_keys.add(dup_key)
                    except Exception as exc:
                        is_valid = False
                        row_errors.append(str(exc))

                elif dataset_type == DatasetType.INVESTMENT:
                    try:
                        pydantic_row = InvestmentRowInput(**clean_row)
                        canonical_sector = NormalizationService.normalize_sector(pydantic_row.sector)
                        canonical_fy = NormalizationService.normalize_financial_year(pydantic_row.financial_year)
                        canonical_status = NormalizationService.normalize_project_status(pydantic_row.project_status)

                        validated_data = pydantic_row.model_dump(exclude_none=True)
                        validated_data["sector"] = canonical_sector.value
                        validated_data["financial_year"] = canonical_fy
                        validated_data["project_status"] = canonical_status.value
                        # Convert Decimal to float for JSON serialization
                        validated_data["allocated_amount"] = float(pydantic_row.allocated_amount)
                        validated_data["spent_amount"] = float(pydantic_row.spent_amount)
                        if area_id:
                            validated_data["administrative_area_id"] = area_id

                        dup_key = f"{area_id}_{pydantic_row.project_name}_{canonical_fy}"
                        if dup_key in seen_keys:
                            duplicate_count += 1
                        seen_keys.add(dup_key)
                    except Exception as exc:
                        is_valid = False
                        row_errors.append(str(exc))
                else:
                    is_valid = False
                    row_errors.append(f"Unsupported dataset type: {dataset_type}")

                # Staging record
                staging_records.append({
                    "import_job_id": job_id,
                    "row_index": row_idx,
                    "raw_data": raw_row,
                    "is_valid": is_valid,
                    "validation_errors": row_errors,
                })

                if is_valid and validated_data:
                    if not area_id:
                        is_valid = False
                        row_errors.append(
                            f"Could not resolve administrative area for '{clean_row.get('area_name') or clean_row.get('area_code')}'"
                        )
                        validation_errors.append({
                            "row_index": row_idx,
                            "errors": row_errors,
                            "raw": raw_row,
                        })
                    else:
                        valid_records.append(validated_data)
                else:
                    validation_errors.append({
                        "row_index": row_idx,
                        "errors": row_errors,
                        "raw": raw_row,
                    })

            # Calculate Quality Metrics
            records_received = row_idx
            records_valid = len(valid_records)
            records_rejected = records_received - records_valid
            validity_score = round((records_valid / records_received * 100.0), 2) if records_received > 0 else 100.0
            completeness_score = round((populated_cells / total_cells * 100.0), 2) if total_cells > 0 else 100.0

            status = ImportJobStatus.COMPLETED if records_rejected == 0 else (
                ImportJobStatus.PARTIAL if records_valid > 0 else ImportJobStatus.FAILED
            )

            completed_at = datetime.now(timezone.utc)
            quality_report = DataQualityReport(
                dataset_type=dataset_type,
                file_name=file_name,
                records_received=records_received,
                records_valid=records_valid,
                records_rejected=records_rejected,
                completeness_score=completeness_score,
                validity_score=validity_score,
                duplicate_count=duplicate_count,
                validation_errors=validation_errors[:50],  # cap at 50 errors
            )

            # Persist to Supabase if available
            await self._persist_records(
                client=client,
                job_id=job_id,
                data_source_id=data_source_id,
                dataset_type=dataset_type,
                file_name=file_name,
                status=status,
                records_received=records_received,
                records_valid=records_valid,
                records_rejected=records_rejected,
                started_at=started_at,
                completed_at=completed_at,
                quality_report=quality_report,
                valid_records=valid_records,
                staging_records=staging_records,
            )

            job_response = DataImportJobResponse(
                job_id=job_id,
                data_source_id=data_source_id,
                dataset_type=dataset_type,
                file_name=file_name,
                status=status,
                records_received=records_received,
                records_valid=records_valid,
                records_rejected=records_rejected,
                started_at=started_at,
                completed_at=completed_at,
                quality_report=quality_report,
            )

            self._in_memory_jobs[job_id] = job_response.model_dump()
            return job_response

    async def _persist_records(
        self,
        client: httpx.AsyncClient,
        job_id: str,
        data_source_id: Optional[str],
        dataset_type: DatasetType,
        file_name: str,
        status: ImportJobStatus,
        records_received: int,
        records_valid: int,
        records_rejected: int,
        started_at: datetime,
        completed_at: datetime,
        quality_report: DataQualityReport,
        valid_records: List[Dict[str, Any]],
        staging_records: List[Dict[str, Any]],
    ) -> None:
        """
        Attempts to write import job audit, staging records, and validated production records to Supabase.
        Fails gracefully if Supabase migration is not yet applied.
        """
        if not (self.settings.SUPABASE_URL and self.settings.SUPABASE_SERVICE_ROLE_KEY):
            return

        headers = self._get_supabase_headers()

        try:
            # 1. Save data_import_jobs record
            job_payload = {
                "id": job_id,
                "data_source_id": data_source_id,
                "dataset_type": dataset_type.value,
                "file_name": file_name,
                "status": status.value,
                "records_received": records_received,
                "records_valid": records_valid,
                "records_rejected": records_rejected,
                "started_at": started_at.isoformat(),
                "completed_at": completed_at.isoformat(),
                "validation_report": quality_report.model_dump(),
            }
            await client.post(
                f"{self.settings.SUPABASE_URL}/rest/v1/data_import_jobs",
                json=job_payload,
                headers=headers,
                timeout=5.0,
            )

            # 2. Save data_staging_records
            if staging_records:
                await client.post(
                    f"{self.settings.SUPABASE_URL}/rest/v1/data_staging_records",
                    json=staging_records[:100],  # batch first 100 for safety
                    headers=headers,
                    timeout=5.0,
                )

            # 3. Save valid production records
            if valid_records:
                table_name = {
                    DatasetType.DEMOGRAPHIC: "demographic_data",
                    DatasetType.INFRASTRUCTURE: "infrastructure_data",
                    DatasetType.INVESTMENT: "investment_data",
                }.get(dataset_type)

                if table_name:
                    for rec in valid_records:
                        rec["import_job_id"] = job_id
                        if data_source_id:
                            rec["data_source_id"] = data_source_id
                        # Remove helper keys before insert
                        rec.pop("area_code", None)
                        rec.pop("area_name", None)

                    await client.post(
                        f"{self.settings.SUPABASE_URL}/rest/v1/{table_name}",
                        json=valid_records,
                        headers=headers,
                        timeout=5.0,
                    )
        except Exception as exc:
            logger.warning(f"Could not persist import job to Supabase (tables may not be migrated yet): {exc}")

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self._in_memory_jobs.get(job_id)


_ingestion_service_instance: Optional[IngestionService] = None


def get_ingestion_service() -> IngestionService:
    global _ingestion_service_instance
    if _ingestion_service_instance is None:
        _ingestion_service_instance = IngestionService()
    return _ingestion_service_instance
