/**
 * Daily Streak API
 * Handles streak claiming, progress saving, and user sign up for streak persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured, userProfilesService } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// GET - Get streak data for a user (by email or session)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const sessionId = searchParams.get('sessionId');

    if (!email && !sessionId) {
      // Return default streak data for new users
      return NextResponse.json({
        success: true,
        data: {
          currentStreak: 0,
          todayClaimed: false,
          totalXP: 0,
          lastClaimDate: null,
          playerLevel: 1,
        }
      });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          currentStreak: 1,
          todayClaimed: true,
          totalXP: 25,
          lastClaimDate: new Date().toISOString(),
          playerLevel: 1,
        }
      });
    }

    let profile = null;
    
    if (email) {
      profile = await userProfilesService.getByEmail(email);
    } else if (sessionId) {
      profile = await userProfilesService.getBySession(sessionId);
    }

    if (!profile) {
      return NextResponse.json({
        success: true,
        data: {
          currentStreak: 0,
          todayClaimed: false,
          totalXP: 0,
          lastClaimDate: null,
          playerLevel: 1,
        }
      });
    }

    // Check if today has been claimed
    // Must have: last_active_at is today AND daily_streak > 0 (to confirm it was a streak claim)
    const lastActive = profile.last_active_at ? new Date(profile.last_active_at) : null;
    const today = new Date();
    const todayClaimed = lastActive && 
      lastActive.toDateString() === today.toDateString() &&
      (profile.daily_streak || 0) > 0;

    return NextResponse.json({
      success: true,
      data: {
        currentStreak: profile.daily_streak || 0,
        todayClaimed,
        totalXP: profile.total_xp || 0,
        lastClaimDate: profile.last_active_at,
        playerLevel: profile.player_level || 1,
        email: profile.email,
      }
    });

  } catch (error) {
    logger.error('Get streak error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get streak data' },
      { status: 500 }
    );
  }
}

// POST - Claim daily streak or save progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, sessionId, streakData } = body;

    if (action === 'claim') {
      return await handleClaimStreak(email, sessionId);
    } else if (action === 'signup') {
      return await handleSignUp(email, streakData);
    } else if (action === 'sync') {
      return await handleSyncProgress(email, sessionId, streakData);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Streak action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process streak action' },
      { status: 500 }
    );
  }
}

// Handle claiming daily streak
async function handleClaimStreak(email?: string, sessionId?: string) {
  // Require either email or sessionId to persist streak claims
  if (!email && !sessionId) {
    return NextResponse.json(
      { success: false, error: 'Email or session ID required to claim streak' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      data: {
        currentStreak: 1,
        xpEarned: 10,
        totalXP: 35,
        bonusEarned: false,
      }
    });
  }

  try {
    let profile = null;
    const identifier: { email?: string; sessionId?: string } = {};

    if (email) {
      profile = await userProfilesService.getByEmail(email);
      identifier.email = email;
    } else if (sessionId) {
      profile = await userProfilesService.getBySession(sessionId);
      identifier.sessionId = sessionId;
    }

    const today = new Date();
    const todayDateStr = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateStr = yesterday.toDateString();

    let currentStreak = 1;
    let bonusEarned = false;
    let xpEarned = 10; // Base XP for daily claim

    if (profile) {
      // Use last_active_at to track streak claims
      // This is the timestamp of the last streak-related activity
      const lastActive = profile.last_active_at ? new Date(profile.last_active_at) : null;
      const lastActiveDate = lastActive ? lastActive.toDateString() : null;
      
      // Check if already claimed today based on last_active_at AND current streak > 0
      // We also check if daily_streak > 0 to ensure this was an actual streak claim
      if (lastActiveDate === todayDateStr && (profile.daily_streak || 0) > 0) {
        return NextResponse.json({
          success: true,
          data: {
            currentStreak: profile.daily_streak || 1,
            xpEarned: 0,
            totalXP: profile.total_xp || 0,
            bonusEarned: false,
            alreadyClaimed: true,
          }
        });
      }

      // Check if streak continues (last active was yesterday)
      if (lastActiveDate === yesterdayDateStr) {
        currentStreak = (profile.daily_streak || 0) + 1;
      } else if (lastActiveDate === todayDateStr) {
        // Same day but streak was 0 (first claim after reset)
        currentStreak = 1;
      } else {
        // Streak broken (more than 1 day gap), start fresh
        currentStreak = 1;
      }

      // Check for streak milestones
      if (currentStreak === 7) {
        xpEarned += 50; // 7-day bonus
        bonusEarned = true;
      } else if (currentStreak === 30) {
        xpEarned += 200; // 30-day bonus
        bonusEarned = true;
      } else if (currentStreak % 7 === 0 && currentStreak > 7) {
        xpEarned += 25; // Weekly bonus after first week
        bonusEarned = true;
      }

      const totalXP = (profile.total_xp || 0) + xpEarned;

      // Update existing profile
      await userProfilesService.updateProgress(identifier, {
        daily_streak: currentStreak,
        total_xp: totalXP,
      });

      return NextResponse.json({
        success: true,
        data: {
          currentStreak,
          xpEarned,
          totalXP,
          bonusEarned,
          alreadyClaimed: false,
        }
      });
    }

    // No profile exists - create one for this user
    const totalXP = xpEarned; // First claim, no existing XP
    
    const createResult = await userProfilesService.saveOnboarding({
      email: identifier.email,
      session_id: identifier.sessionId,
      daily_streak: currentStreak,
      total_xp: totalXP,
      source: 'streak_claim',
      terms_accepted: false, // Will need to accept later
    });

    if (!createResult.success) {
      logger.error('Failed to create profile for streak claim:', createResult.error);
      // Return success anyway with calculated data - frontend will use localStorage
      return NextResponse.json({
        success: true,
        data: {
          currentStreak,
          xpEarned,
          totalXP,
          bonusEarned,
          alreadyClaimed: false,
          profileCreated: false,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        currentStreak,
        xpEarned,
        totalXP,
        bonusEarned,
        alreadyClaimed: false,
        profileCreated: true,
      }
    });

  } catch (error) {
    logger.error('Claim streak error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim streak' },
      { status: 500 }
    );
  }
}

// Handle user sign up to save streak
async function handleSignUp(email: string, streakData: {
  currentStreak?: number;
  totalXP?: number;
  sessionId?: string;
}) {
  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email is required' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      message: 'Progress saved (demo mode)',
      data: { email, ...streakData }
    });
  }

  try {
    // Check if user already exists
    const existing = await userProfilesService.getByEmail(email);

    if (existing) {
      // Merge streak data - keep the higher values
      const mergedStreak = Math.max(existing.daily_streak || 0, streakData.currentStreak || 0);
      const mergedXP = Math.max(existing.total_xp || 0, streakData.totalXP || 0);

      await userProfilesService.updateProgress({ email }, {
        daily_streak: mergedStreak,
        total_xp: mergedXP,
      });

      return NextResponse.json({
        success: true,
        message: 'Progress merged with existing account',
        data: {
          email,
          currentStreak: mergedStreak,
          totalXP: mergedXP,
          isExisting: true,
        }
      });
    }

    // Create new profile
    const result = await userProfilesService.saveOnboarding({
      email,
      session_id: streakData.sessionId,
      daily_streak: streakData.currentStreak || 1,
      total_xp: streakData.totalXP || 25,
      source: 'homepage_streak',
      terms_accepted: true,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
      data: {
        email,
        currentStreak: streakData.currentStreak || 1,
        totalXP: streakData.totalXP || 25,
        isExisting: false,
      }
    });

  } catch (error) {
    logger.error('Sign up error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sign up' },
      { status: 500 }
    );
  }
}

// Handle syncing progress from localStorage
async function handleSyncProgress(email?: string, sessionId?: string, streakData?: {
  currentStreak?: number;
  totalXP?: number;
  playerLevel?: number;
  completedMissions?: string[];
}) {
  if (!email && !sessionId) {
    return NextResponse.json(
      { success: false, error: 'Email or session ID required' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: 'Synced (demo mode)' });
  }

  try {
    // Check if profile exists
    let profile = null;
    if (email) {
      profile = await userProfilesService.getByEmail(email);
    } else if (sessionId) {
      profile = await userProfilesService.getBySession(sessionId);
    }

    if (profile) {
      // Update existing profile
      const identifier = email ? { email } : { sessionId: sessionId! };
      await userProfilesService.updateProgress(identifier, {
        daily_streak: streakData?.currentStreak,
        total_xp: streakData?.totalXP,
        player_level: streakData?.playerLevel,
        completed_missions: streakData?.completedMissions,
      });

      return NextResponse.json({
        success: true,
        message: 'Progress synced successfully',
      });
    }

    // No profile exists - create one
    const createResult = await userProfilesService.saveOnboarding({
      email: email,
      session_id: sessionId,
      daily_streak: streakData?.currentStreak || 0,
      total_xp: streakData?.totalXP || 0,
      player_level: streakData?.playerLevel || 1,
      completed_missions: streakData?.completedMissions || [],
      source: 'progress_sync',
      terms_accepted: false,
    });

    if (!createResult.success) {
      logger.error('Failed to create profile for sync:', createResult.error);
      return NextResponse.json({
        success: true, // Return success - frontend will use localStorage
        message: 'Progress saved locally (profile creation pending)',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile created and progress synced',
      profileCreated: true,
    });

  } catch (error) {
    logger.error('Sync progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync progress' },
      { status: 500 }
    );
  }
}

