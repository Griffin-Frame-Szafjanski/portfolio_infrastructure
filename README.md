# 🎨 Professional Portfolio - Next.js

A modern, full-stack portfolio application built with Next.js, deployed on Vercel with Neon Postgres database.

---

## ✨ Features

### Public Portfolio
- 📝 **Dynamic Biography** - Personal information, contact details, and social links
- 🚀 **Project Showcase** - Display your work with descriptions, tech stacks, and links
- 📧 **Contact Form** - Visitors can send messages directly
- 📱 **Responsive Design** - Works beautifully on all devices

### Admin Dashboard
- 🔐 **Secure Authentication** - JWT-based admin login
- ✏️ **Content Management** - Edit biography and projects
- 💬 **Message Management** - View and manage contact form submissions
- 🎯 **Real-time Updates** - Changes reflect immediately on the site

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19 |
| **Styling** | CSS with CSS Variables, Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | Neon Postgres (Serverless) |
| **Authentication** | JWT with HTTP-only cookies |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon account (free)
- Vercel account (free)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio_infrastructure

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see your portfolio!

---

## 📁 Project Structure

```
portfolio_infrastructure/
├── app/
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Homepage
│   ├── globals.css               # Global styles
│   ├── biography/                # Biography page
│   ├── projects/                 # Projects pages
│   ├── contact/                  # Contact page
│   ├── admin/                    # Admin pages
│   │   ├── login/
│   │   └── dashboard/
│   ├── components/               # React components
│   └── api/                      # API routes
│       ├── biography/
│       ├── projects/
│       ├── contact/
│       └── admin/
├── lib/
│   ├── db.js                     # Neon database functions
│   └── auth.js                   # Authentication helpers
├── public/                       # Static assets
├── VERCEL_DEPLOYMENT.md          # Deployment guide
├── DATABASE_SETUP.md             # Database setup guide
├── ADMIN_GUIDE.md                # Admin usage guide
└── README.md                     # This file
```

---

## 🗄️ Database & Deployment

### Set Up Database
See **[DATABASE_SETUP.md](DATABASE_SETUP.md)** for complete instructions on:
- Creating a Neon Postgres database
- Configuring environment variables
- Running the database schema
- Connecting to Vercel

### Deploy to Vercel
See **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** for:
- GitHub integration (auto-deploy)
- Vercel CLI deployment
- Environment variable configuration
- Custom domain setup

### Use Admin Panel
See **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** for:
- Logging in to the admin dashboard
- Managing biography content
- Adding/editing projects
- Handling contact messages

---

## 🌐 API Endpoints

### Public Endpoints
```
GET  /api/biography              # Get biography data
GET  /api/projects               # Get all projects
GET  /api/projects/[id]          # Get single project
POST /api/contact                # Submit contact form
```

### Admin Endpoints (Protected)
```
POST   /api/admin/login          # Admin login
POST   /api/admin/logout         # Admin logout
GET    /api/admin/me             # Get current user
PUT    /api/biography/[id]       # Update biography
POST   /api/projects             # Create project
PUT    /api/projects/[id]        # Update project
DELETE /api/projects/[id]        # Delete project
GET    /api/admin/messages       # Get all messages
PUT    /api/admin/messages/[id]  # Update message (mark read)
DELETE /api/admin/messages/[id]  # Delete message
```

---

## ⚙️ Environment Variables

Create a `.env.local` file (for local development):

```bash
# Database
DATABASE_URL=your-neon-connection-string

# Authentication
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**In Vercel Dashboard:**
Add these same variables in Settings → Environment Variables → Production

---

## 🎨 Customization

### Styling
- Edit `app/globals.css` for global styles and CSS variables
- Modify color scheme by updating CSS variables
- Component styles use scoped CSS-in-JS

### Content
- **Biography**: Update through admin dashboard after deployment
- **Projects**: Add/edit through admin dashboard
- **Static Pages**: Edit files in `app/` directory

### Components
All React components are in `app/components/`:
- `Header.js` - Navigation bar
- `HeroSection.js` - Homepage hero section
- `ProjectsSection.js` - Projects showcase
- `ContactSection.js` - Contact form
- `Footer.js` - Site footer

---

## 🔒 Security

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing (handled by authentication)
- ✅ Protected admin routes
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ SQL injection protection (parameterized queries)

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| Biography | `/biography` | Full biography and resume |
| Projects | `/projects` | Showcase of all projects |
| Project Detail | `/projects/[id]` | Individual project page |
| Contact | `/contact` | Contact form |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin/dashboard` | Content management |

---

## 🧪 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```

---

## 📚 Additional Resources

- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about Next.js features
- **[Neon Documentation](https://neon.tech/docs)** - Serverless Postgres guides  
- **[Vercel Documentation](https://vercel.com/docs)** - Deployment and hosting

---

## 🐛 Troubleshooting

### Build Fails
- Check all environment variables are set
- Run `npm install` to ensure dependencies are installed
- Check Vercel build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set in Vercel
- Check Neon dashboard to ensure database is active
- Verify database schema has been initialized

### Admin Login Not Working
- Ensure `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set
- Check browser console for errors
- Try clearing cookies and logging in again

---

## 📝 License

MIT License - feel free to use this project for your own portfolio!

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org/) - The React framework
- [Neon](https://neon.tech/) - Serverless Postgres
- [Vercel](https://vercel.com/) - Deployment platform

---

**Made by you | Deployed on Vercel**
