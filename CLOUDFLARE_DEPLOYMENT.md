# 🚀 Cloudflare Pages Deployment Guide

## ✅ Repository Created!

Your portfolio is now on GitHub:
**https://github.com/Griffin-Frame-Szafjanski/portfolio_infrastructure**

All 187 files and commit history have been successfully pushed!

---

## 🔧 Next Step: Connect to Cloudflare Pages

### Automatic Deployment Setup:

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select your account
   - Click **"Pages"** in the left sidebar

2. **Create New Project**
   - Click **"Create a project"**
   - Select **"Connect to Git"**

3. **Authorize GitHub**
   - Click **"Connect GitHub"**
   - Authorize Cloudflare to access your repositories
   - Select **"Griffin-Frame-Szafjanski/portfolio_infrastructure"**

4. **Configure Build Settings**
   ```
   Project name: portfolio-infrastructure (or your choice)
   Production branch: main
   
   Build settings:
   - Framework preset: Next.js
   - Build command: npm run build
   - Build output directory: .next
   - Root directory: (leave empty)
   
   Note: Cloudflare Pages now supports Next.js natively!
   No adapters or deprecated packages needed.
   ```

5. **Add Environment Variables** (Important!)
   Click "Environment variables" and add:
   ```
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your_secure_password_here
   JWT_SECRET = generate_random_32char_string_here
   ```
   
   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Deploy!**
   - Click **"Save and Deploy"**
   - Wait 2-3 minutes for the first build
   - Your site will be live at: `portfolio-infrastructure.pages.dev`

---

## 🎯 After Deployment

### Automatic Updates:
✅ Every time you `git push` to the main branch, Cloudflare will:
1. Detect the new commits
2. Automatically build your project
3. Deploy the updates live
4. Usually takes 2-3 minutes

### Preview Deployments:
- Create a branch: `git checkout -b feature-name`
- Push changes: `git push origin feature-name`
- Cloudflare creates a preview URL automatically
- Perfect for testing before merging to main!

---

## 📝 Important Notes

### Database Setup:
Your portfolio uses a mock database for development. For production, you'll need to:

1. **Create D1 Database** (in Cloudflare Dashboard)
   ```bash
   npx wrangler d1 create portfolio-db
   ```

2. **Run Schema**
   ```bash
   npx wrangler d1 execute portfolio-db --file=./schema.sql
   ```

3. **Update wrangler.toml** with your D1 database ID

4. **Bind D1 to Pages** (in Cloudflare Dashboard → Pages → Settings → Functions)

### Custom Domain:
- Go to Pages → Custom domains
- Add your domain (e.g., yourname.com)
- Follow DNS instructions

---

## 🔄 Future Deployments

Just commit and push:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Cloudflare automatically deploys! 🚀

---

## 📊 Monitoring

View your deployments:
- **GitHub:** https://github.com/Griffin-Frame-Szafjanski/portfolio_infrastructure
- **Cloudflare Pages:** https://dash.cloudflare.com → Pages → portfolio-infrastructure

Check build logs, analytics, and deployment history in the Cloudflare dashboard.

---

## 🆘 Troubleshooting

### Build Fails?
- Check the build logs in Cloudflare Pages
- Verify environment variables are set
- Ensure `npm run build` works locally

### Need Help?
- Cloudflare Docs: https://developers.cloudflare.com/pages
- Check deployment logs for specific errors
