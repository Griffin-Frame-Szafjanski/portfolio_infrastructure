# 🚀 Cloudflare Workers Deployment Guide

## ✅ Your Portfolio is Now Configured for Workers!

Your Next.js portfolio with API routes will deploy as a Cloudflare Worker.

---

## 📝 **What Changed:**

✅ **wrangler.toml** configured for Workers (not Pages)
✅ **Deploy script** updated to build + deploy Worker
✅ **Main entry point** set to `.open-next/worker.js`

---

## 🎯 **Quick Deploy (From Your Computer)**

### 1. Build & Deploy Locally:

```bash
# Build the OpenNext Worker
npm run build:worker

# Deploy to Cloudflare Workers
npm run deploy
```

This will:
1. Build your Next.js app with OpenNext
2. Generate `.open-next/worker.js`
3. Deploy to Cloudflare Workers
4. Your portfolio goes live at: `https://portfolio-infrastructure.<your-subdomain>.workers.dev`

---

## 🔧 **CI/CD Deployment (Automated)**

### Option 1: GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Worker
        run: npm run build:worker
        
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Add Secrets in GitHub:**
- Go to: Repository → Settings → Secrets and variables → Actions
- Add:
  - `CLOUDFLARE_API_TOKEN` = your API token
  - `CLOUDFLARE_ACCOUNT_ID` = `ad653a08880c4e992e000e0bd5758162`

### Option 2: Keep Using Cloudflare Workers CI

In your Workers CI settings, update:

```
Build command: npm run build:worker
Deploy command: npx wrangler deploy
```

---

## 🌐 **Your Worker URL**

After deployment, your portfolio will be available at:

```
https://portfolio-infrastructure.<your-subdomain>.workers.dev
```

Or set up a custom domain in the Cloudflare Dashboard!

---

## 🎨 **Add Custom Domain**

1. Go to Cloudflare Workers Dashboard
2. Select your Worker: `portfolio-infrastructure`
3. Click **Triggers** tab
4. Click **Add Custom Domain**
5. Enter your domain (e.g., `portfolio.yourname.com`)
6. Cloudflare handles SSL automatically!

---

## 🔄 **Local Development**

### Test Worker Locally:

```bash
# Build the worker
npm run build:worker

# Run local preview
npm run preview
```

Visit: `http://localhost:8788`

### Or use Next.js dev server:

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📊 **What's Included:**

✅ All pages (Home, Biography, Projects, Contact, Admin)
✅ All API routes (working with Worker runtime)
✅ Static assets
✅ Optimized for Cloudflare Workers
✅ 0 vulnerabilities
✅ Automatic SSL

---

## 🆘 **Troubleshooting**

### Build fails?
```bash
# Clean and rebuild
rm -rf .next .open-next node_modules
npm install
npm run build:worker
```

### Deploy fails with auth error?
- Verify your API token has "Workers Scripts → Edit" permission
- Check CLOUDFLARE_ACCOUNT_ID is correct

### Worker deployed but showing errors?
- Check the Worker logs in Cloudflare Dashboard
- Verify environment variables are set if needed

---

## 🎉 **You're Ready!**

Run `npm run deploy` and your portfolio will be live on Cloudflare Workers!

**Key Commands:**
- `npm run dev` - Local Next.js development
- `npm run build:worker` - Build the Worker
- `npm run preview` - Test Worker locally
- `npm run deploy` - Deploy to Cloudflare
