# MiniFi Deployment Checklist

## Hosting Stack
- **Frontend:** Vercel (Next.js)
- **Backend:** Render (Python/FastAPI)
- **Database:** Supabase PostgreSQL ✅

---

## Pre-Deployment Checks

### Environment Variables Required

#### Backend (Render)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Supabase PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for coach AI |
| `AWS_ACCESS_KEY_ID` | ⚠️ Optional | AWS credentials for Bedrock |
| `AWS_SECRET_ACCESS_KEY` | ⚠️ Optional | AWS credentials for Bedrock |
| `AWS_REGION` | ⚠️ Optional | Default: `us-east-1` |
| `SMTP_SERVER` | ⚠️ Optional | Email server (default: `smtp.gmail.com`) |
| `SMTP_PORT` | ⚠️ Optional | Email port (default: `587`) |
| `SENDER_EMAIL` | ⚠️ Optional | From email for rewards |
| `SENDER_PASSWORD` | ⚠️ Optional | Email password/app password |

#### Frontend (Vercel)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Render backend URL |

---

## Backend Issues to Fix

### 🔴 Critical

1. **SQLite persistence on Render** - Render's free tier has ephemeral storage!
   - Option A: Use Render PostgreSQL add-on
   - Option B: Use external DB (Supabase, Neon, PlanetScale)
   - Option C: Accept data loss on restart (OK for MVP demo)

2. **No `.env.example` file** - Document required variables

### 🟡 Recommended

3. **Add CORS production URL** - Update for Render URL
4. **Add rate limiting** - Prevent API abuse
5. **Add request logging** - For debugging production issues

### 🟢 Nice to Have

6. **API versioning** - `/api/v1/...`
7. **Response compression** - Gzip for large responses
8. **Sentry/error tracking** - Monitor production errors

---

## Deployment Steps

### Backend (Render)

#### Option 1: Via Dashboard
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub/GitLab repo
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables in Render dashboard
5. Deploy!

#### Option 2: Via render.yaml (already configured!)
```yaml
# render.yaml already exists in project root
services:
  - type: web
    name: minifi-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    rootDir: backend
    envVars:
      - key: OPENAI_API_KEY
        sync: false  # Set manually in dashboard
```

### Frontend (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://minifi-backend.onrender.com
```

Or connect via Vercel Dashboard → Import Git Repository

---

## Files Configuration

### render.yaml (already exists ✅)
```yaml
services:
  - type: web
    name: minifi-backend
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    rootDir: backend
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: PYTHON_VERSION
        value: 3.11.0
    healthCheckPath: /health
    autoDeploy: true
```

### vercel.json (already exists ✅)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

### Update CORS in `main.py`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://minifi.vercel.app",           # Production (Vercel)
        "https://minifi-tick-ai.vercel.app",   # Team production
        "https://minifi.games",                 # Custom domain
        "https://www.minifi.games",             # Custom domain with www
        "https://*.vercel.app",                # Preview deployments
    ],
    allow_origin_regex=r"https://.*\.(vercel\.app|minifi\.games)",  # Allow subdomains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Post-Deployment Verification

### Core Functionality
- [ ] Backend `/health` returns `{ "status": "healthy" }`
- [ ] Backend `/docs` loads Swagger UI
- [ ] Backend `/quotes?ids=apple,bitcoin` returns price data
- [ ] Backend `/coach` endpoint responds (requires API key)
- [ ] Frontend loads at Vercel URL
- [ ] Frontend can call backend (CORS works)
- [ ] Leaderboard submit/get works

### v1.1 Features (Asset Class System)
- [ ] Historical missions display asset class badges
- [ ] Time horizon and FO allocation data visible
- [ ] Asset Class Mastery component loads on timeline page
- [ ] Risk Spectrum visualization renders correctly
- [ ] FO Certification Teaser displays on timeline
- [ ] Upcoming Features preview shows on home page
- [ ] Real historical data fetched for mission results (Yahoo Finance)

---

## Monitoring

### Render Dashboard
- View logs in real-time
- Check deploy history
- Monitor resource usage

### Vercel Dashboard
- View function logs
- Check analytics
- Monitor build times

### Recommended Additions
1. **Sentry** - Error tracking
2. **UptimeRobot** - Free uptime monitoring
3. **BetterStack** - Log aggregation

---

## Cost Estimates

| Service | Free Tier | Paid |
|---------|-----------|------|
| Render | 750 hours/month, spins down after 15min inactivity | $7/month (always on) |
| Vercel | 100GB bandwidth, 100 deploys/day | $20/month |
| OpenAI | Pay-as-you-go | ~$5-50/month |
| AWS Bedrock | Pay-as-you-go | ~$2-20/month |

### ⚠️ Render Free Tier Notes
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- SQLite data is lost on each deploy/restart

---

## Database: Supabase PostgreSQL ✅

**Connection String Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Set in Render Dashboard:**
1. Go to your Render service
2. Environment → Add Environment Variable
3. Key: `DATABASE_URL`
4. Value: Your Supabase connection string

**Tables Created Automatically:**
- `prices` - Price caching
- `events` - Historical financial events
- `leaderboard` - Player scores
- `player_progress` - Mission completion
- `coach_interactions` - AI coach logs

---

*Last Updated: December 2025*

