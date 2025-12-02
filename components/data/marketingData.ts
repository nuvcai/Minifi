/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📊 MARKETING DATA & ANALYTICS SCHEMA                                       ║
 * ║   Data structures for user acquisition, engagement, and growth               ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * FREE MVP VALUE EXCHANGE: World-class financial education ↔ User insights
 * 
 * Security-first design for protecting minor's data while enabling growth.
 */

// ============================================================================
// 1. DATA COLLECTION TIERS
// ============================================================================

export type DataTier = "anonymous" | "basic" | "enhanced" | "behavioral";

/**
 * Tier 1: Anonymous - No consent required, aggregated non-PII
 * Tier 2: Basic - Consent required at signup
 * Tier 3: Enhanced - Explicit optional consent
 * Tier 4: Behavioral - Derived from usage patterns
 */

// ============================================================================
// 2. CONSENT MANAGEMENT
// ============================================================================

export interface UserConsent {
  userId: string;
  
  // Required consents (must accept to use)
  termsAccepted: boolean;
  termsVersion: string;
  termsAcceptedAt: Date;
  
  privacyAccepted: boolean;
  privacyVersion: string;
  privacyAcceptedAt: Date;
  
  // Age verification
  ageVerified: boolean;          // Confirmed 12+
  ageRange: "12-14" | "15-16" | "17-18";
  
  // Optional consents
  marketingEmail: boolean;
  marketingEmailAt?: Date;
  
  pushNotifications: boolean;
  pushNotificationsAt?: Date;
  
  enhancedPersonalization: boolean;
  enhancedPersonalizationAt?: Date;
  
  // Parental consent (required for under 16 in many jurisdictions)
  parentalConsent?: boolean;
  parentalConsentAt?: Date;
  parentEmail?: string;
  parentVerified?: boolean;
  
  // Third party sharing (always false for minors)
  thirdPartySharing: boolean;
  thirdPartySharingAt?: Date;
  
  // Consent withdrawals
  withdrawals: ConsentWithdrawal[];
  
  // Metadata
  ipAddress?: string;           // For audit trail
  userAgent?: string;
  consentMethod: "web_form" | "api" | "parent_portal";
  
  lastUpdated: Date;
}

export interface ConsentWithdrawal {
  consentType: string;
  withdrawnAt: Date;
  reason?: string;
  processedAt?: Date;
  dataDeleted?: boolean;
}

// ============================================================================
// 3. MINIMAL SIGNUP DATA (Tier 2)
// ============================================================================

export interface SignupData {
  // Required - Minimal PII
  email: string;                 // Primary identifier
  passwordHash: string;          // Never store plain text
  ageRange: "12-14" | "15-16" | "17-18";
  country: string;               // For localization
  
  // Required consents
  termsAccepted: boolean;
  privacyAccepted: boolean;
  
  // Optional (default false)
  marketingConsent: boolean;
  
  // Optional enrichment
  displayName?: string;          // For leaderboards (no real name)
  school?: string;               // B2B lead generation
  referralCode?: string;         // Attribution
  
  // Signup metadata
  signupSource: string;          // utm_source
  signupMedium?: string;         // utm_medium
  signupCampaign?: string;       // utm_campaign
  signupAt: Date;
  
  // Device fingerprint (anonymized)
  deviceId?: string;             // For fraud prevention
}

// ============================================================================
// 4. EVENT TRACKING
// ============================================================================

export interface TrackingEvent {
  eventId: string;               // UUID
  eventName: string;
  
  // User identification
  userId?: string;               // Null if anonymous
  sessionId: string;
  anonymousId: string;           // Cookie-based
  
  // Timestamp
  timestamp: Date;
  clientTimestamp?: Date;        // Browser time
  
  // Context
  context: EventContext;
  
  // Event-specific properties
  properties: Record<string, unknown>;
}

export interface EventContext {
  // Page context
  page?: {
    path: string;
    referrer?: string;
    title?: string;
    url: string;
  };
  
  // Campaign attribution
  campaign?: {
    source?: string;             // utm_source
    medium?: string;             // utm_medium
    name?: string;               // utm_campaign
    term?: string;               // utm_term
    content?: string;            // utm_content
  };
  
  // Device info
  device?: {
    type: "mobile" | "tablet" | "desktop";
    manufacturer?: string;
    model?: string;
  };
  
  // Browser/OS
  userAgent?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  
  // Location (country level only for privacy)
  locale?: string;
  timezone?: string;
  country?: string;
  
  // App context
  app?: {
    version: string;
    build?: string;
  };
}

// Key marketing events
export const MARKETING_EVENTS = {
  // Acquisition
  PAGE_VIEW: "page_view",
  LANDING_PAGE_VIEW: "landing_page_view",
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  SIGNUP_ABANDONED: "signup_abandoned",
  
  // Onboarding
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
  COACH_SELECTED: "coach_selected",
  
  // Engagement
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  MISSION_STARTED: "mission_started",
  MISSION_COMPLETED: "mission_completed",
  MISSION_ABANDONED: "mission_abandoned",
  
  // Feature usage
  QUIZ_STARTED: "quiz_started",
  QUIZ_COMPLETED: "quiz_completed",
  LIBRARY_VIEWED: "library_viewed",
  WISDOM_READ: "wisdom_read",
  COACH_CHAT_OPENED: "coach_chat_opened",
  
  // Gamification
  ACHIEVEMENT_EARNED: "achievement_earned",
  LEVEL_UP: "level_up",
  REWARD_VIEWED: "reward_viewed",
  
  // Virality
  REFERRAL_LINK_CREATED: "referral_link_created",
  REFERRAL_LINK_SHARED: "referral_link_shared",
  REFERRAL_CONVERTED: "referral_converted",
  SHARE_CLICKED: "share_clicked",
  
  // B2B Signals
  SCHOOL_INDICATED: "school_indicated",
  TEACHER_ROLE_SELECTED: "teacher_role_selected",
  COMPETITION_CREATED: "competition_created",
  
  // Monetization (future)
  PREMIUM_VIEWED: "premium_viewed",
  PREMIUM_CTA_CLICKED: "premium_cta_clicked",
  SUBSCRIPTION_STARTED: "subscription_started",
  
  // Consent
  CONSENT_GIVEN: "consent_given",
  CONSENT_WITHDRAWN: "consent_withdrawn",
  PARENT_CONSENT_REQUESTED: "parent_consent_requested",
} as const;

// ============================================================================
// 5. USER SEGMENTS
// ============================================================================

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  
  // Segment criteria
  criteria: SegmentCriteria[];
  
  // Segment metadata
  userCount?: number;
  lastCalculated?: Date;
  
  // Marketing automation
  emailSequenceId?: string;
  notificationTemplateId?: string;
}

export interface SegmentCriteria {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
  value: unknown;
}

// Pre-defined segments
export const USER_SEGMENTS = {
  // Lifecycle segments
  NEW_USERS: "new_users",              // Signed up < 7 days
  ACTIVE_USERS: "active_users",        // Active in last 7 days
  AT_RISK: "at_risk",                  // No activity 7-14 days
  CHURNED: "churned",                  // No activity 30+ days
  POWER_USERS: "power_users",          // 5+ sessions/week
  
  // Engagement segments
  MISSION_COMPLETERS: "mission_completers",  // Completed 3+ missions
  QUIZ_TAKERS: "quiz_takers",               // Completed risk/learning quiz
  COACH_USERS: "coach_users",               // Used AI chat 3+ times
  
  // Demographic segments
  TEENS_12_14: "teens_12_14",
  TEENS_15_16: "teens_15_16",
  TEENS_17_18: "teens_17_18",
  
  // B2B segments
  SCHOOL_USERS: "school_users",        // Indicated school
  TEACHERS: "teachers",                // Teacher role
  HIGH_VOLUME_SCHOOLS: "high_volume_schools", // 10+ users same school
  
  // Value segments
  PREMIUM_PROSPECTS: "premium_prospects",  // High engagement, no premium
  REFERRAL_CHAMPIONS: "referral_champions", // 3+ successful referrals
} as const;

// ============================================================================
// 6. ATTRIBUTION & REFERRALS
// ============================================================================

export interface Attribution {
  userId: string;
  
  // First touch
  firstTouchSource?: string;
  firstTouchMedium?: string;
  firstTouchCampaign?: string;
  firstTouchAt?: Date;
  
  // Last touch (at conversion)
  lastTouchSource?: string;
  lastTouchMedium?: string;
  lastTouchCampaign?: string;
  lastTouchAt?: Date;
  
  // Referral
  referredBy?: string;           // Referrer's userId
  referralCode?: string;
  referralConvertedAt?: Date;
}

export interface ReferralProgram {
  userId: string;
  referralCode: string;
  
  // Stats
  linksShared: number;
  signups: number;
  conversions: number;         // Completed onboarding
  
  // Rewards earned
  xpEarned: number;
  rewardsEarned: string[];
  
  // Referrals
  referrals: {
    referredUserId: string;
    signedUpAt: Date;
    convertedAt?: Date;
    rewardGiven: boolean;
  }[];
}

// ============================================================================
// 7. B2B SCHOOL LEAD SCORING
// ============================================================================

export interface SchoolLead {
  id: string;
  schoolName: string;
  domain?: string;             // School email domain
  country: string;
  state?: string;
  
  // Lead signals
  userCount: number;
  teacherCount: number;
  avgEngagementScore: number;
  competitionsCreated: number;
  
  // Lead score (calculated)
  leadScore: number;
  leadStatus: "cold" | "warm" | "hot" | "contacted" | "qualified" | "customer";
  
  // Contacts
  contacts: {
    email: string;
    role: "teacher" | "admin" | "unknown";
    optedIn: boolean;
    lastContact?: Date;
  }[];
  
  // Activity
  firstUserAt: Date;
  lastActiveAt: Date;
  
  // Sales tracking
  assignedTo?: string;
  lastContactedAt?: Date;
  nextFollowUp?: Date;
  notes?: string;
}

// Lead scoring formula
export function calculateSchoolLeadScore(lead: Partial<SchoolLead>): number {
  let score = 0;
  
  // User volume
  score += Math.min((lead.userCount || 0) * 10, 100);
  
  // Teacher presence (strong buying signal)
  score += (lead.teacherCount || 0) * 50;
  
  // Engagement quality
  score += Math.min((lead.avgEngagementScore || 0) * 2, 50);
  
  // Competition creation (classroom use)
  score += (lead.competitionsCreated || 0) * 30;
  
  // School email domain (verifiable)
  if (lead.domain?.endsWith('.edu') || lead.domain?.endsWith('.edu.au')) {
    score += 20;
  }
  
  return score;
}

// ============================================================================
// 8. EMAIL MARKETING
// ============================================================================

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  
  emails: EmailTemplate[];
  
  // Performance
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  
  // Timing
  delayDays: number;
  delayHours?: number;
  
  // Content
  htmlContent: string;
  textContent: string;
  
  // Personalization tokens
  tokens: string[];   // e.g., {{firstName}}, {{xpEarned}}
  
  // Performance
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

// Pre-defined email sequences
export const EMAIL_SEQUENCES = {
  WELCOME: "welcome",
  ONBOARDING_REMINDER: "onboarding_reminder",
  RE_ENGAGEMENT_7DAY: "re_engagement_7day",
  RE_ENGAGEMENT_14DAY: "re_engagement_14day",
  RE_ENGAGEMENT_30DAY: "re_engagement_30day",
  ACHIEVEMENT_CELEBRATION: "achievement_celebration",
  PARENT_NURTURE: "parent_nurture",
  SCHOOL_ADMIN_OUTREACH: "school_admin_outreach",
} as const;

// ============================================================================
// 9. SECURITY LOGGING
// ============================================================================

export interface SecurityLog {
  id: string;
  timestamp: Date;
  
  // Event type
  eventType: SecurityEventType;
  severity: "info" | "warning" | "error" | "critical";
  
  // User context
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // Event details
  action: string;
  resource?: string;
  outcome: "success" | "failure" | "blocked";
  
  // Additional context
  metadata?: Record<string, unknown>;
  
  // For compliance
  dataAccessed?: string[];       // Which PII fields were accessed
  retentionDays: number;         // How long to keep this log
}

export type SecurityEventType =
  | "authentication"
  | "authorization"
  | "data_access"
  | "data_export"
  | "data_deletion"
  | "consent_change"
  | "rate_limit"
  | "suspicious_activity"
  | "admin_action";

// ============================================================================
// 10. DATA RETENTION POLICIES
// ============================================================================

export interface RetentionPolicy {
  dataType: string;
  retentionDays: number;
  deletionMethod: "hard_delete" | "soft_delete" | "anonymize";
  legalBasis: string;
  
  // Exceptions
  extendedRetentionReasons?: string[];
}

export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    dataType: "session_analytics",
    retentionDays: 90,
    deletionMethod: "hard_delete",
    legalBasis: "legitimate_interest"
  },
  {
    dataType: "user_profile",
    retentionDays: 365,  // 1 year after account deletion
    deletionMethod: "hard_delete",
    legalBasis: "consent"
  },
  {
    dataType: "consent_records",
    retentionDays: 2555,  // 7 years for compliance
    deletionMethod: "hard_delete",
    legalBasis: "legal_obligation"
  },
  {
    dataType: "security_logs",
    retentionDays: 365,
    deletionMethod: "hard_delete",
    legalBasis: "legal_obligation"
  },
  {
    dataType: "email_engagement",
    retentionDays: 180,
    deletionMethod: "anonymize",
    legalBasis: "legitimate_interest"
  },
];

// ============================================================================
// 11. GDPR/PRIVACY COMPLIANCE
// ============================================================================

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  
  // Status
  status: "pending" | "processing" | "ready" | "downloaded" | "expired";
  
  // Processing
  processedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
  
  // Audit
  downloadedAt?: Date;
  downloadedByIp?: string;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  
  // Verification (for minors, may need parent)
  verificationMethod: "email" | "parent_email" | "support_ticket";
  verified: boolean;
  verifiedAt?: Date;
  
  // Processing
  status: "pending" | "verified" | "processing" | "completed" | "rejected";
  processedAt?: Date;
  
  // What was deleted
  dataDeleted?: string[];
  dataRetained?: string[];       // With legal reason
  retentionReasons?: string[];
  
  // Confirmation
  confirmationSentAt?: Date;
}

// ============================================================================
// 12. MARKETING DASHBOARD METRICS
// ============================================================================

export interface MarketingMetrics {
  period: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
  
  // Acquisition
  newSignups: number;
  signupConversionRate: number;  // Landing → Signup
  costPerAcquisition?: number;
  
  // Engagement
  activeUsers: number;
  sessionsPerUser: number;
  avgSessionDuration: number;    // seconds
  missionsCompleted: number;
  
  // Retention
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  churnRate: number;
  
  // Virality
  referralsSent: number;
  referralConversions: number;
  viralCoefficient: number;
  
  // B2B
  schoolLeads: number;
  schoolLeadScore: number;
  teacherSignups: number;
  
  // Channel breakdown
  channelBreakdown: {
    channel: string;
    signups: number;
    percentage: number;
  }[];
}

// ============================================================================
// EXPORT DATA INDEX
// ============================================================================

export * from './personalizedCoaching';

