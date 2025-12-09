# 🏆 MiniFi - Financial Literacy for the Next Generation

> **Empowering Australian Teens (12-18) with AI-Powered Investment Education**

A gamified investment education platform by **Tick.AI** that takes young learners on a journey through financial history, teaching real investment strategies through interactive missions and AI-powered coaching.

## 🎯 Project Overview

**MiniFi** is an innovative educational platform designed specifically for Australian teenagers aged 12-18. Players navigate through major financial events in history, make investment decisions, and learn from AI coaches while competing in real-time investment competitions.

Built for **NextGen AI Hackathon 2025** by Tick.AI.

### 🌟 Key Features

- **📚 Historical Financial Missions**: Journey through 35+ years of financial history (1990-2025)
- **🤖 AI-Powered Coaching**: Personalized investment advice teaching family office strategies
- **📊 Real-Time Trading Simulation**: Practice with virtual capital
- **🏆 Competitive Leaderboards**: Compete with players globally
- **📈 Advanced Analytics**: Performance charts and risk analysis
- **🎮 Gamified Learning**: XP system, achievements, and progressive unlocking
- **🎁 Real Rewards System**: Exchange XP for Australian brand gift cards
- **📱 Mobile-First Design**: Optimized for all devices

### 🆕 Latest Features (v1.2)

- **🎯 Crisis-Based Learning**: Mission flow aligned with "learning through crisis" philosophy
- **💎 High Conviction Investing**: Celebrate bold decisions and quick failures as growth
- **🧠 Emotional Intelligence**: Loss results show "Wisdom Earned" with learning-focused messaging
- **📱 Mobile-First UX**: Bottom sheet modals, 44px touch targets, bottom navigation
- **🎮 Enhanced Gamification**:
  - Knowledge Quiz after missions
  - What-If Analysis for exploring alternate outcomes
  - Points System with Flybuys-style rewards
  - League System for competitive progression
  - Investor Journey with milestone tracking
- **🎲 Infinite Gameplay**: Random scenario generation after completing historical missions
- **📊 Asset Class System**: 6 distinct asset classes with FO-aligned categorization
- **🎓 FO Certification Path**: Capital Guardian → Balanced Investor → FO Fellow

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone git@gitlab.com:tick.ai/minifi.git
cd minifi
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# OpenAI API Key (for AI Coach functionality)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Start the Application

**Start Backend:**

```bash
cd backend
./start_backend.sh
```

**Start Frontend (in a new terminal):**

```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎮 How to Play

### 1. Historical Missions

- Start with the Japanese Bubble Economy (1990)
- Complete missions chronologically to unlock new events
- Make investment decisions based on historical context
- Learn from AI coaches about market dynamics

### 2. Investment Competition

- Unlock after completing all historical missions
- Allocate your starting capital across various assets
- Choose from 4 specialized AI coaches
- Trade in real-time with market simulation

### 3. Performance Tracking

- View detailed performance charts
- Analyze risk metrics (Sharpe ratio, volatility, max drawdown)
- Compare your results with global leaderboards
- Earn XP and achievements

## 🏗️ Architecture

### Frontend (React/Next.js)

- **Framework**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and context

### Backend (FastAPI)

- **Framework**: FastAPI with Python
- **Database**: SQLite with thread-safe connections
- **AI Integration**: OpenAI API (GPT-4o-mini) for coaching
- **Caching**: 1-hour TTL for price data (10x performance boost)

### Key Components

```
components/
├── data/
│   ├── missions.ts          # Historical missions with asset class metadata
│   ├── coaches.ts           # AI coach profiles with FO strategies
│   ├── assetClasses.ts      # Comprehensive asset class reference
│   ├── randomScenarios.ts   # Procedural scenario generation
│   └── events.ts            # Financial events data
├── features/
│   ├── UpcomingFeatures.tsx # Coming soon feature teasers
│   ├── AssetClassMastery.tsx # Asset class progress tracking
│   ├── RiskSpectrum.tsx     # Risk/return visualization
│   └── FOCertificationTeaser.tsx # Certification path preview
├── mission/
│   ├── MissionIntro.tsx     # Crisis → Challenge → Conviction flow
│   ├── InvestmentDecision.tsx # High conviction investment choice
│   ├── InvestmentThesis.tsx # Document reasoning before decisions
│   ├── MissionResult.tsx    # Wisdom-focused results (wins & learning)
│   ├── KnowledgeQuiz.tsx    # Post-mission comprehension validation
│   └── WhatIfAnalysis.tsx   # Explore alternate outcomes
├── gamification/
│   ├── InvestorJourney.tsx  # Visual milestone progression
│   ├── LeagueSystem.tsx     # Competitive tier rankings
│   ├── RewardsStore.tsx     # XP redemption marketplace
│   ├── FlybuysRewards.tsx   # Partner rewards integration
│   ├── SavingsVault.tsx     # Goal-based savings game
│   ├── StakingCard.tsx      # XP staking for bonuses
│   └── pointsSystem.ts      # Points calculation utilities
├── shared/
│   └── MobileBottomNav.tsx  # Fixed mobile navigation
├── ui/
│   └── dialog.tsx           # Bottom sheet modal variants
├── PerformanceChart.tsx     # Investment performance visualization
├── AICoach.tsx              # AI coaching interface
├── trading-dashboard.tsx    # Real-time trading with asset classes
└── competition-results.tsx  # Results and leaderboards

backend/
├── main.py                  # FastAPI application
├── models.py               # Pydantic data models
├── database.py             # Database management
└── services/               # Business logic services
    ├── coach_service.py    # AI coaching (family office approach)
    ├── coach_chat.py       # Real-time chat
    ├── price_service.py    # Yahoo Finance price data
    └── investment_metrics_service.py # Historical performance
```

## 🎯 AI Coaching - Family Office Approach

MiniFi teaches teens to invest like wealthy families:

### Core Philosophy
- **Reward Effort** over outcomes
- **Explore Asset Classes** (stocks, bonds, ETFs, crypto, REITs, commodities)
- **Think Long-Term** like family offices managing multi-generational wealth
- **Diversify Strategically** across 4-6+ asset classes

### AI Coach Personalities

#### Steady Sam (Conservative) 🛡️
- Focus: Capital preservation, defensive assets
- Language: "Steady as she goes," "Family offices think in generations"
- Teaches: Bonds, gold, dividend stocks, REITs

#### Wise Wendy (Balanced) ⚖️
- Focus: Strategic allocation, risk-adjusted returns
- Language: "Balance is key," "Diversification protects"
- Teaches: Mixed portfolios, asset correlations

#### Adventure Alex (Aggressive) 🚀
- Focus: Growth opportunities, calculated risks
- Language: "Go big," "Innovation pays off"
- Teaches: Growth stocks, crypto, emerging markets

#### Tech Taylor (Technology) 💻
- Focus: Tech-focused diversification
- Language: "Focus on the future," "Innovation drives wealth"
- Teaches: AI, cloud, semiconductors

## 📊 Performance Metrics

- **Total Return**: Overall portfolio performance
- **Sharpe Ratio**: Risk-adjusted returns
- **Volatility**: Portfolio risk measurement
- **Max Drawdown**: Maximum loss from peak
- **Annualized Return**: Yearly performance rate
- **Asset Class Exploration**: Track diversification progress

## 🚀 Recent Updates

### v1.2.0 - Crisis Learning & Mobile UX Update (December 2025)
- ✅ **Philosophy-Aligned Mission Flow**: "Crisis Mode" → "High Conviction" → "Wisdom Earned"
- ✅ **Learning from Failures**: Losses celebrated as growth opportunities with violet confetti
- ✅ **Mobile Bottom Navigation**: Fixed nav bar with safe area support
- ✅ **Bottom Sheet Modals**: Native mobile dialog experience
- ✅ **Enhanced Touch Targets**: All interactive elements meet 44px minimum
- ✅ **Knowledge Quiz**: Post-mission comprehension validation
- ✅ **What-If Analysis**: Explore alternate investment outcomes
- ✅ **Points System**: Flybuys-style rewards with tier progression
- ✅ **Rewards Store**: Redeem XP for rewards and perks
- ✅ **League System**: Competitive rankings (Bronze → Diamond)
- ✅ **Investor Journey**: Visual milestone progression tracker
- ✅ **Random Scenarios**: Infinite gameplay with procedurally generated events
- ✅ **Homepage Mobile Menu**: Hamburger navigation with responsive typography

### v1.1.0 - Asset Class & Financial Literacy Update (December 2025)
- ✅ **Asset Class System**: 6 FO-aligned asset classes with full metadata
- ✅ **Risk/Return Profiles**: Volatility, correlation, and FO allocation ranges
- ✅ **Time Horizon Guidance**: Short/Medium/Long investment recommendations
- ✅ **Asset Class Mastery UI**: Track progress across all asset classes
- ✅ **FO Certification Teaser**: 3-level certification path preview
- ✅ **Risk Spectrum Visualization**: Interactive risk/return chart component

### v1.0.0 - Family Office Edition
- ✅ AI Coach rewards effort and exploration
- ✅ Backend caching (10x faster price data)
- ✅ Mobile-optimized UI
- ✅ Comprehensive documentation

---

## 🗺️ Product Roadmap

### Current: v1.2 (December 2025)
> *Crisis Learning & Mobile UX Update*

| Feature | Status | Description |
|---------|--------|-------------|
| Historical Missions | ✅ Complete | 6 major financial events (1990-2025) |
| AI Coach System | ✅ Complete | 4 FO-aligned coaches with strategies |
| Trading Simulation | ✅ Complete | Real-time portfolio with asset classes |
| Performance Analytics | ✅ Complete | Real Yahoo Finance data integration |
| Mobile-First UI | ✅ Complete | Bottom nav, bottom sheets, 44px targets |
| Leaderboards | ✅ Complete | Global competition rankings |
| **Crisis-Based Learning** | ✅ Complete | Philosophy-aligned mission flow |
| **Knowledge Quiz** | ✅ Complete | Post-mission comprehension checks |
| **What-If Analysis** | ✅ Complete | Explore alternate outcomes |
| **Points & Rewards** | ✅ Complete | Flybuys-style points system |
| **League System** | ✅ Complete | Competitive tier progression |
| **Investor Journey** | ✅ Complete | Visual milestone tracker |
| **Random Scenarios** | ✅ Complete | Infinite procedural gameplay |

---

### v1.2 - Interactive Features (Q1 2026)
> *Engaging Learning Tools*

| Feature | Priority | Description |
|---------|----------|-------------|
| 🎯 Risk Profile Quiz | High | Personalized coach matching |
| 📊 Portfolio Builder | High | Drag-drop portfolio construction |
| 🎲 Risk Roulette | High | Daily prediction mini-game |
| 🎓 FO Certification | High | 3-level credential system |
| ⏱️ Time Horizon Challenges | Medium | Goal-matching gameplay |
| 📈 Asset Comparison Tool | Medium | Side-by-side analysis |

---

### v1.3 - Enhanced Learning (Q2 2026)
> *Deepening Educational Impact*

| Feature | Priority | Description |
|---------|----------|-------------|
| 📚 Extended Missions | High | Expand to 20+ historical events |
| 🧠 Adaptive Difficulty | High | AI-adjusted challenges based on skill |
| 📊 Learning Analytics | High | Track knowledge gaps & progress |
| 🎯 Micro-Lessons | Medium | Bite-sized financial concepts |
| 🏅 Achievement System | Medium | Badges for milestones & exploration |
| 🌏 ASX Integration | Medium | Real Australian market data |

---

### v1.2 - Social & Gamification (Q2 2026)
> *Building Community*

| Feature | Priority | Description |
|---------|----------|-------------|
| 👥 Friend Competitions | High | Challenge friends, private leagues |
| 💬 Social Feed | High | Share achievements, strategies |
| 🏫 Classroom Mode | High | Teacher dashboards, class competitions |
| 🎁 Rewards Marketplace | Medium | Australian brand gift cards (Woolworths, JB Hi-Fi) |
| 📱 Push Notifications | Medium | Market alerts, challenge reminders |
| 🤝 Mentorship Pairing | Low | Connect beginners with advanced users |

---

### v1.3 - Advanced Trading (Q3 2026)
> *Professional-Grade Features*

| Feature | Priority | Description |
|---------|----------|-------------|
| 📈 Advanced Charts | High | Candlesticks, technical indicators |
| ⚡ Options Trading Sim | High | Learn derivatives safely |
| 🔄 Auto-Rebalancing | Medium | Portfolio optimization suggestions |
| 📉 Short Selling Sim | Medium | Understand market mechanics |
| 🌐 Global Markets | Medium | US, UK, Asian market simulations |
| 🤖 AI Strategy Builder | Low | Create & backtest custom strategies |

---

### v2.0 - Platform Expansion (Q4 2026)
> *Scaling Impact*

| Feature | Priority | Description |
|---------|----------|-------------|
| 📱 Native Mobile Apps | High | iOS & Android with offline mode |
| 🏦 Real Micro-Investing | High | Connect to real brokerage (supervised) |
| 🎓 School Curriculum API | High | LMS integration for educators |
| 👨‍👩‍👧 Parent Portal | Medium | Progress tracking, parental controls |
| 🌏 APAC Expansion | Medium | Localized for Singapore, NZ, HK |
| 🏆 National Competitions | Medium | School vs school tournaments |

---

### v3.0 - AI Evolution (2027)
> *Next-Gen Intelligence*

| Feature | Vision | Description |
|---------|--------|-------------|
| 🧠 Personalized AI Tutors | Planned | Custom AI trained on user learning style |
| 🎮 VR Trading Floor | Planned | Immersive market experience |
| 🔮 Predictive Analytics | Planned | AI-powered market scenario modeling |
| 🌍 Global Launch | Planned | Multi-language, multi-currency |
| 📜 Certification Program | Planned | Industry-recognized credentials |
| 🤝 Fintech Partnerships | Planned | Bank & broker integrations |

---

### 📊 Success Metrics & KPIs

| Metric | v1.0 Target | v2.0 Target |
|--------|-------------|-------------|
| Active Users | 1,000 | 50,000 |
| School Partnerships | 5 | 200 |
| Mission Completion Rate | 70% | 85% |
| Financial Literacy Improvement | 40% | 60% |
| User Retention (30-day) | 35% | 55% |
| NPS Score | 40+ | 60+ |

---

### 🎯 Strategic Priorities

1. **Education First**: Every feature must have measurable learning outcomes
2. **Teen-Centric Design**: UI/UX optimized for Gen Z engagement patterns  
3. **AI-Native**: Leverage AI throughout, not as an afterthought
4. **Australian Focus**: Local market context, brands, and regulations
5. **Responsible Growth**: Build trust with parents, schools, regulators

---

## 📚 Documentation

- [Backend Improvements](BACKEND_IMPROVEMENTS.md) - 10-point improvement plan
- [AI Coach Guide](AI_COACH_IMPROVEMENTS.md) - Family office coaching details
- [Mobile UX Guide](MOBILE_TRADING_IMPROVEMENTS.md) - Mobile optimization
- [Debug Guide](DEBUG_UPDATES.md) - Testing and troubleshooting
- [GitLab Setup](GITLAB_SETUP.md) - Repository management

## 🧪 Testing

Run the test suite:

```bash
./test_updates.sh
```

Expected output:
```
✅ All Python files have valid syntax
✅ Core backend files present
✅ Documentation created
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Set production environment variables
NEXT_PUBLIC_API_URL=https://your-api-domain.com
OPENAI_API_KEY=your_production_api_key

# Start production server
npm start
```

### Environment Variables

| Variable              | Description                    | Required |
| --------------------- | ------------------------------ | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL                | Yes      |
| `OPENAI_API_KEY`      | OpenAI API key for AI coaching | Yes      |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Merge Request

## 📄 License

Private - NextGen AI Hackathon 2025

## 🎉 Acknowledgments

- **Built by**: Tick.AI
- **For**: NextGen AI Hackathon 2025
- **Target**: Australian teenagers aged 12-18
- **Powered by**: OpenAI GPT-4o-mini
- **Inspired by**: Real financial market events and family office strategies

---

**Start your investment journey today with MiniFi!** 🚀💰

*Empowering the next generation of investors through AI-powered education.*
