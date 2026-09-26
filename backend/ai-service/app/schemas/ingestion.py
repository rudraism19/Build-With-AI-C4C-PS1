from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class DatasetType(str, Enum):
    DEMOGRAPHIC = "DEMOGRAPHIC"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    INVESTMENT = "INVESTMENT"
    BOUNDARY = "BOUNDARY"
    OTHER = "OTHER"


class DataSourceStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    PENDING_VALIDATION = "PENDING_VALIDATION"


class ImportJobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    PARTIAL = "PARTIAL"


class ProjectStatus(str, Enum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class CanonicalSector(str, Enum):
    WATER = "WATER"
    ROADS = "ROADS"
    ELECTRICITY = "ELECTRICITY"
    SANITATION = "SANITATION"
    HEALTHCARE = "HEALTHCARE"
    EDUCATION = "EDUCATION"
    TRANSPORT = "TRANSPORT"
    DIGITAL_CONNECTIVITY = "DIGITAL_CONNECTIVITY"
    AGRICULTURE = "AGRICULTURE"
    OTHER = "OTHER"


class DemographicRowInput(BaseModel):
    model_config = ConfigDict(extra="ignore")

    administrative_area_id: Optional[UUID] = None
    area_code: Optional[str] = None
    area_name: Optional[str] = None
    population: Optional[int] = Field(None, ge=0)
    male_population: Optional[int] = Field(None, ge=0)
    female_population: Optional[int] = Field(None, ge=0)
    households: Optional[int] = Field(None, ge=0)
    population_density: Optional[float] = Field(None, ge=0.0)
    literacy_rate: Optional[float] = Field(None, ge=0.0, le=100.0)
    data_year: int = Field(..., ge=1900, le=2100)
    source: Optional[str] = None
    source_url: Optional[str] = None

    @model_validator(mode="after")
    def check_area_identifier(self):
        if not self.administrative_area_id and not self.area_code and not self.area_name:
            raise ValueError("Row must specify at least one of: administrative_area_id, area_code, or area_name")
        return self


class InfrastructureRowInput(BaseModel):
    model_config = ConfigDict(extra="ignore")

    administrative_area_id: Optional[UUID] = None
    area_code: Optional[str] = None
    area_name: Optional[str] = None
    sector: str = Field(..., min_length=1)
    asset_type: str = Field(..., min_length=1)
    asset_count: int = Field(0, ge=0)
    coverage_value: Optional[float] = Field(None, ge=0.0)
    capacity_value: Optional[float] = Field(None, ge=0.0)
    condition_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    access_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    data_year: int = Field(..., ge=1900, le=2100)
    source: Optional[str] = None
    source_url: Optional[str] = None

    @model_validator(mode="after")
    def check_area_identifier(self):
        if not self.administrative_area_id and not self.area_code and not self.area_name:
            raise ValueError("Row must specify at least one of: administrative_area_id, area_code, or area_name")
        return self


class InvestmentRowInput(BaseModel):
    model_config = ConfigDict(extra="ignore")

    administrative_area_id: Optional[UUID] = None
    area_code: Optional[str] = None
    area_name: Optional[str] = None
    sector: str = Field(..., min_length=1)
    project_name: str = Field(..., min_length=1)
    project_type: Optional[str] = None
    allocated_amount: Decimal = Field(..., ge=Decimal("0.0"))
    spent_amount: Decimal = Field(..., ge=Decimal("0.0"))
    project_status: Optional[str] = "PLANNED"
    financial_year: str = Field(..., min_length=4)
    source: Optional[str] = None
    source_url: Optional[str] = None

    @model_validator(mode="after")
    def validate_spending_and_area(self):
        if not self.administrative_area_id and not self.area_code and not self.area_name:
            raise ValueError("Row must specify at least one of: administrative_area_id, area_code, or area_name")
        if self.spent_amount > self.allocated_amount:
            raise ValueError(
                f"spent_amount ({self.spent_amount}) cannot exceed allocated_amount ({self.allocated_amount})"
            )
        return self


class DataQualityReport(BaseModel):
    dataset_type: DatasetType
    file_name: str
    records_received: int = 0
    records_valid: int = 0
    records_rejected: int = 0
    completeness_score: float = Field(100.0, ge=0.0, le=100.0)
    validity_score: float = Field(100.0, ge=0.0, le=100.0)
    duplicate_count: int = 0
    validation_errors: List[Dict[str, Any]] = Field(default_factory=list)


class DataImportJobResponse(BaseModel):
    job_id: str
    data_source_id: Optional[str] = None
    dataset_type: DatasetType
    file_name: str
    status: ImportJobStatus
    records_received: int
    records_valid: int
    records_rejected: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    quality_report: DataQualityReport
    error_message: Optional[str] = None
