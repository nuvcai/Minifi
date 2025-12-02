# 🚀 Loops.so 5-Minute Setup

The **simplest** way to automate newsletters. Zero complexity.

## How It Works

```
┌───────────────────────────────────────────────────────────────┐
│                    THE MAGIC OF LOOPS                         │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│   Your App                    Loops.so                        │
│   ────────                    ────────                        │
│                                                               │
│   User signs up ──────────>  "signup" event                   │
│                              ──────────────>  Welcome email   │
│                                                               │
│   Mission done ───────────>  "mission_complete" event         │
│                              ──────────────>  Congrats email  │
│                                                               │
│   User inactive ──────────>  "inactive_7d" event              │
│                              ──────────────>  Come back email │
│                                                               │
│   Weekly cron ────────────>  "weekly_digest" event            │
│                              ──────────────>  Newsletter!     │
│                                                               │
│   You just trigger events. Loops sends the emails.            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Step 1: Get Loops API Key (1 min)

1. Go to [loops.so](https://loops.so)
2. Create free account
3. Go to **Settings → API**
4. Copy your API key

## Step 2: Add to Environment (1 min)

**For Vercel (frontend):**
```bash
# In Vercel dashboard → Settings → Environment Variables
LOOPS_API_KEY=your_api_key_here
```

**For Render (backend):**
```bash
# In Render dashboard → Environment
LOOPS_API_KEY=your_api_key_here
```

## Step 3: Create Events in Loops Dashboard (3 min)

Go to **Loops Dashboard → Events** and create these:

| Event Name | What to Send |
|------------|--------------|
| `signup` | Welcome email |
| `mission_complete` | "Great job!" celebration |
| `level_up` | Level up celebration |
| `achievement` | Badge earned email |
| `inactive_7d` | "We miss you!" email |
| `weekly_digest` | Your weekly newsletter |

For each event, Loops lets you design the email template with drag-and-drop.

## Step 4: Use in Your Code

### Frontend (Next.js)

```typescript
// Just import and use!
import { onSignup, onMissionComplete, onLevelUp } from '@/lib/loops-simple';

// When user signs up
onSignup('user@email.com', 'John');

// When user completes mission
onMissionComplete('user@email.com', 'First Investment', 100);

// When user levels up
onLevelUp('user@email.com', 5);
```

### Backend (Python/FastAPI)

```python
from services.loops_simple import on_signup, on_mission_complete, on_level_up

# When user signs up
await on_signup('user@email.com', 'John')

# When user completes mission
await on_mission_complete('user@email.com', 'First Investment', 100)

# When user levels up
await on_level_up('user@email.com', 5)
```

## Automatic Weekly Newsletter

### Option A: Loops Scheduled Sends (Easiest!)

1. Go to **Loops Dashboard → Campaigns**
2. Create new campaign
3. Set **Schedule**: Weekly on Tuesday 10am
4. Design your newsletter
5. Select audience: "All subscribers"
6. **Done!** Loops sends it automatically every week

### Option B: Trigger via Cron

If you want dynamic content, use a cron to trigger the event:

```python
# backend/main.py - Add this endpoint
@app.post("/cron/newsletter")
async def send_newsletter():
    from services.loops_simple import trigger_event
    
    # Get all subscriber emails from your database
    subscribers = ["user1@email.com", "user2@email.com"]  # From DB
    
    for email in subscribers:
        await trigger_event(email, "weekly_digest", {
            "week": datetime.now().isocalendar()[1]
        })
    
    return {"sent": len(subscribers)}
```

Then set up free cron at [cron-job.org](https://cron-job.org):
- URL: `https://your-api.onrender.com/cron/newsletter`
- Schedule: `0 10 * * 2` (Tuesday 10am)

## That's It!

| What | How |
|------|-----|
| New subscriber | `onSignup(email, name)` |
| User action | `triggerEvent(email, 'event_name')` |
| Weekly newsletter | Loops scheduled campaign OR cron trigger |

**Total setup time: ~5 minutes**
**Monthly cost: $0** (up to 1,000 contacts)

## Quick Reference

### Files Created

```
lib/loops-simple.ts          # Frontend (3 functions)
backend/services/loops_simple.py  # Backend (3 functions)
```

### The Only 3 Functions

```typescript
// 1. Add user to newsletter list
addToNewsletter(email, firstName?, source?)

// 2. Trigger an event (Loops sends the email)
triggerEvent(email, eventName, data?)

// 3. Update user data (for segmentation)
updateUser(email, data)
```

### Helper Functions

```typescript
onSignup(email, name)           // User signed up
onMissionComplete(email, mission, xp)  // Completed mission
onLevelUp(email, level)         // Leveled up
onAchievement(email, badge)     // Got achievement
onInactive(email, days)         // User went inactive
```

## Troubleshooting

**Emails not sending?**
1. Check LOOPS_API_KEY is set correctly
2. Verify event exists in Loops dashboard
3. Check Loops dashboard → Activity for errors

**User not in Loops?**
- Make sure `addToNewsletter` is called on signup

**Want to test?**
- Use your own email first
- Check Loops Activity tab for event logs


