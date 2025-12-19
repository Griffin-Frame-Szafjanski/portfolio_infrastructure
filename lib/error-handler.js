/**
 * Centralized Error Handler
 * Provides consistent error responses and prevents information leakage
 */

import { NextResponse } from 'next/server';

/**
 * Error types and their user-friendly messages
 */
export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  DATABASE: 'DATABASE',
  FILE_UPLOAD: 'FILE_UPLOAD',
  INTERNAL: 'INTERNAL',
};

/**
 * Generic error messages for production (prevent information leakage)
 */
const GENERIC_MESSAGES = {
  [ErrorTypes.VALIDATION]: 'Invalid input provided',
  [ErrorTypes.AUTHENTICATION]: 'Authentication failed',
  [ErrorTypes.AUTHORIZATION]: 'Access denied',
  [ErrorTypes.NOT_FOUND]: 'Resource not found',
  [ErrorTypes.RATE_LIMIT]: 'Too many requests',
  [ErrorTypes.DATABASE]: 'A database error occurred',
  [ErrorTypes.FILE_UPLOAD]: 'File upload failed',
  [ErrorTypes.INTERNAL]: 'An internal server error occurred',
};

/**
 * HTTP status codes for error types
 */
const STATUS_CODES = {
  [ErrorTypes.VALIDATION]: 400,
  [ErrorTypes.AUTHENTICATION]: 401,
  [ErrorTypes.AUTHORIZATION]: 403,
  [ErrorTypes.NOT_FOUND]: 404,
  [ErrorTypes.RATE_LIMIT]: 429,
  [ErrorTypes.DATABASE]: 500,
  [ErrorTypes.FILE_UPLOAD]: 400,
  [ErrorTypes.INTERNAL]: 500,
};

/**
 * Application Error Class
 */
export class AppError extends Error {
  constructor(type, message, statusCode = null, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode || STATUS_CODES[type] || 500;
    this.details = details;
    this.isOperational = true; // Distinguishes operational errors from programming errors
  }
}

/**
 * Log error details (server-side only)
 * In production, this should integrate with a logging service
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    type: error.type || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    stack: error.stack,
    context,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', errorLog);
  } else {
    // In production, log without stack trace to avoid clutter
    console.error('❌ Error:', {
      timestamp: errorLog.timestamp,
      type: errorLog.type,
      message: errorLog.message,
      statusCode: errorLog.statusCode,
      context: errorLog.context,
    });
  }
  
  // TODO: In production, integrate with logging service (e.g., Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error, { extra: context });
}

/**
 * Sanitize error for client response (prevent information leakage)
 * @param {Error} error - Error to sanitize
 * @returns {Object} Sanitized error object
 */
function sanitizeError(error) {
  // In development, provide more details
  if (process.env.NODE_ENV === 'development') {
    return {
      success: false,
      error: error.message || 'An error occurred',
      type: error.type || 'INTERNAL',
      ...(error.details && { details: error.details }),
      ...(error.stack && { stack: error.stack.split('\n') }),
    };
  }
  
  // In production, use generic messages
  if (error instanceof AppError && error.isOperational) {
    return {
      success: false,
      error: error.message,
      type: error.type,
    };
  }
  
  // For unknown errors, return generic message
  return {
    success: false,
    error: GENERIC_MESSAGES[ErrorTypes.INTERNAL],
    type: ErrorTypes.INTERNAL,
  };
}

/**
 * Handle error and return appropriate response
 * @param {Error} error - Error to handle
 * @param {Object} context - Additional context (request info, user, etc.)
 * @returns {NextResponse} Response object
 */
export function handleError(error, context = {}) {
  // Log the error server-side
  logError(error, context);
  
  // Determine status code
  let statusCode = 500;
  if (error instanceof AppError) {
    statusCode = error.statusCode;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
  }
  
  // Sanitize error for client
  const sanitized = sanitizeError(error);
  
  // Return JSON response
  return NextResponse.json(sanitized, { status: statusCode });
}

/**
 * Async error wrapper for API route handlers
 * Catches errors and passes them to error handler
 * @param {Function} handler - Async route handler
 * @returns {Function} Wrapped handler
 */
export function asyncHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, {
        method: request.method,
        url: request.url,
        ...(context && { routeContext: context }),
      });
    }
  };
}

/**
 * Create a validation error
 * @param {string} message - Error message
 * @param {Object} details - Validation details
 * @returns {AppError}
 */
export function createValidationError(message, details = null) {
  return new AppError(ErrorTypes.VALIDATION, message, 400, details);
}

/**
 * Create an authentication error
 * @param {string} message - Error message
 * @returns {AppError}
 */
export function createAuthError(message = 'Authentication required') {
  return new AppError(ErrorTypes.AUTHENTICATION, message, 401);
}

/**
 * Create an authorization error
 * @param {string} message - Error message
 * @returns {AppError}
 */
export function createAuthorizationError(message = 'Access denied') {
  return new AppError(ErrorTypes.AUTHORIZATION, message, 403);
}

/**
 * Create a not found error
 * @param {string} resource - Resource name
 * @returns {AppError}
 */
export function createNotFoundError(resource = 'Resource') {
  return new AppError(ErrorTypes.NOT_FOUND, `${resource} not found`, 404);
}

/**
 * Create a database error
 * @param {string} message - Error message
 * @param {Error} originalError - Original database error
 * @returns {AppError}
 */
export function createDatabaseError(message = 'Database operation failed', originalError = null) {
  const error = new AppError(ErrorTypes.DATABASE, message, 500);
  if (originalError) {
    error.stack = originalError.stack;
  }
  return error;
}

/**
 * Create a rate limit error
 * @param {string} message - Error message
 * @returns {AppError}
 */
export function createRateLimitError(message = 'Too many requests') {
  return new AppError(ErrorTypes.RATE_LIMIT, message, 429);
}

/**
 * Check if error is operational
 * @param {Error} error - Error to check
 * @returns {boolean}
 */
export function isOperationalError(error) {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Format validation errors from validation library
 * @param {Array} errors - Array of validation errors
 * @returns {AppError}
 */
export function formatValidationErrors(errors) {
  const message = Array.isArray(errors) ? errors[0] : 'Validation failed';
  return createValidationError(message, { errors });
}
