-- Add PDF support to projects table
-- Run this in your Neon SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_file_key TEXT;

-- Update existing projects to have null values for new fields
UPDATE projects 
SET pdf_url = NULL, pdf_file_key = NULL 
WHERE pdf_url IS NULL AND pdf_file_key IS NULL;
