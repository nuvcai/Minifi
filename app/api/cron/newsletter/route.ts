/**
 * Automated Newsletter Cron Job
 * 
 * Runs automatically via Vercel Cron
 * Schedule: Every Tuesday at 10am UTC
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/newsletter",
 *     "schedule": "0 10 * * 2"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateNewsletter, 
  renderNewsletterHTML 
} from '@/lib/newsletter-generator';
import { leadsService } from '@/lib/supabase';

// Verify the request is from Vercel Cron
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  
  // In production, verify the cron secret
  if (process.env.NODE_ENV === 'production' && CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  console.log('📧 Running automated newsletter cron job...');

  try {
    // 1. Generate this week's newsletter
    const edition = await generateNewsletter('weeklyDigest', {
      useAI: !!process.env.OPENAI_API_KEY // Use AI if configured
    });

    const html = renderNewsletterHTML(edition);

    // 2. Get all active subscribers
    const subscribers = await leadsService.getAll({ 
      status: 'subscribed', 
      limit: 10000 
    });

    if (subscribers.length === 0) {
      console.log('No subscribers to send to');
      return NextResponse.json({
        success: true,
        message: 'No subscribers to send to',
        skipped: true
      });
    }

    console.log(`Sending to ${subscribers.length} subscribers...`);

    // 3. Send the newsletter
    let sent = 0;
    const errors: string[] = [];

    // Send via Resend (batch sending)
    if (process.env.RESEND_API_KEY) {
      const emails = subscribers.map(s => s.email);
      const batchSize = 100;
      
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        
        try {
          const response = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(batch.map(email => ({
              from: process.env.EMAIL_FROM || 'Mini.Fi <news@nuvc.ai>',
              to: email,
              subject: edition.title,
              html
            })))
          });

          if (response.ok) {
            sent += batch.length;
          } else {
            const error = await response.json();
            errors.push(`Batch ${i / batchSize}: ${error.message}`);
          }
        } catch (e) {
          errors.push(`Batch ${i / batchSize}: ${e}`);
        }

        // Rate limiting pause between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping send');
      return NextResponse.json({
        success: true,
        message: 'Newsletter generated but RESEND_API_KEY not configured',
        edition: {
          title: edition.title,
          sections: edition.sections.length
        }
      });
    }

    // 4. Log to Discord
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📧 Weekly Newsletter Sent!',
            description: `Auto-generated and sent via cron job`,
            color: errors.length > 0 ? 0xf59e0b : 0x10b981,
            fields: [
              { name: 'Title', value: edition.title, inline: false },
              { name: 'Sent', value: `${sent}/${subscribers.length}`, inline: true },
              { name: 'Errors', value: errors.length.toString(), inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    }

    console.log(`✅ Newsletter sent to ${sent} subscribers`);

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sent} subscribers`,
      stats: {
        total: subscribers.length,
        sent,
        errors: errors.length
      },
      edition: {
        title: edition.title,
        sections: edition.sections.length
      }
    });

  } catch (error) {
    console.error('Cron newsletter error:', error);
    
    // Alert on Discord
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '❌ Newsletter Cron Failed!',
            description: `Error: ${error}`,
            color: 0xef4444,
            timestamp: new Date().toISOString()
          }]
        })
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send newsletter',
      error: String(error)
    }, { status: 500 });
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest): Promise<NextResponse> {
  return GET(request);
}



