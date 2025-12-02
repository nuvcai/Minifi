# Database Setup Guide

This guide helps you set up the Supabase database for Mini.Fi.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

## Environment Variables

Create a `.env.local` file in the project root with:

```bash
# Supabase - Get from Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Email Marketing (Loops.so)
LOOPS_API_KEY=your_loops_api_key_here

# Optional: Transactional Emails (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Optional: WhatsApp Notifications
WHATSAPP_ADMIN_PHONE=+1234567890
WHATSAPP_API_KEY=your_whatsapp_api_key_here
```

## Apply Database Schema

### Option 1: Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations
supabase db push
```

## Database Schema Overview

### Tables

| Table | Description |
|-------|-------------|
| `leads` | Newsletter subscribers and marketing leads |
| `feedback` | User feedback and feature requests |
| `user_activity` | Analytics and event tracking |
| `user_profiles` | User onboarding data and game progress |
| `sponsors` | GitHub sponsors and premium users |
| `daily_streaks` | Daily streak tracking (optional) |
| `streak_claims` | Individual streak claim history (optional) |
| `waitlist` | Feature-specific waitlists |

### Views

| View | Description |
|------|-------------|
| `lead_stats` | Aggregate lead statistics |
| `feedback_stats` | Aggregate feedback statistics |
| `lead_sources` | Lead breakdown by source |

## Verify Setup

Run the verification script:

```bash
npx ts-node scripts/verify-schema.ts
```

Or test via the API:

```bash
# Test stats endpoint (should return demo data if DB not configured)
curl http://localhost:3000/api/stats

# Test newsletter subscription
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Row Level Security (RLS)

The schema includes RLS policies:

- **Service Role**: Full access to all tables
- **Anonymous Users**: Can insert feedback, activity, and join waitlists
- **Authenticated Users**: Can read/update their own profiles

## Troubleshooting

### "Cannot find module 'supabase'"

The app handles missing Supabase gracefully. It will return mock data in development mode.

### "Permission denied"

Check that your service role key is correct and RLS policies are applied.

### "Table does not exist"

Run the schema.sql again to create all tables.

## Demo Mode

If Supabase is not configured, the app runs in demo mode:
- API endpoints return mock data
- No data is persisted
- Perfect for local development and testing

