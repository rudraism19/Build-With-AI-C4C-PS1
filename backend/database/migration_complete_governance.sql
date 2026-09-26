-- ==============================================================================
-- JanSetu AI — Complete Governance Intelligence Migration
-- (Hotspots, Priorities, Policy RAG, Recommendations, Policymaker & Audit)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project-id>/sql
-- ==============================================================================

-- 1. Enable Vector Extension (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Extend User Roles for Granular Jurisdiction Security
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'DISTRICT_OFFICER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'STATE_ADMIN';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'DEPARTMENT_OFFICER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ANALYST';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

-- 3. Custom Enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hotspot_status_enum') THEN
        CREATE TYPE hotspot_status_enum AS ENUM ('ACTIVE', 'INVESTIGATING', 'RESOLVED', 'ARCHIVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recommendation_status_enum') THEN
        CREATE TYPE recommendation_status_enum AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'policy_doc_status_enum') THEN
        CREATE TYPE policy_doc_status_enum AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');
    END IF;
END $$;

-- 4. Jurisdiction Security Columns on Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS jurisdiction_type TEXT DEFAULT 'ALL';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS jurisdiction_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;

-- 5. Hotspots Table (Spatial Clusters of Citizen Demand)
CREATE TABLE IF NOT EXISTS public.hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category complaint_category NOT NULL,
    center_point geometry(Point, 4326),
    geometry geometry(Geometry, 4326),
    complaint_count INTEGER NOT NULL DEFAULT 0,
    validated_complaint_count INTEGER NOT NULL DEFAULT 0,
    affected_population BIGINT DEFAULT 0,
    demand_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    severity_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    administrative_area_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status hotspot_status_enum NOT NULL DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hotspots_category ON public.hotspots(category);
CREATE INDEX IF NOT EXISTS idx_hotspots_status ON public.hotspots(status);
CREATE INDEX IF NOT EXISTS idx_hotspots_area_id ON public.hotspots(administrative_area_id);
CREATE INDEX IF NOT EXISTS idx_hotspots_center_point ON public.hotspots USING GIST(center_point);
CREATE INDEX IF NOT EXISTS idx_hotspots_geometry ON public.hotspots USING GIST(geometry);

-- 6. Priority Scores Table (Deterministic, Explainable Scoring Engine)
CREATE TABLE IF NOT EXISTS public.priority_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotspot_id UUID REFERENCES public.hotspots(id) ON DELETE CASCADE,
    area_id UUID REFERENCES public.administrative_areas(id) ON DELETE CASCADE,
    category complaint_category NOT NULL,
    demand_score DOUBLE PRECISION NOT NULL CHECK (demand_score >= 0 AND demand_score <= 100),
    infrastructure_gap DOUBLE PRECISION NOT NULL CHECK (infrastructure_gap >= 0 AND infrastructure_gap <= 100),
    population_impact DOUBLE PRECISION NOT NULL CHECK (population_impact >= 0 AND population_impact <= 100),
    development_deficit DOUBLE PRECISION NOT NULL CHECK (development_deficit >= 0 AND development_deficit <= 100),
    investment_gap DOUBLE PRECISION NOT NULL CHECK (investment_gap >= 0 AND investment_gap <= 100),
    priority_score DOUBLE PRECISION NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
    rank_context JSONB DEFAULT '{}'::jsonb,
    calculation_version TEXT NOT NULL DEFAULT 'v1.0',
    explanation JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_priority_scores_hotspot ON public.priority_scores(hotspot_id);
CREATE INDEX IF NOT EXISTS idx_priority_scores_area ON public.priority_scores(area_id);
CREATE INDEX IF NOT EXISTS idx_priority_scores_score ON public.priority_scores(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_priority_scores_category ON public.priority_scores(category);

-- 7. Policy Documents Table (Knowledge Base for Governance Guidelines & Schemes)
CREATE TABLE IF NOT EXISTS public.policy_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT,
    document_type TEXT,
    description TEXT,
    source_url TEXT,
    document_date DATE,
    language VARCHAR(10) DEFAULT 'en',
    version TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status policy_doc_status_enum NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_policy_docs_department ON public.policy_documents(department);
CREATE INDEX IF NOT EXISTS idx_policy_docs_status ON public.policy_documents(status);

-- 8. Policy Chunks Table (Semantic Vector Store using pgvector)
CREATE TABLE IF NOT EXISTS public.policy_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.policy_documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding vector(768),
    chunk_index INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_policy_chunks_doc_id ON public.policy_chunks(document_id);

-- 9. AI Development Recommendations Table
CREATE TABLE IF NOT EXISTS public.development_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotspot_id UUID REFERENCES public.hotspots(id) ON DELETE SET NULL,
    priority_score_id UUID REFERENCES public.priority_scores(id) ON DELETE SET NULL,
    sector complaint_category NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    recommended_action TEXT NOT NULL,
    affected_population BIGINT DEFAULT 0,
    estimated_impact TEXT NOT NULL,
    evidence JSONB DEFAULT '[]'::jsonb,
    policy_context JSONB DEFAULT '[]'::jsonb,
    policy_sources JSONB DEFAULT '[]'::jsonb,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    assumptions JSONB DEFAULT '[]'::jsonb,
    data_sources JSONB DEFAULT '[]'::jsonb,
    status recommendation_status_enum NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_recommendations_sector ON public.development_recommendations(sector);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON public.development_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_recommendations_hotspot ON public.development_recommendations(hotspot_id);

-- 10. Audit Logs Table (Security, Transparency & Traceability)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- 11. Stored Procedure: Policy Semantic Search (pgvector Cosine Similarity)
CREATE OR REPLACE FUNCTION match_policy_chunks(
    query_embedding vector(768),
    match_threshold DOUBLE PRECISION DEFAULT 0.5,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_text TEXT,
    similarity DOUBLE PRECISION,
    title TEXT,
    department TEXT,
    source_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.id,
        pc.document_id,
        pc.chunk_text,
        ROUND((1 - (pc.embedding <=> query_embedding))::numeric, 4)::DOUBLE PRECISION AS similarity,
        pd.title,
        pd.department,
        pd.source_url
    FROM public.policy_chunks pc
    JOIN public.policy_documents pd ON pd.id = pc.document_id
    WHERE pc.embedding IS NOT NULL
      AND (1 - (pc.embedding <=> query_embedding)) >= match_threshold
    ORDER BY pc.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;

-- 12. Clearly Labelled DEMO Seed Data (For Testing Governance Intelligence)
DO $$
DECLARE
    v_area_gwalior UUID;
    v_hotspot_id UUID := 'b1000000-0000-0000-0000-000000000001';
    v_priority_id UUID := 'c1000000-0000-0000-0000-000000000001';
    v_policy_id UUID := 'd1000000-0000-0000-0000-000000000001';
BEGIN
    SELECT id INTO v_area_gwalior FROM public.administrative_areas WHERE code = 'GWL-DIST' LIMIT 1;
    IF v_area_gwalior IS NULL THEN
        SELECT id INTO v_area_gwalior FROM public.administrative_areas WHERE code = 'DEMO_DIST_GWALIOR' LIMIT 1;
    END IF;
    IF v_area_gwalior IS NULL THEN
        SELECT id INTO v_area_gwalior FROM public.administrative_areas LIMIT 1;
    END IF;

    -- 12.1 Sample Hotspot
    INSERT INTO public.hotspots (
        id, name, category, center_point, geometry, complaint_count, validated_complaint_count,
        affected_population, demand_score, severity_score, confidence, administrative_area_id, status, metadata
    ) VALUES (
        v_hotspot_id,
        'Morar-Thatipur Drinking Water Scarcity Cluster [DEMO DATA]',
        'WATER',
        ST_SetSRID(ST_MakePoint(78.2150, 26.2250), 4326),
        ST_SetSRID(ST_Buffer(ST_MakePoint(78.2150, 26.2250)::geography, 1500)::geometry, 4326),
        18,
        16,
        45000,
        82.5,
        78.0,
        0.92,
        v_area_gwalior,
        'ACTIVE',
        '{"detection_method": "PostGIS Spatial Clustering", "note": "DEMO DATA"}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET updated_at = now();

    -- 12.2 Sample Priority Score
    INSERT INTO public.priority_scores (
        id, hotspot_id, area_id, category, demand_score, infrastructure_gap, population_impact,
        development_deficit, investment_gap, priority_score, rank_context, calculation_version, explanation
    ) VALUES (
        v_priority_id,
        v_hotspot_id,
        v_area_gwalior,
        'WATER',
        82.5,  -- 0.30 * 82.5 = 24.75
        75.0,  -- 0.25 * 75.0 = 18.75
        70.0,  -- 0.20 * 70.0 = 14.00
        80.0,  -- 0.15 * 80.0 = 12.00
        65.0,  -- 0.10 * 65.0 = 6.50
        76.0,  -- Total = 76.00
        '{"rank": 1, "total_ranked": 5, "scope": "DISTRICT"}'::jsonb,
        'v1.0',
        '["High validated citizen demand for piped drinking water (82.5/100)", "Local water treatment capacity deficit of 35% compared to demand benchmark", "Affects over 45,000 citizens in Morar Ward cluster", "No active capital expenditure recorded in current fiscal cycle"]'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET updated_at = now();

    -- 12.3 Sample Policy Document
    INSERT INTO public.policy_documents (
        id, title, department, document_type, description, source_url, document_date, language, version, content, metadata
    ) VALUES (
        v_policy_id,
        'Jal Jeevan Mission Guidelines for Urban and Peri-Urban Water Security (Operational Directives) [DEMO DATA]',
        'Ministry of Jal Shakti / Public Health Engineering',
        'NATIONAL_SCHEME_GUIDELINES',
        'Framework for community piped water supply, pressure augmentation, and asset coverage standards in urban fringe blocks.',
        'https://jaljeevanmission.gov.in/guidelines-demo',
        '2023-04-01',
        'en',
        '2.1',
        'Under Jal Jeevan Mission (Har Ghar Jal), priorities are mandated for areas with less than 70% tap connection coverage and areas experiencing intermittent supply (<2 hours daily). Financial assistance up to 60% central grant is applicable for piped distribution network augmentation. Local bodies must ensure water quality monitoring at delivery endpoints.',
        '{"scheme_code": "JJM-URBAN-2024", "benchmark_lpcd": 135, "is_demo": true}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET updated_at = now();

    -- 12.4 Sample Policy Chunk (embedding is populated on-demand by FastAPI AI service)
    INSERT INTO public.policy_chunks (
        id, document_id, chunk_text, chunk_index, metadata
    ) VALUES (
        'e1000000-0000-0000-0000-000000000001',
        v_policy_id,
        'Under Jal Jeevan Mission, priorities are mandated for areas with less than 70% tap connection coverage. Financial assistance up to 60% central grant is applicable for piped distribution network augmentation. Local bodies must ensure water quality monitoring at delivery endpoints.',
        0,
        '{"section": "Eligibility and Priority Norms", "scheme": "Jal Jeevan Mission", "is_demo": true}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- 12.5 Sample Development Recommendation
    INSERT INTO public.development_recommendations (
        id, hotspot_id, priority_score_id, sector, title, description, recommended_action,
        affected_population, estimated_impact, evidence, policy_context, policy_sources,
        confidence, assumptions, data_sources, status
    ) VALUES (
        'f1000000-0000-0000-0000-000000000001',
        v_hotspot_id,
        v_priority_id,
        'WATER',
        'Accelerate Secondary Piped Water Augmentation in Morar-Thatipur Corridor [DEMO DATA]',
        'Piped distribution network in Morar sub-district suffers severe pressure drop and leakage, leading to acute citizen distress during peak summer hours.',
        'Sanction emergency pipeline replacement of 4.2 km feeder line and interconnect with Thatipur booster pumping station under AMRUT 2.0 / Jal Jeevan scheme.',
        45000,
        'High — Restores reliable drinking water supply (135 LPCD) to 11,200 households and eliminates 80%+ of local water contamination grievances.',
        '["18 localized citizen complaints verified by field officers", "Coverage score 58% vs district benchmark 78%", "Priority score 76.0 (Rank 1 in Gwalior District)"]'::jsonb,
        '[{"scheme": "Jal Jeevan Mission Guidelines (DEMO DATA)", "provision": "Eligible for 60% capital grant for distribution augmentation"}]'::jsonb,
        '["https://jaljeevanmission.gov.in/guidelines-demo"]'::jsonb,
        0.91,
        '["Groundwater table depth remains within operational threshold", "Right-of-way permissions obtainable within 14 days"]'::jsonb,
        '["Gwalior District Demographics 2023 [DEMO DATA]", "JanSetu AI Citizen Demand Aggregation", "Public Health Engineering Infrastructure Register 2024"]'::jsonb,
        'SUBMITTED'
    ) ON CONFLICT (id) DO UPDATE SET updated_at = now();

    -- 12.6 Sample Audit Log
    INSERT INTO public.audit_logs (
        action, resource_type, resource_id, ip_address, metadata
    ) VALUES (
        'INITIALIZE_GOVERNANCE_SYSTEM',
        'SYSTEM',
        'phase6-final',
        '127.0.0.1',
        '{"event": "Governance intelligence schemas & demo baseline initialized", "is_demo": true}'::jsonb
    );
END $$;
