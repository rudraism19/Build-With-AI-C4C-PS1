-- ==============================================================================
-- JanSetu AI — Database Migration Phase 3: AI Processing Fields
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project-id>/sql
-- ==============================================================================

-- 1. Create AI Processing Status ENUM if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_processing_status') THEN
        CREATE TYPE ai_processing_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
    END IF;
END $$;

-- 2. Add AI Processing Columns to public.complaints
ALTER TABLE public.complaints
    ADD COLUMN IF NOT EXISTS ai_status ai_processing_status NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS ai_category TEXT,
    ADD COLUMN IF NOT EXISTS ai_severity TEXT,
    ADD COLUMN IF NOT EXISTS ai_summary TEXT,
    ADD COLUMN IF NOT EXISTS ai_language TEXT,
    ADD COLUMN IF NOT EXISTS ai_confidence DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS ai_entities JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMPTZ;

-- 3. Create Index on ai_status for efficient filtering
CREATE INDEX IF NOT EXISTS idx_complaints_ai_status ON public.complaints(ai_status);
