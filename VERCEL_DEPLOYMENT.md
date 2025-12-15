# 🚀 Vercel Deployment Guide

Your Next.js portfolio is now optimized for Vercel deployment!

---

## ✅ Why Vercel?

- **Zero Configuration** - Works out of the box with Next.js
- **Automatic Static Asset Serving** - No more 404 errors!
- **Free Tier** - Generous limits for personal projects
- **Auto-Deploy** - Git push triggers automatic deployment
- **Built by Next.js Creators** - Perfect compatibility

---

## 📋 **Method 1: GitHub Integration (Recommended)**

This is the easiest way - automatic deployments on every push!

### Step 1: Go to Vercel

Visit: https://vercel.com/signup

### Step 2: Sign Up with GitHub

Click **"Continue with GitHub"**

### Step 3: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Find **"Griffin-Frame-Szafjanski/portfolio_infrastructure"**
3. Click **"Import"**

### Step 4: Configure (Optional)

Vercel auto-detects Next.js! Just review:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: (leave default)
Install Command: npm install
```

### Step 5: Deploy!

Click **"Deploy"** - Your site will be live in ~2 minutes!

---

## 📋 **Method 2: Vercel CLI**

For manual deployments from your computer.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# ? Set up and deploy? Y
# ? Which scope? (your account)
# ? Link to existing project? N
# ? What's your project's name? portfolio-infrastructure
# ? In which directory is your code located? ./
```

### Step 4: Deploy to Production

```bash
vercel --prod
```

---

## 🌐 **Your Live URL**

After deployment, you'll get:
- **Preview URL**: `https://portfolio-infrastructure-[random].vercel.app`
- **Production URL**: `https://portfolio-infrastructure.vercel.app`

---

## 🎨 **Add Custom Domain (Optional)**

### In Vercel Dashboard:

1. Go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `yourname.com`)
4. Follow DNS instructions
5. ✅ Free SSL certificate automatically

---

## 📊 **What Works Out of the Box:**

✅ All your pages (Home, Biography, Projects, Contact, Admin)
✅ All API routes (`/api/*`)
✅ Static assets (CSS, JavaScript)
✅ Tailwind CSS styling
✅ Image optimization (if you enable it)
✅ Automatic HTTPS
✅ Global CDN

---

## 🔄 **Automatic Deployments:**

Once connected to GitHub:

```bash
git add -A
git commit -m "Update portfolio"
git push origin main
```

✨ Vercel automatically detects the push and deploys!

---

## 🗄️ **Adding a Database (When Ready)**

You're currently using `lib/mockDb.js` (in-memory). When you want real persistence:

### Option 1: Vercel Postgres (Easiest)

```bash
# In Vercel Dashboard
1. Go to your project
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Connect to your project
```

Vercel provides environment variables automatically!

### Option 2: External Database

Popular options:
- **Supabase** (Postgres, free tier)
- **PlanetScale** (MySQL, free tier)  
- **MongoDB Atlas** (NoSQL, free tier)

Add connection string in Vercel:
1. **Settings** → **Environment Variables**
2. Add `DATABASE_URL`
3. Redeploy

---

## ⚙️ **Environment Variables**

If you need any secrets (API keys, etc.):

### In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add your variables:
   - `NEXT_PUBLIC_API_URL` (if needed)
   - `JWT_SECRET` (for authentication)
   - etc.

### In Code:

```javascript
// Access in API routes or server components
const secret = process.env.JWT_SECRET

// Access in client components (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

---

## 🐛 **Troubleshooting**

### Build Fails?

Check the build logs in Vercel Dashboard. Common issues:
- Missing dependencies: `npm install` locally to verify
- TypeScript errors: Fix any type issues
- Environment variables: Ensure they're set

### Site Looks Different?

- Clear your browser cache
- Check that CSS files are loading (F12 → Network tab)
- Verify Tailwind is processing correctly

### API Routes Not Working?

- Ensure files are in `app/api/` directory
- Check route names match your URLs
- Look at Function Logs in Vercel Dashboard

---

## 📈 **Performance**

Your site on Vercel gets:
- **Global CDN** - Served from edge locations worldwide
- **Automatic caching** - Static assets cached aggressively
- **Image optimization** - Can enable in `next.config.js`
- **Analytics** - Built-in performance monitoring

---

## 💰 **Pricing**

**Free (Hobby) Tier includes:**
- Unlimited personal projects
- 100 GB bandwidth/month
- 100 GB build minutes/month
- Automatic HTTPS
- Custom domains

Perfect for portfolios! 🎉

---

## 🔄 **Migrating from Cloudflare Workers**

Good news - you already did the hard part! The changes made:
- ✅ Simplified `next.config.js`
- ✅ Removed `open-next.config.ts`
- ✅ Your code works as-is

Old Cloudflare files (keeping for reference):
- `wrangler.toml` - Not used by Vercel
- `WORKERS_DEPLOYMENT.md` - Historical reference
- `CLOUDFLARE_*.md` - Cloudflare-specific docs

---

## 🎉 **Ready to Deploy!**

Choose your method:
- **Quick & Easy**: Use GitHub integration (Method 1)
- **Manual Control**: Use Vercel CLI (Method 2)

Either way, your portfolio will be live with full styling and functionality in minutes!

**Next step:** Go to https://vercel.com and click "Continue with GitHub" to get started! 🚀
