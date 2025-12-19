-- Skills & Categories Schema Addition
-- Run this in your Neon SQL Editor to add skills functionality

-- ============================================
-- Skill Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Skills Table
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category_id INTEGER REFERENCES skill_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Project-Skills Junction Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS project_skills (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, skill_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_project ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills(skill_id);

-- ============================================
-- Sample Data (Optional)
-- ============================================
-- Uncomment to add sample categories and skills

-- INSERT INTO skill_categories (name, description, display_order) VALUES
--   ('Programming Languages', 'Core programming languages', 1),
--   ('Frontend', 'Frontend frameworks and libraries', 2),
--   ('Backend', 'Backend frameworks and tools', 3),
--   ('Databases', 'Database systems', 4),
--   ('Tools & Platforms', 'Development tools and platforms', 5);

-- INSERT INTO skills (name, category_id, display_order) VALUES
--   ('JavaScript', 1, 1),
--   ('Python', 1, 2),
--   ('Java', 1, 3),
--   ('React', 2, 1),
--   ('Next.js', 2, 2),
--   ('Tailwind CSS', 2, 3),
--   ('Node.js', 3, 1),
--   ('Express', 3, 2),
--   ('PostgreSQL', 4, 1),
--   ('Git', 5, 1),
--   ('Docker', 5, 2);

-- ============================================
-- Verification Queries
-- ============================================
-- Check skill categories
-- SELECT * FROM skill_categories ORDER BY display_order;

-- Check skills with their categories
-- SELECT s.id, s.name, sc.name as category 
-- FROM skills s 
-- LEFT JOIN skill_categories sc ON s.category_id = sc.id 
-- ORDER BY sc.display_order, s.display_order;

-- Check project-skill relationships
-- SELECT p.title, s.name as skill 
-- FROM projects p 
-- JOIN project_skills ps ON p.id = ps.project_id 
-- JOIN skills s ON ps.skill_id = s.id 
-- ORDER BY p.title;
