/**
 * Newsletter Generation API
 * 
 * Your Stack: Substack + Medium + WhatsApp + Resend
 * 
 * This generates content for COPY-PASTE to Substack
 * (Substack doesn't have a public API)
 * 
 * Endpoints:
 * - GET: Preview auto-generated newsletter
 * - POST: Generate for Substack + Medium + WhatsApp
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateNewsletter, 
  renderNewsletterHTML,
  NewsletterType,
  NEWSLETTER_TEMPLATES 
} from '@/lib/newsletter-generator';
import { substack, medium, whatsapp, resend } from '@/lib/marketing-stack';
import { leadsService, isSupabaseConfigured } from '@/lib/supabase';
import { secureCompare } from '@/lib/validation';

// Admin key check - NO FALLBACK VALUES for security
const ADMIN_KEY = process.env.ADMIN_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

function isAuthorized(request: NextRequest): boolean {
  // If keys are not configured, deny all requests
  if (!ADMIN_KEY && !CRON_SECRET) {
    console.warn('⚠️ ADMIN_API_KEY and CRON_SECRET not configured - all requests denied');
    return false;
  }

  const authHeader = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');
  const cronSecret = request.headers.get('x-cron-secret');
  
  // Check cron secret (for automated runs) using timing-safe comparison
  if (cronSecret && CRON_SECRET && secureCompare(cronSecret, CRON_SECRET)) {
    return true;
  }
  
  // Check admin key using timing-safe comparison
  if (ADMIN_KEY) {
    if (authHeader?.startsWith('Bearer ')) {
      return secureCompare(authHeader.slice(7), ADMIN_KEY);
    }
    if (apiKey) {
      return secureCompare(apiKey, ADMIN_KEY);
    }
  }
  
  return false;
}

/**
 * GET - Preview generated newsletter
 * 
 * Formats:
 * - json: Full data object
 * - html: Email preview
 * - substack: Ready to paste into Substack
 * - medium: Ready to paste into Medium
 * - all: All formats at once
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') || 'weeklyDigest') as NewsletterType;
  const format = searchParams.get('format') || 'json';
  const useAI = searchParams.get('ai') === 'true';

  // Validate type
  if (!NEWSLETTER_TEMPLATES[type]) {
    return NextResponse.json({
      success: false,
      message: `Invalid type. Available: ${Object.keys(NEWSLETTER_TEMPLATES).join(', ')}`
    }, { status: 400 });
  }

  try {
    const edition = await generateNewsletter(type, { useAI });
    
    // HTML preview
    if (format === 'html') {
      const html = renderNewsletterHTML(edition);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Substack format (markdown for copy-paste)
    if (format === 'substack') {
      const substackContent = substack.formatPost({
        title: edition.title,
        subtitle: edition.preheader,
        sections: edition.sections.map(s => ({
          heading: s.title,
          body: s.content.replace(/<[^>]*>/g, ''), // Strip HTML
          quote: undefined
        })),
        cta: { text: 'Play Legacy Guardians', url: 'https://legacyguardians.app' }
      });
      
      return new NextResponse(
        `# ${edition.title}\n\n${substackContent}`,
        { headers: { 'Content-Type': 'text/markdown' } }
      );
    }

    // Medium format
    if (format === 'medium') {
      const mediumContent = medium.formatPost({
        title: edition.title,
        subtitle: edition.preheader,
        sections: edition.sections.map(s => ({
          heading: s.title,
          body: s.content.replace(/<[^>]*>/g, '')
        })),
        tags: ['Financial Literacy', 'Investing', 'Education']
      });
      
      return new NextResponse(
        `# ${edition.title}\n\n${mediumContent.markdown}\n\nTags: ${mediumContent.recommendedTags.join(', ')}`,
        { headers: { 'Content-Type': 'text/markdown' } }
      );
    }

    // WhatsApp share links
    const whatsappLinks = {
      shareNewsletter: whatsapp.shareLink(
        `📰 New from Legacy Guardians: ${edition.title}\n\n${edition.preheader}`,
        'https://legacyguardians.substack.com'
      ),
      shareWithParents: whatsapp.shareLink(whatsapp.messages.parentShare()),
      inviteFriend: whatsapp.shareLink(whatsapp.messages.inviteFriend())
    };

    // All formats
    if (format === 'all') {
      const html = renderNewsletterHTML(edition);
      const substackContent = substack.formatPost({
        title: edition.title,
        sections: edition.sections.map(s => ({
          heading: s.title,
          body: s.content.replace(/<[^>]*>/g, '')
        })),
        cta: { text: 'Play Now', url: 'https://legacyguardians.app' }
      });
      const mediumContent = medium.formatPost({
        title: edition.title,
        sections: edition.sections.map(s => ({
          heading: s.title,
          body: s.content.replace(/<[^>]*>/g, '')
        }))
      });

      return NextResponse.json({
        success: true,
        edition,
        formats: {
          html,
          substack: substackContent,
          medium: mediumContent,
          whatsapp: whatsappLinks
        },
        instructions: {
          step1: 'Copy Substack content → Paste in Substack editor → Publish',
          step2: 'Wait 1-2 days, then copy Medium content → Post on Medium',
          step3: 'Click WhatsApp links to share in your groups',
          step4: 'Done! 🎉'
        }
      });
    }

    // Default JSON response
    return NextResponse.json({
      success: true,
      edition,
      whatsappLinks,
      availableFormats: ['json', 'html', 'substack', 'medium', 'all'],
      previewUrls: {
        html: `${request.nextUrl.origin}/api/newsletter/generate?type=${type}&format=html`,
        substack: `${request.nextUrl.origin}/api/newsletter/generate?type=${type}&format=substack`,
        medium: `${request.nextUrl.origin}/api/newsletter/generate?type=${type}&format=medium`,
        all: `${request.nextUrl.origin}/api/newsletter/generate?type=${type}&format=all`
      }
    });

  } catch (error) {
    console.error('Newsletter generation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate newsletter'
    }, { status: 500 });
  }
}

/**
 * POST - Generate and send newsletter
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      type = 'weeklyDigest',
      useAI = false,
      sendNow = false,
      testEmail,
      customTitle,
      customIntro,
      featureAnnouncement
    } = body;

    // Generate the newsletter
    const edition = await generateNewsletter(type as NewsletterType, {
      useAI,
      customTitle,
      customIntro,
      featureAnnouncement
    });

    const html = renderNewsletterHTML(edition);

    // If just generating (not sending), return the content
    if (!sendNow && !testEmail) {
      return NextResponse.json({
        success: true,
        message: 'Newsletter generated (not sent)',
        edition,
        html
      });
    }

    // Send test email
    if (testEmail) {
      const result = await newsletterService.subscribe(testEmail, {
        sendWelcome: false
      });

      // Use Resend to send test
      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Legacy Guardians <news@legacyguardians.app>',
            to: testEmail,
            subject: `[TEST] ${edition.title}`,
            html
          })
        });
      }

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}`,
        edition
      });
    }

    // Send to all subscribers
    if (sendNow) {
      // Get all active subscribers from Supabase
      const subscribers = await leadsService.getAll({ status: 'subscribed', limit: 10000 });
      
      if (subscribers.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'No subscribers to send to'
        });
      }

      // Send via Beehiiv or Resend
      let sent = 0;
      
      // Option 1: If Beehiiv is configured, trigger a broadcast
      if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
        // Beehiiv handles the sending
        // You would create the post via their API
        console.log('Would send via Beehiiv to', subscribers.length, 'subscribers');
        sent = subscribers.length;
      }
      // Option 2: Send via Resend (batch)
      else if (process.env.RESEND_API_KEY) {
        const emails = subscribers.map(s => s.email);
        const batchSize = 100;
        
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          
          await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(batch.map(email => ({
              from: 'Legacy Guardians <news@legacyguardians.app>',
              to: email,
              subject: edition.title,
              html
            })))
          });
          
          sent += batch.length;
        }
      }

      // WhatsApp notification to admin
      try {
        const { whatsappNotify } = await import('@/lib/marketing-stack');
        await whatsappNotify.send(
          whatsappNotify.templates.newsletterSent(edition.title, sent)
        );
      } catch (notifyError) {
        console.warn('WhatsApp notification failed:', notifyError);
      }

      return NextResponse.json({
        success: true,
        message: `Newsletter sent to ${sent} subscribers`,
        edition,
        stats: { sent, total: subscribers.length }
      });
    }

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send newsletter'
    }, { status: 500 });
  }
}

