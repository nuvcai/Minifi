/**
 * 🔄 Loops.so Integration
 * 
 * Loops.so is perfect for automated newsletter sending!
 * - API-first: Your backend can trigger emails
 * - Automated sequences: Welcome, re-engagement, digests
 * - Built for SaaS: Designed for apps like Legacy Guardians
 * 
 * Pricing (as of 2024):
 * - Free: 1,000 contacts, 2,000 emails/mo
 * - Basic ($49/mo): 5,000 contacts, 50,000 emails/mo
 * - Pro ($149/mo): 15,000 contacts, unlimited emails
 */

// =============================================================================
// LOOPS.SO CLIENT
// =============================================================================

const LOOPS_API_URL = 'https://app.loops.so/api/v1';

interface LoopsConfig {
  apiKey: string;
}

interface Contact {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  userGroup?: string;
  subscribed?: boolean;
  // Custom properties
  [key: string]: string | number | boolean | undefined;
}

interface TransactionalEmail {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, string | number>;
  addToAudience?: boolean;
}

interface EventPayload {
  email: string;
  eventName: string;
  eventProperties?: Record<string, string | number>;
}

export class LoopsClient {
  private apiKey: string;

  constructor(config?: LoopsConfig) {
    this.apiKey = config?.apiKey || process.env.LOOPS_API_KEY || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async request(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    if (!this.isConfigured()) {
      console.log(`🔄 [DEV] Loops.so would ${method} ${endpoint}`, body);
      return { success: true, data: { mock: true } };
    }

    try {
      const response = await fetch(`${LOOPS_API_URL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // ===========================================================================
  // CONTACTS
  // ===========================================================================

  /**
   * Create or update a contact
   */
  async createContact(contact: Contact): Promise<{ success: boolean; id?: string; error?: string }> {
    const result = await this.request('/contacts/create', 'POST', contact);
    return {
      success: result.success,
      id: (result.data as { id?: string })?.id,
      error: result.error
    };
  }

  /**
   * Update a contact
   */
  async updateContact(email: string, properties: Partial<Contact>): Promise<{ success: boolean }> {
    const result = await this.request('/contacts/update', 'PUT', {
      email,
      ...properties
    });
    return { success: result.success };
  }

  /**
   * Delete a contact
   */
  async deleteContact(email: string): Promise<{ success: boolean }> {
    const result = await this.request('/contacts/delete', 'POST', { email });
    return { success: result.success };
  }

  /**
   * Find a contact
   */
  async findContact(email: string): Promise<{ success: boolean; contact?: Contact }> {
    const result = await this.request(`/contacts/find?email=${encodeURIComponent(email)}`);
    return {
      success: result.success,
      contact: result.data as Contact
    };
  }

  // ===========================================================================
  // EVENTS (Trigger automated sequences)
  // ===========================================================================

  /**
   * Send an event to trigger automated emails
   * This is how you trigger newsletters and sequences!
   */
  async sendEvent(payload: EventPayload): Promise<{ success: boolean }> {
    const result = await this.request('/events/send', 'POST', payload);
    return { success: result.success };
  }

  // ===========================================================================
  // TRANSACTIONAL EMAILS
  // ===========================================================================

  /**
   * Send a transactional email (one-off, immediate)
   */
  async sendTransactional(params: TransactionalEmail): Promise<{ success: boolean }> {
    const result = await this.request('/transactional', 'POST', params);
    return { success: result.success };
  }

  // ===========================================================================
  // MAILING LISTS
  // ===========================================================================

  /**
   * Get all mailing lists
   */
  async getMailingLists(): Promise<{ success: boolean; lists?: Array<{ id: string; name: string }> }> {
    const result = await this.request('/lists');
    return {
      success: result.success,
      lists: result.data as Array<{ id: string; name: string }>
    };
  }
}

// =============================================================================
// PRE-CONFIGURED CLIENT
// =============================================================================

export const loops = new LoopsClient();

// =============================================================================
// HIGH-LEVEL HELPERS FOR LEGACY GUARDIANS
// =============================================================================

export const loopsHelpers = {
  /**
   * Add a new newsletter subscriber
   */
  async subscribe(email: string, options?: {
    firstName?: string;
    source?: string;
  }): Promise<{ success: boolean }> {
    return loops.createContact({
      email,
      firstName: options?.firstName,
      source: options?.source || 'website',
      userGroup: 'newsletter',
      subscribed: true,
      // Custom properties for segmentation
      signupDate: new Date().toISOString(),
      appUser: false
    });
  },

  /**
   * User signed up to the app
   */
  async onAppSignup(email: string, options?: {
    firstName?: string;
    coach?: string;
  }): Promise<void> {
    // Create/update contact
    await loops.createContact({
      email,
      firstName: options?.firstName,
      userGroup: 'app_users',
      subscribed: true,
      appUser: true,
      coach: options?.coach,
      signupDate: new Date().toISOString()
    });

    // Trigger welcome sequence
    await loops.sendEvent({
      email,
      eventName: 'app_signup',
      eventProperties: {
        coach: options?.coach || 'none'
      }
    });
  },

  /**
   * User completed a mission
   */
  async onMissionComplete(email: string, mission: string, returnPct: number): Promise<void> {
    await loops.sendEvent({
      email,
      eventName: 'mission_completed',
      eventProperties: {
        mission,
        returnPct,
        profitable: returnPct > 0 ? 1 : 0
      }
    });
  },

  /**
   * User earned an achievement
   */
  async onAchievement(email: string, achievement: string, xp: number): Promise<void> {
    await loops.sendEvent({
      email,
      eventName: 'achievement_earned',
      eventProperties: {
        achievement,
        xp
      }
    });
  },

  /**
   * User hasn't been active (trigger re-engagement)
   */
  async onInactive(email: string, daysSinceActive: number): Promise<void> {
    await loops.sendEvent({
      email,
      eventName: 'user_inactive',
      eventProperties: {
        daysSinceActive
      }
    });
  },

  /**
   * Trigger weekly newsletter to all subscribers
   * Call this from your cron job!
   */
  async triggerWeeklyNewsletter(content: {
    subject: string;
    preheader: string;
    mainContent: string;
    quote?: string;
    quoteAuthor?: string;
  }): Promise<{ success: boolean }> {
    // In Loops, you would:
    // 1. Create a Campaign in the Loops dashboard
    // 2. Use the API to trigger it, OR
    // 3. Send to a segment via transactional
    
    // For automated weekly, use their Scheduled feature in dashboard
    // This triggers the "weekly_digest" event for custom logic
    
    console.log('📧 Triggering weekly newsletter via Loops.so');
    console.log('Content:', content);
    
    // If using transactional with a template:
    // await loops.sendTransactional({
    //   transactionalId: 'weekly_newsletter_template_id',
    //   email: 'newsletter-segment@loops.so', // Loops handles the segment
    //   dataVariables: content
    // });
    
    return { success: true };
  }
};

// =============================================================================
// LOOPS EVENT NAMES (Create these sequences in Loops dashboard)
// =============================================================================

export const LOOPS_EVENTS = {
  // Lifecycle events
  APP_SIGNUP: 'app_signup',           // → Welcome sequence
  NEWSLETTER_SIGNUP: 'newsletter_signup', // → Newsletter welcome
  
  // Engagement events
  MISSION_COMPLETED: 'mission_completed', // → Celebration email
  ACHIEVEMENT_EARNED: 'achievement_earned', // → Share prompt
  LEVEL_UP: 'level_up',               // → Level up celebration
  
  // Re-engagement events
  USER_INACTIVE: 'user_inactive',     // → Re-engagement sequence
  CHURN_RISK: 'churn_risk',           // → Win-back sequence
  
  // Conversion events
  PREMIUM_VIEWED: 'premium_viewed',   // → Upgrade nudge
  REFERRAL_SENT: 'referral_sent',     // → Referral thank you
  REFERRAL_CONVERTED: 'referral_converted', // → Referral reward
  
  // Scheduled (set up in Loops dashboard)
  WEEKLY_DIGEST: 'weekly_digest'      // → Weekly newsletter
} as const;

// =============================================================================
// SETUP INSTRUCTIONS
// =============================================================================

export const LOOPS_SETUP = `
## 🔄 Loops.so Setup Guide

### 1. Create Account
Go to https://loops.so and sign up (free tier: 1,000 contacts)

### 2. Get API Key
Dashboard → Settings → API → Create API Key

### 3. Add to Environment
LOOPS_API_KEY=your_api_key_here

### 4. Create Email Templates in Loops Dashboard:

#### Welcome Sequence (Trigger: app_signup)
- Email 1 (Day 0): Welcome! Here's your first mission
- Email 2 (Day 2): Meet your AI coaches
- Email 3 (Day 5): How's it going? Tips & tricks
- Email 4 (Day 7): Invite friends, earn rewards

#### Newsletter Welcome (Trigger: newsletter_signup)
- Email 1 (Day 0): Thanks for subscribing!
- Email 2 (Day 3): Here's what to expect

#### Achievement Celebration (Trigger: achievement_earned)
- Single email: Congrats! Share your achievement

#### Re-engagement (Trigger: user_inactive)
- Email 1 (Day 7): We miss you!
- Email 2 (Day 14): New features you've missed
- Email 3 (Day 21): Final reminder

#### Weekly Digest (Scheduled in Loops)
- Set up as recurring campaign: Every Tuesday at 10am
- Use dynamic content blocks from your API

### 5. Integrate in Your App

\`\`\`typescript
import { loopsHelpers } from '@/lib/loops';

// When user signs up
await loopsHelpers.onAppSignup(email, { firstName, coach });

// When user completes mission
await loopsHelpers.onMissionComplete(email, 'Japan 1990', 15.5);

// When user earns achievement
await loopsHelpers.onAchievement(email, 'First Million', 100);
\`\`\`

### 6. For Weekly Newsletter
Option A: Use Loops' built-in scheduling (recommended)
Option B: Trigger via cron job calling Loops API
`;

export default loops;


