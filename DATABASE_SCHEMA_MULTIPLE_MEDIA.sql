-- Add support for multiple videos and PDFs per project
-- Run this in your Neon SQL Editor

-- Create project_media table to store multiple media files per project
CREATE TABLE IF NOT EXISTS project_media (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('video', 'pdf')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_key TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_type ON project_media(project_id, media_type);

-- Migrate existing media from projects table to project_media table
-- This will preserve your existing videos and PDFs
INSERT INTO project_media (project_id, media_type, title, url, display_order)
SELECT 
  id as project_id,
  'video' as media_type,
  title || ' - Video Demo' as title,
  video_url as url,
  0 as display_order
FROM projects 
WHERE video_url IS NOT NULL AND video_url != '';

INSERT INTO project_media (project_id, media_type, title, url, file_key, display_order)
SELECT 
  id as project_id,
  'pdf' as media_type,
  title || ' - Documentation' as title,
  pdf_url as url,
  pdf_file_key as file_key,
  0 as display_order
FROM projects 
WHERE pdf_url IS NOT NULL AND pdf_url != '';

-- Optional: Keep old columns for backward compatibility or remove them
-- If you want to remove the old columns (recommended after migration):
-- ALTER TABLE projects DROP COLUMN IF EXISTS video_url;
-- ALTER TABLE projects DROP COLUMN IF EXISTS pdf_url;
-- ALTER TABLE projects DROP COLUMN IF EXISTS pdf_file_key;

-- To keep them for backward compatibility, you can leave them as is
-- The API will prioritize project_media table over these columns
