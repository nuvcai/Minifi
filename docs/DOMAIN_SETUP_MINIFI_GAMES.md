# minifi.games Domain Setup & Configuration

## Status Summary

**Domain:** `minifi.games` and `www.minifi.games`  
**Frontend Hosting:** Vercel  
**Backend Hosting:** Render  
**DNS Status:** ✅ Configured (points to Vercel)  
**Site Status:** ✅ Online (accessible via browser)  
**Backend Status:** ⚠️ Needs verification

---

## Issues Found & Fixed

### ✅ Fixed: Backend CORS Configuration

**Problem:** The backend CORS configuration was missing `minifi.games`, which would block API requests from the custom domain.

**Solution Applied:**
- Added `https://minifi.games` and `https://www.minifi.games` to `ALLOWED_ORIGINS` in `backend/main.py`
- Updated CORS regex pattern to allow `.minifi.games` subdomains
- Updated deployment documentation

**File Changed:** `backend/main.py` (lines 134-135, 149)

---

## Configuration Checklist

### ✅ Frontend (Vercel)

- [x] Domain `minifi.games` configured in Vercel dashboard
- [x] Domain `www.minifi.games` configured in Vercel dashboard
- [x] DNS records pointing to Vercel
- [x] SSL certificate (automatic via Vercel)
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set to backend URL

**Vercel Environment Variables Required:**
```bash
NEXT_PUBLIC_API_URL=https://minifi-backend.onrender.com
```

### ⚠️ Backend (Render)

- [x] CORS updated to include `minifi.games`
- [ ] Backend deployment verified (currently returning "Not Found")
- [ ] Health endpoint `/health` accessible
- [ ] Environment variables configured

**Backend Environment Variables Required:**
```bash
DATABASE_URL=<supabase-connection-string>
OPENAI_API_KEY=<openai-key>
LOOPS_API_KEY=<loops-key>  # Optional
CRON_SECRET=<cron-secret>  # Optional
```

---

## Verification Steps

### 1. Frontend Verification

```bash
# Check DNS resolution
dig minifi.games +short
dig www.minifi.games +short

# Expected: Should resolve to Vercel DNS (21c9407b7ad7de29.vercel-dns-016.com)

# Check site accessibility
curl -I https://minifi.games
curl -I https://www.minifi.games

# Expected: HTTP 200 OK
```

### 2. Backend Verification

```bash
# Check backend health
curl https://minifi-backend.onrender.com/health

# Expected: {"status":"healthy","timestamp":"..."}

# Check backend root
curl https://minifi-backend.onrender.com/

# Expected: API info JSON
```

### 3. CORS Verification

Open browser console on `https://minifi.games` and check for CORS errors when making API calls.

---

## Next Steps

### Immediate Actions Required

1. **Deploy Backend Changes**
   - The CORS configuration has been updated in `backend/main.py`
   - Deploy to Render to apply changes
   - Verify backend is accessible at `https://minifi-backend.onrender.com`

2. **Verify Vercel Environment Variables**
   - Ensure `NEXT_PUBLIC_API_URL` is set in Vercel dashboard
   - Value should be: `https://minifi-backend.onrender.com`

3. **Test End-to-End**
   - Visit `https://minifi.games`
   - Test API calls (e.g., AI coach, trading simulation)
   - Check browser console for errors
   - Verify CORS headers in network tab

### Optional Improvements

1. **Update CI/CD Pipeline**
   - Add `minifi.games` to GitLab CI/CD environment URLs
   - Update deployment scripts if needed

2. **Add Domain to Documentation**
   - Update README.md with production URL
   - Update any marketing materials

3. **Monitor Backend Health**
   - Set up health check monitoring
   - Configure alerts for downtime

---

## Troubleshooting

### Issue: Site shows "Connection Reset"

**Possible Causes:**
- DNS propagation delay (wait 24-48 hours)
- Vercel domain configuration incomplete
- SSL certificate not issued yet

**Solution:**
- Check Vercel dashboard → Domains → Verify configuration
- Wait for DNS/SSL propagation
- Check Vercel deployment logs

### Issue: API Calls Fail with CORS Error

**Possible Causes:**
- Backend CORS not updated
- Backend not deployed with latest changes
- Wrong backend URL in frontend environment

**Solution:**
1. Verify `backend/main.py` has `minifi.games` in CORS
2. Redeploy backend to Render
3. Check `NEXT_PUBLIC_API_URL` in Vercel dashboard
4. Clear browser cache and test again

### Issue: Backend Returns "Not Found"

**Possible Causes:**
- Backend service not deployed
- Wrong backend URL
- Backend service stopped/sleeping (Render free tier)

**Solution:**
- Check Render dashboard for service status
- Verify backend URL is correct
- Check Render logs for errors
- Consider upgrading Render plan if service sleeps

---

## Files Modified

1. `backend/main.py` - Added `minifi.games` to CORS configuration
2. `docs/DEPLOYMENT_CHECKLIST.md` - Updated CORS example

---

## Related Documentation

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [GitLab CI/CD Setup](./GITLAB_CICD_SETUP.md)
- [Environment Setup](./ENV_SETUP.md)

---

**Last Updated:** 2025-12-09  
**Status:** CORS configuration fixed, backend deployment verification pending
