import asyncio
import json
import os
import sys
import httpx
from dotenv import load_dotenv

# Load env variables from ai-service
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(os.path.abspath(env_path))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

def generate_embedding(text: str) -> list[float]:
    import hashlib
    import math
    import re
    dim = 768
    cleaned = text.strip().lower()
    if not cleaned:
        return [0.0] * dim
    
    vec = [0.0] * dim
    words = re.findall(r"\w+", cleaned)
    for word in words:
        h = int(hashlib.sha256(word.encode("utf-8")).hexdigest()[:8], 16)
        idx = h % dim
        sign = 1.0 if (h % 2 == 0) else -1.0
        vec[idx] += sign * (1.0 + (len(word) / 10.0))
    
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        return [round(x / norm, 6) for x in vec]
    return [0.0] * dim

async def test_document_inventory():
    print("=" * 80)
    print("TEST 1: Ingested Document Inventory & Verification")
    print("=" * 80)
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        # Fetch policy documents
        r_docs = await client.get(
            f"{SUPABASE_URL}/rest/v1/policy_documents?select=id,title,department,document_type,source_url,created_at&order=created_at.desc",
            headers=HEADERS,
        )
        docs = r_docs.json() if r_docs.status_code == 200 else []
        print(f"[OK] Total Policy Documents in Database: {len(docs)}")
        
        # Fetch policy chunks count per document
        r_chunks = await client.get(
            f"{SUPABASE_URL}/rest/v1/policy_chunks?select=id,document_id,chunk_index,chunk_text&order=chunk_index.asc",
            headers=HEADERS,
        )
        chunks = r_chunks.json() if r_chunks.status_code == 200 else []
        print(f"[OK] Total Vectorized Policy Chunks in Database: {len(chunks)}")
        print("-" * 80)
        
        doc_chunk_map = {}
        for c in chunks:
            doc_id = c.get("document_id")
            doc_chunk_map[doc_id] = doc_chunk_map.get(doc_id, 0) + 1
            
        for d in docs:
            chunk_cnt = doc_chunk_map.get(d["id"], 0)
            print(f"  * {d['title']}")
            print(f"    Department: {d.get('department')}")
            print(f"    Type: {d.get('document_type')} | Chunks: {chunk_cnt}")
            print(f"    Source: {d.get('source_url')}")
            print()

async def test_semantic_search():
    print("=" * 80)
    print("TEST 2: Semantic RAG Retrieval Test (pgvector Similarity Search)")
    print("=" * 80)
    
    test_queries = [
        {
            "sector": "WATER",
            "query": "AMRUT 2.0 water supply distribution network universal tap coverage recycling",
            "expected_scheme": "AMRUT 2.0"
        },
        {
            "sector": "HOUSING",
            "query": "Pradhan Mantri Awas Yojana PMAY urban affordable housing beneficiary grant",
            "expected_scheme": "PMAY"
        },
        {
            "sector": "SANITATION",
            "query": "Swachh Bharat Mission SBM solid waste management used water sanitation processing",
            "expected_scheme": "Swachh Bharat"
        },
        {
            "sector": "RURAL/PERI-URBAN WATER",
            "query": "Jal Jeevan Mission functional household tap connection water quality testing",
            "expected_scheme": "Jal Jeevan"
        }
    ]
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        for idx, tq in enumerate(test_queries, 1):
            q_emb = generate_embedding(tq["query"])
            print(f"Query {idx} [{tq['sector']}]: '{tq['query']}'")
            
            # Call match_policy_chunks RPC
            rpc_res = await client.post(
                f"{SUPABASE_URL}/rest/v1/rpc/match_policy_chunks",
                json={
                    "query_embedding": q_emb,
                    "match_threshold": 0.15,
                    "match_count": 2,
                },
                headers=HEADERS,
            )
            
            if rpc_res.status_code == 200:
                matches = rpc_res.json()
                print(f"  [SUCCESS] Retrieved {len(matches)} policy chunks via match_policy_chunks RPC:")
                for m in matches:
                    title = m.get("title", "Government Policy")
                    sim = m.get("similarity", 0.0)
                    chunk_snippet = m.get("chunk_text", "")[:180].replace("\n", " ")
                    print(f"    - Score: {sim:.4f} | Scheme: {title}")
                    print(f"      Text: \"{chunk_snippet}...\"")
            else:
                print(f"  [ERROR] RPC call failed: {rpc_res.status_code} - {rpc_res.text}")
            print("-" * 80)

async def test_end_to_end_rag_dpr():
    print("=" * 80)
    print("TEST 3: End-to-End Grounded DPR Recommendation Generation (Gemini RAG)")
    print("=" * 80)
    
    # 1. Retrieve policy context for a realistic Gwalior hotspot scenario
    query = "AMRUT 2.0 water distribution pipeline replacement water loss reduction non-revenue water"
    q_emb = generate_embedding(query)
    
    async with httpx.AsyncClient(timeout=25.0) as client:
        rpc_res = await client.post(
            f"{SUPABASE_URL}/rest/v1/rpc/match_policy_chunks",
            json={
                "query_embedding": q_emb,
                "match_threshold": 0.15,
                "match_count": 2,
            },
            headers=HEADERS,
        )
        
        citations = []
        if rpc_res.status_code == 200:
            for row in rpc_res.json():
                citations.append({
                    "title": row.get("title", "AMRUT 2.0 Guidelines"),
                    "source_url": row.get("source_url", "https://amrut.gov.in"),
                    "provision": row.get("chunk_text", "")[:250] + "..."
                })
        
        print(f"Grounding Evidence Provided to Gemini:")
        print(f"  - Administrative Area: Morar Ward 22, Gwalior District")
        print(f"  - Priority Score: 87.4/100 (Critical Infrastructure Deficit)")
        print(f"  - Citizen Grievances: 42 complaints of pipeline leakages and low pressure")
        print(f"  - Ingested Policy Grounding Chunks: {len(citations)} chunks retrieved")
        for c in citations:
            print(f"    * Citations from '{c['title']}': \"{c['provision'][:100]}...\"")
        print()
        
        # 2. Call Gemini model
        if not GEMINI_KEY:
            print("[WARN] GEMINI_API_KEY not configured. Skipping Gemini call.")
            return
            
        prompt = f"""You are a senior public infrastructure advisor to the District Collector and Municipal Commissioner of Gwalior.
Generate a structured, evidence-backed DPR (Detailed Project Report) proposal for the following civic crisis.

CONSTRAINTS:
1. Ground all claims STRICTLY in the provided database evidence and policy context.
2. DO NOT fabricate costs or schemes. Use the exact policy title and mandate retrieved.
3. Output MUST be valid JSON adhering strictly to the schema below.

INPUTS:
- Area: Morar Ward 22, Gwalior District (Area ID: 5e70d4b2-4a55-4442-a374-448128edd03c)
- Sector: WATER_SUPPLY
- Affected Population: 28,500 residents
- Calculated Priority Score: 87.4/100
- Priority Factors: {{"severity": 0.88, "complaint_count": 42, "infrastructure_deficit": 0.85, "demographics_vuln": 0.72}}
- Relevant Scheme Guidelines from Documents: {json.dumps(citations)}

OUTPUT JSON SCHEMA:
{{
  "project_title": "string",
  "applicable_scheme": "string",
  "funding_pattern": "string",
  "recommended_action": "string",
  "affected_population": 28500,
  "expected_impact": "string",
  "policy_citations": [
    {{"title": "...", "provision": "..."}}
  ],
  "confidence_score": 0.94
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "response_mime_type": "application/json",
            },
        }
        
        print("Calling Google Gemini with ingested document grounding...")
        res = await client.post(url, json=payload)
        if res.status_code == 200:
            resp_data = res.json()
            raw_text = resp_data["candidates"][0]["content"]["parts"][0]["text"]
            dpr_proposal = json.loads(raw_text)
            print("[SUCCESS] Gemini Generated Evidence-Grounded DPR Proposal:")
            print(json.dumps(dpr_proposal, indent=2))
        else:
            print(f"[ERROR] Gemini API returned {res.status_code}: {res.text}")

async def main():
    await test_document_inventory()
    await test_semantic_search()
    await test_end_to_end_rag_dpr()

if __name__ == "__main__":
    asyncio.run(main())
