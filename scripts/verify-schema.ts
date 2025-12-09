#!/usr/bin/env npx ts-node
/**
 * Database Schema Verification Script
 * Run: npx ts-node scripts/verify-schema.ts
 * 
 * This script checks if all required tables and columns exist in Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('⚠️  Supabase not configured. Set environment variables first.');
  console.log('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.log('\n📋 To apply the schema manually:');
  console.log('   1. Go to your Supabase Dashboard');
  console.log('   2. Navigate to SQL Editor');
  console.log('   3. Copy the contents of supabase/schema.sql');
  console.log('   4. Paste and run the SQL');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Expected tables and their key columns
const EXPECTED_SCHEMA = {
  leads: ['id', 'email', 'first_name', 'source', 'status', 'subscribed_at', 'metadata', 'created_at', 'updated_at'],
  feedback: ['id', 'type', 'message', 'rating', 'page_context', 'user_agent', 'email', 'status', 'created_at'],
  user_activity: ['id', 'session_id', 'event_type', 'event_data', 'page_path', 'user_agent', 'created_at'],
  sponsors: ['id', 'email', 'name', 'tier', 'github_username', 'status', 'started_at', 'expires_at', 'benefits_claimed', 'metadata', 'created_at', 'updated_at'],
  user_profiles: [
    'id', 'email', 'display_name', 'session_id', 'age_range', 'country',
    'has_part_time_job', 'has_savings_goal', 'family_discusses_finances',
    'risk_personality', 'risk_score', 'risk_answers',
    'learning_style', 'preferred_session_length', 'selected_coach',
    'terms_accepted', 'terms_accepted_at', 'marketing_consent', 'marketing_consent_at',
    'total_xp', 'player_level', 'completed_missions', 'daily_streak',
    'source', 'utm_source', 'utm_medium', 'utm_campaign', 'referral_code',
    'onboarding_completed_at', 'last_active_at', 'created_at', 'updated_at'
  ],
  daily_streaks: ['id', 'user_id', 'email', 'session_id', 'current_streak', 'longest_streak', 'total_claims', 'total_xp_from_streaks', 'last_bonus_earned', 'last_claim_date', 'streak_started_at', 'created_at', 'updated_at'],
  streak_claims: ['id', 'streak_id', 'email', 'session_id', 'claim_date', 'streak_day', 'xp_earned', 'bonus_earned', 'claimed_at'],
  waitlist: ['id', 'email', 'feature', 'priority', 'notified', 'created_at']
};

async function verifySchema() {
  console.log('🔍 Verifying Supabase Schema...\n');
  
  let allGood = true;
  const issues: string[] = [];

  for (const [table, columns] of Object.entries(EXPECTED_SCHEMA)) {
    process.stdout.write(`   Checking ${table}... `);
    
    try {
      // Try to query the table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.log('❌ Table does not exist');
          issues.push(`Table '${table}' is missing. Run the schema.sql to create it.`);
          allGood = false;
        } else {
          console.log(`⚠️  ${error.message}`);
          issues.push(`Table '${table}': ${error.message}`);
        }
        continue;
      }

      // Check if we got data structure
      if (data && data.length > 0) {
        const existingColumns = Object.keys(data[0]);
        const missingColumns = columns.filter(col => !existingColumns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log(`⚠️  Missing columns: ${missingColumns.join(', ')}`);
          issues.push(`Table '${table}' missing columns: ${missingColumns.join(', ')}`);
          allGood = false;
        } else {
          console.log('✅');
        }
      } else {
        // Empty table, can't verify columns but table exists
        console.log('✅ (empty)');
      }

    } catch (err) {
      console.log(`❌ ${err}`);
      allGood = false;
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (allGood) {
    console.log('✅ All tables and columns verified successfully!');
  } else {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('\n📋 To fix, run the schema.sql in your Supabase SQL Editor:');
    console.log('   supabase/schema.sql');
  }
}

// Run verification
verifySchema().catch(console.error);



