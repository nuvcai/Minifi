/**
 * 📱 Marketing Stack Integration
 * 
 * Your Stack:
 * - WhatsApp: Viral sharing & community
 * - Substack: Newsletter (free, unlimited)
 * - Medium: Content discovery & SEO
 * - Resend: Transactional emails (welcome, notifications)
 * 
 * This file provides helpers for all platforms.
 */

// =============================================================================
// WHATSAPP INTEGRATION
// =============================================================================

/**
 * Generate WhatsApp share links
 * No API needed - just URL schemes!
 */
export const whatsapp = {
  /**
   * Generate a share link for WhatsApp
   */
  shareLink(text: string, url?: string): string {
    const fullText = url ? `${text} ${url}` : text;
    return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  },

  /**
   * Generate a direct message link (to specific number)
   */
  directLink(phoneNumber: string, text: string): string {
    // Remove any non-numeric characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Pre-built share messages for different contexts
   */
  messages: {
    inviteFriend: (referralCode?: string) => {
      const base = "🎮 Check out Legacy Guardians - it's teaching me how investing works through time-travel games! Super fun and free.";
      const url = referralCode 
        ? `https://legacyguardians.app?ref=${referralCode}`
        : 'https://legacyguardians.app';
      return `${base}\n\n${url}`;
    },

    shareAchievement: (achievement: string, xp: number) => {
      return `🏆 Just unlocked "${achievement}" on Legacy Guardians! +${xp} XP\n\nLearning to invest has never been this fun 🎮\n\nhttps://legacyguardians.app`;
    },

    shareMissionResult: (mission: string, returnPct: number) => {
      const emoji = returnPct > 0 ? '📈' : '📉';
      return `${emoji} Just completed the ${mission} mission on Legacy Guardians!\n\nMy portfolio: ${returnPct > 0 ? '+' : ''}${returnPct.toFixed(1)}%\n\nCan you beat my score? 🎮\n\nhttps://legacyguardians.app`;
    },

    weeklyWisdom: (quote: string, author: string) => {
      return `💡 Investing wisdom from ${author}:\n\n"${quote}"\n\nLearn more free at Legacy Guardians 🎮\nhttps://legacyguardians.app`;
    },

    parentShare: () => {
      return `Hey! Found this free app that teaches kids about investing through games. My kid loves it! 🎮\n\nIt's called Legacy Guardians - no real money involved, just learning.\n\nhttps://legacyguardians.app`;
    }
  },

  /**
   * Generate click-to-chat link for support
   */
  supportLink(supportNumber: string): string {
    return this.directLink(supportNumber, "Hi! I have a question about Legacy Guardians...");
  }
};

// =============================================================================
// SUBSTACK INTEGRATION
// =============================================================================

/**
 * Substack doesn't have a public API, but we can:
 * 1. Generate content for copy-paste
 * 2. Use their embed widgets
 * 3. Track subscribers via webhooks (if using custom domain)
 */
export const substack = {
  /**
   * Your Substack publication URL
   */
  publicationUrl: process.env.SUBSTACK_URL || 'https://legacyguardians.substack.com',

  /**
   * Get subscribe URL
   */
  subscribeUrl(): string {
    return `${this.publicationUrl}/subscribe`;
  },

  /**
   * Get embed code for subscription form
   */
  embedCode(): string {
    return `<iframe src="${this.publicationUrl}/embed" width="480" height="320" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>`;
  },

  /**
   * Generate formatted content for Substack post
   * (Copy-paste into Substack editor)
   */
  formatPost(content: {
    title: string;
    subtitle?: string;
    sections: Array<{
      heading?: string;
      body: string;
      quote?: { text: string; author: string };
    }>;
    cta?: { text: string; url: string };
  }): string {
    let post = '';
    
    // Subtitle
    if (content.subtitle) {
      post += `*${content.subtitle}*\n\n`;
    }

    // Sections
    for (const section of content.sections) {
      if (section.heading) {
        post += `## ${section.heading}\n\n`;
      }
      
      post += `${section.body}\n\n`;
      
      if (section.quote) {
        post += `> "${section.quote.text}"\n> — ${section.quote.author}\n\n`;
      }
    }

    // CTA
    if (content.cta) {
      post += `---\n\n**[${content.cta.text}](${content.cta.url})**\n`;
    }

    return post;
  },

  /**
   * Format for Substack Notes (short-form)
   */
  formatNote(text: string, url?: string): string {
    const maxLength = 280;
    let note = text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    if (url) {
      note += `\n\n${url}`;
    }
    return note;
  }
};

// =============================================================================
// MEDIUM INTEGRATION
// =============================================================================

/**
 * Medium strategy: Cross-post for discovery, drive to owned channels
 */
export const medium = {
  /**
   * Your Medium publication URL
   */
  publicationUrl: process.env.MEDIUM_URL || 'https://medium.com/@legacyguardians',

  /**
   * Format content for Medium post
   * Includes strategic CTAs for newsletter signup
   */
  formatPost(content: {
    title: string;
    subtitle?: string;
    sections: Array<{
      heading?: string;
      body: string;
      image?: { url: string; caption: string };
    }>;
    tags?: string[];
  }): {
    markdown: string;
    recommendedTags: string[];
  } {
    let post = '';
    
    // Subtitle
    if (content.subtitle) {
      post += `## ${content.subtitle}\n\n`;
    }

    // Hook at start
    post += `*This article is part of our free financial literacy series for teens. [Subscribe to our newsletter](${substack.subscribeUrl()}) for weekly investing tips!*\n\n---\n\n`;

    // Sections
    for (const section of content.sections) {
      if (section.heading) {
        post += `## ${section.heading}\n\n`;
      }
      
      post += `${section.body}\n\n`;
      
      if (section.image) {
        post += `![${section.image.caption}](${section.image.url})\n*${section.image.caption}*\n\n`;
      }
    }

    // CTA at end
    post += `---\n\n`;
    post += `## Want to Learn More?\n\n`;
    post += `**[Legacy Guardians](https://legacyguardians.app)** is a free game that teaches teens about investing through time-travel adventures. No real money required!\n\n`;
    post += `📧 **[Subscribe to our newsletter](${substack.subscribeUrl()})** for weekly financial wisdom.\n\n`;
    post += `🎮 **[Play free now](https://legacyguardians.app)**\n`;

    // Recommended tags
    const recommendedTags = [
      'Financial Literacy',
      'Personal Finance',
      'Investing',
      'Education',
      'Teens',
      ...(content.tags || [])
    ].slice(0, 5);

    return { markdown: post, recommendedTags };
  },

  /**
   * Cross-posting strategy
   */
  crossPostStrategy: {
    // Post on Medium 1-2 days after Substack
    delayDays: 1,
    
    // Modify content slightly for SEO (no duplicate content penalty)
    modifications: [
      'Change title slightly',
      'Add Medium-specific intro paragraph',
      'Include more images',
      'Add strategic CTAs to Substack'
    ],

    // Best posting times for Medium
    bestTimes: {
      days: ['Tuesday', 'Wednesday', 'Thursday'],
      hours: [8, 11, 14] // Morning, late morning, early afternoon
    }
  }
};

// =============================================================================
// RESEND INTEGRATION (Transactional Only)
// =============================================================================

/**
 * Resend for transactional emails:
 * - Welcome emails
 * - Achievement notifications
 * - Re-engagement
 * - Password reset (if needed)
 * 
 * NOT for newsletters (use Substack for that)
 */
export const resend = {
  isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  },

  async send(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log('📧 [DEV] Would send email:', options.subject);
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
          from: options.from || process.env.EMAIL_FROM || 'Legacy Guardians <hello@legacyguardians.app>',
          to: options.to,
          subject: options.subject,
          html: options.html
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * Pre-built email templates
   */
  templates: {
    welcome: (name?: string) => ({
      subject: 'Welcome to Legacy Guardians! 🎮',
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">🎮 Welcome${name ? `, ${name}` : ''}!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; line-height: 1.6;">You've joined the adventure! Legacy Guardians will teach you how investing works through time-travel missions.</p>
      
      <h3 style="color: #10b981;">🚀 Quick Start:</h3>
      <ol style="color: #cbd5e1; line-height: 1.8;">
        <li><strong>Pick your AI coach</strong> - Conservative, Balanced, or Aggressive</li>
        <li><strong>Start Mission 1</strong> - Travel to Japan 1990</li>
        <li><strong>Make investment decisions</strong> - See what happens!</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://legacyguardians.app/timeline" style="background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-weight: bold;">
          Start Playing →
        </a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px;">
        📬 <strong>Weekly tips:</strong> <a href="${substack.subscribeUrl()}" style="color: #10b981;">Subscribe to our Substack</a> for investing wisdom!
      </p>
    </div>
  </div>
</body>
</html>
      `
    }),

    achievementUnlocked: (achievement: string, xp: number) => ({
      subject: `🏆 You unlocked: ${achievement}!`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 10px;">🏆</div>
      <h1 style="color: white; margin: 0;">Achievement Unlocked!</h1>
    </div>
    <div style="padding: 30px; text-align: center;">
      <h2 style="color: #f59e0b; font-size: 24px;">${achievement}</h2>
      <p style="color: #10b981; font-size: 20px; font-weight: bold;">+${xp} XP</p>
      
      <p style="color: #cbd5e1; margin: 20px 0;">Share your achievement!</p>
      
      <a href="${whatsapp.shareLink(whatsapp.messages.shareAchievement(achievement, xp))}" style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
        Share on WhatsApp 📱
      </a>
    </div>
  </div>
</body>
</html>
      `
    }),

    weeklyReminder: () => ({
      subject: "Your portfolio is waiting! 🎮",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 30px;">
    <h2 style="color: #10b981;">Hey there! 👋</h2>
    <p style="color: #cbd5e1; line-height: 1.6;">Haven't seen you in a while! Your virtual portfolio is waiting for you to make some moves.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://legacyguardians.app/timeline" style="background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-weight: bold;">
        Continue Playing →
      </a>
    </div>
    
    <p style="color: #64748b; font-size: 12px; text-align: center;">
      <a href="{{unsubscribe_url}}" style="color: #64748b;">Unsubscribe from reminders</a>
    </p>
  </div>
</body>
</html>
      `
    })
  }
};

// =============================================================================
// UNIFIED CONTENT DISTRIBUTION
// =============================================================================

/**
 * Multi-platform content distribution
 */
export const contentDistribution = {
  /**
   * Distribute content across all platforms
   */
  async distribute(content: {
    title: string;
    body: string;
    quote?: { text: string; author: string };
    cta: { text: string; url: string };
  }): Promise<{
    substackPost: string;
    mediumPost: { markdown: string; tags: string[] };
    whatsappShare: string;
    twitterThread?: string;
  }> {
    // Format for Substack
    const substackPost = substack.formatPost({
      title: content.title,
      sections: [
        { body: content.body, quote: content.quote }
      ],
      cta: content.cta
    });

    // Format for Medium
    const mediumResult = medium.formatPost({
      title: content.title,
      sections: [
        { body: content.body }
      ],
      tags: ['Investing', 'Financial Education']
    });

    // Format for WhatsApp
    const whatsappShare = whatsapp.shareLink(
      `${content.title}\n\n${content.body.substring(0, 100)}...`,
      content.cta.url
    );

    return {
      substackPost,
      mediumPost: {
        markdown: mediumResult.markdown,
        tags: mediumResult.recommendedTags
      },
      whatsappShare
    };
  },

  /**
   * Weekly content calendar
   */
  weeklyCalendar: {
    monday: 'Prepare content, schedule Substack',
    tuesday: 'Substack newsletter goes out (auto)',
    wednesday: 'Cross-post to Medium',
    thursday: 'Share on WhatsApp groups, social',
    friday: 'Engage with comments, prep next week',
    weekend: 'Rest or bonus content'
  }
};

// =============================================================================
// WHATSAPP NOTIFICATIONS (Admin Alerts)
// =============================================================================

/**
 * WhatsApp notification system for admin alerts
 * Uses Twilio WhatsApp API or generates click-to-send links
 */
export const whatsappNotify = {
  /**
   * Check if Twilio WhatsApp is configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM &&
      process.env.ADMIN_WHATSAPP_NUMBER
    );
  },

  /**
   * Send WhatsApp notification via Twilio
   */
  async send(message: string): Promise<{ success: boolean; error?: string }> {
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    
    if (!this.isConfigured()) {
      // Log for dev mode - generate click link instead
      const shareLink = whatsapp.directLink(adminNumber || '0', message);
      console.log('📱 [WhatsApp Alert]:', message);
      console.log('🔗 Manual send link:', shareLink);
      return { success: true };
    }

    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromNumber!.startsWith('whatsapp:') ? fromNumber! : `whatsapp:${fromNumber}`,
            To: adminNumber!.startsWith('whatsapp:') ? adminNumber! : `whatsapp:${adminNumber}`,
            Body: message,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('WhatsApp send failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Pre-built notification templates
   */
  templates: {
    newSubscriber: (email: string, source: string) => 
      `📧 *New Subscriber!*\n\n` +
      `Email: ${email}\n` +
      `Source: ${source}\n` +
      `Time: ${new Date().toLocaleString()}`,

    newOnboarding: (data: {
      ageRange: string;
      riskPersonality: string;
      riskScore: number;
      selectedCoach: string;
      learningStyle: string;
      source: string;
    }) =>
      `🎯 *New User Onboarded!*\n\n` +
      `Age: ${data.ageRange}\n` +
      `Personality: ${data.riskPersonality} (${data.riskScore}%)\n` +
      `Coach: ${data.selectedCoach}\n` +
      `Learning: ${data.learningStyle}\n` +
      `Source: ${data.source}\n` +
      `Time: ${new Date().toLocaleString()}`,

    newFeedback: (type: string, message: string, rating?: number) =>
      `💬 *New Feedback!*\n\n` +
      `Type: ${type}\n` +
      (rating ? `Rating: ${'⭐'.repeat(rating)}\n` : '') +
      `Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}\n` +
      `Time: ${new Date().toLocaleString()}`,

    newWaitlist: (email: string, feature: string) =>
      `📝 *Waitlist Signup!*\n\n` +
      `Email: ${email}\n` +
      `Feature: ${feature}\n` +
      `Time: ${new Date().toLocaleString()}`,

    newsletterSent: (title: string, recipientCount: number) =>
      `📰 *Newsletter Sent!*\n\n` +
      `Title: ${title}\n` +
      `Recipients: ${recipientCount}\n` +
      `Time: ${new Date().toLocaleString()}`,

    dailyStats: (stats: { subscribers: number; onboarded: number; feedback: number }) =>
      `📊 *Daily Stats*\n\n` +
      `Subscribers: ${stats.subscribers}\n` +
      `Onboarded: ${stats.onboarded}\n` +
      `Feedback: ${stats.feedback}\n` +
      `Date: ${new Date().toLocaleDateString()}`,
  }
};

// =============================================================================
// EXPORT
// =============================================================================

export default {
  whatsapp,
  whatsappNotify,
  substack,
  medium,
  resend,
  contentDistribution
};


