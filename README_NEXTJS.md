# Portfolio - Next.js Version

## Overview
This portfolio has been migrated to Next.js while maintaining compatibility with Cloudflare Pages infrastructure.

## Project Structure

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
│   └── api/                      # Next.js API routes (for local dev)
│       ├── biography/route.js
│       └── projects/route.js
├── functions/                    # Cloudflare Pages Functions (for production)
│   └── api/
│       ├── biography.js
│       └── projects.js
├── public/                       # Static assets
│   └── assets/
├── src/                          # Legacy vanilla JS version (kept as reference)
├── next.config.js                # Next.js configuration
├── package.json
└── wrangler.toml                 # Cloudflare configuration
```

## Development

### Local Development
```bash
npm run dev
```
This starts the Next.js development server at http://localhost:3000

- Uses Next.js API routes (`app/api/`) for local development
- Mock data is returned for biography and projects

### Build for Production
```bash
npm run build
```
This creates an optimized production build in `.next` directory

## Deployment to Cloudflare Pages

When deployed to Cloudflare Pages:
1. Next.js pages are built and served as static assets
2. Cloudflare Pages Functions (`functions/api/*`) handle API requests
3. D1 database integration works through Cloudflare Functions

### Deployment Steps
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `.next`
4. Configure D1 database binding in Cloudflare dashboard
5. Deploy!

## Key Features

### ✅ Completed Migration
- [x] Next.js App Router structure
- [x] React components for all sections
- [x] Client-side data fetching with `useState` and `useEffect`
- [x] Responsive design maintained
- [x] API routes for local development
- [x] Cloudflare Functions for production
- [x] Smooth scrolling navigation
- [x] Dynamic content loading

### 🎨 Design
- Modern gradient hero section
- Responsive grid layouts
- Card-based project showcase
- Professional typography
- Smooth animations and transitions

### 🔧 Technologies
- **Frontend**: Next.js 15, React 19
- **Styling**: CSS (CSS Variables, Flexbox, Grid)
- **API**: Next.js API Routes (local) + Cloudflare Pages Functions (production)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (for future file uploads)
- **Hosting**: Cloudflare Pages

## API Endpoints

### Local Development
- `GET /api/biography` - Returns mock biography data
- `GET /api/projects` - Returns mock projects data

### Production (Cloudflare Pages)
- `GET /api/biography` - Fetches from D1 database
- `GET /api/projects` - Fetches from D1 database

## Configuration Notes

### next.config.js
- `images.unoptimized: true` - Required for Cloudflare Pages
- `trailingSlash: true` - Better compatibility with static hosting
- No `output: 'export'` - Allows API routes to work in development

### Two API Layers
1. **Next.js API Routes** (`app/api/*/route.js`)
   - Used for local development only
   - Provides mock data
   
2. **Cloudflare Functions** (`functions/api/*.js`)
   - Used in production when deployed to Cloudflare Pages
   - Connects to real D1 database
   - Cloudflare automatically prioritizes these over Next.js routes

## Future Enhancements

- [ ] Add image optimization for Cloudflare Pages
- [ ] Implement R2 storage for file uploads
- [ ] Add authentication for admin panel
- [ ] Create admin interface for content management
- [ ] Add blog section
- [ ] Implement contact form with email integration

## Migration Notes

The original vanilla JavaScript version is preserved in the `src/` directory for reference. The Cloudflare Functions in `functions/api/` remain unchanged and will work in production deployment.

## Support

For issues or questions about:
- Next.js setup: Check Next.js documentation
- Cloudflare deployment: Refer to DEPLOYMENT_GUIDE.md
- D1 database: See schema.sql and wrangler.toml

## License
MIT
