# 🔐 Cloudflare API Token Setup Guide

## Issue: Authentication Error During Deploy

Your build succeeds perfectly, but deployment fails with:
```
Authentication error [code: 10000]
```

**Cause:** The API token doesn't have Cloudflare Pages permissions.

---

## ✅ Solution: Create Proper API Token

### Step 1: Create New API Token

1. Go to **Cloudflare Dashboard**
2. Click your profile icon → **My Profile**
3. Go to **API Tokens** tab
4. Click **"Create Token"**

### Step 2: Configure Token Permissions

Click **"Create Custom Token"** and set:

```
Token name: Cloudflare Pages Deploy

Permissions:
├─ Account
│  └─ Cloudflare Pages → Edit
│
└─ Account Resources
   └─ Include → Your Account (ad653a08880c4e992e000e0bd5758162)

Zone Resources: (not needed for Pages-only deploy)

Client IP Address Filtering: (optional)

TTL: (optional - set expiration)
```

**Critical:** The token MUST have:
- ✅ Account → Cloudflare Pages → **Edit** (not Read)
- ✅ Account Resources → Include → Your specific account

### Step 3: Copy the Token

After creating:
1. **Copy the token immediately** (shown only once!)
2. Save it securely

---

## 🔧 Add Token to Your Project

### For Cloudflare Workers CI (what you're using):

1. Go to your Worker project in Cloudflare Dashboard
2. Navigate to **Settings** → **Variables and Secrets**
3. Add these environment variables:

```
CLOUDFLARE_API_TOKEN = your_new_token_here
CLOUDFLARE_ACCOUNT_ID = ad653a08880c4e992e000e0bd5758162
```

### Verify Token Works:

Test locally first:
```bash
export CLOUDFLARE_API_TOKEN="your_token"
export CLOUDFLARE_ACCOUNT_ID="ad653a08880c4e992e000e0bd5758162"

# Test authentication
curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Test Pages access
npx wrangler pages project list
```

---

## 📊 Required Permissions Summary

**Minimum for your portfolio:**
- Account → Cloudflare Pages → Edit ✅

**If you add D1 database later:**
- Account → Cloudflare Pages → Edit
- Account → D1 → Edit

**If you add R2 storage later:**
- Account → Cloudflare Pages → Edit  
- Account → R2 → Edit

---

## 🚀 After Adding Token

1. Save the environment variables in Cloudflare Workers settings
2. Trigger a new deployment (push to GitHub or manual retry)
3. The deploy command will now succeed!

---

## ✅ Expected Result

After fixing the token, your deployment will:
1. ✅ Build successfully (already working)
2. ✅ Authenticate with Cloudflare API
3. ✅ Deploy to Cloudflare Pages/Workers
4. ✅ Your portfolio goes live!

---

## 🆘 Troubleshooting

**Still getting auth errors?**
- Verify the token includes "Cloudflare Pages → Edit"
- Check the account ID matches: `ad653a08880c4e992e000e0bd5758162`
- Ensure token hasn't expired
- Try creating a fresh token with Pages permissions

**Token works locally but not in CI?**
- Double-check the environment variable names
- Ensure no extra spaces in the values
- Verify the variables are saved in the correct environment (production)
