# 🎨 Professional Portfolio - Next.js

A modern, full-stack portfolio application built with Next.js 15, featuring a powerful admin panel, secure authentication, and seamless content management. Deployed on Vercel with Neon Postgres database and Vercel Blob storage.

## ✨ Features

### Public Portfolio
- 📝 **Dynamic Biography** - Personal information, skills, resume, and social links
- 🚀 **Project Showcase** - Display projects with images, videos, and PDF documentation
- 🎯 **Skills System** - Organized skills display with categories and filtering
- 🔍 **Project Filtering** - Filter projects by skill on projects page
- 🎬 **Media Support** - Embedded YouTube videos and PDF viewers
- 🌓 **Dark Mode** - Beautiful light/dark theme toggle
- 📧 **Contact Form** - Visitors can send messages directly with rate limiting
- 📱 **Fully Responsive** - Optimized for all devices

### Admin Dashboard
- 🔐 **Secure Authentication** - JWT-based login with rate limiting and account lockout
- ✏️ **Biography Editor** - Update personal info, upload photo and resume
- 🎨 **Projects Manager** - CRUD operations with media management
- 🏷️ **Skills Manager** - Manage individual skills with category assignment
- 📂 **Categories Manager** - Organize skills into categories
- 🔗 **Skill-Project Linking** - Associate skills with projects
- 📹 **Media Management** - Add videos, PDFs, reorder with drag-and-drop arrows
- 💬 **Messages Dashboard** - View and manage contact submissions
- 📊 **Audit Logs Viewer** - Track all admin actions and changes
- 🔑 **Password Management** - Secure password change functionality
- 🧹 **Automatic Blob Cleanup** - Old files automatically deleted on replacement
- 🔒 **Always Light Mode** - Admin interface uses consistent light theme

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Neon Postgres (Serverless)
- **Authentication**: JWT with HTTP-only cookies, BCrypt password hashing
- **File Storage**: Vercel Blob (images, PDFs, resumes)
- **Deployment**: Vercel with automatic HTTPS
- **Security**: Rate limiting, SQL injection prevention, XSS protection

## 🚀 Quick Start

### For Production (Vercel - Recommended)

1. **Import to Vercel**: [vercel.com](https://vercel.com) → Import repository
2. **Set up Neon Database**: Vercel Dashboard → Storage → Create Database → Neon
3. **Set up Blob Storage**: Vercel Dashboard → Storage → Create Store → Blob
4. **Add JWT Secret**: Settings → Environment Variables → Add `JWT_SECRET`
5. **Deploy**: Click Deploy or push to main branch

See **[SETUP.md](SETUP.md)** for complete setup guide.

### For Local Development

```bash
# Clone and install
git clone <your-repo-url>
cd portfolio_infrastructure
npm install

# Pull environment variables from Vercel (requires Vercel CLI)
vercel login
vercel link
vercel env pull .env.local

# Start development
npm run dev
```

Visit http://localhost:3000

**Default Admin Credentials** (change immediately):
- Username: `admin`
- Password: `admin123`
- Login at: http://localhost:3000/admin/login

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup and deployment guide
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Admin panel usage instructions
- **[SECURITY.md](SECURITY.md)** - Security measures and best practices
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[DATABASE_COMPLETE_SCHEMA.sql](DATABASE_COMPLETE_SCHEMA.sql)** - Complete database schema

## 📁 Project Structure

```
portfolio_infrastructure/
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── audit-logs/    # Audit logs viewer page
│   │   ├── dashboard/     # Main admin dashboard
│   │   └── login/         # Admin login page
│   ├── api/               # API routes (REST endpoints)
│   │   ├── admin/         # Admin-specific endpoints
│   │   ├── biography/     # Biography CRUD
│   │   ├── contact/       # Contact form submission
│   │   ├── projects/      # Projects CRUD & media
│   │   ├── skills/        # Skills CRUD
│   │   ├── skill-categories/  # Categories CRUD
│   │   └── upload/        # File upload endpoints
│   ├── components/        # React components
│   │   ├── BiographyEditor.js
│   │   ├── ProjectsManager.js
│   │   ├── SkillsManager.js
│   │   ├── CategoriesManager.js
│   │   ├── MessagesManager.js
│   │   ├── AuditLogsViewer.js
│   │   └── ...            # Other components
│   ├── context/           # React Context
│   │   └── ThemeContext.js  # Dark mode management
│   ├── biography/         # Biography page
│   ├── projects/          # Projects pages
│   ├── skills/            # Skills page
│   └── contact/           # Contact page
├── lib/
│   ├── auth.js            # Authentication & JWT
│   ├── db.js              # Database operations
│   ├── audit-logger.js    # Audit logging system
│   ├── blob-cleanup.js    # Automatic file cleanup
│   ├── rate-limiter.js    # Rate limiting
│   ├── validation.js      # Input validation
│   ├── sanitize.js        # Input sanitization
│   ├── error-handler.js   # Error handling
│   ├── env-validator.js   # Environment validation
│   └── youtube.js         # YouTube embed helpers
├── scripts/
│   └── hash-password.js   # Password hashing utility
├── public/                # Static assets
├── SETUP.md               # Setup guide
├── ADMIN_GUIDE.md         # Admin manual
├── SECURITY.md            # Security documentation
├── DEPLOYMENT_CHECKLIST.md  # Deployment checklist
├── AUDIT_LOGGING_COMPLETE.md  # Audit logging guide
├── BLOB_CLEANUP_GUIDE.md  # Blob cleanup guide
├── SKILLS_SETUP.md        # Skills system setup
├── VERCEL_FILE_SIZE_LIMITS.md  # File size limits info
├── DATABASE_COMPLETE_SCHEMA.sql  # Complete database schema
├── DATABASE_AUDIT_LOGS.sql      # Audit logs schema
├── DATABASE_SKILLS_SCHEMA.sql   # Skills system schema
├── middleware.js          # Next.js middleware (security headers)
├── vercel.json            # Vercel configuration
└── next.config.js         # Next.js configuration
```

## 🔑 Key Features

### Media Management
- Upload and manage project images
- Embed YouTube videos
- Upload PDF documentation
- Intuitive up/down arrows for reordering
- Separate video and PDF sections

### Security
- ✅ JWT authentication with secure cookies
- ✅ BCrypt password hashing (12 salt rounds)
- ✅ Rate limiting (5 failed attempts = 15min lockout)
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (secure headers)
- ✅ CSRF protection (SameSite cookies)
- ✅ All admin operations authenticated
- ✅ File upload validation and limits

### Dark Mode
- System-aware theme detection
- Smooth transitions between themes
- Persistent theme preference
- Public pages support dark mode
- Admin panel always uses light mode

## 🌐 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing with hero and featured content |
| Biography | `/biography` | Full biography with resume viewer |
| Projects | `/projects` | All projects showcase with skill filtering |
| Project Detail | `/projects/[id]` | Individual project with media tabs |
| Skills | `/skills` | Skills organized by categories |
| Contact | `/contact` | Contact form with validation |
| Admin Login | `/admin/login` | Secure authentication |
| Admin Dashboard | `/admin/dashboard` | Content management hub with tabs |
| Audit Logs | `/admin/audit-logs` | View all admin actions and changes |

## ⚙️ Environment Variables

### Vercel Setup (Recommended)

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `DATABASE_URL` | Auto (Neon Integration) | Yes | Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Auto (Blob Store) | Yes | File storage token |
| `JWT_SECRET` | Manual | Yes | 32+ char random string |
| `ADMIN_USERNAME` | Manual | Optional | Default: `admin` |
| `ADMIN_PASSWORD` | Manual | Optional | BCrypt hash, default: `admin123` |

### Local Development

Pull from Vercel:
```bash
vercel env pull .env.local
```

Or create `.env.local` manually:
```env
DATABASE_URL=postgresql://...              # Neon Postgres connection string
JWT_SECRET=<32+ character random string>   # JWT signing secret
BLOB_READ_WRITE_TOKEN=<vercel-blob-token> # File storage token
ADMIN_USERNAME=admin                       # Admin username
ADMIN_PASSWORD=$2b$12$hashed...           # BCrypt hashed password
```

**Important**: Never commit `.env.local` to Git!

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Content
- Update biography through admin dashboard
- Add projects with images, videos, and PDFs
- Customize component text in `app/components/`

## 🔒 Security Best Practices

1. **Change default admin password immediately**
2. Use strong passwords (12+ characters, mixed case, numbers, symbols)
3. Set a secure `JWT_SECRET` (32+ random characters)
4. Review `SECURITY.md` for complete security guide
5. Keep dependencies updated: `npm audit`
6. Enable HTTPS in production (Vercel provides automatically)

## 📱 Deployment to Vercel

### Quick Deploy

1. **Import Project**: Go to [vercel.com](https://vercel.com) and import your repository
2. **Configure Integrations**:
   - Add Neon Database (Storage tab → Create Database)
   - Add Blob Storage (Storage tab → Create Store)
3. **Set Environment Variables**:
   - Add `JWT_SECRET` in Settings → Environment Variables
   - Optionally add `ADMIN_USERNAME` and `ADMIN_PASSWORD`
4. **Deploy**: Push to main branch or click Deploy

### Using Vercel CLI

```bash
vercel login
vercel --prod
```

See **[SETUP.md](SETUP.md)** for detailed deployment instructions including:
- Step-by-step Vercel setup
- Database initialization
- Environment configuration
- Local development setup
- Troubleshooting

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Check all environment variables are set in Vercel Dashboard
- Verify variables are applied to correct environments
- Run `npm install` to update dependencies
- Clear build cache: `rm -rf .next`

**Database Connection**
- Check Vercel Dashboard → Settings → Environment Variables for `DATABASE_URL`
- Verify Neon database is active in Neon dashboard
- Ensure SSL mode is set: `?sslmode=require`
- Check Neon integration is properly connected

**File Uploads Fail**
- Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Check Vercel Dashboard → Storage tab for Blob store
- Verify file size limits (10MB default)
- Check Blob storage quota

**Authentication Issues**
- Verify `JWT_SECRET` is set in Vercel (must be 32+ characters)
- Clear browser cookies and try again
- Check admin password is BCrypt hashed correctly
- Verify cookies are enabled in browser

**Local Development Issues**
- Run `vercel env pull .env.local` to sync variables
- Restart dev server after changing `.env.local`
- Ensure you're linked to correct Vercel project: `vercel link`

## 📝 API Endpoints

### Public
- `GET /api/biography` - Biography data
- `GET /api/projects` - All projects
- `GET /api/projects/[id]` - Single project with skills
- `GET /api/projects/[id]/media` - Project media
- `GET /api/skills` - All skills (with optional category filter)
- `GET /api/skills/[id]` - Single skill with related projects
- `GET /api/skill-categories` - All skill categories
- `POST /api/contact` - Submit contact form

### Protected (requires authentication)

**Biography**
- `PUT /api/biography/[id]` - Update biography

**Projects**
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/[id]/skills` - Get project skills
- `POST /api/projects/[id]/skills` - Associate skills with project
- `DELETE /api/projects/[id]/skills` - Remove skill from project

**Media**
- `POST /api/projects/[id]/media` - Add media
- `PUT /api/projects/[id]/media` - Update media
- `DELETE /api/projects/[id]/media` - Delete media

**Skills**
- `POST /api/skills` - Create skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill

**Skill Categories**
- `POST /api/skill-categories` - Create category
- `PUT /api/skill-categories/[id]` - Update category
- `DELETE /api/skill-categories/[id]` - Delete category

**Messages**
- `GET /api/admin/messages` - Get messages
- `PUT /api/admin/messages/[id]` - Update message (mark as read)
- `DELETE /api/admin/messages/[id]` - Delete message

**Admin**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Check auth status
- `POST /api/admin/change-password` - Change password
- `GET /api/admin/audit-logs` - View audit logs

**File Uploads**
- `POST /api/upload/photo` - Upload profile photo
- `POST /api/upload/resume` - Upload resume PDF
- `POST /api/upload/project-image` - Upload project image
- `POST /api/upload/project-pdf` - Upload project PDF

## 🧪 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build locally
npm run lint     # Run ESLint
```

## 📦 Dependencies

Key packages:
- `next` - React framework
- `react` - UI library
- `@neondatabase/serverless` - Postgres driver
- `@vercel/blob` - File storage
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `tailwindcss` - Utility-first CSS

## 🙏 Acknowledgments

Built with modern web technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Neon](https://neon.tech/) - Serverless Postgres
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📄 License

**All Rights Reserved** - Do not use without permission.

This code is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit written permission from the owner.

---

**For detailed setup instructions, see [SETUP.md](SETUP.md)**  
**For admin usage guide, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)**  
**For security information, see [SECURITY.md](SECURITY.md)**
