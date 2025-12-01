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
├── PerformanceChart.tsx      # Investment performance visualization
├── AICoach.tsx              # AI coaching interface
├── investment-competition.tsx # Competition setup
├── trading-dashboard.tsx    # Real-time trading interface
└── competition-results.tsx  # Results and leaderboards

backend/
├── main.py                  # FastAPI application
├── models.py               # Pydantic data models
├── database.py             # Database management
└── services/               # Business logic services
    ├── coach_service.py    # AI coaching (family office approach)
    └── coach_chat.py       # Real-time chat
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

### v1.0.0 - Family Office Edition
- ✅ AI Coach rewards effort and exploration
- ✅ Backend caching (10x faster price data)
- ✅ Mobile-optimized UI (44x44px touch targets)
- ✅ Request ID tracking for debugging
- ✅ Improved health checks
- ✅ Comprehensive documentation

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
