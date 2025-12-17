# Portfolio Infrastructure - Setup Guide

Complete setup guide for deploying your portfolio website.

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database
- A Vercel account (for hosting and blob storage)
- Git installed

## 1. Initial Setup

### Clone and Install

```bash
git clone <your-repository-url>
cd portfolio_infrastructure
npm install
```

### Vercel Setup (Recommended First Step)

It's recommended to set up Vercel and environment variables **before** local development:

1. **Sign up/Login to Vercel**: Visit [vercel.com](https://vercel.com)
2. **Import Project**: Click "Add New" → "Project" → Import your Git repository
3. **Connect Repository**: Authorize Vercel to access your GitHub/GitLab/Bitbucket
4. **Do NOT deploy yet** - We need to set up environment variables and database first

This approach allows you to use Vercel's integrations to automatically configure environment variables.

## 2. Database Setup (Neon via Vercel Integration)

### Method 1: Vercel Integration (Recommended)

1. In Vercel Dashboard → Your Project → **Storage** tab
2. Click "**Create Database**" → Select "**Neon Serverless Postgres**"
3. Follow the integration wizard:
   - Choose database name
   - Select region (choose closest to your users)
   - Click "Create"
4. ✅ **Environment variable `DATABASE_URL` is automatically added to your Vercel project**

### Method 2: Manual Neon Setup

If you prefer manual setup:
1. Sign up for [Neon](https://neon.tech)
2. Create a new project and database
3. Copy the connection string
4. Add to Vercel: Project Settings → Environment Variables
   - Name: `DATABASE_URL`
   - Value: `postgresql://user:password@host/database?sslmode=require`
   - Apply to: Production, Preview, and Development

### Initialize Schema

Once database is created, initialize it:

**Option 1: Using psql**
```bash
psql $DATABASE_URL -f DATABASE_COMPLETE_SCHEMA.sql
```

**Option 2: Using Neon SQL Editor**
1. Go to your Neon project dashboard
2. Click "SQL Editor"
3. Copy/paste contents of `DATABASE_COMPLETE_SCHEMA.sql`
4. Click "Run"

### Set Admin Password

Create your admin password:

```bash
node scripts/hash-password.js
```

Follow the prompts to generate a hashed password, then update your database:

```sql
UPDATE admin_users 
SET password_hash = 'your-generated-hash-here'
WHERE username = 'admin';
```

**Default credentials** (change immediately):
- Username: `admin`
- Password: `admin123`

## 3. Vercel Blob Storage Setup

### Method 1: Vercel Dashboard (Recommended)

1. In Vercel Dashboard → Your Project → **Storage** tab
2. Click "**Create Store**" → Select "**Blob**"
3. Choose a name for your blob store
4. Click "**Create**"
5. ✅ **Environment variable `BLOB_READ_WRITE_TOKEN` is automatically added to your Vercel project**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login and link project
vercel login
vercel link

# Create blob store
vercel blob create

# Token is automatically added to your project
```

## 4. Set Additional Environment Variables

After setting up database and blob storage, add remaining environment variables in Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add the following variables:

### JWT_SECRET (Required)

- **Name**: `JWT_SECRET`
- **Value**: Generate a secure 32+ character random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Apply to**: Production, Preview, Development

### ADMIN_USERNAME (Optional)

- **Name**: `ADMIN_USERNAME`
- **Value**: `admin` (or your preferred username)
- **Apply to**: Production, Preview, Development
- Note: Default is `admin` if not set

### ADMIN_PASSWORD (Optional)

- **Name**: `ADMIN_PASSWORD`
- **Value**: BCrypt hashed password (see step 2.3 for generation)
- **Apply to**: Production, Preview, Development
- Note: Default password is `admin123` if not set (change immediately!)

## 5. Local Development Setup

For local development, you need to pull environment variables from Vercel:

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000

### Option 2: Manual .env.local (Alternative)

If you prefer not to use Vercel CLI, create `.env.local` manually:

```env
# Copy these values from Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret-here
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$12$hashed-password-here
```

**Important**: Never commit `.env.local` to version control!

### Admin Access

- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard

## 6. Production Deployment

Now that all environment variables are set, deploy to production:

### Deploy to Vercel

```bash
# Using Vercel CLI
vercel --prod
```

Or use the Vercel Dashboard:
- Go to your project → **Deployments** tab
- Click "**Deploy**" or push to your main branch for automatic deployment

### Verify Environment Variables

All required variables should be set:
- ✅ `DATABASE_URL` (from Neon integration)
- ✅ `BLOB_READ_WRITE_TOKEN` (from Blob storage)
- ✅ `JWT_SECRET` (manually added)
- ✅ `ADMIN_USERNAME` (optional, manually added)
- ✅ `ADMIN_PASSWORD` (optional, manually added)

### Post-Deployment

1. Visit your admin panel: `https://your-domain.com/admin/login`
2. Change the default admin password immediately
3. Add your biography information
4. Upload your resume
5. Create projects with media

## 7. Using the Admin Panel

### Biography Management
- Update personal information
- Upload profile photo
- Upload resume PDF
- Add social media links

### Projects Management
- Create/edit/delete projects
- Upload project images
- Add videos (YouTube URLs)
- Upload PDF documentation
- Reorder media with up/down arrows

### Messages Management
- View contact form submissions
- Mark as read/unread
- Delete messages

### Security
- Change password regularly
- Use strong passwords (12+ characters)
- Enable 2FA if available
- Review SECURITY_AUDIT.md for best practices

## Project Structure

```
portfolio_infrastructure/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── context/           # React context (theme)
│   └── ...                # Public pages
├── lib/                   # Utility libraries
│   ├── auth.js           # Authentication
│   ├── db.js             # Database
│   └── youtube.js        # YouTube embed logic
├── public/               # Static assets
├── scripts/              # Utility scripts
├── .env.local           # Environment variables (create this)
├── DATABASE_COMPLETE_SCHEMA.sql  # Database schema
├── ADMIN_GUIDE.md       # Admin usage guide
├── SECURITY_AUDIT.md    # Security documentation
└── README.md            # Project overview
```

## Troubleshooting

### Database Connection Issues
- **Verify environment variable**: Go to Vercel Dashboard → Settings → Environment Variables
- Check `DATABASE_URL` is set correctly in all environments
- Verify Neon database is active in Neon dashboard
- Ensure SSL mode is set: `?sslmode=require`

### File Upload Failures
- **Verify `BLOB_READ_WRITE_TOKEN`** is set in Vercel environment variables
- Check Vercel Blob storage exists (Storage tab)
- Check Vercel Blob storage quota and limits
- Ensure file sizes are within limits (10MB default)

### Authentication Problems
- **Verify `JWT_SECRET`** is set in Vercel (must be 32+ characters)
- Check if cookies are enabled in browser
- Try clearing browser cookies
- Verify admin password is hashed correctly

### Environment Variables Not Working Locally
- Run `vercel env pull .env.local` to sync from Vercel
- Or manually copy values from Vercel Dashboard
- Restart development server after changing `.env.local`

### Build Errors
- Check all required environment variables are set in Vercel
- Run `npm install` to update dependencies
- Clear Next.js cache: `rm -rf .next`
- Check Node.js version (18+ required)

### "Missing environment variables" Error
- Go to Vercel Dashboard → Settings → Environment Variables
- Ensure variables are applied to correct environments (Production/Preview/Development)
- Redeploy after adding new variables

## Support

For issues and questions:
1. Check `ADMIN_GUIDE.md` for admin panel help
2. Review `SECURITY_AUDIT.md` for security best practices
3. Check Next.js documentation: https://nextjs.org/docs
4. Neon documentation: https://neon.tech/docs

## Next Steps

After setup:
1. Customize the theme in `tailwind.config.js`
2. Update site metadata in `app/layout.js`
3. Add your content through the admin panel
4. Test all features thoroughly
5. Set up custom domain in Vercel
6. Configure analytics (optional)

---

**Last Updated**: December 2025  
**Version**: 1.0
