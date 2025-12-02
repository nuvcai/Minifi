# 📊 Marketing Data Strategy & Security Framework

## MVP Value Exchange Model

> **Free Education ↔ User Insights**
> 
> MiniFi provides free, world-class financial education in exchange for anonymized usage data that helps us improve the product and understand our market.

---

## 🎯 Marketing Data Collection Goals

### Primary Objectives
1. **User Acquisition Intelligence** - Understand what brings users to us
2. **Product-Market Fit** - Validate demand and features
3. **Conversion Optimization** - Free → Premium pathways
4. **Retention Strategy** - What keeps users engaged
5. **B2B Sales Intelligence** - School/institutional targeting

---

## 📋 Data Collection Tiers

### Tier 1: Anonymous Analytics (No Consent Required)
*Aggregated, non-PII data collected automatically*

| Data Point | Marketing Use | Security Level |
|------------|---------------|----------------|
| Page views & flows | Funnel optimization | Public |
| Session duration | Engagement benchmarks | Public |
| Feature usage | Product prioritization | Public |
| Device/Browser | Platform optimization | Public |
| Geographic (country level) | Market prioritization | Public |
| Referral source | Channel attribution | Public |

**Tools:** Google Analytics 4, Mixpanel, PostHog

---

### Tier 2: Basic Profile (Consent Required)
*Collected during signup - clear value exchange*

| Data Point | Marketing Use | Why Users Share |
|------------|---------------|-----------------|
| Email address | Nurture campaigns, retention | Progress saves, rewards |
| Age range (12-14, 15-16, 17-18) | Segment targeting | Personalized content |
| Country/State | Localization, school targeting | Local examples |
| School name (optional) | B2B leads, partnerships | Leaderboards, competitions |
| Referral code used | Attribution, viral tracking | Bonus XP for referrals |

**Value Exchange:** "Sign up to save your progress and earn real rewards!"

---

### Tier 3: Enhanced Profile (Explicit Consent)
*Optional, provides better personalization*

| Data Point | Marketing Use | Why Users Share |
|------------|---------------|-----------------|
| Learning style quiz results | Segment personas | Better AI coaching |
| Risk profile quiz results | Product development | Personalized advice |
| Financial goals | Content marketing | Goal-based coaching |
| Parental email (optional) | B2C family marketing | Parent dashboard access |
| Interests (tech, sports, etc.) | Content personalization | Relevant examples |

**Value Exchange:** "Complete your profile for personalized AI coaching!"

---

### Tier 4: Behavioral Intelligence (Implicit from Usage)
*Derived from in-app behavior*

| Behavior | Marketing Insight | Security |
|----------|-------------------|----------|
| Mission completion rate | Product stickiness | Internal only |
| Asset class preferences | Interest signals | Internal only |
| Session frequency | Engagement scoring | Internal only |
| Feature adoption | Product-market fit | Internal only |
| Drop-off points | Funnel optimization | Internal only |
| Coach interactions | AI value validation | Internal only |

---

## 🔐 Security Framework

### Data Classification

| Level | Description | Examples | Protection |
|-------|-------------|----------|------------|
| **Public** | Non-sensitive, aggregated | Page views, device type | Standard encryption |
| **Internal** | Business intelligence | Behavioral patterns | Access controls |
| **Confidential** | User PII | Email, age, school | Encryption + access logging |
| **Restricted** | Minor's detailed data | Risk profiles, goals | Maximum protection |

### Security Measures

#### Infrastructure Security
```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────────┤
│  1. HTTPS/TLS 1.3 for all connections                      │
│  2. WAF (Web Application Firewall)                          │
│  3. DDoS protection (Cloudflare/AWS Shield)                │
│  4. Rate limiting on all APIs                               │
│  5. Input validation & sanitization                         │
├─────────────────────────────────────────────────────────────┤
│                    DATA PROTECTION                          │
├─────────────────────────────────────────────────────────────┤
│  6. AES-256 encryption at rest                             │
│  7. Database access via IAM roles only                     │
│  8. PII stored in separate encrypted table                 │
│  9. Audit logging for all data access                      │
│  10. Automated backup with encryption                       │
├─────────────────────────────────────────────────────────────┤
│                   ACCESS CONTROL                            │
├─────────────────────────────────────────────────────────────┤
│  11. Role-based access control (RBAC)                      │
│  12. Multi-factor authentication for admin                 │
│  13. Principle of least privilege                          │
│  14. Session timeout (30 min inactivity)                   │
│  15. IP allowlisting for admin functions                   │
└─────────────────────────────────────────────────────────────┘
```

#### Minor-Specific Protections (COPPA/Australian Privacy)
- **No direct marketing to under-13s**
- **Parental consent required for enhanced data** (under 16)
- **No sharing PII with third parties**
- **Right to deletion on request**
- **Data minimization** - only collect what's needed
- **No behavioral advertising targeting minors**

---

## 📧 Marketing Data Flows

### User Acquisition Funnel

```
                    ACQUISITION
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
┌───▼───┐         ┌─────▼─────┐       ┌─────▼─────┐
│Social │         │  School   │       │  Organic  │
│ Ads   │         │Partnerships│      │  Search   │
└───┬───┘         └─────┬─────┘       └─────┬─────┘
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   Landing Page   │
              │  (UTM tracking)  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   Play as Guest  │ ◄── Tier 1 Data
              │   (no signup)    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Signup CTA    │ ◄── Tier 2 Data
              │  "Save Progress" │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Profile Quiz    │ ◄── Tier 3 Data
              │  (optional)      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Active User     │ ◄── Tier 4 Data
              │  (engagement)    │
              └────────┬────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
    ┌──────▼──────┐        ┌───────▼───────┐
    │  Premium    │        │  B2B School   │
    │  Upsell     │        │  Lead Gen     │
    └─────────────┘        └───────────────┘
```

---

## 📊 Key Marketing Metrics to Track

### Acquisition Metrics
| Metric | Data Source | Target |
|--------|-------------|--------|
| CAC (Cost per Acquisition) | Ads + Signups | < $2 |
| Signup conversion rate | Landing → Signup | > 15% |
| Referral rate | Referral codes used | > 20% |
| School lead conversion | School signups → Demo | > 10% |

### Engagement Metrics
| Metric | Data Source | Target |
|--------|-------------|--------|
| D1/D7/D30 retention | Session data | 60%/40%/25% |
| Mission completion rate | Game data | > 80% |
| Average session duration | Analytics | > 8 min |
| MAU/DAU ratio | User activity | > 0.3 |

### Monetization Metrics (Future)
| Metric | Data Source | Target |
|--------|-------------|--------|
| Free → Premium conversion | Subscription data | > 5% |
| School license revenue | CRM | $50K ARR Y1 |
| Lifetime value (LTV) | Revenue/users | > $25 |
| LTV/CAC ratio | Calculated | > 3:1 |

---

## 🏫 B2B School Lead Intelligence

### Data Points for School Targeting

| Data Point | How We Get It | Marketing Use |
|------------|---------------|---------------|
| School name | Optional signup field | Direct outreach |
| # users per school | Aggregated | Warm lead scoring |
| Teacher vs student | Role selection | Decision maker ID |
| State/Region | Location | Territory planning |
| Engagement level | Usage data | Lead qualification |

### School Lead Scoring Model

```
LEAD SCORE = 
  (# Active Users × 10) +
  (Avg Session Duration × 5) +
  (Teacher Signup × 50) +
  (School Domain Emails × 20) +
  (Competition Participation × 30)
  
Hot Lead: Score > 200
Warm Lead: Score 100-200
Cold Lead: Score < 100
```

### Outreach Triggers
- 10+ students from same school → Email school contact
- Teacher signup → Immediate sales follow-up
- Competition created → Offer classroom features
- High engagement school → Partnership proposal

---

## 📱 Marketing Automation Flows

### Email Sequences

#### 1. Welcome Sequence (Signup → Day 7)
```
Day 0: Welcome + First Mission CTA
Day 1: Coach introduction + Tips
Day 3: "You're making progress!" + Next mission
Day 5: Risk profile quiz invitation
Day 7: Parent sharing CTA + Referral offer
```

#### 2. Re-engagement Sequence (7+ days inactive)
```
Day 7: "We miss you!" + New feature highlight
Day 14: "Your portfolio is waiting" + Progress summary
Day 21: "Limited time XP bonus" + Urgency
Day 30: Final re-engagement or sunset
```

#### 3. Achievement Celebration
```
On achievement: Congratulations + Share CTA
After 3 achievements: "You're on fire!" + Referral ask
On completion: Certificate + Parent share + Premium tease
```

#### 4. Parent Nurture (if parent email provided)
```
Week 1: What your child is learning
Week 2: Progress report + Conversation starters
Week 4: Family financial discussion guide
Monthly: Newsletter with financial tips
```

---

## 🔒 Consent Management

### Consent Collection Points

| Point | What We Ask | How We Ask |
|-------|-------------|------------|
| First Visit | Cookie consent | Banner (GDPR compliant) |
| Signup | Terms + Privacy | Checkbox (required) |
| Profile | Enhanced data | Optional step |
| Marketing | Email consent | Checkbox (pre-unchecked) |
| Parent Link | Parental consent | Parent email verification |

### Consent Storage

```typescript
interface UserConsent {
  userId: string;
  
  // Required consents
  termsAccepted: boolean;
  termsAcceptedAt: Date;
  privacyAccepted: boolean;
  privacyAcceptedAt: Date;
  ageVerified: boolean; // Confirmed 12+
  
  // Optional consents
  marketingEmail: boolean;
  marketingEmailAt?: Date;
  enhancedPersonalization: boolean;
  enhancedPersonalizationAt?: Date;
  parentalConsent?: boolean;
  parentalConsentAt?: Date;
  parentEmail?: string;
  
  // Withdrawals
  withdrawals: {
    type: string;
    at: Date;
    reason?: string;
  }[];
}
```

### Consent UI Requirements
- ✅ Clear, plain language (age-appropriate)
- ✅ Separate opt-ins for each purpose
- ✅ No pre-checked boxes for marketing
- ✅ Easy withdrawal process
- ✅ Parental consent flow for under-16s

---

## 📋 Data Collection Implementation

### Signup Form (Minimal)

```typescript
interface SignupData {
  // Required
  email: string;           // Primary identifier
  password: string;        // Hashed immediately
  ageRange: "12-14" | "15-16" | "17-18";  // Segment
  country: string;         // Localization
  
  // Terms
  termsAccepted: boolean;  // Required
  marketingConsent: boolean; // Optional, default false
  
  // Optional enrichment
  displayName?: string;    // For leaderboards
  school?: string;         // B2B lead gen
  referralCode?: string;   // Attribution
}
```

### Profile Enrichment (Optional)

```typescript
interface ProfileEnrichment {
  // Learning preferences
  learningStyleResult?: LearningStyle;
  riskProfileResult?: RiskProfile;
  
  // Goals
  primaryGoal?: string;
  goalTimeframe?: string;
  
  // Interests (for content personalization)
  interests?: string[];
  
  // Parent connection
  parentEmail?: string;
  parentConsent?: boolean;
}
```

### Event Tracking Schema

```typescript
interface TrackingEvent {
  event: string;
  userId?: string;        // Anonymous if not logged in
  sessionId: string;
  timestamp: Date;
  
  // Common properties
  properties: {
    page?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    device?: string;
    country?: string;
  };
  
  // Event-specific properties
  eventProperties?: Record<string, any>;
}

// Key events to track
const MARKETING_EVENTS = [
  "page_view",
  "signup_started",
  "signup_completed",
  "mission_started",
  "mission_completed",
  "coach_selected",
  "quiz_completed",
  "achievement_earned",
  "reward_redeemed",
  "referral_sent",
  "referral_converted",
  "premium_viewed",
  "school_indicated",
];
```

---

## 🛡️ Security Checklist

### Pre-Launch Security
- [ ] SSL certificate installed and forced
- [ ] Environment variables secured (no secrets in code)
- [ ] Database credentials rotated
- [ ] Input validation on all forms
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] CSRF tokens on forms
- [ ] Rate limiting configured
- [ ] Error messages sanitized (no stack traces)

### Data Protection
- [ ] PII encrypted at rest
- [ ] Passwords hashed (bcrypt)
- [ ] Session tokens secure & rotated
- [ ] Audit logging enabled
- [ ] Backup encryption verified
- [ ] Data retention policy documented

### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent banner
- [ ] GDPR data export capability
- [ ] GDPR deletion capability
- [ ] Under-16 parental consent flow
- [ ] No COPPA violations (13+ only or parental consent)

### Ongoing Security
- [ ] Dependency vulnerability scanning (weekly)
- [ ] Penetration testing (quarterly)
- [ ] Security training for team
- [ ] Incident response plan documented
- [ ] Data breach notification process

---

## 📈 Marketing Dashboard KPIs

### Real-Time Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│                    MINIFI MARKETING DASHBOARD               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TODAY                        THIS WEEK                     │
│  ├── New Signups: 47          ├── New Signups: 312         │
│  ├── Active Users: 234        ├── Active Users: 1,847      │
│  ├── Missions Completed: 189  ├── Missions Completed: 1,456│
│  └── School Leads: 3          └── School Leads: 18         │
│                                                             │
│  FUNNEL (This Week)                                         │
│  Landing Page ────► Signup ────► Mission 1 ────► Mission 2  │
│     5,234            312          287            198        │
│              (6.0%)      (92.0%)      (69.0%)              │
│                                                             │
│  TOP ACQUISITION CHANNELS                                   │
│  1. Organic Search     42%                                  │
│  2. Social (TikTok)    28%                                  │
│  3. Referrals          18%                                  │
│  4. School Programs    12%                                  │
│                                                             │
│  RETENTION COHORTS                                          │
│  D1: 62%  D7: 41%  D14: 33%  D30: 24%                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Priority

### Phase 1: MVP Launch (Now)
1. ✅ Basic analytics (GA4)
2. ✅ Minimal signup form
3. ✅ Cookie consent banner
4. ✅ Privacy policy
5. ✅ Terms of service

### Phase 2: Growth Foundation (Month 1-2)
1. Event tracking implementation
2. Email automation setup
3. Referral system
4. School lead capture
5. UTM tracking

### Phase 3: Intelligence Layer (Month 3-4)
1. User segmentation
2. Behavioral analytics
3. Lead scoring
4. A/B testing framework
5. Attribution modeling

### Phase 4: Scale (Month 5+)
1. Predictive analytics
2. Lookalike audiences
3. Automated personalization
4. Advanced B2B targeting
5. Revenue optimization

---

## 📞 Vendor Recommendations

| Need | Recommended | Alternative | Why |
|------|-------------|-------------|-----|
| Analytics | Mixpanel | PostHog | Event-based, startup-friendly |
| Email | Resend | SendGrid | Modern API, good deliverability |
| CRM | HubSpot Free | Pipedrive | School lead management |
| Consent | Termly | OneTrust | GDPR/CCPA compliant |
| Auth | Clerk | Auth0 | Easy, secure, social logins |
| Database | Supabase | Neon | PostgreSQL, row-level security |

---

*Last Updated: December 2025*
*Review Schedule: Monthly*

