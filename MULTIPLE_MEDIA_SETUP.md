# 🎬 Multiple Media Setup Guide

Complete guide to enable multiple videos and PDFs per project with professional navigation.

---

## 🌟 New Features

✨ **What's New:**
- Upload **multiple videos** (YouTube) per project
- Upload **multiple PDFs** per project
- Professional media gallery with sidebar navigation
- Individual titles and descriptions for each media item
- Easy reordering with display_order control
- Clean, modern UI with numbered navigation
- Responsive design for mobile and desktop
- Separate management interface accessible from Projects Manager

---

## 📋 Step 1: Database Migration

### Run SQL Migration

1. Go to your **Neon Dashboard** (https://neon.tech)
2. Select your **portfolio-db** project
3. Click **SQL Editor** in the left sidebar
4. Copy and paste the SQL from `DATABASE_SCHEMA_MULTIPLE_MEDIA.sql`:

```sql
-- Create project_media table to store multiple media files per project
CREATE TABLE IF NOT EXISTS project_media (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('video', 'pdf')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_key TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_type ON project_media(project_id, media_type);

-- Migrate existing media from projects table (preserves your current videos/PDFs)
INSERT INTO project_media (project_id, media_type, title, url, display_order)
SELECT 
  id as project_id,
  'video' as media_type,
  title || ' - Video Demo' as title,
  video_url as url,
  0 as display_order
FROM projects 
WHERE video_url IS NOT NULL AND video_url != '';

INSERT INTO project_media (project_id, media_type, title, url, file_key, display_order)
SELECT 
  id as project_id,
  'pdf' as media_type,
  title || ' - Documentation' as title,
  pdf_url as url,
  pdf_file_key as file_key,
  0 as display_order
FROM projects 
WHERE pdf_url IS NOT NULL AND pdf_url != '';
```

5. Click **Run** or **Execute**
6. ✅ Your database is now ready!

### Database Schema

The new `project_media` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `project_id` | INTEGER | Links to projects table |
| `media_type` | VARCHAR(20) | 'video' or 'pdf' |
| `title` | VARCHAR(255) | Display title for the media |
| `description` | TEXT | Optional description |
| `url` | TEXT | YouTube URL or PDF blob URL |
| `file_key` | TEXT | Vercel Blob key for PDFs |
| `display_order` | INTEGER | Order of display (lower first) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

## 🎨 Step 2: How to Use

### Managing Project Media (Admin Dashboard)

1. **Navigate to Admin Dashboard**
   - Go to `/admin/dashboard`
   - Log in with your credentials

2. **Access Media Manager**
   - Find the project you want to add media to
   - Click the purple **"Media"** button
   - This opens the Media Manager modal

3. **Add Videos**
   - Click **"+ Add Media"**
   - Select **"Video (YouTube)"** as media type
   - Enter a descriptive title (e.g., "Product Demo", "Feature Walkthrough")
   - Optionally add a description
   - Paste the YouTube URL
   - Set display order (0 = first, 1 = second, etc.)
   - Click **"Add Media"**

4. **Add PDFs**
   - Click **"+ Add Media"**
   - Select **"PDF Document"** as media type
   - Enter a descriptive title (e.g., "Technical Documentation", "User Guide")
   - Optionally add a description
   - Click **"Choose File"** and select your PDF (max 20MB)
   - Set display order
   - Click **"Add Media"**

5. **Manage Existing Media**
   - View all videos and PDFs in organized sections
   - See counts at the top (Videos: X, PDFs: Y)
   - Click **"Delete"** to remove any media item
   - Delete also removes PDFs from Vercel Blob storage

### Viewing Media (Public Project Pages)

1. **Navigate to a Project**
   - Go to `/projects` and click any project
   - Or go directly to `/projects/[id]`

2. **Media Gallery Features**
   - **Multiple Videos/PDFs**: If project has only one type, displays directly
   - **Type Tabs**: If both videos and PDFs exist, shows tabs to switch between
   - **Navigation Sidebar**: If multiple items of one type exist, shows numbered list on right
   - **Click Navigation**: Click any numbered item to switch view
   - **Active Indicator**: Current item highlighted with gradient background
   - **Responsive**: Sidebar moves below on mobile devices

---

## 🎯 API Endpoints

### New Endpoints Created

#### `GET /api/projects/[id]/media`
Fetches all media items for a project.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "media_type": "video",
      "title": "Product Demo",
      "description": "Overview of main features",
      "url": "https://youtube.com/watch?v=...",
      "display_order": 0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/projects/[id]/media`
Adds new media item to a project.

**Request Body:**
```json
{
  "media_type": "video",
  "title": "Feature Walkthrough",
  "description": "Detailed feature explanation",
  "url": "https://youtube.com/watch?v=...",
  "display_order": 1
}
```

#### `PUT /api/projects/[id]/media`
Updates an existing media item.

**Request Body:**
```json
{
  "media_id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "display_order": 2
}
```

#### `DELETE /api/projects/[id]/media?media_id=1`
Deletes a media item and associated blob storage.

---

## 🧩 New Components

### 1. **ProjectMediaManager** (`app/components/ProjectMediaManager.js`)
Modal interface for managing project media from admin dashboard.

**Features:**
- Visual summary cards showing video/PDF counts
- Add/delete media items
- PDF upload with progress indicator
- Organized sections for videos and PDFs
- Real-time updates after changes

### 2. **ProjectMediaGallery** (`app/components/ProjectMediaGallery.js`)
Public-facing media display with professional navigation.

**Features:**
- Type selector tabs (Videos/Documents)
- Main display area with title/description
- Numbered navigation sidebar
- Active item highlighting
- Responsive layout
- Smooth transitions

---

## 🔄 Migration Notes

### Existing Projects
- Your existing `video_url` and `pdf_url` data is automatically migrated
- Old columns remain in database for backward compatibility
- New system reads from `project_media` table first
- You can safely remove old columns after verifying migration:

```sql
-- OPTIONAL: Remove old columns after verifying everything works
ALTER TABLE projects DROP COLUMN IF EXISTS video_url;
ALTER TABLE projects DROP COLUMN IF EXISTS pdf_url;
ALTER TABLE projects DROP COLUMN IF EXISTS pdf_file_key;
```

### Fallback Behavior
- If `project_media` table is empty for a project, system falls back to old columns
- This ensures no data loss during transition

---

## 🎨 UI/UX Enhancements

### Media Manager Modal
- **Full-screen overlay** with centered modal
- **Color-coded summary cards** with gradient backgrounds
- **Organized sections** separating videos and PDFs
- **Visual feedback** for all actions
- **Empty state** with helpful message

### Media Gallery
- **Professional navigation** with numbered items
- **Gradient highlights** for active selections
- **Smooth transitions** between items
- **Responsive sidebar** that adapts to screen size
- **Clean typography** for readability

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar navigation on the right
- Full-width media display
- Type tabs span full width

### Tablet (768px - 1023px)
- Sidebar moves below main content
- Maintained readability and navigation

### Mobile (<768px)
- Compact type selector (icons only)
- Stacked navigation cards
- Touch-optimized buttons
- Smaller media display area

---

## ✅ Testing Checklist

After setup, verify:

- [ ] Database migration completed successfully
- [ ] Can access Media Manager from Projects list
- [ ] Can add new videos with YouTube URLs
- [ ] Can upload new PDFs (test with <20MB file)
- [ ] Videos display correctly in gallery
- [ ] PDFs render properly in viewer
- [ ] Navigation sidebar appears with multiple items
- [ ] Type tabs appear when both videos and PDFs exist
- [ ] Can delete media items
- [ ] Deleted PDFs removed from Vercel Blob
- [ ] Mobile responsive design works correctly
- [ ] Old projects still show migrated media

---

## 🚀 Best Practices

### For Videos
- Use descriptive titles: "Product Demo", "Tutorial Part 1"
- Add descriptions to provide context
- Order videos logically (intro → features → conclusion)
- Use high-quality YouTube videos

### For PDFs
- Keep files under 20MB for fast loading
- Use clear titles: "Technical Specifications", "User Manual"
- Organize by type or audience
- Ensure PDFs are searchable (not scanned images)

### Display Order
- **0** = First item shown
- **1** = Second item shown
- **2** = Third item shown, etc.
- Use increments of 10 (0, 10, 20) to allow easy reordering

---

## 🆘 Troubleshooting

### Media Manager Won't Open
- Check browser console for errors
- Verify project ID exists
- Ensure you're logged in as admin

### Videos Not Displaying
- Verify YouTube URL is correct
- Check if video is public (not private/unlisted)
- Ensure `lib/youtube.js` functions work correctly

### PDF Upload Fails
- Check file size (must be <20MB)
- Verify Vercel Blob is configured (see `VERCEL_BLOB_SETUP.md`)
- Check `BLOB_READ_WRITE_TOKEN` in environment variables

### Navigation Sidebar Missing
- Sidebar only shows with 2+ items of same type
- Check if media items exist in database
- Verify `display_order` values are set

### API Errors
- Check Neon database connection
- Verify `DATABASE_URL` in environment variables
- Check browser network tab for specific error messages

---

## 🎉 You're All Set!

Your portfolio now supports multiple videos and PDFs per project with a professional, easy-to-navigate interface. 

**Next Steps:**
1. Add media to your existing projects
2. Test the gallery on different devices
3. Customize the gradient colors in `ProjectMediaGallery.js` if desired
4. Share your enhanced portfolio!

---

## 📚 Related Documentation

- **Database Setup**: `DATABASE_SETUP.md`
- **Vercel Blob Setup**: `VERCEL_BLOB_SETUP.md`
- **Admin Guide**: `ADMIN_GUIDE.md`
- **Deployment**: `VERCEL_DEPLOYMENT.md`

---

**Questions or Issues?** Check the troubleshooting section or review the component code for customization options.
