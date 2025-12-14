-- Portfolio Database Schema for Cloudflare D1
-- This file defines the structure of our portfolio database

-- ============================================
-- Biography Table
-- Stores professional biography information
-- ============================================
CREATE TABLE IF NOT EXISTS biography (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL,              -- e.g., "Software Engineer"
    bio TEXT NOT NULL,                 -- Professional bio/summary
    email TEXT NOT NULL,
    phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    location TEXT,
    resume_file_key TEXT,              -- R2 storage key for PDF resume
    photo_file_key TEXT,               -- R2 storage key for profile photo
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Projects Table
-- Stores project demonstrations and details
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,             -- Detailed project description
    tech_stack TEXT,                   -- Technologies used (comma-separated)
    project_url TEXT,                  -- Live project link
    github_url TEXT,                   -- GitHub repository link
    demo_video_key TEXT,               -- R2 storage key for demo video (optional)
    thumbnail_key TEXT,                -- R2 storage key for project thumbnail
    demo_type TEXT CHECK(demo_type IN ('none', 'video', 'python', 'java', 'live')),
    demo_code TEXT,                    -- Code for runnable demos (Python/Java)
    display_order INTEGER DEFAULT 0,   -- For sorting projects
    is_featured BOOLEAN DEFAULT 0,     -- Featured projects
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Project Tags Table (Optional - for filtering)
-- ============================================
CREATE TABLE IF NOT EXISTS project_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    tag_name TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================
-- Create Indexes for Better Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON project_tags(project_id);

-- ============================================
-- Insert Sample Data (for testing)
-- ============================================
INSERT INTO biography (full_name, title, bio, email, phone, location) 
VALUES (
    'Your Name',
    'Full-Stack Developer',
    'Passionate developer with experience in building scalable web applications using modern technologies.',
    'your.email@example.com',
    '+1234567890',
    'City, Country'
);

-- ============================================
-- Admin Users Table
-- Stores admin authentication credentials
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,        -- Bcrypt hashed password
    email TEXT NOT NULL,
    last_login DATETIME,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,              -- Account lockout timestamp
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);

INSERT INTO projects (title, description, tech_stack, demo_type, display_order, is_featured)
VALUES 
    ('Portfolio Website', 'A full-stack portfolio application built on Cloudflare infrastructure', 'Cloudflare Workers, D1, R2, Pages', 'live', 1, 1),
    ('Sample Project', 'Another interesting project showcasing various skills', 'JavaScript, React, Node.js', 'none', 2, 0);
