-- ==============================================================================
-- JanSetu AI — Database Migration Phase 4: PostGIS & Location Intelligence
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project-id>/sql
-- ==============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Administrative Area Type Enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_area_type') THEN
        CREATE TYPE admin_area_type AS ENUM ('STATE', 'DISTRICT', 'BLOCK', 'VILLAGE', 'WARD');
    END IF;
END $$;

-- 3. Administrative Areas Table (Hierarchical Boundaries)
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

-- Spatial and relational indexes on administrative_areas
CREATE INDEX IF NOT EXISTS idx_admin_areas_boundary ON public.administrative_areas USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_admin_areas_parent_id ON public.administrative_areas(parent_id);
CREATE INDEX IF NOT EXISTS idx_admin_areas_type ON public.administrative_areas(type);

-- Trigger for updated_at on administrative_areas
DROP TRIGGER IF EXISTS tr_admin_areas_updated_at ON public.administrative_areas;
CREATE TRIGGER tr_admin_areas_updated_at
    BEFORE UPDATE ON public.administrative_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- 4. Extend Complaints Table with Geospatial & Administrative References
ALTER TABLE public.complaints
    ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS location_point geography(Point, 4326),
    ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS block_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS ward_id UUID REFERENCES public.administrative_areas(id) ON DELETE SET NULL;

-- Spatial GIST index on complaint coordinates
CREATE INDEX IF NOT EXISTS idx_complaints_location_point ON public.complaints USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_complaints_district_id ON public.complaints(district_id);
CREATE INDEX IF NOT EXISTS idx_complaints_state_id ON public.complaints(state_id);

-- 5. Trigger to automatically keep location_point in sync with latitude & longitude
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

-- 6. Spatial Function: Nearby Complaints Radius Search
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

-- 7. Spatial Function: Point-in-Polygon Administrative Boundary Resolution
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

-- 8. Optional Clearly-Labelled DEMO Seed Data (For testing spatial containment)
-- A demo polygon boundary around Gwalior region
DO $$
DECLARE
    v_state_id UUID;
    v_district_id UUID;
BEGIN
    -- Only insert if DEMO DATA does not exist
    IF NOT EXISTS (SELECT 1 FROM public.administrative_areas WHERE code = 'DEMO_STATE_MP') THEN
        INSERT INTO public.administrative_areas (name, code, type, boundary)
        VALUES (
            'DEMO DATA - Madhya Pradesh',
            'DEMO_STATE_MP',
            'STATE',
            ST_Multi(ST_GeomFromText('POLYGON((74.0 21.0, 82.5 21.0, 82.5 27.0, 74.0 27.0, 74.0 21.0))', 4326))::geography
        ) RETURNING id INTO v_state_id;

        INSERT INTO public.administrative_areas (name, code, type, parent_id, boundary)
        VALUES (
            'DEMO DATA - Gwalior District',
            'DEMO_DIST_GWALIOR',
            'DISTRICT',
            v_state_id,
            ST_Multi(ST_GeomFromText('POLYGON((78.0 25.8, 78.5 25.8, 78.5 26.4, 78.0 26.4, 78.0 25.8))', 4326))::geography
        ) RETURNING id INTO v_district_id;

        INSERT INTO public.administrative_areas (name, code, type, parent_id, boundary)
        VALUES (
            'DEMO DATA - Gwalior Urban Ward 1',
            'DEMO_WARD_GWL_01',
            'WARD',
            v_district_id,
            ST_Multi(ST_GeomFromText('POLYGON((78.15 26.18, 78.22 26.18, 78.22 26.24, 78.15 26.24, 78.15 26.18))', 4326))::geography
        );
    END IF;
END $$;
