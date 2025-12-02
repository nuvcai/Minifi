"""
🚀 SIMPLEST LOOPS.SO SETUP (Python/Backend)

ONE file. ONE API key. FULLY automated.

Setup:
1. Get API key from loops.so/settings/api  
2. Add LOOPS_API_KEY to Render env vars
3. Done!
"""

import os
import httpx

LOOPS_API_KEY = os.getenv("LOOPS_API_KEY", "")
LOOPS_URL = "https://app.loops.so/api/v1"


# =============================================================================
# THE ONLY 3 FUNCTIONS YOU NEED
# =============================================================================

async def add_to_newsletter(
    email: str, 
    first_name: str = "", 
    source: str = "app"
) -> dict:
    """
    1️⃣ ADD USER TO NEWSLETTER
    Call this when someone signs up
    """
    if not LOOPS_API_KEY:
        print(f"📧 [DEV] Would add to newsletter: {email}")
        return {"success": True, "mock": True}

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{LOOPS_URL}/contacts/create",
            headers={
                "Authorization": f"Bearer {LOOPS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "email": email,
                "firstName": first_name,
                "source": source,
                "subscribed": True,
                "userGroup": "newsletter",
            },
        )
        return {"success": res.is_success}


async def trigger_event(
    email: str,
    event_name: str,
    data: dict = None
) -> dict:
    """
    2️⃣ TRIGGER AN EVENT
    Loops auto-sends emails based on events you define in dashboard
    
    Pre-made events to create in Loops dashboard:
    - "signup" → Welcome email
    - "mission_complete" → Celebration email  
    - "inactive_7d" → Re-engagement email
    - "weekly_digest" → Weekly newsletter
    """
    if not LOOPS_API_KEY:
        print(f"📧 [DEV] Would trigger event: {event_name} for {email}")
        return {"success": True, "mock": True}

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{LOOPS_URL}/events/send",
            headers={
                "Authorization": f"Bearer {LOOPS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "email": email,
                "eventName": event_name,
                "eventProperties": data or {},
            },
        )
        return {"success": res.is_success}


async def update_user(
    email: str,
    data: dict
) -> dict:
    """
    3️⃣ UPDATE USER DATA
    Call this when user progresses (Loops auto-segments)
    """
    if not LOOPS_API_KEY:
        print(f"📧 [DEV] Would update user: {email}")
        return {"success": True, "mock": True}

    async with httpx.AsyncClient() as client:
        res = await client.put(
            f"{LOOPS_URL}/contacts/update",
            headers={
                "Authorization": f"Bearer {LOOPS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={"email": email, **data},
        )
        return {"success": res.is_success}


# =============================================================================
# CONVENIENCE HELPERS
# =============================================================================

async def on_signup(email: str, name: str = ""):
    """User just signed up"""
    await add_to_newsletter(email, name, "signup")
    await trigger_event(email, "signup", {"firstName": name})


async def on_mission_complete(email: str, mission_name: str, xp: int):
    """User completed a mission"""
    await trigger_event(email, "mission_complete", {"missionName": mission_name, "xp": xp})
    await update_user(email, {"lastMission": mission_name, "totalXp": xp})


async def on_level_up(email: str, level: int):
    """User leveled up"""
    await trigger_event(email, "level_up", {"level": level})
    await update_user(email, {"playerLevel": level})


async def on_achievement(email: str, achievement: str):
    """User earned achievement"""
    await trigger_event(email, "achievement", {"achievement": achievement})


async def on_inactive(email: str, days: int):
    """User inactive for X days (called by cron)"""
    await trigger_event(email, f"inactive_{days}d", {"daysSinceActive": days})


# =============================================================================
# NEWSLETTER CRON HELPER
# =============================================================================

async def send_weekly_digest_event(emails: list[str], week_number: int):
    """
    Trigger weekly digest for all subscribers
    
    In Loops dashboard, create a "weekly_digest" event that sends your newsletter.
    This function just triggers it for each subscriber.
    """
    results = []
    for email in emails:
        result = await trigger_event(email, "weekly_digest", {"week": week_number})
        results.append({"email": email, **result})
    
    sent = sum(1 for r in results if r.get("success"))
    return {"sent": sent, "total": len(emails)}


