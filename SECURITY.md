# Security Documentation

## 🔒 Security Overview

This document outlines the security measures implemented in this portfolio application and provides guidelines for maintaining security.

## Security Features

### 1. Authentication & Authorization

- **JWT-based authentication** with secure HttpOnly cookies
- **Strict JWT secret requirements**: Minimum 32 characters, no fallback defaults
- **Cookie security**: `__Host-` prefix, `sameSite=strict`, `httpOnly=true`
- **Bcrypt password hashing** with 12 salt rounds
- **No default credentials** - all credentials must be explicitly set

### 2. Rate Limiting

Protects against brute force and DoS attacks:

- **Login attempts**: 5 per 15 minutes per IP
- **Contact form**: 3 submissions per hour per IP
- **Password changes**: 3 attempts per hour per IP
- **File uploads**: 10 per minute per IP
- **General API**: 100 requests per minute per IP

### 3. Input Validation & Sanitization

- **Comprehensive validation** for all user inputs
- **XSS prevention** through HTML escaping and sanitization
- **SQL injection prevention** (parameterized queries)
- **Prototype pollution protection**
- **Path traversal prevention** in file uploads
- **Email and URL validation**

### 4. Security Headers

Implemented via Next.js middleware:

- **Content-Security-Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-XSS-Protection**: Enabled
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts browser features
- **HSTS**: Enabled in production (31536000 seconds)

### 5. Error Handling

- **Generic error messages** in production (no information leakage)
- **Detailed logging** server-side only
- **Error sanitization** to prevent stack trace exposure
- **Operational vs programming errors** distinction

### 6. Audit Logging

Logs all security-relevant events:

- Authentication attempts (success/failure)
- Resource modifications (create/update/delete)
- File operations
- Rate limit violations
- Unauthorized access attempts
- Administrative actions

## Environment Variables

### Required Variables

```bash
# JWT Secret (CRITICAL - Must be 32+ characters)
JWT_SECRET=<generate-with: openssl rand -base64 32>

# Database Connection
DATABASE_URL=postgresql://user:password@host:port/database

# Admin Credentials
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<bcrypt-hash-from: npm run hash-password>

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>
```

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate admin password hash
npm run hash-password
# Enter your desired password when prompted
```

## Deployment Security Checklist

### Pre-Deployment

- [ ] All environment variables are set and validated
- [ ] JWT_SECRET is cryptographically secure (32+ chars)
- [ ] ADMIN_PASSWORD is a proper bcrypt hash
- [ ] No sensitive data in repository
- [ ] No default/test credentials in code
- [ ] Security headers are configured
- [ ] Rate limiting is enabled

### Production Environment

- [ ] HTTPS is enabled (required for secure cookies)
- [ ] Environment variables are in secure storage
- [ ] Database has SSL/TLS enabled
- [ ] Audit logs table is created
- [ ] Regular database backups configured
- [ ] Monitoring and alerting enabled
- [ ] Error logging service configured (optional)

### Post-Deployment

- [ ] Test login with correct and incorrect credentials
- [ ] Verify rate limiting works
- [ ] Check security headers with security scanner
- [ ] Verify HTTPS redirect works
- [ ] Test file upload restrictions
- [ ] Review audit logs for anomalies

## Security Best Practices

### For Administrators

1. **Strong Passwords**: Use passwords with 12+ characters, mixed case, numbers, and symbols
2. **Secure Storage**: Never share or commit credentials
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Logs**: Review audit logs regularly for suspicious activity
5. **Backup**: Maintain regular database backups
6. **Access Control**: Limit admin access to trusted devices

### For Developers

1. **Input Validation**: Always validate user input before processing
2. **Parameterized Queries**: Never concatenate SQL queries
3. **Error Handling**: Use centralized error handler, never expose sensitive data
4. **Dependencies**: Regular `npm audit` and updates
5. **Code Review**: Security-focused code reviews
6. **Testing**: Test security features thoroughly

## Vulnerability Reporting

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: [your-email@domain.com]
3. Provide detailed description and reproduction steps
4. Allow reasonable time for fix before public disclosure

## Security Testing

### Automated Testing

```bash
# Check for vulnerable dependencies
npm audit

# Fix fixable vulnerabilities
npm audit fix

# Check for security issues
npm run security-check  # (if configured)
```

### Manual Testing

1. **Authentication**:
   - Test login rate limiting
   - Verify JWT expiration
   - Test logout functionality

2. **Authorization**:
   - Attempt to access admin routes without auth
   - Test cookie security flags

3. **Input Validation**:
   - Try SQL injection in forms
   - Test XSS in text inputs
   - Try path traversal in file uploads

4. **Headers**:
   - Use [securityheaders.com](https://securityheaders.com)
   - Use [Mozilla Observatory](https://observatory.mozilla.org)

## Security Updates

### Regular Maintenance

- **Weekly**: Review audit logs
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Security audit and penetration testing
- **As needed**: Respond to security advisories

### Keeping Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for security vulnerabilities
npm audit

# Update package-lock.json
npm install
```

## Incident Response

### If a Security Breach Occurs

1. **Immediate Actions**:
   - Change all admin passwords
   - Rotate JWT_SECRET
   - Review and revoke suspicious sessions
   - Check audit logs for extent of breach

2. **Investigation**:
   - Identify attack vector
   - Determine compromised data
   - Document timeline of events

3. **Remediation**:
   - Patch vulnerabilities
   - Update security measures
   - Deploy fixes

4. **Communication**:
   - Notify affected users
   - Document lessons learned
   - Update security procedures

## Security Contacts

- **Security Issues**: [your-email@domain.com]
- **General Support**: [support@domain.com]

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: December 2024  
**Version**: 1.0.0
