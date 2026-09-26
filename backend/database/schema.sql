-- ==============================================================================
-- JanSetu AI — Database Schema Migration (Phase 1)
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project-id>/sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Custom ENUM Types (or CHECK constraints)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('CITIZEN', 'POLICYMAKER');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_category') THEN
        CREATE TYPE complaint_category AS ENUM (
            'WATER',
            'ROADS',
            'ELECTRICITY',
            'SANITATION',
            'HEALTHCARE',
            'EDUCATION',
            'TRANSPORT',
            'DIGITAL_CONNECTIVITY',
            'AGRICULTURE',
            'OTHER'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_severity') THEN
        CREATE TYPE complaint_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_status') THEN
        CREATE TYPE complaint_status AS ENUM ('PENDING');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_processing_status') THEN
        CREATE TYPE ai_processing_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_area_type') THEN
        CREATE TYPE admin_area_type AS ENUM ('STATE', 'DISTRICT', 'BLOCK', 'VILLAGE', 'WARD');
    END IF;
END $$;

-- 3. Users Profile Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by auth_user_id
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 4. Administrative Areas Table (Hierarchical Geospatial Boundaries)
CREATE TABLE IF NOT EXISTS public.administrative_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    type admin_area_type NOT NULL,
    parent_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    boundary geography(MultiPolygon, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_admin_areas_boundary ON public.administrative_areas USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_admin_areas_parent_id ON public.administrative_areas(parent_id);
CREATE INDEX IF NOT EXISTS idx_admin_areas_type ON public.administrative_areas(type);

-- 5. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category complaint_category NOT NULL,
    severity complaint_severity NOT NULL,
    status complaint_status NOT NULL DEFAULT 'PENDING',
    ai_status ai_processing_status NOT NULL DEFAULT 'PENDING',
    ai_category TEXT,
    ai_severity TEXT,
    ai_summary TEXT,
    ai_language TEXT,
    ai_confidence DOUBLE PRECISION,
    ai_entities JSONB DEFAULT '{}'::jsonb,
    ai_processed_at TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_point geography(Point, 4326),
    state_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    district_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    block_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    village_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_ai_status ON public.complaints(ai_status);
CREATE INDEX IF NOT EXISTS idx_complaints_location_point ON public.complaints USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_complaints_district_id ON public.complaints(district_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);

-- 5. Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_users_updated_at ON public.users;
CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS tr_complaints_updated_at ON public.complaints;
CREATE TRIGGER tr_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- Trigger for updated_at on administrative_areas
DROP TRIGGER IF EXISTS tr_admin_areas_updated_at ON public.administrative_areas;
CREATE TRIGGER tr_admin_areas_updated_at
    BEFORE UPDATE ON public.administrative_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- Automatically keep location_point in sync with latitude & longitude
CREATE OR REPLACE FUNCTION update_complaint_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    ELSE
        NEW.location_point = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_complaints_location_point ON public.complaints;
CREATE TRIGGER tr_complaints_location_point
    BEFORE INSERT OR UPDATE OF latitude, longitude ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_complaint_location_point();

-- 6. Spatial Functions: Radius Search & Point-in-Polygon Resolution
CREATE OR REPLACE FUNCTION get_nearby_complaints(
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_radius_meters DOUBLE PRECISION DEFAULT 5000,
    p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title VARCHAR(200),
    description TEXT,
    category complaint_category,
    severity complaint_severity,
    status complaint_status,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION,
    created_at TIMESTAMPTZ,
    ai_status ai_processing_status,
    ai_category TEXT,
    ai_severity TEXT,
    ai_summary TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    query_point geography := ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography;
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.user_id,
        c.title,
        c.description,
        c.category,
        c.severity,
        c.status,
        c.latitude,
        c.longitude,
        ROUND(ST_Distance(c.location_point, query_point)::numeric, 2)::DOUBLE PRECISION AS distance_meters,
        c.created_at,
        c.ai_status,
        c.ai_category,
        c.ai_severity,
        c.ai_summary
    FROM public.complaints c
    WHERE c.location_point IS NOT NULL
      AND ST_DWithin(c.location_point, query_point, p_radius_meters)
      AND (p_category IS NULL OR c.category::TEXT = p_category OR c.ai_category = p_category)
    ORDER BY ST_Distance(c.location_point, query_point) ASC;
END;
$$;

CREATE OR REPLACE FUNCTION resolve_administrative_areas(
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    code TEXT,
    type admin_area_type,
    parent_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    point_geom geometry := ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326);
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.name,
        a.code,
        a.type,
        a.parent_id
    FROM public.administrative_areas a
    WHERE a.boundary IS NOT NULL
      AND ST_Contains(a.boundary::geometry, point_geom);
END;
$$;

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Users policies:
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Complaints policies:
-- Citizens can view their own complaints
CREATE POLICY "Citizens can view own complaints"
    ON public.complaints
    FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_user_id = auth.uid()
        )
    );

-- Citizens can insert their own complaints
CREATE POLICY "Citizens can insert own complaints"
    ON public.complaints
    FOR INSERT
    WITH CHECK (
        user_id IN (
            SELECT id FROM public.users WHERE auth_user_id = auth.uid()
        )
    );

-- Note: The NestJS backend uses the Supabase service_role key for administrative queries,
-- which bypasses RLS safely after applying controller and service validation layers.

-- ==============================================================================
-- 8. Phase 5: Government Data Integration & Data Fusion
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dataset_type_enum') THEN
        CREATE TYPE dataset_type_enum AS ENUM ('DEMOGRAPHIC', 'INFRASTRUCTURE', 'INVESTMENT', 'BOUNDARY', 'OTHER');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_source_status_enum') THEN
        CREATE TYPE data_source_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_VALIDATION');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'import_job_status_enum') THEN
        CREATE TYPE import_job_status_enum AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_enum') THEN
        CREATE TYPE project_status_enum AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    dataset_type dataset_type_enum NOT NULL,
    source_url TEXT,
    description TEXT,
    last_updated TIMESTAMPTZ,
    license TEXT DEFAULT 'Government Open Data License - India (GODL)',
    status data_source_status_enum NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_data_sources_type ON public.data_sources(dataset_type);
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON public.data_sources(status);

CREATE TABLE IF NOT EXISTS public.data_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    dataset_type dataset_type_enum NOT NULL,
    file_name TEXT NOT NULL,
    status import_job_status_enum NOT NULL DEFAULT 'PENDING',
    records_received INTEGER NOT NULL DEFAULT 0,
    records_valid INTEGER NOT NULL DEFAULT 0,
    records_rejected INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    validation_report JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.data_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_data_source ON public.data_import_jobs(data_source_id);

CREATE TABLE IF NOT EXISTS public.data_staging_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID NOT NULL REFERENCES public.data_import_jobs(id) ON DELETE CASCADE,
    raw_data JSONB NOT NULL,
    row_index INTEGER NOT NULL,
    is_valid BOOLEAN NOT NULL DEFAULT true,
    validation_errors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_staging_job_id ON public.data_staging_records(import_job_id);

CREATE TABLE IF NOT EXISTS public.demographic_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    administrative_area_id UUID NOT NULL REFERENCES public.administrative_areas(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    import_job_id UUID REFERENCES public.data_import_jobs(id) ON DELETE SET NULL,
    population BIGINT CHECK (population >= 0),
    male_population BIGINT CHECK (male_population >= 0),
    female_population BIGINT CHECK (female_population >= 0),
    households BIGINT CHECK (households >= 0),
    population_density DOUBLE PRECISION CHECK (population_density >= 0),
    literacy_rate DOUBLE PRECISION CHECK (literacy_rate >= 0 AND literacy_rate <= 100),
    data_year INTEGER NOT NULL,
    source TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_demographic_area_year UNIQUE (administrative_area_id, data_year)
);

CREATE INDEX IF NOT EXISTS idx_demographic_area ON public.demographic_data(administrative_area_id);
CREATE INDEX IF NOT EXISTS idx_demographic_year ON public.demographic_data(data_year);

CREATE TABLE IF NOT EXISTS public.infrastructure_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    administrative_area_id UUID NOT NULL REFERENCES public.administrative_areas(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    import_job_id UUID REFERENCES public.data_import_jobs(id) ON DELETE SET NULL,
    sector complaint_category NOT NULL,
    asset_type TEXT NOT NULL,
    asset_count INTEGER NOT NULL DEFAULT 0 CHECK (asset_count >= 0),
    coverage_value DOUBLE PRECISION CHECK (coverage_value >= 0),
    capacity_value DOUBLE PRECISION CHECK (capacity_value >= 0),
    condition_score DOUBLE PRECISION CHECK (condition_score >= 0 AND condition_score <= 100),
    access_score DOUBLE PRECISION CHECK (access_score >= 0 AND access_score <= 100),
    data_year INTEGER NOT NULL,
    source TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_infra_area ON public.infrastructure_data(administrative_area_id);
CREATE INDEX IF NOT EXISTS idx_infra_sector ON public.infrastructure_data(sector);
CREATE INDEX IF NOT EXISTS idx_infra_year ON public.infrastructure_data(data_year);

CREATE TABLE IF NOT EXISTS public.investment_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    administrative_area_id UUID NOT NULL REFERENCES public.administrative_areas(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    import_job_id UUID REFERENCES public.data_import_jobs(id) ON DELETE SET NULL,
    sector complaint_category NOT NULL,
    project_name TEXT NOT NULL,
    project_type TEXT,
    allocated_amount NUMERIC(15, 2) NOT NULL CHECK (allocated_amount >= 0),
    spent_amount NUMERIC(15, 2) NOT NULL CHECK (spent_amount >= 0 AND spent_amount <= allocated_amount),
    project_status project_status_enum NOT NULL DEFAULT 'PLANNED',
    financial_year VARCHAR(10) NOT NULL,
    source TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_investment_area ON public.investment_data(administrative_area_id);
CREATE INDEX IF NOT EXISTS idx_investment_sector ON public.investment_data(sector);
CREATE INDEX IF NOT EXISTS idx_investment_fin_year ON public.investment_data(financial_year);

CREATE OR REPLACE FUNCTION get_area_data_fusion(
    p_area_id UUID,
    p_sector TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_area JSONB;
    v_demo JSONB;
    v_demand JSONB;
    v_infra JSONB;
    v_invest JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', a.id,
        'name', a.name,
        'code', a.code,
        'type', a.type
    ) INTO v_area
    FROM public.administrative_areas a
    WHERE a.id = p_area_id;

    IF v_area IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_build_object(
        'population', COALESCE(d.population, 0),
        'male_population', d.male_population,
        'female_population', d.female_population,
        'households', d.households,
        'population_density', d.population_density,
        'literacy_rate', d.literacy_rate,
        'data_year', d.data_year,
        'source', d.source
    ) INTO v_demo
    FROM public.demographic_data d
    WHERE d.administrative_area_id = p_area_id
    ORDER BY d.data_year DESC
    LIMIT 1;

    IF v_demo IS NULL THEN
        v_demo := jsonb_build_object(
            'population', 0,
            'male_population', null,
            'female_population', null,
            'households', null,
            'population_density', null,
            'literacy_rate', null,
            'data_year', null,
            'source', null
        );
    END IF;

    SELECT jsonb_build_object(
        'total_complaints', COUNT(*),
        'critical_count', COUNT(*) FILTER (WHERE c.severity = 'CRITICAL' OR c.ai_severity = 'CRITICAL'),
        'high_count', COUNT(*) FILTER (WHERE c.severity = 'HIGH' OR c.ai_severity = 'HIGH'),
        'medium_count', COUNT(*) FILTER (WHERE c.severity = 'MEDIUM' OR c.ai_severity = 'MEDIUM'),
        'low_count', COUNT(*) FILTER (WHERE c.severity = 'LOW' OR c.ai_severity = 'LOW')
    ) INTO v_demand
    FROM public.complaints c
    WHERE (c.district_id = p_area_id OR c.state_id = p_area_id OR c.block_id = p_area_id OR c.ward_id = p_area_id)
      AND (p_sector IS NULL OR c.category::TEXT = p_sector OR c.ai_category = p_sector);

    SELECT jsonb_build_object(
        'total_assets', COALESCE(SUM(inf.asset_count), 0),
        'avg_coverage', ROUND(AVG(inf.coverage_value)::numeric, 2),
        'total_capacity', COALESCE(SUM(inf.capacity_value), 0),
        'avg_condition_score', ROUND(AVG(inf.condition_score)::numeric, 2),
        'avg_access_score', ROUND(AVG(inf.access_score)::numeric, 2)
    ) INTO v_infra
    FROM public.infrastructure_data inf
    WHERE inf.administrative_area_id = p_area_id
      AND (p_sector IS NULL OR inf.sector::TEXT = p_sector);

    SELECT jsonb_build_object(
        'total_allocated', COALESCE(SUM(inv.allocated_amount), 0),
        'total_spent', COALESCE(SUM(inv.spent_amount), 0),
        'project_count', COUNT(*),
        'completed_projects', COUNT(*) FILTER (WHERE inv.project_status = 'COMPLETED'),
        'ongoing_projects', COUNT(*) FILTER (WHERE inv.project_status = 'ONGOING')
    ) INTO v_invest
    FROM public.investment_data inv
    WHERE inv.administrative_area_id = p_area_id
      AND (p_sector IS NULL OR inv.sector::TEXT = p_sector);

    RETURN jsonb_build_object(
        'area', v_area,
        'sector', COALESCE(p_sector, 'ALL'),
        'demographics', v_demo,
        'citizen_demand', v_demand,
        'infrastructure', v_infra,
        'investment', v_invest,
        'fused_at', timezone('utc'::text, now())
    );
END;
$$;

-- 10. Enable Vector Extension (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- 11. Extend User Roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'DISTRICT_OFFICER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'STATE_ADMIN';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'DEPARTMENT_OFFICER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ANALYST';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

-- 12. Additional Enums
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

-- 13. Jurisdiction Columns on Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS jurisdiction_type TEXT DEFAULT 'ALL';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS jurisdiction_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;

-- 14. Hotspots Table
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

-- 15. Priority Scores Table
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

-- 16. Policy Documents Table
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

-- 17. Policy Chunks Table (Vector Store)
CREATE TABLE IF NOT EXISTS public.policy_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.policy_documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding vector(768),
    chunk_index INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. Development Recommendations Table
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

-- 19. Audit Logs Table
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

-- 20. Stored Procedure: Policy Semantic Search (pgvector Cosine Similarity)
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


