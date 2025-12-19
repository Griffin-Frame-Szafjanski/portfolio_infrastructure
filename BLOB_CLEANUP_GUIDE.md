# 🧹 Blob Storage Cleanup System

## Overview

Automatic cleanup system that deletes old files from Vercel Blob storage when they're replaced with new uploads, preventing storage bloat and unnecessary costs.

## Problem Solved

Without cleanup:
- Upload profile photo → `photo-1.jpg` stored
- Upload new profile photo → `photo-2.jpg` stored, but `photo-1.jpg` still exists
- Repeat 100 times → 100 unused files consuming storage

With cleanup:
- Upload profile photo → `photo-1.jpg` stored
- Upload new profile photo → `photo-2.jpg` stored, `photo-1.jpg` **automatically deleted** ✅
- Storage only contains current files

## How It Works

### Automatic Detection
The system automatically detects when a Vercel Blob URL is being replaced:
1. Fetches the current record before updating
2. Compares old URL with new URL
3. If different, deletes the old blob file
4. Updates the database with new URL

### Smart Filtering
Only deletes files that:
- ✅ Are Vercel Blob URLs (contains `vercel-storage.com`)
- ✅ Are being **replaced** (not just removed)
- ✅ Are different from the new URL
- ❌ Skips external URLs (GitHub, LinkedIn, etc.)
- ❌ Skips if BLOB_READ_WRITE_TOKEN not configured

## Implemented Endpoints

### ✅ Biography Updates
**Endpoint:** `PUT /api/biography/[id]`

Cleans up when replacing:
- `profile_photo_url` - Profile photos
- `resume_pdf_url` - Resume PDFs

**Example Flow:**
```javascript
// Old: https://blob.vercel-storage.com/profile-photo-1.jpg
// New: https://blob.vercel-storage.com/profile-photo-2.jpg
// Result: photo-1.jpg deleted, photo-2.jpg active
```

### ✅ Project Updates
**Endpoint:** `PUT /api/projects/[id]`

Cleans up when replacing:
- `image_url` - Project cover images

**Example Flow:**
```javascript
// Old: https://blob.vercel-storage.com/project-images/image-1.png
// New: https://blob.vercel-storage.com/project-images/image-2.png
// Result: image-1.png deleted, image-2.png active
```

## Implementation Pattern

### For Update Endpoints

```javascript
import { cleanupReplacedBlobs } from '@/lib/blob-cleanup';
import { getRecordById } from '@/lib/db';

// 1. Fetch current record
const oldRecord = await getRecordById(id);

// 2. Update the record
const updatedRecord = await updateRecord(id, newData);

// 3. Cleanup old blobs
await cleanupReplacedBlobs(
  oldRecord,           // Old data
  newData,            // New data
  ['image_url']       // URL fields to check
);
```

## API Functions

### `cleanupReplacedBlobs(oldData, newData, urlFields)`
Main function for automatic cleanup when updating records.

**Parameters:**
- `oldData` - Old record with URL fields
- `newData` - New data being saved
- `urlFields` - Array of field names to check (e.g., `['image_url', 'photo_url']`)

**Returns:** Number of files deleted

**Example:**
```javascript
await cleanupReplacedBlobs(
  { image_url: 'https://blob.vercel-storage.com/old.jpg' },
  { image_url: 'https://blob.vercel-storage.com/new.jpg' },
  ['image_url']
);
// Result: old.jpg deleted
```

### `deleteBlobFile(url)`
Delete a single blob file.

**Parameters:**
- `url` - Vercel Blob URL to delete

**Returns:** `true` if deleted, `false` if skipped

**Example:**
```javascript
await deleteBlobFile('https://blob.vercel-storage.com/file.jpg');
```

### `deleteBlobFiles(urls)`
Delete multiple blob files at once.

**Parameters:**
- `urls` - Array of Vercel Blob URLs

**Returns:** Number of files successfully deleted

**Example:**
```javascript
await deleteBlobFiles([
  'https://blob.vercel-storage.com/file1.jpg',
  'https://blob.vercel-storage.com/file2.jpg'
]);
```

## Safety Features

### Non-Breaking
- **Never throws errors** - Failed deletions are logged but don't break the update
- **Continues on failure** - If one file fails to delete, others still process
- **Validates URLs** - Only attempts to delete valid Vercel Blob URLs

### Smart Detection
```javascript
// ✅ Will delete (Vercel Blob URL)
'https://blob.vercel-storage.com/abc123/file.jpg'

// ❌ Won't delete (External URL)
'https://github.com/user/repo'
'https://example.com/image.jpg'

// ❌ Won't delete (No change)
oldUrl === newUrl

// ❌ Won't delete (Removal, not replacement)
newUrl === null || newUrl === undefined
```

## Logging

The system logs all cleanup operations:

```bash
# Success
🧹 Cleaning up 1 replaced blob file(s)
✅ Deleted old blob file: https://blob.vercel-storage.com/old.jpg
Deleted 1 of 1 blob files

# Skipped
Skipping deletion - not a Vercel Blob URL: https://example.com/image.jpg

# Warning
⚠️ Failed to delete blob file: https://blob.vercel-storage.com/file.jpg Error message
```

## Configuration

### Required Environment Variable
```bash
BLOB_READ_WRITE_TOKEN=your_token_here
```

Without this token, the system will:
- Log warnings
- Skip deletions
- Continue normal operation
- Not break your application

## Testing

### Manual Test
1. **Upload a profile photo** in biography editor
2. **Note the URL** in the database
3. **Upload a different photo** 
4. **Check server logs** - Should see: `🧹 Cleaning up 1 replaced blob file(s)`
5. **Verify old file is deleted** - Old URL should return 404

### Test Scenarios
```javascript
// Scenario 1: Replace with new blob
Old: 'https://blob.vercel-storage.com/photo-1.jpg'
New: 'https://blob.vercel-storage.com/photo-2.jpg'
✅ Expected: photo-1.jpg deleted

// Scenario 2: Replace blob with external URL
Old: 'https://blob.vercel-storage.com/photo-1.jpg'
New: 'https://github.com/user/photo.jpg'
✅ Expected: photo-1.jpg deleted

// Scenario 3: Remove URL (set to null)
Old: 'https://blob.vercel-storage.com/photo-1.jpg'
New: null
❌ Expected: photo-1.jpg NOT deleted (intentional removal, not replacement)

// Scenario 4: No change
Old: 'https://blob.vercel-storage.com/photo-1.jpg'
New: 'https://blob.vercel-storage.com/photo-1.jpg'
❌ Expected: Nothing deleted (same URL)

// Scenario 5: External URL unchanged
Old: 'https://github.com/user/photo.jpg'
New: 'https://github.com/user/photo.jpg'
❌ Expected: Nothing deleted (not a blob URL)
```

## Future Enhancements

**Potential additions:**
- Cleanup on DELETE operations (delete all associated blobs)
- Batch cleanup utility for orphaned files
- Storage usage monitoring dashboard
- Scheduled cleanup of truly orphaned files
- Dry-run mode for testing

## Files Modified

```
lib/blob-cleanup.js              (NEW) - Cleanup utilities
app/api/biography/[id]/route.js  (UPDATED) - Biography cleanup
app/api/projects/[id]/route.js   (UPDATED) - Project cleanup
```

## Storage Benefits

### Before Cleanup
- Every upload creates a new file
- Old files accumulate forever
- Storage costs increase over time
- Manual cleanup required

### After Cleanup
- Only current files stored
- Automatic removal of old files
- Storage costs stay minimal
- Zero maintenance required

## Example: Storage Savings

**Scenario:** Admin updates profile photo 50 times over a year

**Without Cleanup:**
- 50 files stored
- ~250 MB (50 × 5 MB avg)
- Growing indefinitely

**With Cleanup:**
- 1 file stored
- ~5 MB (current photo only)
- Constant size ✅

---

**Implementation Date:** December 19, 2025  
**Status:** ✅ ACTIVE  
**Coverage:** Biography & Project endpoints
