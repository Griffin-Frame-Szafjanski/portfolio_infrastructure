-- Complete Database Schema for Portfolio
-- Run this in your Neon SQL Editor to create all tables

-- Drop existing tables if recreating (CAUTION: This deletes all data!)
-- Uncomment the lines below only if you want to start fresh
-- DROP TABLE IF EXISTS project_media CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS biography CASCADE;

-- ============================================
-- Biography Table
-- ============================================
CREATE TABLE IF NOT EXISTS biography (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  title VARCHAR(255),
  bio TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  linkedin_url TEXT,
  github_url TEXT,
  resume_url TEXT,
  resume_pdf_url TEXT,
  profile_photo_url TEXT,
  photo_file_key TEXT DEFAULT '/assets/placeholder-avatar.svg',
  resume_file_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Projects Table (WITHOUT video/PDF fields)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  tech_stack TEXT,
  technologies TEXT,
  project_url TEXT,
  github_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Project Media Table (for videos and PDFs)
-- ============================================
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_type ON project_media(project_id, media_type);

-- ============================================
-- Contact Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Insert Default Biography
-- ============================================
INSERT INTO biography (full_name, title, bio, email, phone, location)
VALUES (
  'Your Name',
  'Full-Stack Developer',
  'Passionate developer with experience in building scalable web applications.',
  'your.email@example.com',
  '+1234567890',
  'City, Country'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Sample Projects
-- ============================================
INSERT INTO projects (title, description, long_description, tech_stack, technologies, project_url, github_url, display_order, featured)
VALUES
  (
    'Portfolio Website',
    'A modern portfolio website built with Next.js and deployed on Vercel.',
    'This is a full-stack portfolio application featuring a modern design, admin dashboard for content management, contact form with email notifications, and responsive layout optimized for all devices.',
    'Next.js, React, Vercel, PostgreSQL',
    'Next.js, React, Vercel, PostgreSQL',
    'https://your-portfolio.vercel.app',
    'https://github.com/yourusername/portfolio',
    1,
    true
  ),
  (
    'E-commerce Platform',
    'Full-stack e-commerce solution with payment integration and admin dashboard.',
    'A comprehensive e-commerce platform with product management, shopping cart, secure payment processing via Stripe, order tracking, and an admin dashboard for managing products and orders.',
    'Node.js, Express, PostgreSQL, Stripe',
    'Node.js, Express, PostgreSQL, Stripe',
    'https://example-ecommerce.com',
    'https://github.com/yourusername/ecommerce',
    2,
    false
  ),
  (
    'Task Management App',
    'Collaborative task management application with real-time updates.',
    'Real-time task management system with drag-and-drop interface, team collaboration features, project boards, task assignments, and progress tracking.',
    'React, Firebase, Material-UI',
    'React, Firebase, Material-UI',
    NULL,
    'https://github.com/yourusername/task-manager',
    3,
    false
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- Optional: Add sample media for projects
-- ============================================
-- Uncomment and modify these if you want sample media entries

-- INSERT INTO project_media (project_id, media_type, title, description, url, display_order)
-- VALUES
--   (1, 'video', 'Portfolio Demo', 'Quick walkthrough of the portfolio features', 'https://youtube.com/watch?v=...', 0),
--   (1, 'pdf', 'Technical Documentation', 'Detailed technical specifications', 'https://your-blob-url.com/doc.pdf', 1);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify your setup

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check projects
-- SELECT id, title, description FROM projects;

-- Check project_media
-- SELECT pm.id, p.title as project_title, pm.media_type, pm.title as media_title 
-- FROM project_media pm 
-- JOIN projects p ON pm.project_id = p.id;

-- Check biography
-- SELECT full_name, title, email FROM biography;

-- Check messages
-- SELECT id, name, email, subject, read FROM messages;
