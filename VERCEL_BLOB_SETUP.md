# 🗄️ Vercel Blob Storage Setup Guide

This guide explains how to set up Vercel Blob storage for file uploads (profile photos and resumes).

---

## 📋 What is Vercel Blob?

Vercel Blob is a serverless file storage solution that integrates seamlessly with your Vercel deployments:
- ✅ **Free tier**: 500GB bandwidth/month
- ✅ **Fast CDN delivery**: Global edge network
- ✅ **Easy integration**: Simple API
- ✅ **Secure**: Automatic HTTPS and access control

---

## 🚀 Setup Steps

### 1. Enable Vercel Blob in Your Project

```bash
# Option 1: Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Blob"
5. Click "Create"

# Option 2: Via Vercel CLI (if installed)
vercel blob create
```

### 2. Get Your Blob Token

After creating the Blob store:

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. You should see `BLOB_READ_WRITE_TOKEN` automatically created
3. If not, create it manually:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Get from Storage → Blob → Settings → Tokens

### 3. Add to Local Environment

Create or update `.env.local`:

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 4. Verify Installation

Check that the package is installed:
```bash
npm list @vercel/blob
# Should show: @vercel/blob@x.x.x
```

---

## 📁 Project Structure

New files added for Blob storage:

```
portfolio_infrastructure/
├── app/api/
│   └── upload/
│       ├── photo/route.js          # Profile photo upload
│       └── resume/route.js         # Resume upload
├── VERCEL_BLOB_SETUP.md           # This guide
└── .env.local                      # Local environment (gitignored)
```

---

## 🔧 How It Works

### Profile Photo Upload Flow

1. **User selects file** in admin dashboard
2. **Frontend** sends file to `/api/upload/photo`
3. **API** uploads to Vercel Blob
4. **Returns** public URL
5. **Frontend** saves URL to database
6. **Biography page** displays image from Blob URL

### Resume Upload Flow

Same as photo, but to `/api/upload/resume` endpoint.

---

## 🌐 File Access

### Public URLs
All uploaded files get public URLs like:
```
https://[random-id].public.blob.vercel-storage.com/filename.jpg
```

### Features
- ✅ Automatic HTTPS
- ✅ Global CDN caching
- ✅ No bandwidth limits on free tier
- ✅ Permanent storage (unless manually deleted)

---

## 🔒 Security

### Upload Protection
- ✅ Only authenticated admin can upload
- ✅ File type validation (images/PDFs only)
- ✅ File size limits enforced
- ✅ Token stored securely in environment variables

### File Naming
Files are stored with unique names to prevent:
- Overwriting existing files
- Guessing file URLs
- Conflicts between users

---

## 💾 File Size Limits

**Recommended limits** (configured in API):
- **Profile Photo**: 5 MB (images only: jpg, png, webp)
- **Resume**: 10 MB (PDF only)

**Vercel Blob Limits**:
- Free tier: 500GB bandwidth/month
- No storage limit
- 4.5 MB max per serverless function (use client upload for larger)

---

## 🧪 Testing

### Test Upload Flow

1. **Login** to admin dashboard
2. **Navigate** to Biography Editor
3. **Click** "Choose File" buttons
4. **Select** a file (photo or PDF)
5. **Upload** starts automatically
6. **Verify** success message
7. **Check** file displays on biography page

### Verify in Vercel

1. Go to **Vercel Dashboard** → **Storage** → **Blob**
2. Click your Blob store
3. See uploaded files listed
4. Click files to view/download

---

## 🔧 Troubleshooting

### Upload Fails

**Problem**: "Upload failed" error  
**Solution**:
- Check `BLOB_READ_WRITE_TOKEN` is set in Vercel
- Verify token has read/write permissions
- Check file size doesn't exceed limits

### Token Not Found

**Problem**: "BLOB_READ_WRITE_TOKEN is not defined"  
**Solution**:
- Add token to `.env.local` for local dev
- Add token to Vercel environment variables for production
- Redeploy after adding variables

### Files Not Displaying

**Problem**: Uploaded but not showing  
**Solution**:
- Check database has correct URL saved
- Verify URL is accessible (open in browser)
- Check for CORS issues (shouldn't happen with Vercel Blob)

### Old Files Taking Space

**Problem**: Want to delete old uploads  
**Solution**:
```bash
# Via Vercel Dashboard
1. Go to Storage → Blob → Your Store
2. Select files to delete
3. Click Delete

# Or use API (advanced)
# Create admin endpoint to delete files
```

---

## 📊 Monitoring Usage

### Check Storage Usage

1. **Vercel Dashboard** → **Storage** → **Blob**
2. View:
   - Total files stored
   - Bandwidth used this month
   - Storage size

### Free Tier Limits

- **Bandwidth**: 500GB/month (resets monthly)
- **Storage**: Unlimited
- **Requests**: Unlimited

If you exceed, Vercel will notify you and you can upgrade.

---

## 🔄 Migration from URLs

If you previously used external URLs:

1. **Old URLs still work** - No need to migrate immediately
2. **Upload new files** to Blob going forward
3. **Optionally download old files** and re-upload to Blob
4. **Update database** with new Blob URLs

---

## 🎯 Best Practices

### File Management

✅ **Do**:
- Upload images in modern formats (WebP, JPEG)
- Compress images before upload
- Use descriptive filenames
- Delete unused files periodically

❌ **Don't**:
- Upload extremely large files
- Store sensitive data without encryption
- Use Blob for frequently changing files

### Performance

- ✅ Images are automatically cached by CDN
- ✅ Use `next/image` for optimized loading
- ✅ Set proper cache headers
- ✅ Use lazy loading for images

---

## 📚 Additional Resources

- **[Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)** - Official documentation
- **[Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)** - SDK guide
- **[Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body)** - Form data handling

---

## 💡 Quick Reference

### Environment Variables
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

### API Endpoints
```
POST /api/upload/photo   # Upload profile photo
POST /api/upload/resume  # Upload resume PDF
```

### Usage
```javascript
import { put } from '@vercel/blob';

const blob = await put(filename, file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

console.log(blob.url); // Public URL
```

---

**Setup Complete!** 🎉 Your portfolio now supports file uploads with Vercel Blob!
