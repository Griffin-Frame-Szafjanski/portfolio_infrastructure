-- Migration: Remove description column from skills table
-- Run this in your Neon SQL Editor

-- Remove description column from skills table
ALTER TABLE skills DROP COLUMN IF EXISTS description;

-- Verification: Check the skills table structure
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'skills';
