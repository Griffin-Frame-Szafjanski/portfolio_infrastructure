/**
 * Audit Logging System
 * Logs security-relevant events for compliance and incident response
 * NOTE: Database schema needs to be created before using database logging
 */

/**
 * Audit event types
 */
export const AuditEventTypes = {
  // Authentication events
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  
  // Data operations
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  READ: 'READ',
  
  // File operations
  FILE_UPLOAD: 'FILE_UPLOAD',
  FILE_DELETE: 'FILE_DELETE',
  
  // Security events
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Administrative events
  ADMIN_ACTION: 'ADMIN_ACTION',
};

/**
 * Severity levels
 */
export const SeverityLevels = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

/**
 * Get client IP from request
 * @param {Request} request - Request object
 * @returns {string} Client IP address
 */
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  return 'unknown';
}

/**
 * Get user agent from request
 * @param {Request} request - Request object
 * @returns {string} User agent string
 */
function getUserAgent(request) {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Create audit log entry
 * @param {Object} params - Audit log parameters
 * @returns {Object} Audit log entry
 */
function createAuditLogEntry({
  eventType,
  severity = SeverityLevels.INFO,
  userId = null,
  username = null,
  resourceType = null,
  resourceId = null,
  action = null,
  details = {},
  ipAddress = 'unknown',
  userAgent = 'unknown',
  success = true,
  errorMessage = null,
}) {
  return {
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    userId,
    username,
    resourceType,
    resourceId,
    action,
    details: typeof details === 'object' ? details : { value: details },
    ipAddress,
    userAgent,
    success,
    errorMessage,
  };
}

/**
 * Console logger (fallback when database is unavailable)
 * @param {Object} logEntry - Log entry to write
 */
function logToConsole(logEntry) {
  const emoji = {
    [SeverityLevels.INFO]: 'ℹ️',
    [SeverityLevels.WARNING]: '⚠️',
    [SeverityLevels.ERROR]: '❌',
    [SeverityLevels.CRITICAL]: '🚨',
  }[logEntry.severity] || 'ℹ️';
  
  console.log(`${emoji} [AUDIT] ${logEntry.eventType}`, {
    timestamp: logEntry.timestamp,
    user: logEntry.username || logEntry.userId || 'anonymous',
    resource: logEntry.resourceType ? `${logEntry.resourceType}/${logEntry.resourceId}` : 'N/A',
    ip: logEntry.ipAddress,
    success: logEntry.success,
    ...(logEntry.errorMessage && { error: logEntry.errorMessage }),
  });
}

/**
 * Log audit event
 * @param {Object} params - Audit parameters
 * @param {Request} request - Optional request object for IP/UA
 */
export async function logAuditEvent(params, request = null) {
  try {
    // Extract IP and UA from request if provided
    let ipAddress = params.ipAddress || 'unknown';
    let userAgent = params.userAgent || 'unknown';
    
    if (request) {
      ipAddress = getClientIP(request);
      userAgent = getUserAgent(request);
    }
    
    // Create log entry
    const logEntry = createAuditLogEntry({
      ...params,
      ipAddress,
      userAgent,
    });
    
    // For now, log to console
    // TODO: Implement database logging when audit_logs table is created
    logToConsole(logEntry);
    
    // Future: Save to database
    // await saveAuditLogToDatabase(logEntry);
    
  } catch (error) {
    // Don't let audit logging failure break the application
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Log login attempt
 * @param {Object} params - Login parameters
 * @param {Request} request - Request object
 */
export async function logLoginAttempt({ username, success, errorMessage = null }, request) {
  await logAuditEvent(
    {
      eventType: success ? AuditEventTypes.LOGIN_SUCCESS : AuditEventTypes.LOGIN_FAILURE,
      severity: success ? SeverityLevels.INFO : SeverityLevels.WARNING,
      username,
      action: 'LOGIN',
      success,
      errorMessage,
      details: { username },
    },
    request
  );
}

/**
 * Log logout
 * @param {Object} user - User object
 * @param {Request} request - Request object
 */
export async function logLogout(user, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.LOGOUT,
      severity: SeverityLevels.INFO,
      userId: user.id,
      username: user.username,
      action: 'LOGOUT',
      success: true,
    },
    request
  );
}

/**
 * Log password change
 * @param {Object} user - User object
 * @param {Request} request - Request object
 */
export async function logPasswordChange(user, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.PASSWORD_CHANGE,
      severity: SeverityLevels.INFO,
      userId: user.id,
      username: user.username,
      action: 'PASSWORD_CHANGE',
      success: true,
    },
    request
  );
}

/**
 * Log resource creation
 * @param {Object} params - Creation parameters
 * @param {Request} request - Request object
 */
export async function logResourceCreation({ user, resourceType, resourceId, details = {} }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.CREATE,
      severity: SeverityLevels.INFO,
      userId: user?.id,
      username: user?.username,
      resourceType,
      resourceId,
      action: 'CREATE',
      details,
      success: true,
    },
    request
  );
}

/**
 * Log resource update
 * @param {Object} params - Update parameters
 * @param {Request} request - Request object
 */
export async function logResourceUpdate({ user, resourceType, resourceId, details = {} }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.UPDATE,
      severity: SeverityLevels.INFO,
      userId: user?.id,
      username: user?.username,
      resourceType,
      resourceId,
      action: 'UPDATE',
      details,
      success: true,
    },
    request
  );
}

/**
 * Log resource deletion
 * @param {Object} params - Deletion parameters
 * @param {Request} request - Request object
 */
export async function logResourceDeletion({ user, resourceType, resourceId, details = {} }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.DELETE,
      severity: SeverityLevels.WARNING,
      userId: user?.id,
      username: user?.username,
      resourceType,
      resourceId,
      action: 'DELETE',
      details,
      success: true,
    },
    request
  );
}

/**
 * Log file upload
 * @param {Object} params - Upload parameters
 * @param {Request} request - Request object
 */
export async function logFileUpload({ user, filename, fileType, fileSize }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.FILE_UPLOAD,
      severity: SeverityLevels.INFO,
      userId: user?.id,
      username: user?.username,
      action: 'FILE_UPLOAD',
      details: { filename, fileType, fileSize },
      success: true,
    },
    request
  );
}

/**
 * Log rate limit exceeded
 * @param {Object} params - Rate limit parameters
 * @param {Request} request - Request object
 */
export async function logRateLimitExceeded({ endpoint, limitType }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.RATE_LIMIT_EXCEEDED,
      severity: SeverityLevels.WARNING,
      action: 'RATE_LIMIT_EXCEEDED',
      details: { endpoint, limitType },
      success: false,
    },
    request
  );
}

/**
 * Log unauthorized access attempt
 * @param {Object} params - Access parameters
 * @param {Request} request - Request object
 */
export async function logUnauthorizedAccess({ resource, action, reason }, request) {
  await logAuditEvent(
    {
      eventType: AuditEventTypes.UNAUTHORIZED_ACCESS,
      severity: SeverityLevels.WARNING,
      action: 'UNAUTHORIZED_ACCESS',
      details: { resource, action, reason },
      success: false,
    },
    request
  );
}
