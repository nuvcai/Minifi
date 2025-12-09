"""
📰 Newsletter Service - Auto-generates and sends newsletters via Loops.so
Triggered by Render Cron Jobs

Usage:
1. Render calls /cron/newsletter endpoint
2. Service generates content from wisdom data
3. Sends via Loops.so API
4. Done! Zero manual work.
"""

import os
import json
import random
import httpx
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

# =============================================================================
# CONFIGURATION
# =============================================================================

LOOPS_API_KEY = os.getenv("LOOPS_API_KEY", "")
LOOPS_API_URL = "https://app.loops.so/api/v1"

# Your transactional email IDs from Loops dashboard
LOOPS_TRANSACTIONAL_IDS = {
    "weekly_digest": os.getenv("LOOPS_WEEKLY_DIGEST_ID", ""),
    "welcome": os.getenv("LOOPS_WELCOME_ID", ""),
    "achievement": os.getenv("LOOPS_ACHIEVEMENT_ID", ""),
    "reengagement": os.getenv("LOOPS_REENGAGEMENT_ID", ""),
}

# =============================================================================
# CONTENT DATA (mirrors your frontend wealthWisdom.ts)
# =============================================================================

WEALTH_PILLARS = [
    {
        "name": "Wealth Accumulation",
        "emoji": "🌱",
        "principle": "Start early, invest consistently, let compound growth work its magic",
        "for_teens": "Here's the secret adults wish they knew at your age: Starting to invest at 15-18 gives you a MASSIVE advantage! Thanks to compound growth, $100/month starting at 15 beats $500/month starting at 35. Time is your superpower!"
    },
    {
        "name": "Wealth Preservation",
        "emoji": "🛡️",
        "principle": "Protect what you've built - defense wins championships",
        "for_teens": "Think of wealth like health - prevention is easier than cure! Smart investors don't just chase gains; they protect against big losses. That's why we diversify."
    },
    {
        "name": "Wealth Growth",
        "emoji": "🚀",
        "principle": "Embrace calculated risks and transformative trends",
        "for_teens": "YOUR generation has AI and robotics - just like past generations had the railroad, electricity, and internet! Those who recognized these shifts early built generational wealth."
    },
    {
        "name": "Generational Transfer",
        "emoji": "🎓",
        "principle": "Wealth without wisdom is wasted in three generations",
        "for_teens": "One day, YOU might teach YOUR kids about investing! The knowledge you're building now isn't just for you - it's a gift to your future family."
    }
]

INVESTOR_WISDOM = [
    {
        "investor": "Warren Buffett",
        "quote": "The stock market is designed to transfer money from the Active to the Patient.",
        "lesson": "Patience beats panic. The best investors often do nothing.",
        "for_teens": "Don't check your investments every day. Set it, forget it, let it grow!"
    },
    {
        "investor": "Peter Lynch",
        "quote": "Know what you own, and know why you own it.",
        "lesson": "Invest in what you understand.",
        "for_teens": "Love gaming? Tech? Sports? Start by learning about companies in industries YOU actually care about!"
    },
    {
        "investor": "Charlie Munger",
        "quote": "The big money is not in the buying and selling, but in the waiting.",
        "lesson": "Time in market beats timing the market.",
        "for_teens": "Boring is beautiful in investing. The best portfolios are often the most ignored ones."
    },
    {
        "investor": "Ray Dalio",
        "quote": "He who lives by the crystal ball will eat shattered glass.",
        "lesson": "Nobody can predict the future - diversify.",
        "for_teens": "Don't try to guess what will happen next. Spread your bets!"
    }
]

TIPS = [
    "💡 Every time you get money (allowance, birthday, job), automatically put 10% aside before spending.",
    "💡 Before buying something, wait 24 hours. If you still want it tomorrow, maybe it's worth it!",
    "💡 Think in hours, not dollars. If something costs $50 and you earn $10/hour, is it worth 5 hours of your life?",
    "💡 Start with index funds - they're like buying a tiny piece of hundreds of companies at once!",
    "💡 The best time to start investing was yesterday. The second best time is today.",
    "💡 Compound interest is called the 8th wonder of the world. Einstein said so!",
    "💡 A 1% fee doesn't sound like much, but over 40 years it can cost you 25% of your wealth!",
    "💡 Emergency fund first! Keep 3-6 months of expenses in a savings account before investing."
]

# =============================================================================
# LOOPS.SO CLIENT
# =============================================================================

class LoopsClient:
    """Client for Loops.so API"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or LOOPS_API_KEY
        self.base_url = LOOPS_API_URL
    
    def is_configured(self) -> bool:
        return bool(self.api_key)
    
    async def _request(
        self, 
        method: str, 
        endpoint: str, 
        data: Dict = None
    ) -> Dict:
        """Make API request to Loops"""
        if not self.is_configured():
            print(f"🔄 [DEV] Loops.so would {method} {endpoint}")
            return {"success": True, "mock": True}
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=f"{self.base_url}{endpoint}",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=data
            )
            
            if response.status_code >= 400:
                print(f"❌ Loops API error: {response.status_code} - {response.text}")
                return {"success": False, "error": response.text}
            
            return {"success": True, "data": response.json()}
    
    async def create_contact(
        self, 
        email: str, 
        properties: Dict = None
    ) -> Dict:
        """Create or update a contact"""
        data = {"email": email, **(properties or {})}
        return await self._request("POST", "/contacts/create", data)
    
    async def send_event(
        self, 
        email: str, 
        event_name: str, 
        properties: Dict = None
    ) -> Dict:
        """Send event to trigger automated sequences"""
        data = {
            "email": email,
            "eventName": event_name,
            "eventProperties": properties or {}
        }
        return await self._request("POST", "/events/send", data)
    
    async def send_transactional(
        self, 
        transactional_id: str,
        email: str,
        data_variables: Dict = None
    ) -> Dict:
        """Send a transactional email"""
        data = {
            "transactionalId": transactional_id,
            "email": email,
            "dataVariables": data_variables or {}
        }
        return await self._request("POST", "/transactional", data)
    
    async def get_contacts(self, limit: int = 100) -> List[Dict]:
        """Get all contacts (for sending digest)"""
        result = await self._request("GET", f"/contacts?limit={limit}")
        if result.get("success"):
            return result.get("data", [])
        return []

# Global client instance
loops_client = LoopsClient()

# =============================================================================
# NEWSLETTER GENERATOR
# =============================================================================

class NewsletterGenerator:
    """Generates newsletter content from existing data"""
    
    def __init__(self):
        self.week_number = self._get_week_number()
    
    def _get_week_number(self) -> int:
        """Get current week number of the year"""
        return datetime.now().isocalendar()[1]
    
    def _get_rotating_item(self, items: List, offset: int = 0) -> Any:
        """Get item based on week number for rotation"""
        index = (self.week_number + offset) % len(items)
        return items[index]
    
    def generate_wisdom(self) -> Dict:
        """Generate wealth pillar section"""
        pillar = self._get_rotating_item(WEALTH_PILLARS)
        return {
            "type": "wisdom",
            "emoji": pillar["emoji"],
            "title": pillar["name"],
            "principle": pillar["principle"],
            "content": pillar["for_teens"]
        }
    
    def generate_investor_spotlight(self) -> Dict:
        """Generate investor quote section"""
        investor = self._get_rotating_item(INVESTOR_WISDOM, offset=1)
        return {
            "type": "investor",
            "name": investor["investor"],
            "quote": investor["quote"],
            "lesson": investor["lesson"],
            "for_teens": investor["for_teens"]
        }
    
    def generate_tip(self) -> str:
        """Generate a tip"""
        return self._get_rotating_item(TIPS, offset=2)
    
    def generate_weekly_digest(self) -> Dict:
        """Generate complete weekly digest content"""
        wisdom = self.generate_wisdom()
        investor = self.generate_investor_spotlight()
        tip = self.generate_tip()
        
        return {
            "subject": f"📰 Legacy Guardians Weekly #{self.week_number}",
            "preheader": "Your weekly dose of financial wisdom!",
            "date": datetime.now().isoformat(),
            
            # Main content
            "intro": f"Hey there! 👋 Welcome to week #{self.week_number} of your financial journey!",
            
            "wisdom_emoji": wisdom["emoji"],
            "wisdom_title": wisdom["title"],
            "wisdom_principle": wisdom["principle"],
            "wisdom_content": wisdom["content"],
            
            "investor_name": investor["name"],
            "investor_quote": investor["quote"],
            "investor_lesson": investor["lesson"],
            "investor_for_teens": investor["for_teens"],
            
            "tip": tip,
            
            "cta_text": "Continue Your Journey",
            "cta_url": "https://legacyguardians.app/timeline",
            
            "closing": "Keep stacking knowledge! Your future self will thank you. 💚"
        }

# Global generator instance
newsletter_generator = NewsletterGenerator()

# =============================================================================
# NEWSLETTER SERVICE
# =============================================================================

class NewsletterService:
    """Main service for sending newsletters"""
    
    def __init__(self):
        self.loops = loops_client
        self.generator = newsletter_generator
    
    async def send_weekly_digest_to_all(self) -> Dict:
        """Send weekly digest to all subscribers"""
        print("📰 Starting weekly digest send...")
        
        # Generate content
        content = self.generator.generate_weekly_digest()
        print(f"📝 Generated content for week #{content['subject']}")
        
        # Get all contacts
        contacts = await self.loops.get_contacts(limit=10000)
        
        if not contacts:
            print("⚠️ No contacts found")
            return {
                "success": True,
                "message": "No contacts to send to",
                "sent": 0
            }
        
        # Filter for subscribed contacts
        subscribers = [c for c in contacts if c.get("subscribed", True)]
        print(f"📧 Sending to {len(subscribers)} subscribers")
        
        # Send to each subscriber
        sent = 0
        errors = []
        
        for contact in subscribers:
            try:
                email = contact.get("email")
                if not email:
                    continue
                
                # Personalize content
                personalized_content = {
                    **content,
                    "firstName": contact.get("firstName", "there")
                }
                
                # Send via transactional or event
                transactional_id = LOOPS_TRANSACTIONAL_IDS.get("weekly_digest")
                
                if transactional_id:
                    # Use transactional email
                    result = await self.loops.send_transactional(
                        transactional_id=transactional_id,
                        email=email,
                        data_variables=personalized_content
                    )
                else:
                    # Fallback: Send event to trigger sequence
                    result = await self.loops.send_event(
                        email=email,
                        event_name="weekly_digest",
                        properties=personalized_content
                    )
                
                if result.get("success"):
                    sent += 1
                else:
                    errors.append(f"{email}: {result.get('error')}")
                    
            except Exception as e:
                errors.append(f"Error: {str(e)}")
        
        print(f"✅ Weekly digest sent to {sent}/{len(subscribers)} subscribers")
        
        return {
            "success": True,
            "message": f"Weekly digest sent to {sent} subscribers",
            "sent": sent,
            "total": len(subscribers),
            "errors": len(errors),
            "content": content
        }
    
    async def send_welcome_email(self, email: str, first_name: str = None) -> Dict:
        """Send welcome email to new subscriber"""
        print(f"📧 Sending welcome email to {email}")
        
        # Create contact in Loops
        await self.loops.create_contact(email, {
            "firstName": first_name,
            "source": "app_signup",
            "subscribed": True,
            "userGroup": "newsletter"
        })
        
        # Trigger welcome sequence
        result = await self.loops.send_event(
            email=email,
            event_name="newsletter_signup",
            properties={"firstName": first_name or "there"}
        )
        
        return result
    
    async def send_achievement_email(
        self, 
        email: str, 
        achievement: str, 
        xp: int
    ) -> Dict:
        """Send achievement celebration email"""
        print(f"🏆 Sending achievement email to {email}")
        
        result = await self.loops.send_event(
            email=email,
            event_name="achievement_earned",
            properties={
                "achievement": achievement,
                "xp": xp
            }
        )
        
        return result
    
    async def trigger_reengagement(self, email: str, days_inactive: int) -> Dict:
        """Trigger re-engagement sequence for inactive user"""
        print(f"💤 Triggering re-engagement for {email} ({days_inactive} days)")
        
        result = await self.loops.send_event(
            email=email,
            event_name="user_inactive",
            properties={"daysSinceActive": days_inactive}
        )
        
        return result
    
    def preview_weekly_digest(self) -> Dict:
        """Preview this week's digest content (no sending)"""
        return self.generator.generate_weekly_digest()

# Global service instance
newsletter_service = NewsletterService()

# =============================================================================
# RENDER CRON HELPERS
# =============================================================================

async def cron_weekly_newsletter() -> Dict:
    """
    Called by Render cron job every Tuesday at 10am
    
    Render cron setup:
    1. Go to your Render service
    2. Add a Cron Job
    3. Schedule: 0 10 * * 2 (Tuesday 10am UTC)
    4. Command: curl -X POST https://your-api.onrender.com/cron/newsletter
    """
    return await newsletter_service.send_weekly_digest_to_all()

async def cron_reengagement_check() -> Dict:
    """
    Called daily to check for inactive users
    
    Schedule: 0 9 * * * (Daily 9am UTC)
    """
    # This would check your database for inactive users
    # and trigger re-engagement emails
    print("🔍 Checking for inactive users...")
    # Implementation depends on your database structure
    return {"success": True, "message": "Re-engagement check completed"}






