/**
 * Input Sanitization Utilities
 * Sanitizes user input to prevent XSS, injection attacks, and malicious data
 */

/**
 * HTML entities to escape
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML entities to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char]);
}

/**
 * Sanitize HTML content - strips dangerous tags and attributes
 * For basic use cases without needing a heavy library
 * @param {string} html - HTML string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html, options = {}) {
  if (typeof html !== 'string') return '';
  
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes = {
      a: ['href', 'title', 'target'],
    },
  } = options;
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // If we want to be very strict, we can strip all HTML
  // For now, we keep allowed tags
  // Note: In production, consider using a library like DOMPurify for robust HTML sanitization
  
  return sanitized;
}

/**
 * Strip all HTML tags from a string
 * @param {string} str - String with HTML
 * @returns {string} Plain text without HTML
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize and validate URL
 * @param {string} url - URL to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return null;
    }
  }
  
  // Only allow http(s) and relative URLs
  if (!trimmed.startsWith('http://') && 
      !trimmed.startsWith('https://') && 
      !trimmed.startsWith('/')) {
    return null;
  }
  
  return trimmed;
}

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email (lowercase, trimmed)
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Sanitize filename - remove dangerous characters
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
export function sanitizeFileName(filename) {
  if (typeof filename !== 'string') return '';
  
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  
  // Remove path separators
  sanitized = sanitized.replace(/[\/\\]/g, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  
  // Remove special characters that could cause issues
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const extension = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 255 - extension.length - 1) + '.' + extension;
  }
  
  return sanitized || 'file';
}

/**
 * Sanitize text input - basic cleaning
 * @param {string} text - Text to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized text
 */
export function sanitizeText(text, options = {}) {
  if (typeof text !== 'string') return '';
  
  const {
    trim = true,
    maxLength = null,
    removeLineBreaks = false,
    allowHtml = false,
  } = options;
  
  let sanitized = text;
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Strip HTML if not allowed
  if (!allowHtml) {
    sanitized = stripHtml(sanitized);
  }
  
  // Remove line breaks if specified
  if (removeLineBreaks) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  }
  
  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  // Limit length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize SQL input - escape special characters
 * Note: Always use parameterized queries instead when possible
 * @param {string} str - String to sanitize for SQL
 * @returns {string} Sanitized string
 */
export function sanitizeSql(str) {
  if (typeof str !== 'string') return '';
  
  // Escape single quotes (most common SQL injection vector)
  return str.replace(/'/g, "''");
}

/**
 * Sanitize object - recursively sanitize all string values
 * @param {Object} obj - Object to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj, options = {}) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value, options);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize integer input
 * @param {any} value - Value to sanitize as integer
 * @param {Object} options - Options (min, max, default)
 * @returns {number} Sanitized integer
 */
export function sanitizeInteger(value, options = {}) {
  const {
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    defaultValue = 0,
  } = options;
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    return defaultValue;
  }
  
  if (parsed < min) return min;
  if (parsed > max) return max;
  
  return parsed;
}

/**
 * Sanitize boolean input
 * @param {any} value - Value to sanitize as boolean
 * @returns {boolean} Sanitized boolean
 */
export function sanitizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  return Boolean(value);
}

/**
 * Remove invisible characters (zero-width, direction marks, etc.)
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
export function removeInvisibleCharacters(str) {
  if (typeof str !== 'string') return '';
  
  // Remove zero-width characters
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
}

/**
 * Sanitize JSON input
 * @param {string} jsonString - JSON string to sanitize
 * @returns {Object|null} Parsed and sanitized object or null if invalid
 */
export function sanitizeJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return sanitizeObject(parsed);
  } catch (error) {
    return null;
  }
}

/**
 * Prevent prototype pollution by checking object keys
 * @param {Object} obj - Object to check
 * @returns {boolean} True if safe, false if potentially malicious
 */
export function isPrototypePollutionSafe(obj) {
  if (typeof obj !== 'object' || obj === null) return true;
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (const key of Object.keys(obj)) {
    if (dangerousKeys.includes(key)) {
      return false;
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (!isPrototypePollutionSafe(obj[key])) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Sanitize user input comprehensively
 * @param {any} input - Input to sanitize
 * @param {string} type - Type of input (text, email, url, html, filename)
 * @param {Object} options - Additional options
 * @returns {any} Sanitized input
 */
export function sanitizeInput(input, type = 'text', options = {}) {
  switch (type) {
    case 'email':
      return sanitizeEmail(input);
    case 'url':
      return sanitizeUrl(input);
    case 'html':
      return sanitizeHtml(input, options);
    case 'filename':
      return sanitizeFileName(input);
    case 'integer':
      return sanitizeInteger(input, options);
    case 'boolean':
      return sanitizeBoolean(input);
    case 'text':
    default:
      return sanitizeText(input, options);
  }
}
