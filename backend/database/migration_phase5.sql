-- ==============================================================================
-- JanSetu AI — Database Migration Phase 5: Government Data Integration & Data Fusion
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project-id>/sql
-- ==============================================================================

-- 1. Custom Enum Types
ALTER TYPE complaint_category ADD VALUE IF NOT EXISTS 'AGRICULTURE';
ALTER TYPE complaint_category ADD VALUE IF NOT EXISTS 'DIGITAL_CONNECTIVITY';

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

-- 2. Data Sources Registry (Dataset Provenance & Lineage)
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

-- 3. Data Import Jobs Table (Audit Tracking & Execution Logs)
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

-- 4. Staging Records Table (Safe Ingestion Pattern)
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

-- 5. Demographic Data Table
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

-- 6. Infrastructure Data Table
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

-- 7. Public Investment Data Table
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
CREATE INDEX IF NOT EXISTS idx_investment_status ON public.investment_data(project_status);

-- 8. Data Fusion Stored Procedure
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
    -- 1. Area basic details
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

    -- 2. Demographics (Latest data year)
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

    -- 3. Citizen Demand (Complaints aggregated by area & sector)
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

    -- 4. Infrastructure summary
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

    -- 5. Investment summary
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

    -- 6. Combine into Data Fusion contract
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

-- 9. Clearly Labelled DEMO Seed Data (For Testing Data Fusion)
DO $$
DECLARE
    v_source_demo_id UUID;
    v_source_gov_id UUID;
    v_job_id UUID;
    v_area_gwalior UUID;
BEGIN
    -- Ensure Gwalior district exists in administrative_areas
    SELECT id INTO v_area_gwalior FROM public.administrative_areas WHERE code = 'DEMO_DIST_GWALIOR' LIMIT 1;
    
    IF v_area_gwalior IS NULL THEN
        INSERT INTO public.administrative_areas (name, code, type, boundary)
        VALUES (
            'DEMO DATA - Gwalior District',
            'DEMO_DIST_GWALIOR',
            'DISTRICT',
            ST_Multi(ST_GeomFromText('POLYGON((78.0 25.8, 78.5 25.8, 78.5 26.4, 78.0 26.4, 78.0 25.8))', 4326))::geography
        ) RETURNING id INTO v_area_gwalior;
    END IF;

    -- Data Sources
    IF NOT EXISTS (SELECT 1 FROM public.data_sources WHERE name = 'Census of India (DEMO DATA)') THEN
        INSERT INTO public.data_sources (name, organization, dataset_type, source_url, description)
        VALUES (
            'Census of India (DEMO DATA)',
            'Office of the Registrar General & Census Commissioner',
            'DEMOGRAPHIC',
            'https://censusindia.gov.in',
            'Simulated demographic statistics for testing data ingestion pipelines.'
        ) RETURNING id INTO v_source_demo_id;

        INSERT INTO public.data_sources (name, organization, dataset_type, source_url, description)
        VALUES (
            'Ministry of Jal Shakti (DEMO DATA)',
            'Department of Drinking Water and Sanitation',
            'INFRASTRUCTURE',
            'https://jaljeevanmission.gov.in',
            'Simulated rural and urban water supply infrastructure metrics.'
        ) RETURNING id INTO v_source_gov_id;

        -- Import Job record
        INSERT INTO public.data_import_jobs (data_source_id, dataset_type, file_name, status, records_received, records_valid, records_rejected)
        VALUES (
            v_source_demo_id,
            'DEMOGRAPHIC',
            'demo_gwalior_census_2023.csv',
            'COMPLETED',
            1, 1, 0
        ) RETURNING id INTO v_job_id;

        -- Seed Demographics
        INSERT INTO public.demographic_data (
            administrative_area_id, data_source_id, import_job_id,
            population, male_population, female_population, households,
            population_density, literacy_rate, data_year, source
        ) VALUES (
            v_area_gwalior, v_source_demo_id, v_job_id,
            2032036, 1090161, 941875, 412500,
            440.0, 77.9, 2023, 'Census of India (DEMO DATA)'
        );

        -- Seed Infrastructure
        INSERT INTO public.infrastructure_data (
            administrative_area_id, data_source_id, sector,
            asset_type, asset_count, coverage_value, capacity_value,
            condition_score, access_score, data_year, source
        ) VALUES
        (v_area_gwalior, v_source_gov_id, 'WATER', 'Water Treatment Plants & Distribution', 18, 64.5, 185000.0, 72.0, 68.0, 2023, 'Jal Jeevan Mission (DEMO DATA)'),
        (v_area_gwalior, v_source_gov_id, 'ROADS', 'Paved Road Network (km)', 1240, 78.0, 3500.0, 65.0, 74.0, 2023, 'PWD Madhya Pradesh (DEMO DATA)'),
        (v_area_gwalior, v_source_gov_id, 'HEALTHCARE', 'Primary Health Centres & District Hospitals', 42, 82.0, 1450.0, 70.0, 75.0, 2023, 'National Health Mission (DEMO DATA)');

        -- Seed Investment
        INSERT INTO public.investment_data (
            administrative_area_id, data_source_id, sector,
            project_name, project_type, allocated_amount, spent_amount,
            project_status, financial_year, source
        ) VALUES
        (v_area_gwalior, v_source_gov_id, 'WATER', 'Urban Water Supply Augmentation Scheme', 'Infrastructure Upgrade', 45000000.00, 31500000.00, 'ONGOING', '2023-2024', 'State Plan (DEMO DATA)'),
        (v_area_gwalior, v_source_gov_id, 'ROADS', 'Smart City Ring Road Phase 2', 'Road Construction', 85000000.00, 72000000.00, 'COMPLETED', '2023-2024', 'State PWD (DEMO DATA)'),
        (v_area_gwalior, v_source_gov_id, 'SANITATION', 'Solid Waste Management Facility', 'Waste Management', 22000000.00, 9500000.00, 'ONGOING', '2023-2024', 'Swachh Bharat Urban (DEMO DATA)');
    END IF;
END $$;
