/**
 * 📰 Automated Newsletter Generator
 * 
 * Auto-generates newsletter content from existing app data
 * Founder just needs to review & hit send (or fully automate)
 * 
 * Sources:
 * - Wealth Wisdom (daily quotes, pillars)
 * - Investor Spotlights
 * - App metrics (missions completed, popular features)
 * - New feature announcements
 * - AI-generated market commentary
 */

import { 
  wealthPillars, 
  investorWisdom, 
  hopeMessages, 
  foPrinciples,
  wealthEras 
} from '@/components/data/wealthWisdom';

// =============================================================================
// NEWSLETTER CONTENT TYPES
// =============================================================================

export interface NewsletterEdition {
  id: string;
  title: string;
  preheader: string;
  date: Date;
  
  // Content sections
  sections: NewsletterSection[];
  
  // Metadata
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: Date;
  sentAt?: Date;
  
  // Performance
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
}

export interface NewsletterSection {
  type: 'hero' | 'wisdom' | 'investor' | 'tip' | 'feature' | 'cta' | 'metrics' | 'story';
  title?: string;
  content: string;
  emoji?: string;
  ctaText?: string;
  ctaUrl?: string;
  image?: string;
}

// =============================================================================
// CONTENT TEMPLATES (Mix & Match)
// =============================================================================

export const NEWSLETTER_TEMPLATES = {
  // Weekly digest template
  weeklyDigest: {
    name: "Weekly Digest",
    description: "Best of the week: wisdom + tip + CTA",
    sections: ['hero', 'wisdom', 'tip', 'feature', 'cta']
  },
  
  // Investor spotlight
  investorSpotlight: {
    name: "Investor Spotlight",
    description: "Deep dive on one legendary investor",
    sections: ['hero', 'investor', 'story', 'cta']
  },
  
  // Quick tip
  quickTip: {
    name: "Quick Tip",
    description: "Short, actionable advice",
    sections: ['hero', 'tip', 'cta']
  },
  
  // Feature announcement
  featureAnnouncement: {
    name: "New Feature",
    description: "Announce new app features",
    sections: ['hero', 'feature', 'cta']
  },
  
  // Market moment
  marketMoment: {
    name: "Market Moment",
    description: "Current events + historical parallel",
    sections: ['hero', 'story', 'wisdom', 'cta']
  }
};

// =============================================================================
// AUTO-CONTENT GENERATORS
// =============================================================================

/**
 * Get rotating content based on day/week
 */
function getRotatingIndex(items: unknown[], offsetDays: number = 0): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  ) + offsetDays;
  return dayOfYear % items.length;
}

/**
 * Generate wisdom section from existing data
 */
export function generateWisdomSection(): NewsletterSection {
  const pillarIndex = getRotatingIndex(wealthPillars);
  const pillar = wealthPillars[pillarIndex];
  
  return {
    type: 'wisdom',
    title: `${pillar.emoji} Wealth Pillar: ${pillar.name}`,
    emoji: pillar.emoji,
    content: `
<strong>${pillar.principle}</strong>

${pillar.forTeens}

<em>💼 FO Insight:</em> ${pillar.foWisdom}
    `.trim()
  };
}

/**
 * Generate investor spotlight from existing data
 */
export function generateInvestorSection(): NewsletterSection {
  const investorIndex = getRotatingIndex(investorWisdom);
  const investor = investorWisdom[investorIndex];
  
  return {
    type: 'investor',
    title: `🏆 Investor Spotlight: ${investor.investor}`,
    content: `
<blockquote>"${investor.quote}"</blockquote>

<strong>The Lesson:</strong> ${investor.lesson}

<strong>For You:</strong> ${investor.forTeens}

<em>Era: ${investor.era}</em>
    `.trim()
  };
}

/**
 * Generate hope/motivation section
 */
export function generateHopeSection(): NewsletterSection {
  const hopeIndex = getRotatingIndex(hopeMessages);
  const hope = hopeMessages[hopeIndex];
  
  return {
    type: 'story',
    title: `✨ ${hope.title}`,
    emoji: '✨',
    content: `
${hope.message}

<strong>Evidence:</strong> ${hope.evidence}

<strong>Your Action:</strong> ${hope.callToAction}
    `.trim()
  };
}

/**
 * Generate FO principle tip
 */
export function generatePrincipleSection(): NewsletterSection {
  const principleIndex = getRotatingIndex(foPrinciples);
  const principle = foPrinciples[principleIndex];
  
  return {
    type: 'tip',
    title: `💡 FO Principle #${principle.number}`,
    emoji: '💡',
    content: `
<strong>${principle.principle}</strong>

${principle.explanation}

<strong>How Family Offices Apply It:</strong>
${principle.howFamilyOfficesApplyIt}

<strong>How YOU Can Apply It:</strong>
${principle.howTeensCanApplyIt}
    `.trim()
  };
}

/**
 * Generate wealth era section
 */
export function generateEraSection(): NewsletterSection {
  const eraIndex = getRotatingIndex(wealthEras);
  const era = wealthEras[eraIndex];
  
  return {
    type: 'story',
    title: `${era.emoji} ${era.era}: ${era.transformativeTrend}`,
    emoji: era.emoji,
    content: `
<strong>What Changed:</strong> ${era.whatChanged}

<strong>How People Got Rich:</strong> ${era.howPeopleGotRich}

<strong>Key Investments:</strong> ${era.keyInvestments.join(', ')}

<strong>Wealth Creators:</strong> ${era.wealthCreators.join(', ')}

<strong>Lesson for Today:</strong> ${era.forTeens}
    `.trim()
  };
}

// =============================================================================
// AI CONTENT ENHANCEMENT (Optional - for variety)
// =============================================================================

interface AIContentOptions {
  topic?: string;
  tone?: 'casual' | 'professional' | 'inspiring';
  length?: 'short' | 'medium' | 'long';
  audience?: 'teens' | 'parents' | 'teachers';
}

/**
 * Generate content using AI (OpenAI/Claude)
 * Falls back to template content if not configured
 */
export async function generateAIContent(
  type: 'intro' | 'tip' | 'story' | 'closing',
  options: AIContentOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Return template content if no API key
    return getTemplateContent(type, options);
  }

  const prompts: Record<string, string> = {
    intro: `Write a warm, engaging newsletter intro for Legacy Guardians (a financial literacy app for teens). 
Topic: ${options.topic || 'general financial wisdom'}
Tone: ${options.tone || 'casual'} and encouraging
Length: 2-3 sentences
Audience: Teenagers 13-18 years old
Include an emoji or two.`,

    tip: `Write a quick, actionable financial tip for teenagers.
Topic: ${options.topic || 'saving or investing basics'}
Make it practical and relatable to teen life.
Length: 3-4 sentences
End with an encouraging note.`,

    story: `Write a brief story or analogy about ${options.topic || 'compound interest'} that a teenager would find interesting.
Use relatable examples (gaming, social media, sports, etc.)
Length: 4-5 sentences
Make it memorable and shareable.`,

    closing: `Write a brief, motivating newsletter sign-off for a financial literacy app for teens.
Encourage them to take action (play a mission, share with friends, etc.)
Length: 2-3 sentences
Warm and personal tone.`
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly financial educator writing for teenagers. Your tone is casual, encouraging, and emoji-friendly. You make complex topics simple and relatable.'
          },
          {
            role: 'user',
            content: prompts[type]
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('AI API failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getTemplateContent(type, options);
    
  } catch (error) {
    console.warn('AI generation failed, using template:', error);
    return getTemplateContent(type, options);
  }
}

/**
 * Fallback template content when AI not available
 */
function getTemplateContent(type: string, _options: AIContentOptions): string {
  const templates: Record<string, string[]> = {
    intro: [
      "Hey there, future investor! 👋 Ready for this week's dose of financial wisdom?",
      "What's up! 🚀 Got some money moves to share with you this week.",
      "Hey Legend! 💰 Time to level up your money game!",
      "Welcome back! 🎮 Ready to unlock more financial superpowers?"
    ],
    tip: [
      "💡 Quick tip: Every time you get money (allowance, birthday cash, job), automatically put 10% aside before spending. Future you will thank present you!",
      "💡 Pro move: Before buying something, wait 24 hours. If you still want it tomorrow, it might be worth it. Most impulse buys? You'll forget about them!",
      "💡 Money hack: Think in hours, not dollars. If something costs $50 and you earn $10/hour, ask yourself: Is this worth 5 hours of my life?"
    ],
    story: [
      "Imagine you plant a money tree 🌱 Every year, it grows 10% taller. In 7 years, it's doubled. In 14 years, quadrupled. That's compound interest - and it's why starting NOW matters more than starting big!",
      "Think of investing like gaming 🎮 You wouldn't start a new game on the hardest difficulty. You learn the basics, level up, then tackle bigger challenges. Same with money - start simple, grow your skills!"
    ],
    closing: [
      "That's all for this week! Now go play a mission and put this knowledge into practice 🎮 See you next time!",
      "Until next time - keep stacking knowledge AND wealth! 💪 Your future self is already proud.",
      "Go crush it this week! And hey, if this was useful, share it with a friend who needs to hear it 🚀"
    ]
  };

  const options = templates[type] || templates.intro;
  return options[Math.floor(Math.random() * options.length)];
}

// =============================================================================
// FULL NEWSLETTER GENERATOR
// =============================================================================

export type NewsletterType = keyof typeof NEWSLETTER_TEMPLATES;

/**
 * Generate a complete newsletter edition
 */
export async function generateNewsletter(
  type: NewsletterType = 'weeklyDigest',
  options: {
    customTitle?: string;
    customIntro?: string;
    featureAnnouncement?: { title: string; description: string; url: string };
    useAI?: boolean;
  } = {}
): Promise<NewsletterEdition> {
  const template = NEWSLETTER_TEMPLATES[type];
  const sections: NewsletterSection[] = [];
  
  const editionNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)); // Week number
  
  // Generate each section based on template
  for (const sectionType of template.sections) {
    switch (sectionType) {
      case 'hero':
        sections.push({
          type: 'hero',
          title: options.customTitle || `Legacy Guardians Weekly #${editionNumber}`,
          content: options.customIntro || (options.useAI 
            ? await generateAIContent('intro', { tone: 'casual' })
            : getTemplateContent('intro', {})
          ),
          emoji: '📰'
        });
        break;
        
      case 'wisdom':
        sections.push(generateWisdomSection());
        break;
        
      case 'investor':
        sections.push(generateInvestorSection());
        break;
        
      case 'tip':
        sections.push(options.useAI
          ? { ...generatePrincipleSection(), content: await generateAIContent('tip') }
          : generatePrincipleSection()
        );
        break;
        
      case 'feature':
        if (options.featureAnnouncement) {
          sections.push({
            type: 'feature',
            title: `🆕 ${options.featureAnnouncement.title}`,
            content: options.featureAnnouncement.description,
            ctaText: 'Try It Now →',
            ctaUrl: options.featureAnnouncement.url,
            emoji: '🆕'
          });
        } else {
          // Default feature promo
          sections.push({
            type: 'feature',
            title: '🎮 This Week\'s Challenge',
            content: 'Ready to test your skills? Jump into a new mission and see how your portfolio performs through history!',
            ctaText: 'Start Playing →',
            ctaUrl: 'https://legacyguardians.app/timeline',
            emoji: '🎮'
          });
        }
        break;
        
      case 'story':
        sections.push(generateHopeSection());
        break;
        
      case 'cta':
        sections.push({
          type: 'cta',
          title: 'Keep Learning!',
          content: options.useAI 
            ? await generateAIContent('closing')
            : getTemplateContent('closing', {}),
          ctaText: 'Play a Mission →',
          ctaUrl: 'https://legacyguardians.app/timeline',
          emoji: '🚀'
        });
        break;
    }
  }

  return {
    id: `newsletter-${Date.now()}`,
    title: sections.find(s => s.type === 'hero')?.title || 'Legacy Guardians Newsletter',
    preheader: 'Your weekly dose of financial wisdom 💰',
    date: new Date(),
    sections,
    status: 'draft'
  };
}

// =============================================================================
// HTML EMAIL RENDERER
// =============================================================================

/**
 * Render newsletter to HTML email
 */
export function renderNewsletterHTML(edition: NewsletterEdition): string {
  const sectionHTML = edition.sections.map(section => {
    switch (section.type) {
      case 'hero':
        return `
          <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${section.emoji || '📰'} ${section.title}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0; font-size: 16px; line-height: 1.5;">${section.content}</p>
          </div>
        `;
        
      case 'wisdom':
      case 'tip':
      case 'investor':
        return `
          <div style="padding: 25px 30px; border-bottom: 1px solid #334155;">
            <h2 style="color: #10b981; margin: 0 0 15px; font-size: 20px;">${section.title}</h2>
            <div style="color: #cbd5e1; font-size: 15px; line-height: 1.7;">
              ${section.content.replace(/\n/g, '<br>')}
            </div>
          </div>
        `;
        
      case 'story':
        return `
          <div style="padding: 25px 30px; background: #0f172a; border-radius: 8px; margin: 20px;">
            <h2 style="color: #f59e0b; margin: 0 0 15px; font-size: 20px;">${section.title}</h2>
            <div style="color: #cbd5e1; font-size: 15px; line-height: 1.7;">
              ${section.content.replace(/\n/g, '<br>')}
            </div>
          </div>
        `;
        
      case 'feature':
        return `
          <div style="padding: 25px 30px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border-radius: 8px; margin: 20px; text-align: center;">
            <h2 style="color: white; margin: 0 0 10px; font-size: 22px;">${section.title}</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px; font-size: 15px;">${section.content}</p>
            ${section.ctaUrl ? `
              <a href="${section.ctaUrl}" style="display: inline-block; background: white; color: #8b5cf6; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                ${section.ctaText || 'Learn More'}
              </a>
            ` : ''}
          </div>
        `;
        
      case 'cta':
        return `
          <div style="padding: 30px; text-align: center; background: #0f172a; border-radius: 0 0 12px 12px;">
            <p style="color: #cbd5e1; margin: 0 0 20px; font-size: 15px;">${section.content}</p>
            ${section.ctaUrl ? `
              <a href="${section.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                ${section.ctaText || 'Get Started'}
              </a>
            ` : ''}
          </div>
        `;
        
      default:
        return '';
    }
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${edition.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Email container -->
    <div style="background: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
      ${sectionHTML}
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px;">
      <p style="color: #64748b; font-size: 13px; margin: 0 0 10px;">
        Made with 💚 by <a href="https://nuvc.ai" style="color: #10b981;">NUVC.AI</a> for teens everywhere
      </p>
      <p style="color: #475569; font-size: 11px; margin: 0;">
        <a href="{{unsubscribe_url}}" style="color: #64748b;">Unsubscribe</a> | 
        <a href="https://legacyguardians.app" style="color: #64748b;">Visit Website</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
}

// =============================================================================
// SCHEDULER & AUTOMATION
// =============================================================================

/**
 * Get next scheduled send time (e.g., every Tuesday at 10am)
 */
export function getNextSendTime(dayOfWeek: number = 2, hour: number = 10): Date {
  const now = new Date();
  const next = new Date(now);
  
  // Set to the target day
  const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
  next.setDate(now.getDate() + (daysUntilTarget || 7)); // If today is the day, schedule next week
  
  // Set time
  next.setHours(hour, 0, 0, 0);
  
  // If the time has passed today and it's the target day, schedule next week
  if (next <= now) {
    next.setDate(next.getDate() + 7);
  }
  
  return next;
}

/**
 * Schedule options for automated newsletters
 */
export const SCHEDULE_OPTIONS = {
  weekly: { dayOfWeek: 2, hour: 10, label: 'Every Tuesday @ 10am' },
  biweekly: { interval: 14, hour: 10, label: 'Every other Tuesday @ 10am' },
  monthly: { dayOfMonth: 1, hour: 10, label: 'First of month @ 10am' }
};

// =============================================================================
// EXPORT HELPERS
// =============================================================================

export default {
  generateNewsletter,
  renderNewsletterHTML,
  generateWisdomSection,
  generateInvestorSection,
  generateHopeSection,
  generatePrincipleSection,
  generateEraSection,
  generateAIContent,
  getNextSendTime,
  NEWSLETTER_TEMPLATES,
  SCHEDULE_OPTIONS
};






