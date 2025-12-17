# 🔐 Admin Password Setup Guide

Complete guide for setting up and managing your admin password.

---

## ⚠️ Important: Password vs Hash

**YOU MUST STORE THE HASHED PASSWORD, NOT THE PLAIN TEXT PASSWORD!**

The system uses bcrypt hashing for security. Here's what you need to know:

- ❌ **WRONG**: `ADMIN_PASSWORD=mypassword123`
- ✅ **CORRECT**: `ADMIN_PASSWORD=$2a$12$abcd1234...` (bcrypt hash)

---

## 🚀 Initial Setup (First Time)

### Step 1: Generate Your Password Hash

You have two options:

#### Option A: Using the Hash Script (Recommended)

```bash
# Run the password hash script
node scripts/hash-password.js

# Or provide password as argument (less secure - shows in shell history)
node scripts/hash-password.js "your-password-here"
```

The script will output something like:
```
✅ Password hashed successfully!

Add this to your environment variables:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN_PASSWORD=$2a$12$aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Option B: Online Bcrypt Generator

1. Go to https://bcrypt-generator.com/
2. Enter your desired password
3. Set rounds to **12**
4. Click "Generate"
5. Copy the generated hash

### Step 2: Set Environment Variables

#### For Local Development (.env.local)

Create or edit `.env.local` in your project root:

```bash
# Required Environment Variables
JWT_SECRET=your-random-jwt-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2a$12$... # <-- PASTE YOUR HASH HERE
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### For Production (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environments |
|------|-------|--------------|
| `JWT_SECRET` | (generated secret) | Production, Preview, Development |
| `ADMIN_USERNAME` | `admin` | Production, Preview, Development |
| `ADMIN_PASSWORD` | `$2a$12$...` (hash) | Production, Preview, Development |

5. Click **Save**
6. **Redeploy** your application

### Step 3: Test Login

1. Navigate to `/admin/login`
2. Enter:
   - **Username**: The value you set for `ADMIN_USERNAME` (e.g., "admin")
   - **Password**: Your **PLAIN TEXT** password (not the hash)
3. Click "Login"
4. You should be redirected to `/admin/dashboard`

---

## 🔄 Changing Your Password

You can change your password from the admin dashboard without manually editing environment variables.

### Method 1: Using the Dashboard (Easiest)

1. **Log in** to `/admin/dashboard`
2. On the **Overview** tab, find the "Change Password" section
3. Click **🔐 Change Password**
4. Fill in the form:
   - **Current Password**: Your current password
   - **New Password**: Your new password (min 8 characters)
   - **Confirm New Password**: Re-enter new password
5. Click **Generate New Password Hash**
6. The system will show you the new hash
7. **Copy the hash** (click the copy button)
8. **Update environment variables** with the new hash:
   - **Vercel**: Settings → Environment Variables → Edit `ADMIN_PASSWORD`
   - **Local**: Update `.env.local`
9. **Redeploy** (Vercel) or **restart dev server** (local)
10. Log out and log back in with your new password

### Method 2: Using the Script (Alternative)

1. Generate a new hash:
   ```bash
   node scripts/hash-password.js
   ```
2. Copy the generated hash
3. Update `ADMIN_PASSWORD` in your environment variables
4. Redeploy/restart

---

## 🆘 Troubleshooting

### "Server configuration error"

**Problem**: Login shows "Server error" or "Server configuration error"

**Solution**: This means your environment variables are not set correctly.

1. **Check if variables exist:**
   - Vercel: Settings → Environment Variables
   - Local: `.env.local` file exists

2. **Verify all required variables are set:**
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

3. **For Local Development:**
   ```bash
   # Check if .env.local exists
   cat .env.local
   
   # Should show:
   # JWT_SECRET=...
   # ADMIN_USERNAME=admin
   # ADMIN_PASSWORD=$2a$12$...
   ```

4. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   npm run dev
   ```

5. **For Production (Vercel):**
   - Verify variables are set for all environments
   - **Redeploy** your application after adding/updating variables

### "Invalid credentials" 

**Problem**: Login says "Invalid credentials"

**Possible causes:**

1. **Wrong username**
   - Make sure you're using the exact value from `ADMIN_USERNAME`
   - Default is "admin" (case-sensitive)

2. **Wrong password**
   - You should enter your PLAIN TEXT password
   - NOT the hash from the environment variable

3. **Hash was not generated correctly**
   - Regenerate hash using `node scripts/hash-password.js`
   - Make sure you used bcrypt with 12 rounds
   - Copy the FULL hash (starts with `$2a$12$` or `$2b$12$`)

4. **Environment variable not updated**
   - After changing the hash, you must restart/redeploy
   - Vercel: Redeploy after updating variables
   - Local: Restart `npm run dev`

### Password doesn't work after change

**Problem**: Changed password but can't log in with new password

**Solution**:

1. **Did you update the environment variable?**
   - You must copy the new hash to `ADMIN_PASSWORD`
   - In Vercel: Update the environment variable
   - In Local: Update `.env.local`

2. **Did you redeploy/restart?**
   - Vercel: Must redeploy after changing variables
   - Local: Must restart dev server (`Ctrl+C` then `npm run dev`)

3. **Are you using the right password?**
   - Use your NEW plain text password
   - NOT the old password
   - NOT the hash

### Can't access admin dashboard

**Problem**: Redirected to login or see "Unauthorized"

**Solutions:**

1. **Clear your browser cookies**
   ```
   Chrome: Settings → Privacy → Clear browsing data
   Or use incognito mode
   ```

2. **Log in again**
   - Go to `/admin/login`
   - Enter credentials
   - Should set a new session cookie

3. **Check JWT_SECRET**
   - Must be set in environment variables
   - Must be the same in all environments

---

## 🔒 Security Best Practices

### Password Requirements

- **Minimum length**: 8 characters
- **Recommended**: 12+ characters
- Use a mix of:
  - Uppercase letters
  - Lowercase letters  
  - Numbers
  - Special characters

### Dos and Don'ts

✅ **DO:**
- Use a strong, unique password
- Store hashes in environment variables
- Change password periodically
- Use the dashboard password change feature
- Keep your `.env.local` file in `.gitignore`

❌ **DON'T:**
- Store plain text passwords in environment variables
- Commit `.env.local` to Git
- Share your password hash publicly
- Use the same password across multiple sites
- Use simple passwords like "password123"

### Production Security Checklist

- [ ] `ADMIN_PASSWORD` contains a bcrypt hash (not plain text)
- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables are set in Vercel
- [ ] Password is strong and unique
- [ ] Only trusted people have access to Vercel dashboard
- [ ] HTTPS is enabled (automatic on Vercel)

---

## 📝 Quick Reference

### Environment Variables Format

```bash
# .env.local or Vercel Environment Variables
JWT_SECRET=a1b2c3d4e5f6...          # Random hex string (32+ chars)
ADMIN_USERNAME=admin                 # Your username (default: admin)
ADMIN_PASSWORD=$2a$12$...           # BCRYPT HASH (not plain text!)
```

### Common Commands

```bash
# Generate password hash
node scripts/hash-password.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start development server
npm run dev

# Check environment variables (local)
cat .env.local
```

### Login Credentials

- **URL**: `https://your-domain.com/admin/login`
- **Username**: Value of `ADMIN_USERNAME` (default: "admin")
- **Password**: Your **plain text password** (not the hash!)

---

## 🎯 Example Setup

Here's a complete example of setting up from scratch:

```bash
# 1. Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6789...

# 2. Generate Password Hash
node scripts/hash-password.js
# Enter password: MySecurePass123!
# Output: $2a$12$abcdefghijklmnopqrstuvwxyz...

# 3. Create .env.local
cat > .env.local << EOF
JWT_SECRET=a1b2c3d4e5f6789...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2a$12$abcdefghijklmnopqrstuvwxyz...
DATABASE_URL=your-database-url
BLOB_READ_WRITE_TOKEN=your-blob-token
EOF

# 4. Start server
npm run dev

# 5. Test login at http://localhost:3000/admin/login
# Username: admin
# Password: MySecurePass123!
```

---

## 📚 Related Documentation

- **Database Setup**: `DATABASE_SETUP.md`
- **Vercel Deployment**: `VERCEL_DEPLOYMENT.md`
- **Admin Guide**: `ADMIN_GUIDE.md`
- **Main README**: `README.md`

---

## ❓ Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for error messages (F12 → Console tab)
2. Check the terminal/Vercel logs for server errors
3. Verify ALL environment variables are set correctly
4. Try generating a new password hash
5. Clear browser cookies and try again
6. Make sure you restarted/redeployed after changes

---

**Remember**: Always use the BCRYPT HASH in environment variables, but log in with your PLAIN TEXT password! 🔐
