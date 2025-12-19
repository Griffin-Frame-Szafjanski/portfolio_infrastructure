/**
 * Blob Storage Cleanup Utility
 * Handles deletion of old files from Vercel Blob when they're replaced
 */

import { del } from '@vercel/blob';

/**
 * Extract blob URL from a Vercel Blob URL
 * @param {string} url - Full Vercel Blob URL
 * @returns {string|null} - Extracted URL or null if invalid
 */
function extractBlobUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Check if it's a Vercel Blob URL
  if (url.includes('vercel-storage.com') || url.includes('blob.vercel-storage.com')) {
    return url;
  }
  
  return null;
}

/**
 * Delete a single blob file from Vercel Blob storage
 * @param {string} url - Vercel Blob URL to delete
 * @returns {Promise<boolean>} - True if deleted, false if skipped
 */
export async function deleteBlobFile(url) {
  try {
    const blobUrl = extractBlobUrl(url);
    
    if (!blobUrl) {
      console.log('Skipping deletion - not a Vercel Blob URL:', url);
      return false;
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured - cannot delete blob');
      return false;
    }

    await del(blobUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    console.log('✅ Deleted old blob file:', blobUrl);
    return true;
  } catch (error) {
    // Don't throw - log and continue
    console.error('⚠️ Failed to delete blob file:', url, error.message);
    return false;
  }
}

/**
 * Delete multiple blob files
 * @param {string[]} urls - Array of Vercel Blob URLs to delete
 * @returns {Promise<number>} - Number of files successfully deleted
 */
export async function deleteBlobFiles(urls) {
  if (!Array.isArray(urls) || urls.length === 0) {
    return 0;
  }

  const results = await Promise.allSettled(
    urls.map(url => deleteBlobFile(url))
  );

  const successCount = results.filter(
    result => result.status === 'fulfilled' && result.value === true
  ).length;

  console.log(`Deleted ${successCount} of ${urls.length} blob files`);
  return successCount;
}

/**
 * Compare and cleanup old blob URLs when updating
 * Deletes old blobs if they're being replaced with new ones
 * @param {Object} oldData - Old record with URL fields
 * @param {Object} newData - New data with URL fields
 * @param {string[]} urlFields - Fields to check for URL changes
 * @returns {Promise<number>} - Number of files deleted
 */
export async function cleanupReplacedBlobs(oldData, newData, urlFields) {
  if (!oldData || !newData || !urlFields || urlFields.length === 0) {
    return 0;
  }

  const urlsToDelete = [];

  for (const field of urlFields) {
    const oldUrl = oldData[field];
    const newUrl = newData[field];

    // Only delete if:
    // 1. Old URL exists and is a blob URL
    // 2. New URL is different from old URL
    // 3. New URL is not null/undefined (indicating a replacement, not a removal)
    if (oldUrl && newUrl && oldUrl !== newUrl && extractBlobUrl(oldUrl)) {
      urlsToDelete.push(oldUrl);
    }
  }

  if (urlsToDelete.length > 0) {
    console.log(`🧹 Cleaning up ${urlsToDelete.length} replaced blob file(s)`);
    return await deleteBlobFiles(urlsToDelete);
  }

  return 0;
}
