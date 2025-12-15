// Extract YouTube video ID from various URL formats
export function getYouTubeVideoId(url) {
  if (!url) return null;
  
  // Regular YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  const regularMatch = url.match(/[?&]v=([^&]+)/);
  if (regularMatch) return regularMatch[1];
  
  // Short YouTube URL: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Embed URL: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) return embedMatch[1];
  
  return null;
}

// Check if URL is a YouTube video
export function isYouTubeUrl(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Get YouTube embed URL from video ID
export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}
