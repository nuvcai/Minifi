/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏆 REWARDS API - Badges + III Tokens Management                           ║
 * ║   Dual rewards system like KEEP app                                         ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-load Supabase client to avoid build-time errors
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured - rewards API will return mock data');
    return null;
  }
  
  _supabase = createClient(supabaseUrl, supabaseServiceKey);
  return _supabase;
}

// =============================================================================
// GET - Fetch player rewards data
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const email = searchParams.get("email");

    if (!sessionId && !email) {
      return NextResponse.json(
        { error: "sessionId or email required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    
    // Return mock data if Supabase not configured
    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: {
          rewards: null,
          badges: [],
          recentTransactions: [],
          summary: {
            totalIII: 0,
            weeklyIII: 0,
            stakedIII: 0,
            totalBadges: 0,
            badgesByCategory: {},
            badgesByTier: {},
          },
        },
      });
    }

    // Fetch player rewards
    let rewardsQuery = supabase.from("player_rewards").select("*");
    if (sessionId) rewardsQuery = rewardsQuery.eq("session_id", sessionId);
    if (email) rewardsQuery = rewardsQuery.eq("email", email);
    
    const { data: rewards, error: rewardsError } = await rewardsQuery.single();

    // Fetch earned badges
    let badgesQuery = supabase.from("earned_badges").select("*");
    if (sessionId) badgesQuery = badgesQuery.eq("session_id", sessionId);
    if (email) badgesQuery = badgesQuery.eq("email", email);
    badgesQuery = badgesQuery.order("earned_at", { ascending: false });
    
    const { data: badges } = await badgesQuery;

    // Fetch recent transactions
    let transQuery = supabase.from("iii_transactions").select("*");
    if (sessionId) transQuery = transQuery.eq("session_id", sessionId);
    if (email) transQuery = transQuery.eq("email", email);
    transQuery = transQuery.order("created_at", { ascending: false }).limit(20);
    
    const { data: transactions } = await transQuery;

    if (rewardsError && rewardsError.code !== "PGRST116") {
      console.error("Error fetching rewards:", rewardsError);
      return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        rewards: rewards || null,
        badges: badges || [],
        recentTransactions: transactions || [],
        summary: {
          totalIII: rewards?.total_iii || 0,
          weeklyIII: rewards?.weekly_iii || 0,
          stakedIII: rewards?.staked_iii || 0,
          totalBadges: badges?.length || 0,
          badgesByCategory: groupBadgesByCategory(badges || []),
          badgesByTier: groupBadgesByTier(badges || []),
        },
      },
    });
  } catch (error) {
    console.error("Rewards GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// POST - Award badge and/or III tokens
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, email, data } = body;

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    switch (action) {
      case "award_badge":
        return await awardBadge(sessionId, email, data);
      case "add_iii":
        return await addIII(sessionId, email, data);
      case "record_reflection":
        return await recordReflection(sessionId, email, data);
      case "update_progress":
        return await updateProgress(sessionId, email, data);
      case "sync_rewards":
        return await syncRewards(sessionId, email, data);
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Rewards POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function getOrCreatePlayerRewards(sessionId: string, email?: string) {
  const supabase = getSupabase();
  
  // Return mock data if Supabase not configured
  if (!supabase) {
    return {
      id: 'mock',
      session_id: sessionId,
      email: email || null,
      total_iii: 0,
      weekly_iii: 0,
      staked_iii: 0,
      lifetime_iii: 0,
      total_badges_earned: 0,
    };
  }
  
  // Try to find existing record
  let query = supabase.from("player_rewards").select("*");
  if (sessionId) query = query.eq("session_id", sessionId);
  
  const { data: existing } = await query.single();
  
  if (existing) return existing;

  // Create new record
  const { data: newRecord, error } = await supabase
    .from("player_rewards")
    .insert({
      session_id: sessionId,
      email: email || null,
      total_iii: 0,
      weekly_iii: 0,
      staked_iii: 0,
      lifetime_iii: 0,
      total_badges_earned: 0,
      week_start_date: getWeekStartDate(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating player_rewards:", error);
    throw error;
  }

  return newRecord;
}

async function awardBadge(sessionId: string, email: string | null, data: {
  badgeId: string;
  badgeName: string;
  badgeEmoji?: string;
  badgeCategory: string;
  badgeTier: string;
  iiiReward: number;
  wisdomUnlocked?: string;
  foWisdom?: string;
}) {
  const supabase = getSupabase();
  
  // Return mock success if Supabase not configured
  if (!supabase) {
    return NextResponse.json({
      success: true,
      badge: {
        id: data.badgeId,
        name: data.badgeName,
        emoji: data.badgeEmoji,
        category: data.badgeCategory,
        tier: data.badgeTier,
      },
      iiiAwarded: data.iiiReward,
      newBalance: data.iiiReward,
      message: `🏆 Badge earned: ${data.badgeName} (+${data.iiiReward} III)`,
    });
  }
  
  // Check if badge already earned
  const { data: existingBadge } = await supabase
    .from("earned_badges")
    .select("id")
    .eq("session_id", sessionId)
    .eq("badge_id", data.badgeId)
    .single();

  if (existingBadge) {
    return NextResponse.json({
      success: false,
      message: "Badge already earned",
      alreadyEarned: true,
    });
  }

  // Award the badge
  const { error: badgeError } = await supabase
    .from("earned_badges")
    .insert({
      session_id: sessionId,
      email,
      badge_id: data.badgeId,
      badge_name: data.badgeName,
      badge_emoji: data.badgeEmoji,
      badge_category: data.badgeCategory,
      badge_tier: data.badgeTier,
      iii_awarded: data.iiiReward,
      wisdom_unlocked: data.wisdomUnlocked,
      fo_wisdom: data.foWisdom,
    });

  if (badgeError) {
    console.error("Error awarding badge:", badgeError);
    return NextResponse.json({ error: "Failed to award badge" }, { status: 500 });
  }

  // Update player rewards with III tokens
  const playerRewards = await getOrCreatePlayerRewards(sessionId, email || undefined);
  const newTotal = (playerRewards.total_iii || 0) + data.iiiReward;
  const newWeekly = (playerRewards.weekly_iii || 0) + data.iiiReward;
  const newLifetime = (playerRewards.lifetime_iii || 0) + data.iiiReward;
  const newBadgeCount = (playerRewards.total_badges_earned || 0) + 1;

  await supabase
    .from("player_rewards")
    .update({
      total_iii: newTotal,
      weekly_iii: newWeekly,
      lifetime_iii: newLifetime,
      total_badges_earned: newBadgeCount,
    })
    .eq("id", playerRewards.id);

  // Log transaction
  await supabase.from("iii_transactions").insert({
    session_id: sessionId,
    email,
    transaction_type: "badge_earned",
    amount: data.iiiReward,
    balance_after: newTotal,
    reference_type: "badge",
    reference_id: data.badgeId,
    description: `Earned "${data.badgeName}" badge`,
  });

  return NextResponse.json({
    success: true,
    badge: {
      id: data.badgeId,
      name: data.badgeName,
      emoji: data.badgeEmoji,
      category: data.badgeCategory,
      tier: data.badgeTier,
    },
    iiiAwarded: data.iiiReward,
    newBalance: newTotal,
    message: `🏆 Badge earned: ${data.badgeName} (+${data.iiiReward} III)`,
  });
}

async function addIII(sessionId: string, email: string | null, data: {
  amount: number;
  transactionType: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
}) {
  const supabase = getSupabase();
  const playerRewards = await getOrCreatePlayerRewards(sessionId, email || undefined);
  const newTotal = (playerRewards.total_iii || 0) + data.amount;
  const newWeekly = (playerRewards.weekly_iii || 0) + (data.amount > 0 ? data.amount : 0);
  const newLifetime = (playerRewards.lifetime_iii || 0) + (data.amount > 0 ? data.amount : 0);

  if (supabase) {
    await supabase
      .from("player_rewards")
      .update({
        total_iii: Math.max(0, newTotal),
        weekly_iii: newWeekly,
        lifetime_iii: newLifetime,
      })
      .eq("id", playerRewards.id);

    // Log transaction
    await supabase.from("iii_transactions").insert({
      session_id: sessionId,
      email,
      transaction_type: data.transactionType,
      amount: data.amount,
      balance_after: newTotal,
      reference_type: data.referenceType,
      reference_id: data.referenceId,
      description: data.description,
    });
  }

  return NextResponse.json({
    success: true,
    amount: data.amount,
    newBalance: newTotal,
    message: data.amount > 0 
      ? `+${data.amount} III earned!` 
      : `${data.amount} III spent`,
  });
}

async function recordReflection(sessionId: string, email: string | null, data: {
  missionId?: string;
  crisisType?: string;
  lossPercentage?: number;
  assetClass?: string;
  selectedLessons?: string[];
  customReflection?: string;
  reflectionQuality: 'quick' | 'detailed' | 'thoughtful';
}) {
  const supabase = getSupabase();
  
  // Calculate III reward based on reflection quality
  const qualityRewards = {
    quick: 20,
    detailed: 35,
    thoughtful: 50,
  };
  const iiiReward = qualityRewards[data.reflectionQuality] || 20;

  // Update progress
  const playerRewards = await getOrCreatePlayerRewards(sessionId, email || undefined);
  const newReflections = (playerRewards.reflections_completed || 0) + 1;
  const newTotal = (playerRewards.total_iii || 0) + iiiReward;

  if (supabase) {
    // Insert reflection
    const { error: reflectionError } = await supabase
      .from("crisis_reflections")
      .insert({
        session_id: sessionId,
        email,
        mission_id: data.missionId,
        crisis_type: data.crisisType,
        loss_percentage: data.lossPercentage,
        asset_class: data.assetClass,
        selected_lessons: data.selectedLessons || [],
        custom_reflection: data.customReflection,
        reflection_quality: data.reflectionQuality,
        iii_awarded: iiiReward,
      });

    if (reflectionError) {
      console.error("Error recording reflection:", reflectionError);
      return NextResponse.json({ error: "Failed to record reflection" }, { status: 500 });
    }

    await supabase
      .from("player_rewards")
      .update({
        reflections_completed: newReflections,
        total_iii: newTotal,
        weekly_iii: (playerRewards.weekly_iii || 0) + iiiReward,
        lifetime_iii: (playerRewards.lifetime_iii || 0) + iiiReward,
      })
      .eq("id", playerRewards.id);

    // Log transaction
    await supabase.from("iii_transactions").insert({
      session_id: sessionId,
      email,
      transaction_type: "reflection_bonus",
      amount: iiiReward,
      balance_after: newTotal,
      reference_type: "reflection",
      reference_id: data.missionId,
      description: `Completed ${data.reflectionQuality} reflection`,
    });
  }

  return NextResponse.json({
    success: true,
    iiiAwarded: iiiReward,
    newBalance: newTotal,
    reflectionsCompleted: newReflections,
    message: `📚 Wisdom gained! +${iiiReward} III for ${data.reflectionQuality} reflection`,
  });
}

async function updateProgress(sessionId: string, email: string | null, data: {
  field: string;
  value: number | string | string[];
  increment?: boolean;
}) {
  const supabase = getSupabase();
  const playerRewards = await getOrCreatePlayerRewards(sessionId, email || undefined);
  
  let updateData: Record<string, unknown> = {};
  
  if (data.increment && typeof data.value === 'number') {
    updateData[data.field] = (playerRewards[data.field] || 0) + data.value;
  } else if (Array.isArray(data.value)) {
    // For array fields like asset_classes_tried
    const existing = playerRewards[data.field] || [];
    updateData[data.field] = [...new Set([...existing, ...data.value])];
  } else {
    updateData[data.field] = data.value;
  }

  if (supabase) {
    const { error } = await supabase
      .from("player_rewards")
      .update(updateData)
      .eq("id", playerRewards.id);

    if (error) {
      console.error("Error updating progress:", error);
      return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    field: data.field,
    newValue: updateData[data.field],
  });
}

async function syncRewards(sessionId: string, email: string | null, data: {
  totalIII: number;
  weeklyIII: number;
  stakedIII: number;
  earnedBadgeIds: string[];
  progress: {
    investmentsMade?: number;
    highRiskInvestments?: number;
    extremeRiskInvestments?: number;
    lossesExperienced?: number;
    investmentsAfterLoss?: number;
    crisesNavigated?: number;
    missionsCompleted?: number;
    reflectionsCompleted?: number;
    assetClassesTried?: string[];
    riskLevelsTried?: string[];
    coachesUsed?: string[];
  };
  adventureName?: string;
}) {
  const supabase = getSupabase();
  const playerRewards = await getOrCreatePlayerRewards(sessionId, email || undefined);

  // Check if week has changed
  const currentWeekStart = getWeekStartDate();
  const shouldResetWeekly = playerRewards.week_start_date !== currentWeekStart;

  const updateData: Record<string, unknown> = {
    total_iii: data.totalIII,
    weekly_iii: shouldResetWeekly ? 0 : data.weeklyIII,
    staked_iii: data.stakedIII,
    lifetime_iii: Math.max(playerRewards.lifetime_iii || 0, data.totalIII),
    total_badges_earned: data.earnedBadgeIds.length,
    investments_made: data.progress.investmentsMade ?? playerRewards.investments_made,
    high_risk_investments: data.progress.highRiskInvestments ?? playerRewards.high_risk_investments,
    extreme_risk_investments: data.progress.extremeRiskInvestments ?? playerRewards.extreme_risk_investments,
    losses_experienced: data.progress.lossesExperienced ?? playerRewards.losses_experienced,
    investments_after_loss: data.progress.investmentsAfterLoss ?? playerRewards.investments_after_loss,
    crises_navigated: data.progress.crisesNavigated ?? playerRewards.crises_navigated,
    missions_completed: data.progress.missionsCompleted ?? playerRewards.missions_completed,
    reflections_completed: data.progress.reflectionsCompleted ?? playerRewards.reflections_completed,
    asset_classes_tried: data.progress.assetClassesTried ?? playerRewards.asset_classes_tried,
    risk_levels_tried: data.progress.riskLevelsTried ?? playerRewards.risk_levels_tried,
    coaches_used: data.progress.coachesUsed ?? playerRewards.coaches_used,
    week_start_date: currentWeekStart,
  };

  if (data.adventureName) {
    updateData.adventure_name = data.adventureName;
  }
  if (email) {
    updateData.email = email;
  }

  if (supabase) {
    const { error } = await supabase
      .from("player_rewards")
      .update(updateData)
      .eq("id", playerRewards.id);

    if (error) {
      console.error("Error syncing rewards:", error);
      return NextResponse.json({ error: "Failed to sync rewards" }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    synced: true,
    weekReset: shouldResetWeekly,
  });
}

function groupBadgesByCategory(badges: Array<{ badge_category: string }>) {
  const result: Record<string, number> = {};
  badges.forEach(b => {
    result[b.badge_category] = (result[b.badge_category] || 0) + 1;
  });
  return result;
}

function groupBadgesByTier(badges: Array<{ badge_tier: string }>) {
  const result: Record<string, number> = {};
  badges.forEach(b => {
    result[b.badge_tier] = (result[b.badge_tier] || 0) + 1;
  });
  return result;
}

function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

