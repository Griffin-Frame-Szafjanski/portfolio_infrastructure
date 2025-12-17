# 🎨 Professional Portfolio - Next.js

A modern, full-stack portfolio application built with Next.js 15, featuring a powerful admin panel, secure authentication, and seamless content management. Deployed on Vercel with Neon Postgres database and Vercel Blob storage.

## ✨ Features

### Public Portfolio
- 📝 **Dynamic Biography** - Personal information, skills, resume, and social links
- 🚀 **Project Showcase** - Display projects with images, videos, and PDF documentation
- 🎬 **Media Support** - Embedded YouTube videos and PDF viewers
- 🌓 **Dark Mode** - Beautiful light/dark theme toggle
- 📧 **Contact Form** - Visitors can send messages directly
- 📱 **Fully Responsive** - Optimized for all devices

### Admin Dashboard
- 🔐 **Secure Authentication** - JWT-based login with rate limiting
- ✏️ **Biography Editor** - Update personal info, upload photo and resume
- 🎨 **Projects Manager** - CRUD operations with media management
- 📹 **Media Management** - Add videos, PDFs, reorder with drag-and-drop arrows
- 💬 **Messages Dashboard** - View and manage contact submissions
- 🔑 **Password Management** - Secure password change functionality
- 🔒 **Always Light Mode** - Admin interface uses consistent light theme

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Neon Postgres (Serverless)
- **Authentication**: JWT with HTTP-only cookies, BCrypt password hashing
- **File Storage**: Vercel Blob (images, PDFs, resumes)
- **Deployment**: Vercel with automatic HTTPS
- **Security**: Rate limiting, SQL injection prevention, XSS protection

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd portfolio_infrastructure
npm install

# Set up environment (see SETUP.md)
cp .env.local.example .env.local
# Edit .env.local with your credentials

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
- **[SECURITY_AUDIT.md](SECURITY_AUDIT.md)** - Security measures and best practices
- **[DATABASE_COMPLETE_SCHEMA.sql](DATABASE_COMPLETE_SCHEMA.sql)** - Complete database schema

## 📁 Project Structure

```
portfolio_infrastructure/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (REST endpoints)
│   ├── components/         # React components
│   ├── context/            # React Context (theme management)
│   ├── biography/          # Biography page
│   ├── projects/           # Projects pages
│   └── contact/            # Contact page
├── lib/
│   ├── auth.js             # Authentication & JWT
│   ├── db.js               # Database operations
│   └── youtube.js          # YouTube embed helpers
├── scripts/
│   └── hash-password.js    # Password hashing utility
├── SETUP.md                # Setup guide
├── ADMIN_GUIDE.md          # Admin manual
├── SECURITY_AUDIT.md       # Security documentation
└── DATABASE_COMPLETE_SCHEMA.sql  # Database schema
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
| Projects | `/projects` | All projects showcase |
| Project Detail | `/projects/[id]` | Individual project with media tabs |
| Contact | `/contact` | Contact form with validation |
| Admin Login | `/admin/login` | Secure authentication |
| Admin Dashboard | `/admin/dashboard` | Content management hub |

## ⚙️ Environment Variables

Required variables (add to `.env.local` and Vercel):

```env
DATABASE_URL=postgresql://...              # Neon Postgres connection string
JWT_SECRET=<32+ character random string>   # JWT signing secret
BLOB_READ_WRITE_TOKEN=<vercel-blob-token> # File storage token
NODE_ENV=production                        # Environment (development/production)
```

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
4. Review `SECURITY_AUDIT.md` for complete security guide
5. Keep dependencies updated: `npm audit`
6. Enable HTTPS in production (Vercel provides automatically)

## 📱 Deployment

Deploy to Vercel in one command:

```bash
vercel --prod
```

See **[SETUP.md](SETUP.md)** for detailed deployment instructions including:
- Database setup
- Environment configuration
- File storage setup
- Custom domain configuration

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Check environment variables are set in Vercel
- Run `npm install` to update dependencies
- Clear build cache: `rm -rf .next`

**Database Connection**
- Verify `DATABASE_URL` format
- Ensure Neon database is active
- Check SSL mode is set correctly

**File Uploads Fail**
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check file size limits
- Ensure Vercel Blob storage is configured

**Authentication Issues**
- Verify `JWT_SECRET` is set (32+ characters)
- Clear browser cookies
- Check password was hashed correctly

## 📝 API Endpoints

### Public
- `GET /api/biography` - Biography data
- `GET /api/projects` - All projects
- `GET /api/projects/[id]` - Single project
- `GET /api/projects/[id]/media` - Project media
- `POST /api/contact` - Submit contact form

### Protected (requires authentication)
- `PUT /api/biography/[id]` - Update biography
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/media` - Add media
- `PUT /api/projects/[id]/media` - Update media
- `DELETE /api/projects/[id]/media` - Delete media
- `GET /api/admin/messages` - Get messages
- `POST /api/admin/change-password` - Change password
- All `/api/upload/*` endpoints

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

MIT License - free to use for your own portfolio!

---

**For detailed setup instructions, see [SETUP.md](SETUP.md)**  
**For admin usage guide, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)**  
**For security information, see [SECURITY_AUDIT.md](SECURITY_AUDIT.md)**
