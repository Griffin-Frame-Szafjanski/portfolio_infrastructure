# Vercel File Size Limits

## Overview

This application is configured for Vercel's **free tier**, which has a **4.5 MB request body size limit** for serverless functions. All file upload endpoints have been configured with a **4 MB maximum** to account for form data overhead.

## Current File Size Limits

All upload endpoints enforce the following limits:

- **Profile Photos**: 4 MB
- **Project Images**: 4 MB  
- **Project PDFs**: 4 MB
- **Resume/CV PDFs**: 4 MB

## Why This Limitation Exists

Vercel's free tier (Hobby plan) enforces a 4.5 MB request body size limit on serverless functions. This is a hard limit imposed by Vercel's infrastructure and cannot be increased on the free tier.

## Solutions for Larger Files

If you need to upload files larger than 4 MB, you have several options:

### Option 1: Compress Your Files (Recommended)

#### For PDFs:
- Use online tools like [iLovePDF](https://www.ilovepdf.com/compress_pdf) or [Smallpdf](https://smallpdf.com/compress-pdf)
- Reduce image quality/resolution within the PDF
- Remove unnecessary pages or content
- Use PDF optimization tools that remove unused objects

#### For Images:
- Use online tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- Convert to WebP format (better compression)
- Reduce dimensions if the image is larger than needed
- Lower the quality setting (80-85% usually looks identical to the human eye)

### Option 2: Upgrade to Vercel Pro Plan

Vercel's Pro plan increases the request body size limit to **4.5 MB**. However, this still may not be sufficient for very large files.

**Pricing**: $20/month per user

**Additional benefits**:
- More concurrent builds
- Longer serverless function execution time
- More bandwidth
- Better support

### Option 3: Use Direct-to-Storage Uploads

For applications that frequently need to handle larger files, consider implementing direct-to-storage uploads:

1. **Vercel Blob with Client-Side Upload**:
   - Generate a presigned URL on the server
   - Upload directly from the browser to Vercel Blob
   - This bypasses the API route entirely
   - No size limits from Vercel serverless functions

2. **Alternative Storage Providers**:
   - **AWS S3** with presigned URLs
   - **Cloudinary** (specialized for images/videos)
   - **Google Cloud Storage**
   - **Azure Blob Storage**

### Option 4: Split Large Files

For very large files, implement chunked upload:
- Split files into smaller chunks (< 4 MB each)
- Upload chunks sequentially
- Reassemble on the server or storage provider
- Requires custom implementation

## Implementation Notes

All upload routes include clear error messages that indicate the size limit:

```
"File too large. Maximum size is 4MB (Vercel free tier limit)."
```

This helps users understand why their upload failed and what they can do about it.

## Current File Storage

The application uses **Vercel Blob Storage** for all file uploads:
- Unlimited storage on free tier
- Only the upload size is limited (4.5 MB request body)
- Files are served via Vercel's CDN
- Automatic cleanup of old files via `lib/blob-cleanup.js`

## Recommendations

1. **For Most Users**: Compress files before uploading (Option 1)
2. **For Occasional Large Files**: Use external hosting and link to the file
3. **For Frequent Large Files**: Consider upgrading to Pro or implementing direct uploads (Options 2-3)
4. **For Enterprise Use**: Implement a complete direct-to-storage solution with chunked uploads (Options 3-4)

## Related Files

- `app/api/upload/photo/route.js` - Profile photo uploads
- `app/api/upload/project-image/route.js` - Project image uploads
- `app/api/upload/project-pdf/route.js` - Project PDF uploads
- `app/api/upload/resume/route.js` - Resume/CV uploads
- `lib/blob-cleanup.js` - Automatic cleanup of old files
- `vercel.json` - Vercel configuration
- `next.config.js` - Next.js configuration

## Testing File Sizes

To check your file size before uploading:

**macOS/Linux**:
```bash
ls -lh filename.pdf
# or
du -h filename.pdf
```

**Windows (PowerShell)**:
```powershell
Get-Item filename.pdf | Select-Object Name, Length
```

**Or use your file browser**: Right-click the file and select "Get Info" (Mac) or "Properties" (Windows)

## Questions?

For issues related to file uploads or size limits, check:
1. The error message in the upload UI
2. Browser console for detailed error information
3. Vercel deployment logs for server-side errors

---

*Last updated: December 19, 2024*
