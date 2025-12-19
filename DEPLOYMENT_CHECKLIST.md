# Deployment Checklist

## Pre-Deployment Security Checklist

### Environment Variables ✅
- [ ] `JWT_SECRET` is set and is at least 32 characters long
- [ ] `JWT_SECRET` is cryptographically random (use `openssl rand -base64 32`)
- [ ] `DATABASE_URL` is correctly configured with SSL enabled
- [ ] `ADMIN_USERNAME` is set (minimum 3 characters)
- [ ] `ADMIN_PASSWORD` is a bcrypt hash (use `npm run hash-password`)
- [ ] `BLOB_READ_WRITE_TOKEN` is configured for Vercel Blob storage
- [ ] No sensitive data is committed to the repository
- [ ] `.env.local` file is in `.gitignore`

### Database Setup 📊
- [ ] PostgreSQL database is created and accessible
- [ ] Run `DATABASE_COMPLETE_SCHEMA.sql` to create all tables
- [ ] Run `DATABASE_SKILLS_SCHEMA.sql` if using skills feature
- [ ] Run `DATABASE_AUDIT_LOGS.sql` to create audit logs table
- [ ] Database user has appropriate permissions
- [ ] Database connection uses SSL/TLS
- [ ] Database backups are configured

### Security Configuration 🔒
- [ ] Security headers middleware is in place (`middleware.js`)
- [ ] Rate limiting is configured and tested
- [ ] CORS settings are appropriate for your domain
- [ ] File upload restrictions are in place
- [ ] Input validation is enabled on all routes
- [ ] Error handler doesn't leak sensitive information

### Code Review 🔍
- [ ] No hardcoded secrets or credentials
- [ ] All API routes have authentication where needed
- [ ] All user input is validated and sanitized
- [ ] No console.log statements with sensitive data
- [ ] Dependencies are up to date (`npm audit`)
- [ ] No TODO comments with security implications

### Production Environment 🚀
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] `NODE_ENV` is set to `production`
- [ ] Compression is enabled
- [ ] Static assets are cached appropriately
- [ ] CDN is configured (if applicable)

## Deployment Steps

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 2. Configure Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables:
   - `JWT_SECRET`
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN`
   - `NODE_ENV=production`
4. Set scope to Production, Preview, and Development as needed

### 3. Database Migration

```bash
# Connect to your database
psql $DATABASE_URL

# Run migrations
\i DATABASE_COMPLETE_SCHEMA.sql
\i DATABASE_SKILLS_SCHEMA.sql
\i DATABASE_AUDIT_LOGS.sql

# Verify tables exist
\dt

# Exit
\q
```

## Post-Deployment Testing

### Authentication Tests 🔐
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials fails
- [ ] Rate limiting works (try 6 failed logins)
- [ ] Logout works and clears session
- [ ] Accessing admin routes without auth fails
- [ ] JWT token expires after 24 hours

### API Tests 🌐
- [ ] Contact form submission works
- [ ] Contact form rate limiting works (try 4 submissions)
- [ ] File uploads work and enforce size/type limits
- [ ] All CRUD operations work for projects
- [ ] All CRUD operations work for skills
- [ ] Messages can be read and marked as read

### Security Header Tests 🛡️
- [ ] Test headers at [securityheaders.com](https://securityheaders.com)
- [ ] Verify CSP is working (check browser console)
- [ ] X-Frame-Options prevents iframe embedding
- [ ] HSTS header is present in production

### Performance Tests ⚡
- [ ] Page load times are acceptable
- [ ] Images load correctly
- [ ] API responses are fast (<500ms)
- [ ] No memory leaks in long-running sessions

### Error Handling Tests ❌
- [ ] 404 pages display correctly
- [ ] 500 errors show generic message (no stack traces)
- [ ] Validation errors show user-friendly messages
- [ ] Error logs are captured server-side

## Monitoring Setup

### Required Monitoring 📊
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Configure error tracking (e.g., Sentry, LogRocket)
- [ ] Set up log aggregation if needed
- [ ] Configure alerts for:
  - Server downtime
  - High error rates
  - Failed login attempts
  - Database connection issues

### Recommended Monitoring 📈
- [ ] Performance monitoring (e.g., Vercel Analytics)
- [ ] Database query performance
- [ ] Rate limit violations
- [ ] Unusual traffic patterns

## Backup Strategy

### Database Backups 💾
- [ ] Automated daily backups configured
- [ ] Backup retention policy defined (e.g., 30 days)
- [ ] Test backup restoration process
- [ ] Store backups in separate location
- [ ] Encrypt backup files

### File Storage Backups 📁
- [ ] Vercel Blob storage backups (if needed)
- [ ] Document restoration procedure

## Incident Response Plan

### Preparation 🚨
- [ ] Document admin contact information
- [ ] Create incident response team
- [ ] Define escalation procedures
- [ ] Document rollback procedures

### Response Procedures 📋
- [ ] Process for password rotation
- [ ] Process for JWT secret rotation
- [ ] Process for emergency rollback
- [ ] Process for user notification

## Regular Maintenance

### Weekly Tasks 📅
- [ ] Review audit logs for suspicious activity
- [ ] Check error logs for recurring issues
- [ ] Monitor uptime and performance metrics

### Monthly Tasks 🗓️
- [ ] Update npm dependencies (`npm update`)
- [ ] Run security audit (`npm audit`)
- [ ] Review and rotate access credentials if needed
- [ ] Test backup restoration

### Quarterly Tasks 📆
- [ ] Full security audit
- [ ] Penetration testing (if applicable)
- [ ] Review and update security policies
- [ ] Update documentation

## Quick Reference Commands

### Generate Secure Secrets
```bash
# JWT Secret
openssl rand -base64 32

# Admin Password Hash
npm run hash-password
```

### Database Commands
```bash
# Connect to database
psql $DATABASE_URL

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Vercel Commands
```bash
# View logs
vercel logs

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local

# Deploy to production
vercel --prod
```

### Security Testing
```bash
# Check dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update
```

## Rollback Procedure

### If deployment has critical issues:

1. **Immediate rollback in Vercel:**
   ```bash
   # Revert to previous deployment
   vercel rollback
   ```

2. **Fix the issue locally:**
   ```bash
   # Fix code
   git revert <commit-hash>
   # Or fix and commit
   git commit -am "Fix: <issue description>"
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Success Criteria ✅

Deployment is successful when:
- [ ] All tests pass
- [ ] Security headers score A+ on securityheaders.com
- [ ] No console errors on production site
- [ ] Admin login works
- [ ] Contact form works
- [ ] All pages load correctly
- [ ] Monitoring alerts are configured
- [ ] Backups are working

## Support Contacts

- **Technical Issues**: [your-email@domain.com]
- **Security Issues**: See SECURITY.md
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Database Support**: [Your database provider]

---

**Last Updated**: December 2024  
**Version**: 1.0.0
