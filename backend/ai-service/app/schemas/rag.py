from typing import Any, Dict, List, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class PolicyDocumentIngestRequest(BaseModel):
    title: str = Field(..., min_length=3, description="Official title of the policy or scheme guideline")
    department: Optional[str] = Field(None, description="Issuing department or ministry")
    document_type: Optional[str] = Field("SCHEME_GUIDELINE", description="Document type")
    description: Optional[str] = None
    source_url: Optional[str] = None
    document_date: Optional[str] = None
    language: str = Field("en", description="Language code")
    version: Optional[str] = "1.0"
    content: str = Field(..., min_length=20, description="Full text content of the policy document")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PolicyChunkResponse(BaseModel):
    id: Optional[str] = None
    document_id: Optional[str] = None
    chunk_index: int
    chunk_text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PolicyDocumentResponse(BaseModel):
    id: str
    title: str
    department: Optional[str] = None
    document_type: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    document_date: Optional[str] = None
    language: str
    version: Optional[str] = None
    chunks_count: int
    status: str
    created_at: str


class PolicySearchRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Search query or problem description")
    top_k: int = Field(5, ge=1, le=20, description="Number of policy chunks to retrieve")
    match_threshold: float = Field(0.4, ge=0.0, le=1.0, description="Minimum cosine similarity threshold")


class PolicySearchResult(BaseModel):
    document_id: str
    title: str
    department: Optional[str] = None
    chunk: str
    similarity: float
    source_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PolicySearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[PolicySearchResult]
