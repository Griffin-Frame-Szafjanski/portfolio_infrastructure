import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Security Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const COOKIE_NAME = 'admin_token';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Set authentication cookie
 * @param {string} token - JWT token
 */
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Get authentication cookie
 * @returns {string|null} JWT token or null
 */
export async function getAuthCookie() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current authenticated user from cookie
 * @returns {Object|null} User data or null if not authenticated
 */
export async function getCurrentUser() {
  const token = await getAuthCookie();
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Middleware to protect routes - checks authentication
 * @returns {Object|null} User data if authenticated, null otherwise
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return user;
}

/**
 * Verify authentication for API routes
 * @param {Request} request - The incoming request
 * @returns {Object} Object with authenticated status and user data
 */
export async function verifyAuth(request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      authenticated: false,
      user: null
    };
  }
  
  return {
    authenticated: true,
    user: user
  };
}

/**
 * Check if account is locked due to failed login attempts
 * @param {Object} user - User object with lockout info
 * @returns {boolean} True if account is locked
 */
export function isAccountLocked(user) {
  if (!user.locked_until) return false;
  
  const lockedUntil = new Date(user.locked_until);
  const now = new Date();
  
  return now < lockedUntil;
}

/**
 * Calculate lockout expiration time
 * @returns {Date} Lockout expiration timestamp
 */
export function calculateLockoutTime() {
  return new Date(Date.now() + LOCKOUT_DURATION);
}

/**
 * Check if max login attempts reached
 * @param {number} attempts - Current failed attempts
 * @returns {boolean} True if max attempts reached
 */
export function maxAttemptsReached(attempts) {
  return attempts >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Sanitize user data for client response (remove sensitive info)
 * @param {Object} user - User object
 * @returns {Object} Sanitized user object
 */
export function sanitizeUser(user) {
  const { password_hash, ...sanitized } = user;
  return sanitized;
}

// Export constants for use in other files
export const AUTH_CONFIG = {
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION,
  JWT_EXPIRES_IN,
  COOKIE_NAME,
};
