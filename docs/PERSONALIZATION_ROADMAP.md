# 🎯 Personalized Coaching Database & Roadmap

## Overview

This document outlines the data architecture needed to provide truly personalized AI coaching for MiniFi users. The goal is to transform generic financial advice into individually tailored guidance based on each user's personality, learning style, goals, and behavior.

---

## 📊 Data Categories

### 1. User Profile & Demographics
**Purpose:** Basic user understanding for age-appropriate content

| Data Point | Why We Need It |
|------------|----------------|
| Age group (12-14, 15-16, 17-18) | Age-appropriate language and examples |
| School year | Align with curriculum and cognitive level |
| Has part-time job | Realistic income scenarios |
| Family financial exposure | Starting knowledge assumptions |
| Country/State | Local examples, tax context |

**Collection Method:** Onboarding flow + optional profile completion

---

### 2. Learning Style Assessment
**Purpose:** Deliver content in the format that resonates most

| Learning Style | Content Adaptation |
|----------------|-------------------|
| Visual | More charts, infographics, color-coded |
| Auditory | Consider audio explanations, verbal coaching |
| Reading | Longer text explanations, detailed articles |
| Kinesthetic | More simulations, interactive elements |

**Also Track:**
- Preferred session length (5min vs 20min)
- Content depth preference (surface vs deep dive)
- Best time of day for learning
- Gamification response (points vs badges vs streaks)

**Collection Method:** 5-question quiz during onboarding

---

### 3. Financial Personality (Risk Profile)
**Purpose:** Match advice to psychological comfort zone

| Personality Type | AI Coach Approach |
|-----------------|-------------------|
| Guardian (Very Conservative) | Emphasize safety, show worst cases first |
| Builder (Moderate) | Balance risk/reward, steady progress |
| Explorer (Growth) | Show upside potential, calculated risks |
| Pioneer (Aggressive) | Challenge them, high-conviction opportunities |

**Behavioral Traits to Measure:**
- **Loss Aversion Score** (0-100): How much do they hate losses?
- **Patient Capital Score** (0-100): Can they wait for long-term gains?
- **FOMO Score** (0-100): Fear of missing out tendency
- **Panic Selling Score** (0-100): Likelihood to sell during crashes
- **Herd Following Score** (0-100): Independent vs crowd follower

**Collection Method:** 
- Initial quiz (10 questions)
- Refined by actual behavior in missions

---

### 4. Knowledge & Skill Tracking
**Purpose:** Don't teach what they already know, fill gaps

**Track Mastery Levels:**
```
not_started → introduced → practicing → proficient → mastered
```

**Concepts to Track (~40 total):**
- Basic: compound interest, inflation, risk/return, diversification
- Asset Classes: stocks, bonds, commodities, real estate, crypto, cash
- Strategies: buy & hold, DCA, rebalancing, allocation
- Risk: position sizing, correlation, volatility
- Markets: bull/bear, cycles, indicators
- Behavioral: biases, emotions, psychology

**Collection Method:** Quiz performance + mission decisions

---

### 5. Behavioral Data & Patterns
**Purpose:** Let actions speak louder than self-reported preferences

**Key Behaviors to Track:**

| Behavior | Insight |
|----------|---------|
| Time to make decision | Confidence level |
| Changed mind before confirming | Uncertainty |
| Followed coach advice | Trust in coaching |
| Reviews past missions | Learning orientation |
| Pauses on loss screens | Emotional response to losses |
| Session length patterns | Engagement optimization |

**Decision History:**
- Which options they chose across missions
- Which asset classes they gravitate toward
- Performance outcomes (profit/loss)
- Time patterns (when they play)

---

### 6. Goals & Aspirations
**Purpose:** Connect abstract investing to real motivations

**Goal Categories:**
- 🎓 Education (university, courses)
- 🚗 Lifestyle (car, travel, tech)
- 🏠 Long-term (house deposit someday)
- 💼 Career (startup capital, business)
- 🎁 Giving (charity, helping family)

**Goal Attributes:**
- Target amount (if known)
- Timeline (short/medium/long/very long)
- Priority (must-have vs dream)
- Personal "why" (motivation)

**How AI Uses Goals:**
- "Saving for a car? Here's how compound interest can get you there faster..."
- "Your university fund has 4 years to grow - here's why stocks make sense..."

---

### 7. Coach Relationship Tracking
**Purpose:** Build rapport, remember context, improve over time

**Per Coach-User Pair:**
- Total interactions
- Trust score (do they follow advice?)
- Preferred communication tone
- Topics discussed
- Questions asked
- Satisfaction indicators

**Communication Preferences:**
- Casual vs Professional tone
- Brief vs Detailed explanations
- Wants emoji? Examples? Data?
- Responds to encouragement vs challenge?

---

### 8. Conversation History
**Purpose:** Contextual AI responses, no repetition

**Store Per Conversation:**
- User messages
- Coach responses
- Mission context (what they were doing)
- Sentiment/intent (confused? excited? frustrated?)

**Use Cases:**
- "Last time we talked about bonds - how did that decision go?"
- Don't explain concepts already discussed
- Reference their previous decisions

---

## 🗄️ Database Schema (PostgreSQL)

```sql
-- Core Tables
users
learning_profiles (1:1 with users)
financial_personalities (1:1 with users)
knowledge_profiles (1:1 with users)
behavioral_data (1:1 with users)
financial_goals (1:N with users)
coach_relationships (users × coaches)
conversations (1:N with users)
user_achievements (users × achievements)
content_recommendations (1:N with users)
parent_links (N:N parent-child)

-- Reference Tables (static)
market_scenarios
achievements
financial_concepts
```

---

## 🤖 How AI Coaches Use This Data

### Context Building
Every AI coach request includes:
```javascript
{
  userProfile: { ageGroup, experienceLevel, totalXp },
  personality: { riskProfile, decisionStyle, lossAversion },
  learning: { style, pace, depth, strengths, gaps },
  behavior: { followsAdvice, preferredAssetClasses },
  goals: [{ name, timeframe, progress }],
  context: { currentMission, recentDecisions }
}
```

### Personalization Examples

**Loss Aversion Adaptation:**
- High loss aversion (80+): "I know losses feel painful, but here's why this is actually a learning opportunity..."
- Low loss aversion (20): "You handled that loss well! Ready to analyze what we can learn?"

**Learning Style Adaptation:**
- Visual learner: Coach shows more charts, uses color metaphors
- Reading learner: Coach provides detailed explanations
- Kinesthetic: Coach suggests simulations and "try it yourself"

**Risk Personality Adaptation:**
- Guardian: "Let's make sure we protect your principal first..."
- Pioneer: "Here's an opportunity - the risk is real, but so is the reward..."

---

## 📈 Implementation Phases

### Phase 1: Basic Personalization (MVP+)
- [ ] Learning style quiz (5 questions)
- [ ] Risk profile quiz (10 questions)  
- [ ] Basic decision tracking
- [ ] Send personality to AI coach

### Phase 2: Behavioral Learning (3-6 months)
- [ ] Full behavioral tracking
- [ ] Refine profiles based on actions
- [ ] Knowledge gap identification
- [ ] Personalized content recommendations

### Phase 3: Deep Personalization (6-12 months)
- [ ] Conversation history integration
- [ ] Goal tracking and coaching
- [ ] Achievement system
- [ ] Parent dashboard

### Phase 4: Advanced AI (12+ months)
- [ ] Predictive coaching (anticipate needs)
- [ ] Emotion detection from interactions
- [ ] Personalized scenario generation
- [ ] Multi-coach collaboration

---

## 🔐 Privacy & Consent

### Data Minimization
- Only collect what's necessary
- Age-appropriate data collection (under 16)
- No PII beyond account basics

### Consent Layers
1. **Basic** - Essential learning tracking (required)
2. **Enhanced** - Behavioral analysis (optional, more personalization)
3. **Marketing** - External communications (optional)

### Parent Controls
- Parents can view child's progress
- Parents can limit data collection level
- Parents can request data deletion

### GDPR/Privacy Compliance
- Right to access
- Right to deletion
- Data portability
- Clear privacy policy
- Parental consent for under 16

---

## 💰 Business Value

### User Benefits
- More relevant content
- Faster learning
- Higher engagement
- Better outcomes

### Platform Benefits
- Higher retention (personalized = sticky)
- Premium tier justification
- B2B school licensing (progress reports)
- Research insights

### Metrics to Track
| Metric | Target | How Personalization Helps |
|--------|--------|--------------------------|
| Session completion | 80%+ | Right content, right length |
| 7-day retention | 50%+ | Personalized recommendations |
| Mission completion | 90%+ | Appropriate difficulty |
| Coach satisfaction | 4.5/5 | Relevant responses |

---

## 🚀 Quick Wins (Start Here)

1. **Risk Quiz** - 10 questions, assign personality type
2. **Learning Style Quiz** - 5 questions, adapt content format
3. **Decision Tracking** - Log all mission choices
4. **Basic AI Context** - Send profile to coach API

These 4 items dramatically improve personalization with minimal effort.

---

## Next Steps

1. Review this document with team
2. Prioritize Phase 1 features
3. Design quiz UX/UI
4. Update database schema
5. Modify AI coach prompts to use context

---

*Last Updated: December 2025*
*Author: MiniFi Product Team*

