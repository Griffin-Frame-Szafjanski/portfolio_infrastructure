# Deployment Guide - Portfolio Infrastructure

This guide walks you through deploying your portfolio to Cloudflare's free infrastructure.

## 🎯 Current Status

✅ **Completed:**
- Project structure and configuration
- Backend API endpoints (Cloudflare Pages Functions)
- Frontend (HTML, CSS, JavaScript)
- Local development tested successfully

⏳ **Next Steps:**
- Set up D1 database (serverless SQLite)
- Set up R2 storage (file storage)
- Deploy to Cloudflare Pages
- Connect to GitHub for CI/CD

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Cloudflare Account** (free tier is sufficient)
   - Sign up at: https://dash.cloudflare.com/sign-up

2. **GitHub Account**
   - Your code needs to be in a GitHub repository

3. **Wrangler CLI Authenticated**
   - Run: `npx wrangler login`
   - This will open a browser for authentication

---

## 🗄️ Step 1: Create D1 Database

D1 is Cloudflare's serverless SQLite database. It's free for up to 5GB storage and 5M reads/day.

### 1.1 Create the Database

```bash
# Create D1 database
npx wrangler d1 create portfolio-db
```

**Important:** This command will output a `database_id`. Copy it!

Example output:
```
✅ Successfully created DB 'portfolio-db'!

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
```

### 1.2 Update wrangler.toml

Open `wrangler.toml` and uncomment the D1 configuration section, adding your database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your actual ID
```

**What does this do?**
- `binding = "DB"` - Makes the database accessible as `env.DB` in your API functions
- The binding connects your application code to the database

### 1.3 Initialize Database Schema

```bash
# Run the schema.sql file to create tables
npx wrangler d1 execute portfolio-db --file=./schema.sql
```

This creates your `biography`, `projects`, and `project_tags` tables with sample data.

### 1.4 Verify Database Setup

```bash
# Query the database to check it's working
npx wrangler d1 execute portfolio-db --command="SELECT * FROM biography"
```

You should see your sample biography data!

---

## 📦 Step 2: Create R2 Storage Bucket

R2 is Cloudflare's object storage (like AWS S3). Free tier: 10GB storage.

### 2.1 Create the Bucket

```bash
# Create R2 bucket for file storage
npx wrangler r2 bucket create portfolio-files
```

### 2.2 Update wrangler.toml

Uncomment the R2 configuration section in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "FILES"
bucket_name = "portfolio-files"
```

**What does this do?**
- `binding = "FILES"` - Makes the bucket accessible as `env.FILES` in your code
- You'll use this to store/retrieve PDFs, images, videos

### 2.3 Upload Files to R2 (Optional - for later)

```bash
# Upload your resume PDF
npx wrangler r2 object put portfolio-files/resume.pdf --file=/path/to/your/resume.pdf

# Upload your profile photo
npx wrangler r2 object put portfolio-files/photo.jpg --file=/path/to/your/photo.jpg
```

**Note:** Files in R2 can be accessed via public URLs or through your Workers.

---

## 🚀 Step 3: Deploy to Cloudflare Pages

There are two ways to deploy: via GitHub (recommended) or via CLI.

### Option A: Deploy via GitHub (Recommended - CI/CD)

This provides automatic deployments when you push to GitHub.

#### 3.1 Push to GitHub

```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/portfolio_infrastructure.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 3.2 Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git**
4. Select your `portfolio_infrastructure` repository
5. Configure build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `src`
6. Click **Save and Deploy**

#### 3.3 Configure Environment Bindings

After deployment, add your D1 and R2 bindings:

1. Go to your Pages project → **Settings** → **Functions**
2. Add **D1 database binding:**
   - Variable name: `DB`
   - D1 database: Select `portfolio-db`
3. Add **R2 bucket binding:**
   - Variable name: `FILES`
   - R2 bucket: Select `portfolio-files`
4. **Redeploy** for changes to take effect

### Option B: Deploy via CLI

```bash
# Deploy directly from command line
npm run deploy

# Or with wrangler directly
npx wrangler pages deploy src
```

**Note:** CLI deployment doesn't set up CI/CD. Use GitHub method for automatic deployments.

---

## 🌐 Step 4: Access Your Live Site

After deployment, Cloudflare provides you with a URL:

```
https://portfolio-infrastructure.pages.dev
```

You can also add a custom domain:
1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Follow the DNS configuration steps

---

## 🔧 Step 5: Updating Content

### Update Biography

```bash
# Connect to your database
npx wrangler d1 execute portfolio-db --command="
UPDATE biography SET 
  full_name='Your Actual Name',
  title='Your Title',
  bio='Your bio text',
  email='your@email.com',
  phone='+1234567890',
  linkedin_url='https://linkedin.com/in/yourprofile',
  github_url='https://github.com/yourusername',
  location='Your City, Country'
WHERE id=1
"
```

### Add a Project

```bash
npx wrangler d1 execute portfolio-db --command="
INSERT INTO projects (title, description, tech_stack, project_url, github_url, demo_type, display_order)
VALUES (
  'My New Project',
  'Description of the project',
  'React, Node.js, PostgreSQL',
  'https://myproject.com',
  'https://github.com/username/project',
  'live',
  3
)
"
```

---

## 📊 Understanding the Architecture

### How It All Works Together:

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
└─────────────┬───────────────────────────────────────────┘
              │ Request: https://your-portfolio.pages.dev
              ▼
┌─────────────────────────────────────────────────────────┐
│            Cloudflare Global Network (CDN)              │
│  • Caches static files (HTML, CSS, JS, images)         │
│  • Distributes content from 300+ locations worldwide    │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare Pages                        │
│  • Serves frontend files from /src                      │
│  • Routes API requests to Pages Functions               │
└─────────────┬───────────────────────────────────────────┘
              │
              ├─── Static Files (HTML, CSS, JS)
              │
              └─── API Requests (/api/*)
                   │
                   ▼
        ┌──────────────────────────┐
        │  Pages Functions         │
        │  (Serverless)            │
        │                          │
        │  • /api/biography        │
        │  • /api/projects         │
        └──────────┬───────────────┘
                   │
                   ├──────────────┐
                   │              │
                   ▼              ▼
        ┌──────────────┐  ┌─────────────┐
        │  D1 Database │  │  R2 Storage │
        │  (SQLite)    │  │  (Objects)  │
        │              │  │             │
        │  • biography │  │  • PDFs     │
        │  • projects  │  │  • Images   │
        │  • tags      │  │  • Videos   │
        └──────────────┘  └─────────────┘
```

### Why This Architecture is Powerful:

1. **Global Performance**
   - Content served from nearest datacenter
   - Sub-50ms response times worldwide

2. **Zero Servers**
   - No EC2 instances to manage
   - No server maintenance
   - Auto-scaling built-in

3. **Cost: $0/month**
   - Free tier covers most portfolios
   - No surprise bills

4. **Security**
   - DDoS protection included
   - HTTPS by default
   - Isolated execution environments

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Tail logs in real-time
npx wrangler pages deployment tail
```

### Check Database Content

```bash
# List all projects
npx wrangler d1 execute portfolio-db --command="SELECT * FROM projects"

# Check biography
npx wrangler d1 execute portfolio-db --command="SELECT * FROM biography"
```

### Analytics

View analytics in Cloudflare Dashboard:
- **Workers & Pages** → Your project → **Analytics**
- See requests, errors, and performance metrics

---

## 🛠️ Development Workflow

### Local Development

```bash
# Start local dev server
npm run dev

# Server runs at http://localhost:8788
```

### Making Changes

1. Edit files in `src/` (frontend) or `functions/` (backend)
2. Changes hot-reload automatically in dev mode
3. Test locally
4. Commit and push to GitHub
5. Cloudflare automatically deploys

```bash
git add .
git commit -m "Update project content"
git push origin main
```

### Testing APIs Locally

```bash
# Biography endpoint
curl http://localhost:8788/api/biography

# Projects endpoint  
curl http://localhost:8788/api/projects

# Specific project
curl http://localhost:8788/api/projects/1
```

---

## 🎨 Customization Ideas

### Change Color Scheme

Edit `src/styles/main.css` CSS variables:

```css
:root {
  --color-primary: #3b82f6;      /* Change to your brand color */
  --color-secondary: #8b5cf6;    /* Secondary color */
}
```

### Add Sections

Add new sections to `src/index.html`:
- Skills/Technologies
- Work Experience
- Blog posts
- Testimonials

### Add New API Endpoints

Create new files in `functions/api/`:
- `functions/api/skills.js` → `/api/skills`
- `functions/api/blog.js` → `/api/blog`

---

## 📚 Additional Resources

### Cloudflare Documentation
- Pages: https://developers.cloudflare.com/pages/
- D1 Database: https://developers.cloudflare.com/d1/
- R2 Storage: https://developers.cloudflare.com/r2/
- Workers: https://developers.cloudflare.com/workers/

### Learning Resources
- HTML/CSS: https://developer.mozilla.org/en-US/docs/Web/HTML
- JavaScript: https://javascript.info/
- Cloudflare Workers: https://workers.cloudflare.com/

---

## 🐛 Troubleshooting

### Issue: API returns 500 errors

**Solution:** Check wrangler.toml has correct bindings and database_id

### Issue: Database not found

**Solution:** Ensure D1 database is created and bound in Pages settings

### Issue: Files not loading from R2

**Solution:** Check R2 bucket binding is configured in Pages Functions settings

### Issue: Changes not appearing on live site

**Solution:** 
1. Check deployment status in Cloudflare Dashboard
2. Clear browser cache
3. Verify changes were pushed to GitHub

---

## 🎓 What You've Learned

Throughout this project, you've learned:

1. **Serverless Architecture** - No servers to manage
2. **API Development** - RESTful endpoints with Cloudflare Functions
3. **Database Design** - SQL schema and relationships
4. **Frontend Development** - HTML, CSS, JavaScript
5. **CI/CD** - Automated deployments via GitHub
6. **Cloud Infrastructure** - Cloudflare's edge network
7. **Modern JavaScript** - Async/await, Fetch API, modules
8. **Responsive Design** - CSS Grid, Flexbox, media queries
9. **Security** - CORS, XSS prevention, sanitization
10. **Git Workflow** - Version control best practices

---

## 🚀 Next Steps

Ready to take it further?

1. **Add Authentication** - Admin panel to edit content
2. **Contact Form** - Email integration with Cloudflare Email Workers
3. **Blog System** - Add a blog with markdown support
4. **Analytics** - Custom analytics dashboard
5. **Dark Mode** - Theme switcher
6. **Internationalization** - Multi-language support
7. **PWA** - Make it a Progressive Web App
8. **SEO Optimization** - Meta tags, sitemaps, structured data

---

**Congratulations! You've built a professional portfolio on enterprise-grade infrastructure - all for $0/month! 🎉**
