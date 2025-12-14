# Admin Dashboard Guide

## Overview
The portfolio now includes a secure admin dashboard for managing content without taking the site down. Built with industry-standard security practices.

## Features

### 🔐 Security
- **JWT Authentication** with HttpOnly cookies
- **Bcrypt Password Hashing** (12 salt rounds)
- **Account Lockout Protection** (5 failed attempts = 15 min lockout)
- **CSRF Protection** via secure cookies
- **Session Management** with 24-hour expiration
- **Rate Limiting Ready** for production

### 📊 Dashboard Capabilities
- Biography/Profile Management (ready for implementation)
- Projects CRUD Operations (ready for implementation)
- Overview Statistics
- Quick Actions
- Secure Logout

## Access

### Login
1. Navigate to: `http://localhost:3000/admin/login` (or your domain `/admin/login`)
2. Default credentials (for local dev):
   - **Username**: `admin`
   - **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

### Dashboard
After successful login, you'll be redirected to: `/admin/dashboard`

## Architecture

### Authentication Flow
```
1. User submits credentials → POST /api/admin/login
2. Server verifies password with bcrypt
3. JWT token generated and set as HttpOnly cookie
4. User redirected to dashboard
5. Dashboard checks auth via GET /api/admin/me
6. Protected routes verify JWT token
```

### File Structure
```
app/
├── admin/
│   ├── login/
│   │   └── page.js          # Login page
│   └── dashboard/
│       └── page.js          # Main dashboard
├── api/admin/
│   ├── login/route.js       # Login endpoint
│   ├── logout/route.js      # Logout endpoint
│   └── me/route.js          # Auth check endpoint
lib/
└── auth.js                  # Authentication utilities
```

## Security Best Practices

### For Production Deployment

1. **Set JWT Secret**
   ```bash
   # Add to .env file
   JWT_SECRET=your-very-long-random-secret-here
   ```

2. **Create Admin User**
   ```javascript
   // Use the hashPassword function
   import { hashPassword } from './lib/auth';
   const hash = await hashPassword('your-secure-password');
   
   // Store in D1 database
   INSERT INTO admin_users (username, password_hash, email)
   VALUES ('your_username', 'hash_here', 'your@email.com');
   ```

3. **Update Mock Data**
   - Remove mock user from `app/api/admin/login/route.js`
   - Uncomment database queries
   - Configure D1 binding in wrangler.toml

4. **Enable HTTPS**
   - Cloudflare Pages automatically provides HTTPS
   - Cookies will be secure in production

5. **Rate Limiting**
   - Configure Cloudflare Rate Limiting rules
   - Limit `/api/admin/login` to 5 requests per minute

## API Endpoints

### POST /api/admin/login
Login with credentials

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  },
  "message": "Login successful"
}
```

**Response (Failed):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "attemptsRemaining": 4
}
```

### POST /api/admin/logout
Logout current session

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/admin/me
Check authentication status

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

## Development vs Production

### Local Development
- Uses mock user data
- JWT secret from environment or default
- Works without D1 database

### Production (Cloudflare Pages)
- Connects to D1 database
- Requires JWT_SECRET environment variable
- Uses Cloudflare's edge security
- HttpOnly cookies with secure flag

## Troubleshooting

### Can't Login
- Check console for errors
- Verify credentials match database
- Check if account is locked (wait 15 minutes)
- Clear cookies and try again

### Session Expired
- Sessions expire after 24 hours
- Simply log in again
- Tokens are automatically refreshed

### Database Connection Issues
- Verify D1 binding in wrangler.toml
- Check database has admin_users table
- Ensure admin user exists in database

## Future Enhancements

### Planned Features
- ✅ Biography editing interface
- ✅ Projects CRUD with drag-and-drop reordering
- ✅ File upload for images/resume (R2 integration)
- ✅ Analytics dashboard
- ✅ Multi-user support with roles
- ✅ Email notifications
- ✅ Audit log for changes

### Extending the Admin

To add new admin pages:

1. Create page in `app/admin/your-page/page.js`
2. Add authentication check
3. Add navigation item in dashboard
4. Create corresponding API routes

Example:
```javascript
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (!data.success) router.push('/admin/login');
      else setUser(data.user);
    }
    checkAuth();
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>Your Admin Page</div>;
}
```

## Security Checklist

Before going to production:

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET environment variable
- [ ] Enable Cloudflare Rate Limiting
- [ ] Configure D1 database binding
- [ ] Test account lockout functionality
- [ ] Verify HTTPS is enabled
- [ ] Review access logs
- [ ] Set up monitoring/alerting
- [ ] Document admin procedures
- [ ] Train authorized users

## Support

For issues or questions:
- Check DEPLOYMENT_GUIDE.md for setup instructions
- Review error logs in Cloudflare dashboard
- Test authentication flow in local development first

## License
MIT
