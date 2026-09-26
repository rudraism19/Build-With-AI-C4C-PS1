from fastapi import APIRouter, Depends, status
from app.api.routes.ingestion import verify_service_access
from app.schemas.rag import (
    PolicyDocumentIngestRequest,
    PolicyDocumentResponse,
    PolicySearchRequest,
    PolicySearchResponse,
)
from app.services.rag_service import RagService, get_rag_service

router = APIRouter(prefix="/rag", tags=["Policy RAG & Semantic Search"])


@router.post(
    "/ingest",
    response_model=PolicyDocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest policy document with semantic vector chunking",
    dependencies=[Depends(verify_service_access)],
)
async def ingest_policy(
    req: PolicyDocumentIngestRequest,
    service: RagService = Depends(get_rag_service),
):
    return await service.ingest_policy_document(req)


@router.post(
    "/search",
    response_model=PolicySearchResponse,
    summary="Semantic vector search across policy knowledge base",
    dependencies=[Depends(verify_service_access)],
)
async def search_policies(
    req: PolicySearchRequest,
    service: RagService = Depends(get_rag_service),
):
    return await service.search_policies(req)
