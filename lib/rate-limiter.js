/**
 * Rate Limiter
 * In-memory rate limiting for API endpoints
 * Prevents abuse and brute force attacks
 */

// Store for tracking requests: Map<identifier, { count, resetTime }>
const requestStore = new Map();

// Cleanup interval to remove expired entries
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

/**
 * Rate Limit Configuration
 */
export const RATE_LIMITS = {
  LOGIN: {
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  CONTACT: {
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many contact form submissions. Please try again in 1 hour.',
  },
  API: {
    max: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  UPLOAD: {
    max: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many upload attempts. Please wait a moment.',
  },
  PASSWORD_CHANGE: {
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many password change attempts. Please try again in 1 hour.',
  },
};

/**
 * Get client identifier from request
 * Uses IP address with fallback to a generic identifier
 * @param {Request} request - The incoming request
 * @returns {string} Client identifier
 */
function getClientIdentifier(request) {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback - not ideal but better than nothing
  return 'unknown';
}

/**
 * Check if request is rate limited
 * @param {string} identifier - Client identifier
 * @param {Object} config - Rate limit configuration
 * @returns {Object} { allowed: boolean, remaining: number, resetTime: number }
 */
function checkRateLimit(identifier, config) {
  const now = Date.now();
  const record = requestStore.get(identifier);
  
  // No previous requests or window has expired
  if (!record || now > record.resetTime) {
    const resetTime = now + config.windowMs;
    requestStore.set(identifier, {
      count: 1,
      resetTime,
    });
    
    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime,
    };
  }
  
  // Within the time window
  if (record.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  // Increment count
  record.count++;
  requestStore.set(identifier, record);
  
  return {
    allowed: true,
    remaining: config.max - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit middleware for API routes
 * @param {Request} request - The incoming request
 * @param {string} limitType - Type of rate limit to apply (LOGIN, CONTACT, API, etc.)
 * @returns {Object} { success: boolean, response?: Response }
 */
export function rateLimit(request, limitType = 'API') {
  const config = RATE_LIMITS[limitType];
  
  if (!config) {
    throw new Error(`Invalid rate limit type: ${limitType}`);
  }
  
  const identifier = getClientIdentifier(request);
  const key = `${limitType}:${identifier}`;
  const result = checkRateLimit(key, config);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          success: false,
          error: config.message,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      ),
    };
  }
  
  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': config.max.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.resetTime.toString(),
    },
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual intervention
 * @param {string} identifier - Client identifier
 * @param {string} limitType - Type of rate limit
 */
export function resetRateLimit(identifier, limitType = 'API') {
  const key = `${limitType}:${identifier}`;
  requestStore.delete(key);
}

/**
 * Clear all rate limits
 * Useful for testing
 */
export function clearAllRateLimits() {
  requestStore.clear();
}

/**
 * Get current rate limit status for an identifier
 * @param {Request} request - The incoming request
 * @param {string} limitType - Type of rate limit
 * @returns {Object} Status information
 */
export function getRateLimitStatus(request, limitType = 'API') {
  const config = RATE_LIMITS[limitType];
  const identifier = getClientIdentifier(request);
  const key = `${limitType}:${identifier}`;
  const record = requestStore.get(key);
  
  if (!record || Date.now() > record.resetTime) {
    return {
      count: 0,
      remaining: config.max,
      resetTime: null,
    };
  }
  
  return {
    count: record.count,
    remaining: Math.max(0, config.max - record.count),
    resetTime: record.resetTime,
  };
}

/**
 * Cleanup expired entries from the store
 * Should be called periodically
 */
function cleanup() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      keysToDelete.push(key);
    }
  }
  
  for (const key of keysToDelete) {
    requestStore.delete(key);
  }
}

// Start cleanup interval
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, CLEANUP_INTERVAL);
}

/**
 * Get store statistics (for monitoring/debugging)
 * @returns {Object} Store statistics
 */
export function getStoreStats() {
  return {
    totalEntries: requestStore.size,
    entries: Array.from(requestStore.entries()).map(([key, record]) => ({
      key,
      count: record.count,
      resetTime: new Date(record.resetTime).toISOString(),
    })),
  };
}
