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

### Environment Variables

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Authentication
JWT_SECRET=<strong-random-secret-minimum-32-characters>

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>

# Environment
NODE_ENV=development
```

**Important**: Never commit `.env.local` to version control!

## 2. Database Setup

### Create Database

1. Sign up for [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`

### Initialize Schema

Run the complete database schema:

```bash
psql $DATABASE_URL -f DATABASE_COMPLETE_SCHEMA.sql
```

Or copy the contents of `DATABASE_COMPLETE_SCHEMA.sql` and execute in Neon's SQL Editor.

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

### Create Blob Store

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Create blob store: `vercel blob create`
5. Copy the token to your `.env.local` as `BLOB_READ_WRITE_TOKEN`

## 4. Local Development

Start the development server:

```bash
npm run dev
```

Visit http://localhost:3000

### Admin Access

- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard

## 5. Production Deployment

### Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Set Environment Variables in Vercel

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

- `DATABASE_URL`
- `JWT_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `NODE_ENV=production`

### Post-Deployment

1. Visit your admin panel: `https://your-domain.com/admin/login`
2. Change the default admin password immediately
3. Add your biography information
4. Upload your resume
5. Create projects with media

## 6. Using the Admin Panel

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
- Verify `DATABASE_URL` is correct
- Check if Neon database is active
- Ensure SSL mode is set correctly

### File Upload Failures
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob storage quota
- Ensure file sizes are within limits

### Authentication Problems
- Verify `JWT_SECRET` is set (32+ characters)
- Check if cookies are enabled
- Try clearing browser cookies

### Build Errors
- Run `npm install` to update dependencies
- Clear Next.js cache: `rm -rf .next`
- Check Node.js version (18+ required)

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
