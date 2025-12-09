/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📚 HISTORICAL MISSIONS - Teaching Wealth Through Financial History         ║
 * ║   A Family Office Perspective on Generational Wealth Creation                ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// Import and re-export shared types from assetClasses for backwards compatibility
import type { AssetClass, TimeHorizon } from './assetClasses';
export type { AssetClass, TimeHorizon } from './assetClasses';

// Risk/Return Profile aligned with FO standards
export interface RiskReturnProfile {
  riskLevel: "none" | "low" | "medium" | "high" | "extreme";
  historicalVolatility: string;  // e.g., "15-25%" annual
  correlationWithStocks: "negative" | "low" | "moderate" | "high";
}

export interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  risk: string;
  expectedReturn: string;
  actualReturn: number;
  investmentInsight: string;
  // NEW: Family Office aligned fields
  assetClass: AssetClass;
  timeHorizon: TimeHorizon;
  riskReturnProfile: RiskReturnProfile;
  foAllocationRange: string;  // Typical FO allocation e.g., "5-15%"
  liquidityRating: "high" | "medium" | "low";
}

export interface MissionData {
  context: string;
  situation: string;
  options: InvestmentOption[];
  coachAdvice: Record<string, string>;
  outcome: string;
  // NEW: Generational wealth wisdom fields
  wealthLesson: string;           // Key wealth-building lesson from this era
  foWisdom: string;               // Family Office perspective
  historicalOpportunity: string;  // What opportunity existed in this era
  hopeMessage: string;            // Inspiring message for young investors
}

export const missionData: Record<number, MissionData> = {
  1990: {
    context:
      "It's 1990 and Japan is living its best life! 🇯🇵 Property prices are through the roof, stocks are pumping, and everyone thinks the party will never end. But smart investors are starting to notice something's off...",
    situation:
      "You've got $100,000 to invest. Everyone's hyped about Japanese markets, but some finance experts are warning it might be too good to be true. What's your move?",
    options: [
      {
        id: "stocks",
        name: "Japanese Stocks",
        description: "Jump into the Nikkei 225 - Japan's hottest stock index",
        risk: "High",
        expectedReturn: "15-25%",
        actualReturn: -60,
        investmentInsight: "Japanese stocks are at all-time highs! 📈 But wait - prices might be way overblown. Some companies are trading at crazy valuations that don't make sense.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "high",
          historicalVolatility: "20-35%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "10-25%",
        liquidityRating: "high",
      },
      {
        id: "realestate",
        name: "Tokyo Real Estate",
        description: "Buy apartments in central Tokyo - prices only go up, right?",
        risk: "High",
        expectedReturn: "20-30%",
        actualReturn: -70,
        investmentInsight: "Tokyo property prices have 10x'd in a decade! 🏢 Land here costs more than anywhere else on Earth. But is this FOMO or a real opportunity?",
        assetClass: "alternatives" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "high",
          historicalVolatility: "15-25%",
          correlationWithStocks: "moderate",
        },
        foAllocationRange: "10-20%",
        liquidityRating: "low",
      },
      {
        id: "bonds",
        name: "US Treasury Bonds",
        description: "Play it safe with US government bonds",
        risk: "Low",
        expectedReturn: "8-10%",
        actualReturn: 45,
        investmentInsight: "Boring but reliable! US government bonds are backed by Uncle Sam himself. Not as exciting as Japanese stocks, but your money stays safe 🛡️",
        assetClass: "fixed_income" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "low",
          historicalVolatility: "5-10%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "15-30%",
        liquidityRating: "high",
      },
      {
        id: "gold",
        name: "Gold",
        description: "Stack some gold - the OG store of value",
        risk: "Medium",
        expectedReturn: "5-8%",
        actualReturn: 20,
        investmentInsight: "Gold has been valuable for thousands of years 🥇 It won't make you rich overnight, but it protects your money when things go sideways.",
        assetClass: "commodities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "15-20%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "5-10%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Those Japanese markets are sketchy! Go safe with bonds and gold 🛡️",
      "growth-guru": "Don't YOLO into Japan - try a balanced mix ⚖️",
      "adventure-alex": "Japanese markets are on fire - go big! 🚀",
      "yield-yoda": "Steady wins the race - bonds keep you safe 🧘",
    },
    outcome:
      "Plot twist: In 1991, Japan's central bank raised interest rates and the bubble POPPED! 💥 Stocks and property prices crashed hard, starting the 'Lost Decade' of slow growth.",
    wealthLesson: "🎓 WEALTH LESSON: When EVERYONE is euphoric and prices seem too good to be true... they usually are! Bubbles happen when people forget that prices should reflect real value. Diversified investors who held bonds and gold preserved their wealth while others lost 60-70%.",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: The wealthiest families survived Japan's crash because they NEVER put all their eggs in one basket. While speculators lost everything, diversified portfolios dropped 15-20% max. Capital preservation isn't boring - it's how fortunes survive crises.",
    historicalOpportunity: "💡 THE OPPORTUNITY: While Japan suffered, wise investors who moved to US markets caught the beginning of America's tech boom. Those who bought Microsoft, Intel, and Walmart in 1990 saw 10-20x returns by 2000. Crisis in one market = opportunity in another!",
    hopeMessage: "✨ FOR YOU: Every crash in history has been followed by an even bigger boom. Japan's 1990 crash taught a generation about bubble risks - knowledge that protected smart investors in 2000 and 2008. Learning from history is YOUR superpower!"
  },
  1997: {
    context:
      "July 1997 - Thailand just dropped a bombshell: they're letting their currency float freely. 💸 This starts a domino effect across Asia, with currencies and stock markets falling like crazy...",
    situation:
      "You've got $100,000 to invest. Asian markets are in chaos - currencies are crashing, but maybe there's opportunity in the madness?",
    options: [
      {
        id: "asian-stocks",
        name: "Asian Stocks",
        description: "Buy Korean, Thai, and Indonesian stocks while they're cheap!",
        risk: "Extreme",
        expectedReturn: "30-50%",
        actualReturn: -65,
        investmentInsight: "Asian markets are in freefall! 📉 Prices look like a bargain, but currencies are tanking too. This could get way worse before it gets better.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "extreme",
          historicalVolatility: "30-50%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "5-15%",
        liquidityRating: "medium",
      },
      {
        id: "us-stocks",
        name: "US Stocks",
        description: "Invest in the S&P 500 - America's safest bet",
        risk: "Medium",
        expectedReturn: "12-18%",
        actualReturn: 28,
        investmentInsight: "While Asia burns, the US economy is chugging along nicely 🇺🇸 Money is flowing OUT of Asia and INTO American stocks.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "15-20%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "25-40%",
        liquidityRating: "high",
      },
      {
        id: "bonds",
        name: "US Treasury Bonds",
        description: "Hide in the safety of government bonds",
        risk: "Low",
        expectedReturn: "6-8%",
        actualReturn: 15,
        investmentInsight: "When the world goes crazy, US bonds are where scared money hides 🏠 Super safe but not super exciting.",
        assetClass: "fixed_income" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "low",
          historicalVolatility: "5-10%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "15-30%",
        liquidityRating: "high",
      },
      {
        id: "cash",
        name: "US Dollar Cash",
        description: "Just hold dollars and wait for better opportunities",
        risk: "None",
        expectedReturn: "4-5%",
        actualReturn: 8,
        investmentInsight: "Cash is king during chaos! 👑 The US dollar is actually getting STRONGER while Asian currencies collapse.",
        assetClass: "cash" as AssetClass,
        timeHorizon: "short" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "none",
          historicalVolatility: "0-2%",
          correlationWithStocks: "low",
        },
        foAllocationRange: "5-15%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Asia is chaos - stay safe in US bonds 🚫",
      "growth-guru": "Skip Asia, focus on US stocks 🇺🇸",
      "adventure-alex": "Everyone's panicking = buying opportunity! 🎯",
      "yield-yoda": "Stay calm - cash gives you options 🎯",
    },
    outcome:
      "The crisis lasted until 1998 - many Asian currencies lost over 50% of their value and stock markets dropped 60-80%! 😱 Meanwhile, US markets stayed relatively chill and became a safe haven.",
    wealthLesson: "🎓 WEALTH LESSON: Global diversification protects you from regional disasters! While Asian markets crashed 60-80%, US stocks GAINED 28%. Having investments in multiple regions means one area's crisis doesn't destroy your wealth.",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: The smartest move during the Asian Crisis was patience + cash. Those who held cash could buy incredible Asian companies at 70-80% discounts. Samsung, Toyota, and TSMC traded at once-in-a-lifetime prices for those brave enough to buy.",
    historicalOpportunity: "💡 THE OPPORTUNITY: Investors who bought quality Asian stocks AFTER the crisis (1998-1999) saw massive returns over the next decade. Samsung alone returned 5,000%+. Crisis prices create generational wealth opportunities!",
    hopeMessage: "✨ FOR YOU: Regional crises are scary but temporary. The Asian economies that crashed in 1997 are now powerhouses - Korea, Thailand, Indonesia. What looked like the end was actually a reset. Your generation's 'crisis' markets could be tomorrow's goldmines!"
  },
  2000: {
    context:
      "Welcome to Y2K! 🎉 The internet is changing EVERYTHING. Tech stocks have been going absolutely nuts for 5 years straight. New websites are getting billion-dollar valuations without making any money. Sound familiar?",
    situation:
      "You've got $100,000 to invest. The Nasdaq has pumped 400% in 5 years! Everyone's getting rich from tech stocks. Your friends are quitting their jobs to day-trade. FOMO is real!",
    options: [
      {
        id: "tech",
        name: "Tech Stocks",
        description: "Invest in the Nasdaq 100 - ride the internet wave!",
        risk: "High",
        expectedReturn: "25-40%",
        actualReturn: -78,
        investmentInsight: "Tech stocks are trading at insane prices! 🤯 Many companies have never made a profit but are worth billions. Is this the future or just hype?",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "high",
          historicalVolatility: "25-40%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "15-25%",
        liquidityRating: "high",
      },
      {
        id: "dotcom",
        name: "Dot-com Startups",
        description: "Go full degen on .com company stocks",
        risk: "Extreme",
        expectedReturn: "50-100%",
        actualReturn: -95,
        investmentInsight: "Pets.com, Webvan, eToys... These companies are burning through cash like crazy with no real business plan 🔥 But STONKS ONLY GO UP, right?",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "extreme",
          historicalVolatility: "50-100%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "0-5%",
        liquidityRating: "low",
      },
      {
        id: "traditional",
        name: "Traditional Stocks",
        description: "Stick with old-school Dow Jones companies",
        risk: "Medium",
        expectedReturn: "10-15%",
        actualReturn: -25,
        investmentInsight: "Boomer stocks! 👴 Coca-Cola, McDonald's, GE - they actually make money. Not as sexy as tech, but more grounded in reality.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "12-18%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "20-35%",
        liquidityRating: "high",
      },
      {
        id: "cash",
        name: "Cash",
        description: "Sit this one out and wait",
        risk: "None",
        expectedReturn: "3-5%",
        actualReturn: 15,
        investmentInsight: "Sometimes the best move is no move 🧘 When everyone's greedy, smart money stays patient.",
        assetClass: "cash" as AssetClass,
        timeHorizon: "short" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "none",
          historicalVolatility: "0-2%",
          correlationWithStocks: "low",
        },
        foAllocationRange: "5-15%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Major bubble vibes! I'm staying in cash 🫧",
      "growth-guru": "Don't go all-in on tech - diversify! 🎯",
      "adventure-alex": "The internet changes everything - YOLO! 🌐",
      "yield-yoda": "When prices are crazy, patience wins 🧘",
    },
    outcome:
      "March 2000 - the bubble BURSTS! 💥 Nasdaq crashes 78% over the next two years. Most .com companies go bankrupt. Pets.com becomes a meme. The party is over.",
    wealthLesson: "🎓 WEALTH LESSON: Revolutionary technology can be REAL while stock prices are INSANE! The internet DID change everything - but Pets.com at $300M valuation selling dog food online? Come on! Separate good technology from bad investments.",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: Amazon, Google, and Apple all survived the crash and became trillion-dollar companies. The difference? Real business models that made actual profits. FOs stayed invested in QUALITY tech while avoiding the 'story stocks' with no real business.",
    historicalOpportunity: "💡 THE OPPORTUNITY: The dot-com crash was AMAZING for patient investors! Amazon dropped from $113 to $6 but survived. Those who bought at $6 saw 600x returns! The crash separated real businesses from fake ones - then rewarded those who recognized the difference.",
    hopeMessage: "✨ FOR YOU: This is DIRECTLY relevant to AI today! AI will change everything (like the internet did), but not every AI company is a good investment. Learn to separate hype from substance. The next Amazon is being built right now - can you spot it?"
  },
  2008: {
    context:
      "September 2008 - Lehman Brothers (a MASSIVE bank) just went bankrupt! 🏦💀 Turns out, banks were making super risky home loans and it's all falling apart. The whole financial system is on the edge of collapse...",
    situation:
      "You've got $100,000 to invest. Stock markets worldwide are in freefall. Banks are failing. Governments are scrambling to save the economy. What do you do?",
    options: [
      {
        id: "stocks",
        name: "Global Stocks",
        description: "Buy the dip on world stocks!",
        risk: "Extreme",
        expectedReturn: "20-30%",
        actualReturn: -55,
        investmentInsight: "Stock prices are crashing everywhere! 📉 Companies are losing value fast as everyone panics. It might be a buying opportunity... or it could get much worse.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "extreme",
          historicalVolatility: "30-50%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "25-40%",
        liquidityRating: "high",
      },
      {
        id: "banks",
        name: "Banking Stocks",
        description: "Buy bank stocks while they're cheap",
        risk: "Extreme",
        expectedReturn: "40-60%",
        actualReturn: -75,
        investmentInsight: "Banks are getting crushed! 🏦 Some might survive, some might not. The government is bailing some out, but shareholders could lose everything.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "extreme",
          historicalVolatility: "40-70%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "5-15%",
        liquidityRating: "high",
      },
      {
        id: "bonds",
        name: "US Treasury Bonds",
        description: "Run to the safest investment on Earth",
        risk: "Low",
        expectedReturn: "4-6%",
        actualReturn: 25,
        investmentInsight: "When the world is on fire, everyone wants US government bonds 🇺🇸 Super safe, and the Fed is cutting interest rates which makes bonds go up!",
        assetClass: "fixed_income" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "low",
          historicalVolatility: "5-10%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "15-30%",
        liquidityRating: "high",
      },
      {
        id: "gold",
        name: "Gold",
        description: "Stack gold - the ultimate crisis hedge",
        risk: "Medium",
        expectedReturn: "8-12%",
        actualReturn: 35,
        investmentInsight: "Gold shines brightest in dark times! ✨ Banks can fail, currencies can crash, but gold has been valuable for 5,000 years.",
        assetClass: "commodities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "15-25%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "5-10%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Scary times! Bonds and gold only 😰",
      "growth-guru": "Stay careful - mostly bonds, some gold 📊",
      "adventure-alex": "Blood in the streets = mega sale! 🩸",
      "yield-yoda": "Fear creates opportunity - bonds first 🎯",
    },
    outcome:
      "2008-2009: Global stocks dropped 50%+ 📉 But US bonds and gold were the safe havens everyone needed. The government pumped TRILLIONS into the economy, setting up the recovery that followed.",
    wealthLesson: "🎓 WEALTH LESSON: Market crashes are the ultimate test of your strategy. Those with diversified portfolios (bonds + gold) only dropped 20-30% while all-stock portfolios fell 50%+. More importantly, they had CASH to buy at the bottom!",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: 'Be greedy when others are fearful.' Legendary investors like Warren Buffett were BUYING in late 2008 and early 2009. They knew quality companies at 50% off are gifts. FOs kept 10-15% cash specifically for moments like this.",
    historicalOpportunity: "💡 THE OPPORTUNITY: The S&P 500 bottomed at 666 in March 2009. By 2019, it hit 3,000 - a 4.5x return! Those who invested $10,000 at the bottom had $45,000 ten years later. Crashes create millionaires for those brave enough to buy.",
    hopeMessage: "✨ FOR YOU: You WILL experience market crashes in your lifetime. They'll feel terrifying - everyone will say it's 'different this time.' It never is. Keep some powder dry, stay calm, and remember: this mission taught you that crashes are opportunities in disguise! 🎯"
  },
  2020: {
    context:
      "March 2020 - COVID-19 is spreading worldwide! 🦠 Countries are locking down, businesses are closing, and stock markets just crashed 30% in ONE MONTH. But then something unexpected happens...",
    situation:
      "You've got $100,000 to invest. Everyone's working from home, Zoom is blowing up, and the government is sending everyone free money. Peak panic or time to be greedy?",
    options: [
      {
        id: "tech-stocks",
        name: "Tech Stocks",
        description: "Invest in FAANG and other tech giants",
        risk: "Medium",
        expectedReturn: "15-25%",
        actualReturn: 85,
        investmentInsight: "Everyone's stuck at home using Netflix, Amazon, and Zoom! 📱 Tech companies are actually THRIVING while the rest of the economy struggles.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "20-30%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "15-25%",
        liquidityRating: "high",
      },
      {
        id: "travel-stocks",
        name: "Travel & Airlines",
        description: "Bet on airlines, cruises, and hotels recovering",
        risk: "Extreme",
        expectedReturn: "50-100%",
        actualReturn: -45,
        investmentInsight: "Travel is DEAD right now ✈️💀 But vaccines are coming... eventually. Could be the ultimate comeback story or a total disaster.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "extreme",
          historicalVolatility: "40-60%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "5-10%",
        liquidityRating: "high",
      },
      {
        id: "bonds",
        name: "US Treasury Bonds",
        description: "Play it safe with government bonds",
        risk: "Low",
        expectedReturn: "2-4%",
        actualReturn: 12,
        investmentInsight: "The Fed cut interest rates to basically zero! Bonds are safe but won't make you rich. Still, safe > sorry during a pandemic 🏠",
        assetClass: "fixed_income" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "low",
          historicalVolatility: "5-8%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "15-25%",
        liquidityRating: "high",
      },
      {
        id: "gold",
        name: "Gold",
        description: "Buy gold as an inflation hedge",
        risk: "Medium",
        expectedReturn: "8-15%",
        actualReturn: 28,
        investmentInsight: "The government is printing TRILLIONS of dollars 💵 When money printers go brrr, gold usually goes up!",
        assetClass: "commodities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "15-20%",
          correlationWithStocks: "negative",
        },
        foAllocationRange: "5-10%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Pandemic?! Playing it super safe 😷",
      "growth-guru": "Tech is winning - the future is digital! 💻",
      "adventure-alex": "Travel will bounce back huge! ✈️",
      "yield-yoda": "Follow trends - tech is the new normal 🏠",
    },
    outcome:
      "Plot twist: Tech stocks went absolutely INSANE! 🚀 After the initial crash, the Nasdaq doubled while many traditional companies struggled. The Fed's money printing pushed all asset prices up.",
    wealthLesson: "🎓 WEALTH LESSON: Crises accelerate existing trends! COVID didn't create e-commerce or remote work - it ACCELERATED them by 10 years. Smart investors asked: 'What was already growing that this crisis will supercharge?' The answer was tech, and it paid massively.",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: The fastest recovery from a crash in history happened because FOs recognized that this crisis was DIFFERENT - it would END (vaccines were coming) and would accelerate digital transformation. They bought quality tech aggressively in March-April 2020.",
    historicalOpportunity: "💡 THE OPPORTUNITY: Those who bought in March 2020 saw the Nasdaq nearly TRIPLE in 18 months. Zoom went from $70 to $560. Tesla went 10x. Understanding that COVID would accelerate digital trends was worth a fortune.",
    hopeMessage: "✨ FOR YOU: COVID taught your generation something powerful: the world can change FAST, and those who adapt quickly win. You saw businesses pivot, schools go online, and new habits form overnight. This adaptability is YOUR superpower for future opportunities! 🦠➡️🚀"
  },
  2025: {
    context:
      "Welcome to 2025! 🎮 AI is changing everything (like, EVERYTHING), crypto is still wild, and the world's trying to figure out what's next. Inflation, interest rates, and global drama keep markets on their toes...",
    situation:
      "You've got $100,000 to invest. ChatGPT and AI are everywhere. Green energy is growing fast. Interest rates are high. What's the winning move?",
    options: [
      {
        id: "ai-stocks",
        name: "AI Tech Stocks",
        description: "Bet big on artificial intelligence companies",
        risk: "High",
        expectedReturn: "20-40%",
        actualReturn: 35, // Simulated: AI stocks have been strong in 2024-2025
        investmentInsight: "AI is the hottest thing since the internet! 🤖 Nvidia, Microsoft, Google - they're all racing to dominate. But are prices already too high?",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "high",
          historicalVolatility: "25-40%",
          correlationWithStocks: "high",
        },
        foAllocationRange: "10-20%",
        liquidityRating: "high",
      },
      {
        id: "energy",
        name: "Green Energy Stocks",
        description: "Invest in solar, wind, and clean energy",
        risk: "High",
        expectedReturn: "15-30%",
        actualReturn: -15, // Simulated: Green energy struggled with high rates in 2024
        investmentInsight: "The world is going green! 🌱 Governments are spending big on clean energy. But high interest rates make these projects more expensive.",
        assetClass: "equities" as AssetClass,
        timeHorizon: "long" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "high",
          historicalVolatility: "25-35%",
          correlationWithStocks: "moderate",
        },
        foAllocationRange: "5-15%",
        liquidityRating: "high",
      },
      {
        id: "tips",
        name: "Inflation-Protected Bonds (TIPS)",
        description: "Get bonds that adjust for inflation",
        risk: "Low",
        expectedReturn: "5-8%",
        actualReturn: 8, // Simulated: TIPS performed as expected with inflation
        investmentInsight: "With prices going up everywhere, these bonds protect your buying power 💪 Not exciting, but you won't lose money to inflation!",
        assetClass: "fixed_income" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "low",
          historicalVolatility: "5-10%",
          correlationWithStocks: "low",
        },
        foAllocationRange: "10-20%",
        liquidityRating: "high",
      },
      {
        id: "commodities",
        name: "Commodities Basket",
        description: "Invest in oil, gold, and food",
        risk: "Medium",
        expectedReturn: "10-20%",
        actualReturn: 18, // Simulated: Gold hit all-time highs in 2024
        investmentInsight: "Real stuff like oil, gold, and food usually does well when inflation is high 🛢️ Global supply chain issues and conflicts can push prices up.",
        assetClass: "commodities" as AssetClass,
        timeHorizon: "medium" as TimeHorizon,
        riskReturnProfile: {
          riskLevel: "medium",
          historicalVolatility: "15-25%",
          correlationWithStocks: "low",
        },
        foAllocationRange: "5-10%",
        liquidityRating: "high",
      },
    ],
    coachAdvice: {
      "steady-sam": "Uncertain times - protect against inflation 🤔",
      "growth-guru": "AI is the future but stay balanced ⚖️",
      "adventure-alex": "AI changes everything - get in now! 🤖",
      "yield-yoda": "High inflation? Real assets protect you 🛡️",
    },
    outcome:
      "🎬 LIVE SCENARIO: Based on 2024-2025 market trends, AI stocks surged 35% as companies raced to deploy AI. Green energy struggled (-15%) with high interest rates. TIPS delivered steady 8% protection. Gold hit all-time highs pushing commodities up 18%. The lesson? Even in YOUR era, diversification wins!",
    wealthLesson: "🎓 WEALTH LESSON: You are living through YOUR generation's transformative moment! AI is this era's Industrial Revolution, Internet, and smartphone combined. Every generation has a defining technology - AI and robotics are YOURS.",
    foWisdom: "🏛️ FAMILY OFFICE WISDOM: The smartest FOs are allocating 15-30% to AI-related investments while maintaining diversification. They're buying the 'picks and shovels' (NVIDIA, cloud providers) AND promising AI applications. But they NEVER go all-in on any single bet.",
    historicalOpportunity: "💡 THE OPPORTUNITY: You're witnessing the early stages of the AI revolution - like being in 1995 for the internet or 2007 for smartphones. The companies that will dominate 2035 are being built RIGHT NOW. Understanding AI gives you an edge most investors don't have!",
    hopeMessage: "✨ FOR YOU: This isn't just an investment opportunity - it's YOUR moment in history! Carnegie had steel, Ford had automobiles, Gates had software, Bezos had e-commerce. What will YOU build or invest in during the AI era? The biggest fortunes of the next 30 years are being created NOW! 🤖🚀"
  },
};

// ============================================================================
// EDUCATIONAL EXPORT - Key Lessons Across All Eras
// ============================================================================

export const generationalWealthLessons = {
  overarchingTruth: "Every generation has their moment to build wealth. The Industrial Revolution, electricity, automobiles, computers, internet, mobile, and now AI - each era created new fortunes for those who recognized the shift early.",
  
  patternToWatch: "Look for technologies that multiply human capability. Steam multiplied physical labor. Electricity multiplied factories. Computers multiplied calculation. AI multiplies human intelligence. These multipliers create enormous wealth.",
  
  hopeForYoungInvestors: "You don't need to be rich to start investing. Carnegie arrived in America as a poor immigrant. Buffett bought his first stock with paper route money. Bezos left a good job to sell books from his garage. Starting matters more than starting big.",
  
  timingTruth: "The best time to invest was 20 years ago. The second best time is NOW. Your greatest advantage is TIME - use it!",
  
  familyOfficePrinciple: "Wealthy families think in generations, not quarters. They diversify to preserve wealth, invest in trends to grow it, and pass down knowledge more valuable than money itself."
};
