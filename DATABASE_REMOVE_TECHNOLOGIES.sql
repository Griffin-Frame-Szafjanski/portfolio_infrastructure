-- Migration: Remove old technologies/tech_stack columns from projects table
-- Run this after Phase 2 is complete and all projects have been migrated to use skills

-- Remove the technologies and tech_stack columns (they're redundant now)
ALTER TABLE projects DROP COLUMN IF EXISTS technologies;
ALTER TABLE projects DROP COLUMN IF EXISTS tech_stack;

-- Verification query to check the table structure
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'projects' 
-- ORDER BY ordinal_position;
