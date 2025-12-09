-- =============================================================================
-- Legacy Guardians - Supabase Database Schema
-- Lead Capture, Feedback, and Activity Tracking
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- LEADS TABLE - Newsletter subscribers and potential users
-- =============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON leads;
CREATE POLICY "Service role full access" ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- FEEDBACK TABLE - User feedback and feature requests
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('love', 'idea', 'issue', 'general')),
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  page_context TEXT,
  user_agent TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'actioned', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON feedback;
CREATE POLICY "Service role full access" ON feedback
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert feedback
DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- USER_ACTIVITY TABLE - Analytics and event tracking
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_activity
CREATE INDEX IF NOT EXISTS idx_activity_session ON user_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_event_type ON user_activity(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON user_activity(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON user_activity;
CREATE POLICY "Service role full access" ON user_activity
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert activity
DROP POLICY IF EXISTS "Anyone can track activity" ON user_activity;
CREATE POLICY "Anyone can track activity" ON user_activity
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- SPONSORS TABLE - Track sponsors and their benefits
-- =============================================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('supporter', 'champion', 'guardian')),
  github_username TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  benefits_claimed JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sponsors
CREATE INDEX IF NOT EXISTS idx_sponsors_email ON sponsors(email);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);

-- Enable Row Level Security
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON sponsors;
CREATE POLICY "Service role full access" ON sponsors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- USER_PROFILES TABLE - Onboarding data and personalization
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Identity (optional email - can be anonymous)
  email TEXT UNIQUE,
  display_name TEXT,
  session_id TEXT,  -- For anonymous users
  
  -- Demographics
  age_range TEXT CHECK (age_range IN ('12-14', '15-16', '17-18')),
  country TEXT DEFAULT 'AU',
  
  -- Financial Background
  has_part_time_job BOOLEAN DEFAULT FALSE,
  has_savings_goal BOOLEAN DEFAULT FALSE,
  family_discusses_finances BOOLEAN DEFAULT FALSE,
  
  -- Risk Profile
  risk_personality TEXT CHECK (risk_personality IN ('guardian', 'builder', 'explorer', 'pioneer')),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_answers JSONB DEFAULT '[]',
  
  -- Learning Preferences
  learning_style TEXT CHECK (learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),
  preferred_session_length TEXT CHECK (preferred_session_length IN ('short', 'medium', 'long')),
  
  -- Coach Selection
  selected_coach TEXT,
  
  -- Consent
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT FALSE,
  marketing_consent_at TIMESTAMPTZ,
  
  -- Game Progress (synced from localStorage periodically)
  total_xp INTEGER DEFAULT 0,
  player_level INTEGER DEFAULT 1,
  completed_missions JSONB DEFAULT '[]',
  daily_streak INTEGER DEFAULT 0,
  
  -- Attribution
  source TEXT DEFAULT 'app',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referral_code TEXT,
  
  -- Metadata
  onboarding_completed_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_session ON user_profiles(session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_risk ON user_profiles(risk_personality);
CREATE INDEX IF NOT EXISTS idx_profiles_coach ON user_profiles(selected_coach);
CREATE INDEX IF NOT EXISTS idx_profiles_created ON user_profiles(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON user_profiles;
CREATE POLICY "Service role full access" ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert their own profile
DROP POLICY IF EXISTS "Anyone can create profile" ON user_profiles;
CREATE POLICY "Anyone can create profile" ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- DAILY_STREAKS TABLE - Track streak history and claims
-- =============================================================================

CREATE TABLE IF NOT EXISTS daily_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Streak data
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_claims INTEGER DEFAULT 0,
  
  -- XP tracking
  total_xp_from_streaks INTEGER DEFAULT 0,
  last_bonus_earned INTEGER DEFAULT 0,
  
  -- Timestamps
  last_claim_date DATE,
  streak_started_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for daily_streaks
CREATE INDEX IF NOT EXISTS idx_streaks_user ON daily_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_email ON daily_streaks(email);
CREATE INDEX IF NOT EXISTS idx_streaks_session ON daily_streaks(session_id);
CREATE INDEX IF NOT EXISTS idx_streaks_last_claim ON daily_streaks(last_claim_date DESC);

-- Enable Row Level Security
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON daily_streaks;
CREATE POLICY "Service role full access" ON daily_streaks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert/update their own streaks
DROP POLICY IF EXISTS "Anyone can manage their streak" ON daily_streaks;
CREATE POLICY "Anyone can manage their streak" ON daily_streaks
  FOR ALL
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- STREAK_CLAIMS TABLE - Individual claim history
-- =============================================================================

CREATE TABLE IF NOT EXISTS streak_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  streak_id UUID REFERENCES daily_streaks(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Claim details
  claim_date DATE NOT NULL,
  streak_day INTEGER NOT NULL, -- Day number in current streak
  xp_earned INTEGER DEFAULT 10,
  bonus_earned INTEGER DEFAULT 0, -- Extra XP from milestones
  
  -- Metadata
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for streak_claims
CREATE INDEX IF NOT EXISTS idx_claims_streak ON streak_claims(streak_id);
CREATE INDEX IF NOT EXISTS idx_claims_date ON streak_claims(claim_date DESC);
CREATE INDEX IF NOT EXISTS idx_claims_email ON streak_claims(email);

-- Enable Row Level Security
ALTER TABLE streak_claims ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON streak_claims;
CREATE POLICY "Service role full access" ON streak_claims
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert claims
DROP POLICY IF EXISTS "Anyone can claim streak" ON streak_claims;
CREATE POLICY "Anyone can claim streak" ON streak_claims
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- WAITLIST TABLE - Feature-specific waitlists
-- =============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  feature TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, feature)
);

-- Indexes for waitlist
CREATE INDEX IF NOT EXISTS idx_waitlist_feature ON waitlist(feature);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON waitlist;
CREATE POLICY "Service role full access" ON waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can join waitlist
DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- TRADING_SESSIONS TABLE - Competition/Trading session data
-- =============================================================================

CREATE TABLE IF NOT EXISTS trading_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Session details
  competition_type TEXT DEFAULT 'standard',
  coach_id TEXT,
  starting_capital DECIMAL(15, 2) DEFAULT 5000.00,
  
  -- Final results
  final_value DECIMAL(15, 2),
  total_return DECIMAL(10, 4),
  sharpe_ratio DECIMAL(10, 4),
  volatility DECIMAL(10, 4),
  max_drawdown DECIMAL(10, 4),
  annualized_return DECIMAL(10, 4),
  
  -- Portfolio snapshot
  final_portfolio JSONB DEFAULT '{}',
  final_cash DECIMAL(15, 2),
  
  -- Chart data
  chart_data JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for trading_sessions
CREATE INDEX IF NOT EXISTS idx_trading_user ON trading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_email ON trading_sessions(email);
CREATE INDEX IF NOT EXISTS idx_trading_session ON trading_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_trading_status ON trading_sessions(status);
CREATE INDEX IF NOT EXISTS idx_trading_created ON trading_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON trading_sessions;
CREATE POLICY "Service role full access" ON trading_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can manage their sessions
DROP POLICY IF EXISTS "Anyone can manage their sessions" ON trading_sessions;
CREATE POLICY "Anyone can manage their sessions" ON trading_sessions
  FOR ALL
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- TRADING_TRANSACTIONS TABLE - Individual trades within a session
-- =============================================================================

CREATE TABLE IF NOT EXISTS trading_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES trading_sessions(id) ON DELETE CASCADE,
  
  -- Trade details
  asset TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell')),
  shares DECIMAL(15, 8) NOT NULL,
  price DECIMAL(15, 4) NOT NULL,
  total_value DECIMAL(15, 2) NOT NULL,
  
  -- Asset metadata
  asset_class TEXT,
  
  -- Portfolio state after trade
  portfolio_value_after DECIMAL(15, 2),
  cash_after DECIMAL(15, 2),
  
  -- Timestamps
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for trading_transactions
CREATE INDEX IF NOT EXISTS idx_transactions_session ON trading_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_asset ON trading_transactions(asset);
CREATE INDEX IF NOT EXISTS idx_transactions_executed ON trading_transactions(executed_at DESC);

-- Enable Row Level Security
ALTER TABLE trading_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON trading_transactions;
CREATE POLICY "Service role full access" ON trading_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert transactions
DROP POLICY IF EXISTS "Anyone can log transactions" ON trading_transactions;
CREATE POLICY "Anyone can log transactions" ON trading_transactions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- PORTFOLIO_SNAPSHOTS TABLE - Periodic portfolio value snapshots
-- =============================================================================

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES trading_sessions(id) ON DELETE CASCADE,
  
  -- Snapshot data
  total_value DECIMAL(15, 2) NOT NULL,
  cash_value DECIMAL(15, 2),
  holdings JSONB DEFAULT '{}',
  
  -- Market data at snapshot time
  prices JSONB DEFAULT '{}',
  
  -- Timestamps
  snapshot_time TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for portfolio_snapshots
CREATE INDEX IF NOT EXISTS idx_snapshots_session ON portfolio_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_time ON portfolio_snapshots(snapshot_time DESC);

-- Enable Row Level Security
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON portfolio_snapshots;
CREATE POLICY "Service role full access" ON portfolio_snapshots
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert snapshots
DROP POLICY IF EXISTS "Anyone can save snapshots" ON portfolio_snapshots;
CREATE POLICY "Anyone can save snapshots" ON portfolio_snapshots
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- PLAYER_REWARDS TABLE - III Token balance and progression
-- =============================================================================

CREATE TABLE IF NOT EXISTS player_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  adventure_name TEXT,
  
  -- III Token Balance
  total_iii INTEGER DEFAULT 0,
  weekly_iii INTEGER DEFAULT 0,
  staked_iii INTEGER DEFAULT 0,
  lifetime_iii INTEGER DEFAULT 0,
  
  -- Badge Stats
  total_badges_earned INTEGER DEFAULT 0,
  
  -- Progress Tracking
  investments_made INTEGER DEFAULT 0,
  high_risk_investments INTEGER DEFAULT 0,
  extreme_risk_investments INTEGER DEFAULT 0,
  losses_experienced INTEGER DEFAULT 0,
  investments_after_loss INTEGER DEFAULT 0,
  consecutive_losses INTEGER DEFAULT 0,
  profit_after_consecutive_losses INTEGER DEFAULT 0,
  crises_navigated INTEGER DEFAULT 0,
  bubbles_survived INTEGER DEFAULT 0,
  drawdowns_held INTEGER DEFAULT 0,
  reflections_completed INTEGER DEFAULT 0,
  rational_decisions INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  perfect_quizzes INTEGER DEFAULT 0,
  theses_written INTEGER DEFAULT 0,
  risk_previews_viewed INTEGER DEFAULT 0,
  coach_advice_viewed INTEGER DEFAULT 0,
  
  -- Exploration (stored as arrays for Sets)
  asset_classes_tried TEXT[] DEFAULT '{}',
  risk_levels_tried TEXT[] DEFAULT '{}',
  coaches_used TEXT[] DEFAULT '{}',
  
  -- Timestamps
  week_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for player_rewards
CREATE INDEX IF NOT EXISTS idx_rewards_user ON player_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_email ON player_rewards(email);
CREATE INDEX IF NOT EXISTS idx_rewards_session ON player_rewards(session_id);
CREATE INDEX IF NOT EXISTS idx_rewards_total_iii ON player_rewards(total_iii DESC);

-- Enable Row Level Security
ALTER TABLE player_rewards ENABLE ROW LEVEL SECURITY;

-- Policies for player_rewards
DROP POLICY IF EXISTS "Service role full access" ON player_rewards;
CREATE POLICY "Service role full access" ON player_rewards
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their rewards" ON player_rewards;
CREATE POLICY "Users can manage their rewards" ON player_rewards
  FOR ALL
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- EARNED_BADGES TABLE - Track which badges each player has earned
-- =============================================================================

CREATE TABLE IF NOT EXISTS earned_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Badge info
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_emoji TEXT,
  badge_category TEXT NOT NULL CHECK (badge_category IN (
    'crisis_wisdom', 'effort', 'streak', 'mastery', 'exploration', 'resilience', 'generational'
  )),
  badge_tier TEXT NOT NULL CHECK (badge_tier IN (
    'bronze', 'silver', 'gold', 'platinum', 'diamond'
  )),
  
  -- Reward given
  iii_awarded INTEGER DEFAULT 0,
  
  -- Wisdom unlocked (if any)
  wisdom_unlocked TEXT,
  fo_wisdom TEXT,
  
  -- Timestamps
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one badge per user
  UNIQUE(session_id, badge_id)
);

-- Indexes for earned_badges
CREATE INDEX IF NOT EXISTS idx_badges_user ON earned_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_session ON earned_badges(session_id);
CREATE INDEX IF NOT EXISTS idx_badges_badge_id ON earned_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_badges_category ON earned_badges(badge_category);
CREATE INDEX IF NOT EXISTS idx_badges_tier ON earned_badges(badge_tier);
CREATE INDEX IF NOT EXISTS idx_badges_earned_at ON earned_badges(earned_at DESC);

-- Enable Row Level Security
ALTER TABLE earned_badges ENABLE ROW LEVEL SECURITY;

-- Policies for earned_badges
DROP POLICY IF EXISTS "Service role full access" ON earned_badges;
CREATE POLICY "Service role full access" ON earned_badges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can earn badges" ON earned_badges;
CREATE POLICY "Users can earn badges" ON earned_badges
  FOR ALL
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- III_TRANSACTIONS TABLE - Log all III token transactions
-- =============================================================================

CREATE TABLE IF NOT EXISTS iii_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'badge_earned', 'mission_complete', 'streak_bonus', 'reflection_bonus',
    'courage_bonus', 'exploration_bonus', 'staking_reward', 'welcome_bonus',
    'stake', 'unstake', 'spend', 'refund'
  )),
  amount INTEGER NOT NULL, -- Positive for earn, negative for spend
  balance_after INTEGER NOT NULL,
  
  -- Reference (e.g., badge_id, mission_id, etc.)
  reference_type TEXT,
  reference_id TEXT,
  
  -- Description
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for iii_transactions
CREATE INDEX IF NOT EXISTS idx_iii_trans_user ON iii_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_iii_trans_session ON iii_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_iii_trans_type ON iii_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_iii_trans_created ON iii_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE iii_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for iii_transactions
DROP POLICY IF EXISTS "Service role full access" ON iii_transactions;
CREATE POLICY "Service role full access" ON iii_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can log transactions" ON iii_transactions;
CREATE POLICY "Users can log transactions" ON iii_transactions
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their transactions" ON iii_transactions;
CREATE POLICY "Users can view their transactions" ON iii_transactions
  FOR SELECT
  TO anon
  USING (true);

-- =============================================================================
-- CRISIS_REFLECTIONS TABLE - Store post-loss reflections for wisdom learning
-- =============================================================================

CREATE TABLE IF NOT EXISTS crisis_reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  
  -- Crisis context
  mission_id TEXT,
  crisis_type TEXT,
  loss_percentage DECIMAL(10, 4),
  asset_class TEXT,
  
  -- Reflection content
  selected_lessons TEXT[] DEFAULT '{}',
  custom_reflection TEXT,
  reflection_quality TEXT CHECK (reflection_quality IN ('quick', 'detailed', 'thoughtful')),
  
  -- Rewards given
  iii_awarded INTEGER DEFAULT 0,
  wisdom_points INTEGER DEFAULT 0,
  
  -- Timestamps
  reflected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for crisis_reflections
CREATE INDEX IF NOT EXISTS idx_reflections_user ON crisis_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_session ON crisis_reflections(session_id);
CREATE INDEX IF NOT EXISTS idx_reflections_mission ON crisis_reflections(mission_id);

-- Enable Row Level Security
ALTER TABLE crisis_reflections ENABLE ROW LEVEL SECURITY;

-- Policies for crisis_reflections
DROP POLICY IF EXISTS "Service role full access" ON crisis_reflections;
CREATE POLICY "Service role full access" ON crisis_reflections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage reflections" ON crisis_reflections;
CREATE POLICY "Users can manage reflections" ON crisis_reflections
  FOR ALL
  TO anon
  WITH CHECK (true);

-- =============================================================================
-- VIEWS - Useful aggregate views
-- =============================================================================

-- Lead statistics view
CREATE OR REPLACE VIEW lead_stats AS
SELECT 
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'subscribed') as active_subscribers,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_this_week,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_this_month
FROM leads;

-- Feedback statistics view
CREATE OR REPLACE VIEW feedback_stats AS
SELECT 
  COUNT(*) as total_feedback,
  COUNT(*) FILTER (WHERE type = 'love') as love_count,
  COUNT(*) FILTER (WHERE type = 'idea') as idea_count,
  COUNT(*) FILTER (WHERE type = 'issue') as issue_count,
  COUNT(*) FILTER (WHERE type = 'general') as general_count,
  COUNT(*) FILTER (WHERE status = 'new') as unreviewed,
  AVG(rating) FILTER (WHERE rating IS NOT NULL) as avg_rating
FROM feedback;

-- Source breakdown view
CREATE OR REPLACE VIEW lead_sources AS
SELECT 
  source,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE status = 'subscribed') as subscribed,
  MIN(created_at) as first_signup,
  MAX(created_at) as last_signup
FROM leads
GROUP BY source
ORDER BY count DESC;

-- =============================================================================
-- FUNCTIONS - Helper functions
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leads table
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for sponsors table
DROP TRIGGER IF EXISTS sponsors_updated_at ON sponsors;
CREATE TRIGGER sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for user_profiles table
DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for daily_streaks table
DROP TRIGGER IF EXISTS daily_streaks_updated_at ON daily_streaks;
CREATE TRIGGER daily_streaks_updated_at
  BEFORE UPDATE ON daily_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SAMPLE DATA (for testing - remove in production)
-- =============================================================================

-- Uncomment to insert sample data:
/*
INSERT INTO leads (email, first_name, source) VALUES
  ('test@example.com', 'Test', 'homepage'),
  ('demo@example.com', 'Demo', 'support-page');

INSERT INTO feedback (type, message, rating, page_context) VALUES
  ('love', 'Great app for learning!', 5, 'homepage'),
  ('idea', 'Add more historical missions', NULL, 'timeline');
*/

-- =============================================================================
-- GRANTS - Ensure proper permissions
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant table permissions
GRANT SELECT, INSERT ON leads TO anon;
GRANT SELECT, INSERT ON feedback TO anon;
GRANT SELECT, INSERT ON user_activity TO anon;
GRANT SELECT, INSERT ON waitlist TO anon;

GRANT ALL ON leads TO service_role;
GRANT ALL ON feedback TO service_role;
GRANT ALL ON user_activity TO service_role;
GRANT ALL ON user_profiles TO service_role;
GRANT ALL ON sponsors TO service_role;
GRANT ALL ON waitlist TO service_role;
GRANT ALL ON daily_streaks TO service_role;
GRANT ALL ON streak_claims TO service_role;

GRANT SELECT, INSERT ON user_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON daily_streaks TO anon;
GRANT SELECT, INSERT ON streak_claims TO anon;

-- Trading tables
GRANT ALL ON trading_sessions TO service_role;
GRANT ALL ON trading_transactions TO service_role;
GRANT ALL ON portfolio_snapshots TO service_role;
GRANT SELECT, INSERT, UPDATE ON trading_sessions TO anon;
GRANT SELECT, INSERT ON trading_transactions TO anon;
GRANT SELECT, INSERT ON portfolio_snapshots TO anon;

-- Grant view permissions
GRANT SELECT ON lead_stats TO service_role;
GRANT SELECT ON feedback_stats TO service_role;
GRANT SELECT ON lead_sources TO service_role;

-- Rewards tables
GRANT ALL ON player_rewards TO service_role;
GRANT ALL ON earned_badges TO service_role;
GRANT ALL ON iii_transactions TO service_role;
GRANT ALL ON crisis_reflections TO service_role;
GRANT SELECT, INSERT, UPDATE ON player_rewards TO anon;
GRANT SELECT, INSERT ON earned_badges TO anon;
GRANT SELECT, INSERT ON iii_transactions TO anon;
GRANT SELECT, INSERT ON crisis_reflections TO anon;


