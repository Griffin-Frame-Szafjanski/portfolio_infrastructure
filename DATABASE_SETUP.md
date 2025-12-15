# 🗄️ Database Setup Guide - Vercel Postgres

Complete guide to set up environment variables and replace mock data with Vercel Postgres.

---

## 📋 **Step 1: Set Up Environment Variables**

### In Vercel Dashboard:

1. Go to your project: https://vercel.com/dashboard
2. Click on your **"portfolio-infrastructure"** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

#### Required Environment Variables:

```bash
# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random

# Admin credentials (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

#### How to Generate a Secure JWT_SECRET:

```bash
# On Mac/Linux, run in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use: https://generate-secret.vercel.app/32
```

5. Click **"Save"** for each variable
6. **Important:** Check **"Production"**, **"Preview"**, and **"Development"** for each

---

## 🗄️ **Step 2: Create Vercel Postgres Database**

### In Vercel Dashboard:

1. Still in your project, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a database name: `portfolio-db`
5. Select region: **Choose closest to you**
6. Click **"Create"**

### Connect to Your Project:

1. Vercel will show connection options
2. Click **"Connect"** for your project
3. **Vercel automatically adds these environment variables:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

✅ **You're done with Vercel setup!** Environment variables are configured.

---

## 📊 **Step 3: Initialize Database Schema**

### Access Vercel Postgres:

1. In Vercel Dashboard → **Storage** → **portfolio-db**
2. Click **"Query"** tab (or use `.sql` tab)
3. Run this SQL to create your tables:

```sql
-- Biography table
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

-- Projects table
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
  video_url TEXT,
  demo_type VARCHAR(50) DEFAULT 'none',
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
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

-- Insert default biography
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

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, technologies, project_url, github_url, demo_type, display_order)
VALUES
  (
    'Portfolio Website',
    'A modern portfolio website built with Next.js and deployed on Vercel.',
    'Next.js, React, Vercel, Postgres',
    'Next.js, React, Vercel, Postgres',
    'https://your-portfolio.vercel.app',
    'https://github.com/yourusername/portfolio',
    'live',
    1
  ),
  (
    'E-commerce Platform',
    'Full-stack e-commerce solution with payment integration and admin dashboard.',
    'Node.js, Express, PostgreSQL, Stripe',
    'Node.js, Express, PostgreSQL, Stripe',
    'https://example.com',
    'https://github.com/yourusername/ecommerce',
    'video',
    2
  ),
  (
    'Task Management App',
    'Collaborative task management application with real-time updates.',
    'React, Firebase, Material-UI',
    'React, Firebase, Material-UI',
    NULL,
    'https://github.com/yourusername/task-manager',
    'none',
    3
  )
ON CONFLICT DO NOTHING;
```

4. Click **"Run Query"** or **"Execute"**
5. ✅ Your database schema is ready!

---

## 💻 **Step 4: Install Database Package**

### In Your Local Project:

```bash
cd /Users/griffinframe-szafjanski/Projects/portfolio_infrastructure

# Install Vercel Postgres SDK
npm install @vercel/postgres
```

---

## 🔄 **Step 5: Update Your Code**

I'll help you:
1. Create a new `lib/db.js` that uses real Postgres
2. Update all API routes to use the new database
3. Keep `lib/mockDb.js` as a backup

**Ready?** Let me know and I'll create the database integration code!

---

## ✅ **Verification Steps**

After setup:

1. **Check Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Should see `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and all `POSTGRES_*` variables

2. **Check Database:**
   - Vercel Dashboard → Storage → portfolio-db → Query
   - Run: `SELECT * FROM biography;`
   - Should see your default data

3. **Redeploy:**
   - After we update the code, push to Git
   - Vercel will auto-deploy with new database connection

---

## 🎯 **Next Steps**

1. ✅ Set environment variables in Vercel
2. ✅ Create Postgres database
3. ✅ Run schema SQL
4. ✅ Install `@vercel/postgres` package
5. ⏳ Update code to use real database (I'll help!)
6. ⏳ Test everything works

**Ready for Step 4 & 5?** Let me know when you've completed Steps 1-3, and I'll create the database integration code!
