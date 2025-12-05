/**
 * Newsletter Integration Layer
 * Supports multiple providers: Beehiiv, Substack, Resend
 * Falls back gracefully if not configured
 */

// =============================================================================
// BEEHIIV INTEGRATION
// Sign up at beehiiv.com - free up to 2,500 subscribers
// =============================================================================

interface BeehiivSubscriber {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  custom_fields?: Array<{ name: string; value: string }>;
  send_welcome_email?: boolean;
  reactivate_existing?: boolean;
}

interface BeehiivConfig {
  publicationId: string;
  apiKey: string;
}

export const beehiiv = {
  isConfigured(): boolean {
    return !!(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID);
  },

  async addSubscriber(data: BeehiivSubscriber): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      console.warn('Beehiiv not configured, skipping');
      return { success: true };
    }

    try {
      const response = await fetch(
        `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: data.email,
            reactivate_existing: data.reactivate_existing ?? true,
            send_welcome_email: data.send_welcome_email ?? true,
            utm_source: data.utm_source || 'website',
            utm_medium: data.utm_medium || 'organic',
            utm_campaign: data.utm_campaign,
            referring_site: data.referring_site || 'legacyguardians.app',
            custom_fields: data.custom_fields || []
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Beehiiv error:', error);
        return { success: false, error: error.message || 'Subscription failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Beehiiv API error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async getStats(): Promise<{ subscribers?: number; error?: string }> {
    if (!this.isConfigured()) {
      return { subscribers: 0 };
    }

    try {
      const response = await fetch(
        `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
          }
        }
      );

      if (!response.ok) {
        return { error: 'Failed to fetch stats' };
      }

      const data = await response.json();
      return { subscribers: data.data?.subscriber_count || 0 };
    } catch (error) {
      return { error: 'Network error' };
    }
  }
};

// =============================================================================
// RESEND INTEGRATION
// For transactional emails - welcome, notifications, etc.
// =============================================================================

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export const resend = {
  isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  },

  async send(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log('📧 [DEV] Would send email:', options.subject, 'to', options.to);
      return { success: true, id: 'dev-mode' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: options.from || 'Legacy Guardians <hello@legacyguardians.app>',
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
          tags: options.tags
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async sendBatch(emails: EmailOptions[]): Promise<{ success: boolean; sent: number }> {
    if (!this.isConfigured()) {
      console.log(`📧 [DEV] Would send ${emails.length} batch emails`);
      return { success: true, sent: emails.length };
    }

    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emails.map(e => ({
          from: e.from || 'Legacy Guardians <hello@legacyguardians.app>',
          to: Array.isArray(e.to) ? e.to : [e.to],
          subject: e.subject,
          html: e.html
        })))
      });

      if (!response.ok) {
        return { success: false, sent: 0 };
      }

      const data = await response.json();
      return { success: true, sent: data.data?.length || emails.length };
    } catch (error) {
      return { success: false, sent: 0 };
    }
  }
};

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

export const emailTemplates = {
  welcome: (name?: string) => ({
    subject: 'Welcome to Legacy Guardians! 🎮💰',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px;">🎮 Welcome to Legacy Guardians!</h1>
      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your financial literacy adventure begins now</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; line-height: 1.6;">
        Hey${name ? ` ${name}` : ''}! 👋
      </p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        You've just taken the first step toward mastering your financial future. 
        Legacy Guardians will teach you how money works through epic time-travel adventures!
      </p>
      
      <h3 style="color: #10b981; margin-top: 30px;">🚀 What's Next?</h3>
      
      <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="margin-bottom: 15px;">
          <span style="color: #10b981; font-weight: bold;">1.</span>
          <strong>Start Your First Mission</strong><br>
          <span style="color: #94a3b8; font-size: 14px;">Travel to Japan 1990 and learn about market bubbles</span>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #10b981; font-weight: bold;">2.</span>
          <strong>Choose Your AI Coach</strong><br>
          <span style="color: #94a3b8; font-size: 14px;">Conservative Clara, Balanced Brock, or Aggressive Alex?</span>
        </div>
        <div>
          <span style="color: #10b981; font-weight: bold;">3.</span>
          <strong>Earn 🪙 iii & Rewards</strong><br>
          <span style="color: #94a3b8; font-size: 14px;">Complete missions to level up and earn real rewards!</span>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://legacyguardians.app/timeline" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 12px; font-weight: bold; font-size: 16px;">
          Start Playing →
        </a>
      </div>
      
      <p style="font-size: 14px; color: #94a3b8; text-align: center;">
        Questions? Just reply to this email - we read every message! 💚
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        Made with 💚 by <a href="https://nuvc.ai" style="color: #10b981;">NUVC.AI</a> for teens everywhere
      </p>
      <p style="margin: 10px 0 0; font-size: 11px; color: #475569;">
        You're receiving this because you signed up for Legacy Guardians.
        <a href="{{unsubscribe_url}}" style="color: #64748b;">Unsubscribe</a>
      </p>
    </div>
    
  </div>
</body>
</html>
    `
  }),

  weeklyDigest: (stats: { xp: number; level: number; missions: number }) => ({
    subject: `📊 Your Weekly Progress: ${stats.xp} XP earned!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 24px;">📊 Your Weekly Progress</h1>
    </div>
    
    <div style="padding: 30px;">
      <div style="display: flex; justify-content: space-around; text-align: center; margin-bottom: 30px;">
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #10b981;">${stats.xp}</div>
          <div style="color: #94a3b8; font-size: 14px;">XP Earned</div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #8b5cf6;">${stats.level}</div>
          <div style="color: #94a3b8; font-size: 14px;">Current Level</div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #f59e0b;">${stats.missions}</div>
          <div style="color: #94a3b8; font-size: 14px;">Missions Done</div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://legacyguardians.app/timeline" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 12px; font-weight: bold;">
          Continue Your Journey →
        </a>
      </div>
    </div>
    
    <div style="background: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        <a href="{{unsubscribe_url}}" style="color: #64748b;">Unsubscribe</a>
      </p>
    </div>
    
  </div>
</body>
</html>
    `
  }),

  referralInvite: (referrerName: string, referralCode: string) => ({
    subject: `${referrerName} wants you to try Legacy Guardians! 🎮`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px;">
    
    <h1 style="text-align: center; color: #10b981;">🎮 You're Invited!</h1>
    
    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
      <strong>${referrerName}</strong> thinks you'd love Legacy Guardians - 
      a free game that teaches you how investing works through time-travel adventures!
    </p>
    
    <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
      <p style="margin: 0 0 10px; color: #94a3b8;">Use this code for bonus 🪙 iii:</p>
      <div style="font-size: 24px; font-weight: bold; color: #10b981; letter-spacing: 2px;">${referralCode}</div>
    </div>
    
    <div style="text-align: center;">
      <a href="https://legacyguardians.app?ref=${referralCode}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 12px; font-weight: bold;">
        Start Playing Free →
      </a>
    </div>
    
  </div>
</body>
</html>
    `
  })
};

// =============================================================================
// UNIFIED NEWSLETTER SERVICE
// Use this in your API routes
// =============================================================================

export const newsletterService = {
  /**
   * Subscribe to newsletter across all configured platforms
   */
  async subscribe(
    email: string, 
    options?: { 
      name?: string; 
      source?: string;
      sendWelcome?: boolean;
    }
  ): Promise<{ success: boolean; platforms: string[] }> {
    const platforms: string[] = [];
    
    // 1. Add to Beehiiv (if configured)
    if (beehiiv.isConfigured()) {
      const result = await beehiiv.addSubscriber({
        email,
        utm_source: options?.source || 'website',
        send_welcome_email: false, // We'll send our own
        custom_fields: options?.name ? [{ name: 'name', value: options.name }] : []
      });
      if (result.success) platforms.push('beehiiv');
    }
    
    // 2. Send welcome email via Resend (if configured)
    if (options?.sendWelcome !== false && resend.isConfigured()) {
      const template = emailTemplates.welcome(options?.name);
      await resend.send({
        to: email,
        subject: template.subject,
        html: template.html
      });
      platforms.push('resend-welcome');
    }
    
    return { 
      success: platforms.length > 0 || true, // Always succeed for Supabase fallback
      platforms 
    };
  },

  /**
   * Get combined stats from all platforms
   */
  async getStats(): Promise<{ 
    beehiiv?: number; 
    total: number;
  }> {
    let total = 0;
    const stats: { beehiiv?: number; total: number } = { total: 0 };
    
    if (beehiiv.isConfigured()) {
      const beehiivStats = await beehiiv.getStats();
      if (beehiivStats.subscribers) {
        stats.beehiiv = beehiivStats.subscribers;
        total += beehiivStats.subscribers;
      }
    }
    
    stats.total = total;
    return stats;
  }
};

export default newsletterService;




