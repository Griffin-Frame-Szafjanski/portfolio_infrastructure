/**
 * Environment Variable Validator
 * Validates all required environment variables at startup
 * Ensures application doesn't start with insecure or missing configuration
 */

class EnvironmentValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EnvironmentValidationError';
  }
}

/**
 * Validate JWT Secret
 * @param {string} secret - JWT secret to validate
 * @throws {EnvironmentValidationError} If validation fails
 */
function validateJWTSecret(secret) {
  if (!secret) {
    throw new EnvironmentValidationError(
      'JWT_SECRET is required but not set. Generate a secure secret with: openssl rand -base64 32'
    );
  }

  if (secret.length < 32) {
    throw new EnvironmentValidationError(
      `JWT_SECRET must be at least 32 characters long (current: ${secret.length}). ` +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }

  // Check for common insecure values
  const insecureValues = [
    'your-secret-key',
    'change-in-production',
    'secret',
    'password',
    'test',
    '12345'
  ];

  const lowerSecret = secret.toLowerCase();
  for (const insecure of insecureValues) {
    if (lowerSecret.includes(insecure)) {
      throw new EnvironmentValidationError(
        `JWT_SECRET contains insecure value "${insecure}". ` +
        'Generate a secure secret with: openssl rand -base64 32'
      );
    }
  }
}

/**
 * Validate Database URL
 * @param {string} url - Database URL to validate
 * @throws {EnvironmentValidationError} If validation fails
 */
function validateDatabaseURL(url) {
  if (!url) {
    throw new EnvironmentValidationError(
      'DATABASE_URL is required but not set. Configure your database connection string.'
    );
  }

  // Basic format validation
  if (!url.startsWith('postgres://') && !url.startsWith('postgresql://')) {
    throw new EnvironmentValidationError(
      'DATABASE_URL must be a valid PostgreSQL connection string (postgres:// or postgresql://)'
    );
  }
}

/**
 * Validate Admin Credentials
 * @param {string} username - Admin username
 * @param {string} password - Admin password (should be bcrypt hash)
 * @throws {EnvironmentValidationError} If validation fails
 */
function validateAdminCredentials(username, password) {
  if (!username) {
    throw new EnvironmentValidationError(
      'ADMIN_USERNAME is required but not set. Set your admin username in environment variables.'
    );
  }

  if (username.length < 3) {
    throw new EnvironmentValidationError(
      'ADMIN_USERNAME must be at least 3 characters long'
    );
  }

  if (!password) {
    throw new EnvironmentValidationError(
      'ADMIN_PASSWORD is required but not set. ' +
      'Generate a bcrypt hash with: npm run hash-password'
    );
  }

  // Check if password looks like a bcrypt hash
  if (!password.startsWith('$2a$') && !password.startsWith('$2b$') && !password.startsWith('$2y$')) {
    throw new EnvironmentValidationError(
      'ADMIN_PASSWORD must be a bcrypt hash. ' +
      'Generate one with: npm run hash-password'
    );
  }
}

/**
 * Validate Blob Storage Token
 * @param {string} token - Blob storage token
 * @throws {EnvironmentValidationError} If validation fails
 */
function validateBlobToken(token) {
  if (!token) {
    throw new EnvironmentValidationError(
      'BLOB_READ_WRITE_TOKEN is required but not set. ' +
      'Configure your Vercel Blob storage token.'
    );
  }

  if (token.length < 20) {
    throw new EnvironmentValidationError(
      'BLOB_READ_WRITE_TOKEN appears to be invalid (too short)'
    );
  }
}

/**
 * Validate all required environment variables
 * @throws {EnvironmentValidationError} If any validation fails
 */
export function validateEnvironment() {
  const errors = [];

  try {
    validateJWTSecret(process.env.JWT_SECRET);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateDatabaseURL(process.env.DATABASE_URL);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateAdminCredentials(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateBlobToken(process.env.BLOB_READ_WRITE_TOKEN);
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    throw new EnvironmentValidationError(
      'Environment validation failed:\n' +
      errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n') +
      '\n\nPlease check your .env.local file and update the required variables.'
    );
  }
}

/**
 * Validate environment with detailed reporting
 * @returns {Object} Validation result with status and errors
 */
export function validateEnvironmentSafe() {
  try {
    validateEnvironment();
    return { valid: true, errors: [] };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}

/**
 * Get environment validation status for health checks
 * @returns {Object} Status object
 */
export function getEnvironmentStatus() {
  const status = {
    JWT_SECRET: !!process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
    DATABASE_URL: !!process.env.DATABASE_URL,
    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
  };

  return {
    allValid: Object.values(status).every(v => v),
    details: status
  };
}
