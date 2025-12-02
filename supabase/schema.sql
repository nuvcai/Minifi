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
GRANT ALL ON sponsors TO service_role;
GRANT ALL ON waitlist TO service_role;

-- Grant view permissions
GRANT SELECT ON lead_stats TO service_role;
GRANT SELECT ON feedback_stats TO service_role;
GRANT SELECT ON lead_sources TO service_role;

