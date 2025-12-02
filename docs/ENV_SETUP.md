# Environment Variables Setup

## Required for Lead Capture (Supabase)

Copy these to your `.env.local` file:

```bash
# =============================================================================
# SUPABASE - Database & Authentication
# Get these from: https://supabase.com/dashboard/project/_/settings/api
# =============================================================================

# Public URL (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Anon key (safe for client-side, limited permissions)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (SERVER ONLY - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================================================
# ADMIN API
# =============================================================================

# Secret key for admin API access (generate a secure random string)
ADMIN_API_KEY=your-secure-admin-key-here

# =============================================================================
# DISCORD WEBHOOKS - Real-time notifications (optional but recommended)
# Create webhooks: Server Settings > Integrations > Webhooks
# =============================================================================

# General notifications (new subscribers, etc.)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Feedback-specific channel (optional)
DISCORD_FEEDBACK_WEBHOOK=https://discord.com/api/webhooks/...
```

---

## Supabase Setup Steps

### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and keys

### 2. Run Database Schema
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `supabase/schema.sql`
3. Run the SQL to create tables

### 3. Set Environment Variables
1. Add the variables above to your `.env.local`
2. For Vercel: Add them in Project Settings > Environment Variables

---

## Database Tables Created

| Table | Purpose |
|-------|---------|
| `leads` | Newsletter subscribers & potential users |
| `feedback` | User feedback & feature requests |
| `waitlist` | Feature-specific waitlists |
| `sponsors` | Sponsor tracking & benefits |
| `user_activity` | Analytics & event tracking |

---

## API Endpoints

### Newsletter Subscription
```bash
# Subscribe
POST /api/newsletter/subscribe
{ "email": "user@example.com", "firstName": "John", "source": "homepage" }

# Check status
GET /api/newsletter/subscribe?stats=true

# Unsubscribe
DELETE /api/newsletter/subscribe?email=user@example.com
```

### Feedback
```bash
# Submit feedback
POST /api/feedback
{ "type": "idea", "message": "Add dark mode", "rating": 5, "pageContext": "homepage" }

# Get stats
GET /api/feedback?stats=true
```

### Waitlist
```bash
# Join waitlist
POST /api/waitlist
{ "email": "user@example.com", "feature": "risk-quiz" }

# Check position
GET /api/waitlist?email=user@example.com&feature=risk-quiz
```

### Admin (requires ADMIN_API_KEY)
```bash
# Get summary
GET /api/admin/leads?view=summary
Headers: x-api-key: your-admin-key

# Get all leads
GET /api/admin/leads?view=leads&limit=100

# Get all feedback
GET /api/admin/leads?view=feedback

# Export for CSV
GET /api/admin/leads?view=export
```

---

## Discord Webhook Format

When configured, you'll receive real-time notifications:

**New Subscriber:**
```
📧 New Newsletter Subscriber!
Email: user@example.com
Name: John
Source: homepage
```

**New Feedback:**
```
💡 New Idea Feedback
"Add more historical missions..."
Rating: ⭐⭐⭐⭐⭐
Page: timeline
```

---

## Testing Locally

Without Supabase configured, the API will:
1. Log to console
2. Return success responses
3. Not persist data

This allows development without database setup.

---

## Production Checklist

- [ ] Supabase project created
- [ ] Schema deployed (`supabase/schema.sql`)
- [ ] Environment variables set in Vercel/hosting
- [ ] Discord webhooks configured (optional)
- [ ] Admin API key generated and stored securely
- [ ] Row Level Security policies reviewed

