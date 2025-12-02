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
CREATE POLICY "Service role full access" ON feedback
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert feedback
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
CREATE POLICY "Service role full access" ON user_activity
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert activity
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
CREATE POLICY "Service role full access" ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert their own profile
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
CREATE POLICY "Service role full access" ON daily_streaks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert/update their own streaks
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
CREATE POLICY "Service role full access" ON streak_claims
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can insert claims
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
CREATE POLICY "Service role full access" ON waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anonymous users can join waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT
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

-- Grant view permissions
GRANT SELECT ON lead_stats TO service_role;
GRANT SELECT ON feedback_stats TO service_role;
GRANT SELECT ON lead_sources TO service_role;


