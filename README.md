# Portfolio - Next.js on Cloudflare Pages

A full-stack professional portfolio application built with Next.js and deployed on Cloudflare's free infrastructure.

## 🏗️ Architecture

This project uses a modern serverless architecture:

- **Frontend**: Next.js 15 with React 19 (App Router)
- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (serverless SQLite)
- **File Storage**: Cloudflare R2 (S3-compatible object storage)
- **Authentication**: JWT-based admin authentication

## 📋 Features

### 1. Professional Portfolio
- Dynamic biography section with profile photo
- Contact information and social links
- Resume download functionality
- Responsive design

### 2. Project Showcase
- Project cards with descriptions
- Links to live demos and repositories
- Video demonstrations support
- Image galleries

### 3. Admin Dashboard
- Secure authentication system
- Content management interface
- Biography and project editing
- Protected routes with JWT

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: CSS (CSS Variables, Flexbox, Grid)
- **Backend**: Next.js API Routes
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages
- **Authentication**: JWT with bcrypt
- **Version Control**: Git + GitHub

## 🚀 Development Setup

### Prerequisites
- Node.js (v18+)
- npm
- Git
- Cloudflare account (free)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio_infrastructure

# Install dependencies
npm install

# Install Cloudflare Wrangler CLI globally (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set up D1 database
wrangler d1 create portfolio-db
# Copy the database_id from output and update wrangler.toml

# Initialize database with schema
npm run d1:init
```

### Local Development

```bash
# Start Next.js development server
npm run dev
```

This starts the development server at http://localhost:3000

- Uses Next.js API routes for local development
- Mock data is returned for biography and projects
- Hot module reloading enabled

## 📁 Project Structure

```
portfolio_infrastructure/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   ├── globals.css               # Global styles
│   ├── components/               # React components
│   │   ├── Header.js
│   │   ├── HeroSection.js
│   │   ├── ProjectsSection.js
│   │   ├── ContactSection.js
│   │   └── Footer.js
│   ├── admin/                    # Admin pages
│   │   ├── login/page.js
│   │   └── dashboard/page.js
│   └── api/                      # API routes
│       ├── admin/
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   └── me/route.js
│       ├── biography/route.js
│       └── projects/route.js
├── lib/                          # Utilities
│   └── auth.js                   # Authentication helpers
├── public/                       # Static assets
│   └── assets/
├── schema.sql                    # Database schema
├── next.config.js                # Next.js configuration
├── wrangler.toml                 # Cloudflare configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/biography` - Get biography information
- `GET /api/projects` - Get all projects

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin user

## 🚀 Deployment to Cloudflare Pages

### Method 1: Using Wrangler CLI

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run pages:deploy
```

### Method 2: Connect Git Repository

1. Push your code to GitHub
2. Go to Cloudflare Dashboard > Pages
3. Click "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: (leave empty)
6. Set environment variables if needed
7. Click "Save and Deploy"

### Post-Deployment Configuration

1. **Configure D1 Database**:
   - In Cloudflare Dashboard, go to Pages > Your Project > Settings > Functions
   - Add D1 database binding:
     - Variable name: `DB`
     - D1 database: Select your `portfolio-db`

2. **Configure R2 Storage** (for file uploads):
   - Add R2 bucket binding:
     - Variable name: `FILES`
     - R2 bucket: Select your `portfolio-files` bucket

3. **Set Environment Variables**:
   - `JWT_SECRET`: Your secret key for JWT tokens
   - `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password

## 🔧 Configuration

### next.config.js
```javascript
{
  images: { unoptimized: true },  // Required for Cloudflare Pages
  trailingSlash: true,             // Better static hosting compatibility
  reactStrictMode: true
}
```

### wrangler.toml
- `pages_build_output_dir = ".next"` - Points to Next.js build output
- Configure D1 and R2 bindings as needed

## 🗄️ Database Management

```bash
# Create D1 database
npm run d1:create

# Initialize schema
npm run d1:init

# Execute custom query
npm run d1:query "SELECT * FROM biography"
```

## 📝 Admin Setup

1. Generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

2. Add admin user to database:
```bash
wrangler d1 execute portfolio-db --command "INSERT INTO admins (username, password_hash) VALUES ('admin', 'your-hash-here')"
```

3. Login at `/admin/login`

## 🎨 Customization

### Styling
- Global styles: `app/globals.css`
- Component-specific styles: Inline or CSS modules
- CSS variables for theming

### Content
- Update biography through admin dashboard (once deployed)
- Add projects through the database
- Modify components in `app/components/`

## 🔒 Security Features

- JWT-based authentication
- HTTP-only cookies for token storage
- Bcrypt password hashing
- Protected admin routes
- CORS configuration

## 📚 Additional Documentation

- `ADMIN_GUIDE.md` - Admin interface usage
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `schema.sql` - Database structure

## 🔮 Future Enhancements

- [ ] Image optimization for Cloudflare Pages
- [ ] R2 integration for file uploads
- [ ] Blog section with markdown support
- [ ] Contact form with email integration
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] PWA capabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🙏 Acknowledgments

Built with Next.js and deployed on Cloudflare's excellent free tier infrastructure.

---

**Built with ❤️ using Next.js and Cloudflare Pages**
