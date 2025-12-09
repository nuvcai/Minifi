/**
 * Onboarding Completion API Endpoint
 * Stores user profile in Supabase and syncs with marketing systems
 * Also awards welcome bonus III tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { userProfilesService, rewardsService, isSupabaseConfigured } from '@/lib/supabase';
import { loopsHelpers } from '@/lib/loops';
import { MARKETING_EVENTS } from '@/components/data/marketingData';

// Welcome bonus III tokens
const WELCOME_BONUS_III = 100;

interface OnboardingPayload {
  // Core profile
  ageRange: "12-14" | "15-16" | "17-18" | "19-24" | "25+";
  country: string;
  
  // Financial background
  hasPartTimeJob: boolean;
  hasSavingsGoal: boolean;
  familyDiscussesFinances: boolean;
  
  // Risk profile
  riskPersonality: string;
  riskScore: number;
  riskAnswers?: number[];
  
  // Learning preferences
  learningStyle: string;
  preferredSessionLength: string;
  
  // Coach
  selectedCoach: string;
  
  // Consent
  termsAccepted: boolean;
  marketingConsent: boolean;
  
  // Metadata
  completedAt: string;
  source: string;
  sessionId?: string;  // For anonymous tracking
  
  // UTM tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ref?: string;
  
  // Optional email (if collected)
  email?: string;
  firstName?: string;
  adventureName?: string;  // Player's adventure name
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: OnboardingPayload = await request.json();
    
    // Validate required fields
    if (!body.ageRange || !body.termsAccepted) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ==========================================================================
    // 1. SAVE TO SUPABASE (Primary storage)
    // ==========================================================================
    const profileResult = await userProfilesService.saveOnboarding({
      email: body.email,
      display_name: body.firstName,
      session_id: body.sessionId,
      age_range: body.ageRange,
      country: body.country || 'AU',
      has_part_time_job: body.hasPartTimeJob,
      has_savings_goal: body.hasSavingsGoal,
      family_discusses_finances: body.familyDiscussesFinances,
      risk_personality: body.riskPersonality as 'guardian' | 'builder' | 'explorer' | 'pioneer',
      risk_score: body.riskScore,
      risk_answers: body.riskAnswers,
      learning_style: body.learningStyle as 'visual' | 'auditory' | 'reading' | 'kinesthetic',
      preferred_session_length: body.preferredSessionLength as 'short' | 'medium' | 'long',
      selected_coach: body.selectedCoach,
      terms_accepted: body.termsAccepted,
      marketing_consent: body.marketingConsent,
      source: body.source,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      referral_code: body.ref
    });

    if (!profileResult.success) {
      console.error('❌ Failed to save profile to Supabase:', profileResult.error);
      // Continue anyway - don't block user experience
    } else {
      console.log('✅ Profile saved to Supabase', { 
        email: body.email || 'anonymous',
        supabaseConfigured: isSupabaseConfigured()
      });
    }

    // ==========================================================================
    // 2. SYNC TO LOOPS.SO (Email marketing)
    // ==========================================================================
    if (body.email && body.marketingConsent) {
      try {
        await loopsHelpers.onAppSignup(body.email, {
          firstName: body.firstName,
          coach: body.selectedCoach
        });
        
        // Update with profile data
        const { loops } = await import('@/lib/loops');
        await loops.updateContact(body.email, {
          ageRange: body.ageRange,
          country: body.country,
          riskPersonality: body.riskPersonality,
          riskScore: body.riskScore,
          learningStyle: body.learningStyle,
          preferredSessionLength: body.preferredSessionLength,
          hasPartTimeJob: body.hasPartTimeJob,
          hasSavingsGoal: body.hasSavingsGoal,
          userGroup: 'onboarded_users'
        });
        
        console.log('✅ Synced to Loops.so');
      } catch (loopsError) {
        console.warn('⚠️ Loops sync failed:', loopsError);
      }
    }

    // ==========================================================================
    // 3. ANALYTICS LOGGING
    // ==========================================================================
    console.log('📋 Onboarding completed:', {
      event: MARKETING_EVENTS.ONBOARDING_COMPLETED,
      ageRange: body.ageRange,
      riskPersonality: body.riskPersonality,
      learningStyle: body.learningStyle,
      selectedCoach: body.selectedCoach,
      marketingConsent: body.marketingConsent,
      source: body.source,
      utm_source: body.utm_source,
      savedToSupabase: profileResult.success
    });

    // Generate user segment
    const userSegment = determineUserSegment(body);

    // ==========================================================================
    // 4. AWARD WELCOME BONUS III TOKENS
    // ==========================================================================
    let welcomeBonusAwarded = false;
    if (body.sessionId) {
      try {
        const rewardsResult = await rewardsService.addIII({
          sessionId: body.sessionId,
          email: body.email,
          amount: WELCOME_BONUS_III,
          transactionType: 'welcome_bonus',
          description: 'Welcome bonus for completing onboarding!',
        });
        welcomeBonusAwarded = rewardsResult.success;
        
        // Update adventure name if provided
        if (body.adventureName) {
          await rewardsService.syncFromLocalStorage(body.sessionId, {
            email: body.email,
            adventureName: body.adventureName,
            totalIII: WELCOME_BONUS_III,
            weeklyIII: WELCOME_BONUS_III,
            stakedIII: 0,
            earnedBadgeIds: [],
            progress: {},
          });
        }
        
        console.log('✅ Welcome bonus III awarded:', WELCOME_BONUS_III);
      } catch (rewardsError) {
        console.warn('⚠️ Welcome bonus award failed:', rewardsError);
      }
    }

    // ==========================================================================
    // 5. WHATSAPP NOTIFICATION (Admin Alert)
    // ==========================================================================
    try {
      const { whatsappNotify } = await import('@/lib/marketing-stack');
      await whatsappNotify.send(
        whatsappNotify.templates.newOnboarding({
          ageRange: body.ageRange,
          riskPersonality: body.riskPersonality,
          riskScore: body.riskScore,
          selectedCoach: body.selectedCoach,
          learningStyle: body.learningStyle,
          source: body.utm_source || body.source || 'direct'
        })
      );
    } catch (notifyError) {
      console.warn('WhatsApp notification failed:', notifyError);
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully!',
      data: {
        userSegment,
        riskPersonality: body.riskPersonality,
        selectedCoach: body.selectedCoach,
        profileId: profileResult.data?.id,
        welcomeBonus: welcomeBonusAwarded ? WELCOME_BONUS_III : 0,
        adventureName: body.adventureName,
      }
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// Determine user segment based on profile
function determineUserSegment(data: OnboardingPayload): string {
  // Age-based segments
  const ageSegments: Record<string, string> = {
    '12-14': 'teens_early',
    '15-16': 'teens_mid',
    '17-18': 'teens_late',
    '19-24': 'young_adult',
    '25+': 'adult'
  };
  
  // Risk-based modifier
  const riskModifier = data.riskScore >= 70 ? 'high_risk' : 
                       data.riskScore >= 40 ? 'moderate_risk' : 
                       'conservative';
  
  return `${ageSegments[data.ageRange] || 'unknown'}_${riskModifier}`;
}


