# Online Portfolio Application

A full-stack professional portfolio application built on Cloudflare's free infrastructure.

## 🏗️ Architecture

This project uses a modern serverless architecture:

- **Frontend**: Static site deployed to **Cloudflare Pages**
- **Backend**: Serverless functions using **Cloudflare Workers**
- **Database**: **Cloudflare D1** (serverless SQLite)
- **File Storage**: **Cloudflare R2** (S3-compatible object storage)

## 📋 Features

### 1. Professional Biography Section
- Resume (PDF download)
- Contact details
- Professional photo
- Bio information

### 2. Projects Demonstrations
- Project descriptions
- Optional video demos
- Optional runnable code (Python/Java in browser)
- Live project links

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla/React)
- **Backend**: Cloudflare Workers (JavaScript/TypeScript)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages + Workers
- **Version Control**: Git + GitHub

## 🚀 Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git
- Cloudflare account (free)

### Installation

```bash
# Install dependencies
npm install

# Install Cloudflare Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set up D1 database
wrangler d1 create portfolio-db

# Run locally
npm run dev
```

## 📁 Project Structure

```
portfolio_infrastructure/
├── src/                    # Frontend source files
│   ├── index.html         # Main HTML
│   ├── styles/            # CSS files
│   └── scripts/           # JavaScript files
├── api/                   # Cloudflare Workers (backend)
│   └── index.js          # API endpoints
├── schema.sql            # Database schema
├── wrangler.toml         # Cloudflare configuration
└── README.md            # This file
```

## 🌐 Deployment

```bash
# Deploy to Cloudflare
npm run deploy
```

## 📝 License

MIT

---

**Built with ❤️ using Cloudflare's free infrastructure**
