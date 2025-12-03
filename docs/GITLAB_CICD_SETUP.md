# GitLab CI/CD Setup Guide

## Overview

MiniFi uses GitLab CI/CD for automatic deployment to:
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (FastAPI/Python)

## Pipeline Stages

```
validate → test → build → deploy
```

| Stage | Jobs | Purpose |
|-------|------|---------|
| **validate** | `lint`, `typecheck` | Code quality checks |
| **test** | `test:frontend`, `test:backend` | Run test suites |
| **build** | `build:frontend`, `build:backend` | Build artifacts |
| **deploy** | `deploy:vercel`, `deploy:render` | Production deployment |

## Required CI/CD Variables

Configure these in GitLab → Settings → CI/CD → Variables:

### Vercel (Frontend)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | Organization ID | `vercel whoami` or project settings |
| `VERCEL_PROJECT_ID` | Project ID | `.vercel/project.json` after `vercel link` |

### Render (Backend)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `RENDER_API_KEY` | Render API Key | [Render Dashboard](https://dashboard.render.com/account/api-keys) |
| `RENDER_SERVICE_ID` | Service ID | URL: `dashboard.render.com/web/srv-XXXXX` → `srv-XXXXX` is the ID |

### Optional

| Variable | Description |
|----------|-------------|
| `SLACK_WEBHOOK_URL` | Slack notifications |
| `SUPABASE_URL` | Database connection |
| `SUPABASE_ANON_KEY` | Database auth |

## Setup Steps

### 1. Connect GitLab to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Link project (run from project root)
vercel link

# Get project/org IDs
cat .vercel/project.json
```

### 2. Create Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: `gitlab-ci`
4. Scope: Full Account
5. Copy token → Add to GitLab CI/CD Variables

### 3. Get Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Account Settings → API Keys
3. Create new key
4. Copy → Add to GitLab CI/CD Variables

### 4. Get Render Service ID

1. Go to your Render service dashboard
2. Copy service ID from URL: `dashboard.render.com/web/srv-XXXXX`

### 5. Add Variables to GitLab

1. Go to GitLab → Project → Settings → CI/CD
2. Expand "Variables"
3. Add each variable:
   - Check "Mask variable" for secrets
   - Check "Protect variable" for production-only

## Deployment Triggers

### Automatic Deployment (v1.2-release branch)

Push to `v1.2-release` triggers automatic deployment:

```bash
git checkout v1.2-release
git push gitlab v1.2-release
```

### Manual Deployment (main branch)

Push to `main` requires manual trigger:

1. Go to GitLab → CI/CD → Pipelines
2. Click on latest pipeline
3. Click "Play" button on deploy jobs

### Preview Deployments (Merge Requests)

Every MR gets a preview deployment automatically.

## Pipeline Configuration

### Branch Protection

| Branch | Auto-Deploy | Requires |
|--------|-------------|----------|
| `main` | Manual | Approval |
| `v1.2-release` | Auto | Build pass |
| `feature/*` | Preview only | MR |

### Environment URLs

| Environment | URL |
|-------------|-----|
| Production Frontend | https://minifi.vercel.app |
| Production Backend | https://minifi-backend.onrender.com |
| Preview | Dynamic per MR |

## Monitoring

### Pipeline Status

- GitLab → CI/CD → Pipelines
- Check build logs for errors
- Monitor deployment status

### Vercel Dashboard

- Build logs: Vercel → Project → Deployments
- Analytics: Vercel → Analytics
- Logs: Vercel → Logs

### Render Dashboard

- Logs: Render → Service → Logs
- Metrics: Render → Service → Metrics
- Events: Render → Service → Events

## Troubleshooting

### Build Failures

```bash
# Check Node version
node --version  # Should be 20+

# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### Deploy Failures

1. **Vercel Token Invalid**
   - Regenerate token
   - Update GitLab variable

2. **Render API Error**
   - Check service ID is correct
   - Verify API key has deploy permissions

3. **Branch Protection**
   - Ensure branch is not protected
   - Or add exceptions for CI

### Environment Variables Missing

```bash
# Verify variables in GitLab
# Settings → CI/CD → Variables

# Check variable is not "Protected" if deploying from non-protected branch
```

## Security Best Practices

1. **Mask all secrets** in CI/CD variables
2. **Protect production variables** to main/release branches only
3. **Rotate tokens** every 90 days
4. **Audit access** to CI/CD settings regularly
5. **Never commit secrets** to repository

## Cost Considerations

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | Free |
| Render | Free | Free (limited) |
| GitLab CI | Free tier | 400 mins/month |

For production, consider:
- Vercel Pro: $20/month
- Render Starter: $7/month
- GitLab Premium: $19/user/month

---

*Last Updated: December 2025*

