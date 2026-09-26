from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RecommendationGenerateRequest(BaseModel):
    hotspot_id: Optional[str] = None
    priority_score_id: Optional[str] = None
    area_id: str = Field(..., description="Target administrative area UUID")
    sector: str = Field(..., description="Civic sector (e.g. WATER, ROADS, HEALTHCARE)")
    area_name: Optional[str] = "Target Area"
    affected_population: int = Field(0, ge=0)
    priority_score: Optional[float] = None
    priority_factors: Dict[str, float] = Field(default_factory=dict)
    evidence: List[str] = Field(default_factory=list)
    policy_query: Optional[str] = None


class PolicyCitation(BaseModel):
    title: str
    source_url: Optional[str] = None
    provision: Optional[str] = None


class DevelopmentRecommendationOutput(BaseModel):
    title: str = Field(..., description="Actionable recommendation title")
    sector: str = Field(..., description="Civic sector")
    recommended_action: str = Field(..., description="Concrete administrative or infrastructure intervention")
    affected_population: int = Field(..., ge=0)
    estimated_impact: str = Field(..., description="Projected benefit and civic grievance reduction")
    evidence: List[str] = Field(default_factory=list, description="Measurable database facts backing this intervention")
    policy_context: List[PolicyCitation] = Field(default_factory=list, description="Applicable government schemes or guidelines")
    confidence: float = Field(0.85, ge=0.0, le=1.0)
    assumptions: List[str] = Field(default_factory=list)
    data_sources: List[str] = Field(default_factory=list)
