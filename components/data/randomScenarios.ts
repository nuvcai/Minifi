/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎲 RANDOM SCENARIO GENERATOR - Infinite Learning After All Missions       ║
 * ║   Generate unique financial scenarios to keep players engaged               ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║   CORE EDUCATIONAL PRINCIPLES:                                              ║
 * ║   🔥 Learning Through Crisis - Navigate real market chaos                   ║
 * ║   🧠 Emotional Intelligence - Master fear, greed, FOMO, panic               ║
 * ║   🏛️ Generational Thinking - Build wealth across decades                    ║
 * ║   💎 High Conviction Decisions - Make confident, researched choices         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { AssetClass, TimeHorizon } from './assetClasses';
import type { MissionData, InvestmentOption, RiskReturnProfile } from './missions';
import type { FinancialEvent } from './events';

// ============================================================================
// CORE PRINCIPLES - The educational foundation of every scenario
// ============================================================================

export const corePrinciples = {
  learningThroughCrisis: {
    name: "Learning Through Crisis",
    emoji: "🔥",
    description: "Every market crisis in history has created opportunities for those who understood what was happening.",
    keyLessons: [
      "Crises reveal the true value of assets - overpriced things crash, underpriced things survive",
      "The best buying opportunities come when everyone else is selling in panic",
      "Understanding WHY a crisis happened prevents you from repeating others' mistakes",
      "Every crisis eventually ends - the question is: are you positioned to benefit?",
    ],
  },
  emotionalIntelligence: {
    name: "Emotional Intelligence",
    emoji: "🧠",
    description: "Your biggest enemy in investing isn't the market - it's your own emotions.",
    keyLessons: [
      "FOMO (Fear Of Missing Out) makes you buy at the top when everyone is euphoric",
      "Panic makes you sell at the bottom when everyone is fearful",
      "Greed makes you take unnecessary risks when things are going well",
      "Patience is the most valuable - and rarest - investor trait",
    ],
  },
  generationalThinking: {
    name: "Generational Thinking",
    emoji: "🏛️",
    description: "Wealthy families think in decades, not days. They build wealth that lasts generations.",
    keyLessons: [
      "Short-term volatility doesn't matter when you're thinking 20+ years ahead",
      "Compound growth turns small, consistent investments into fortunes",
      "The best investments are boring - they just grow steadily over time",
      "Diversification isn't about maximizing returns, it's about ensuring survival",
    ],
  },
  highConviction: {
    name: "High Conviction Decisions",
    emoji: "💎",
    description: "The best investors make fewer, better decisions with deep understanding.",
    keyLessons: [
      "Understand WHAT you own and WHY you own it",
      "If you can't explain your investment in simple terms, you don't understand it",
      "Conviction comes from research, not from what others are doing",
      "The best time to develop conviction is BEFORE the crisis, not during it",
    ],
  },
};

// ============================================================================
// SCENARIO TEMPLATES - Built around core principles
// ============================================================================

interface ScenarioTemplate {
  id: string;
  title: string;
  themes: string[];
  primaryPrinciple?: keyof typeof corePrinciples;
  secondaryPrinciple?: keyof typeof corePrinciples;
  contextTemplates: string[];
  situationTemplates: string[];
  emotionalChallenge?: string; // The emotional trap this scenario tests
  outcomeTemplates: {
    good: string[];
    bad: string[];
  };
  lessonsTemplates: string[];
  generationalWisdom?: string[];
  convictionTest?: string; // What conviction is being tested
}

const scenarioTemplates: ScenarioTemplate[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 1: MARKET PANIC - Tests Emotional Intelligence
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "market_panic",
    title: "Market Panic",
    themes: ["crash", "fear", "panic selling", "emotional test"],
    primaryPrinciple: "emotionalIntelligence",
    secondaryPrinciple: "learningThroughCrisis",
    emotionalChallenge: "PANIC - The overwhelming urge to sell everything when prices drop",
    convictionTest: "Can you hold your investments when everyone around you is selling in fear?",
    contextTemplates: [
      "🚨 CRISIS MODE: Markets have plunged {percentage}% in {timeframe}! Your phone is blowing up with news alerts. Your parents are worried. Your friends are panic-selling. This feels like the end of the world...",
      "RED EVERYWHERE! 📉 Your portfolio just lost {percentage}%. Social media is full of people crying about losses. Experts on TV are predicting total collapse. Can you keep your head?",
      "MARKET MELTDOWN! The {sector} sector crashed {percentage}% overnight! Everyone you know is selling. The fear is contagious. But you remember what your coach said about emotional investing...",
    ],
    situationTemplates: [
      "Your ${amount} portfolio is bleeding. Your gut screams 'SELL NOW!' but your education says 'this is when fortunes are made.' The emotional battle is real. What wins?",
      "Friends sold everything and feel relieved. You're still holding and feeling sick. Is patience wisdom or stubbornness? This is the hardest test of emotional intelligence.",
      "The market has crashed {percentage}%. History says: buy. Your emotions say: run. Family Offices say: this is the moment that separates wealthy from broke. What do you choose?",
    ],
    outcomeTemplates: {
      good: [
        "🏆 EMOTIONAL VICTORY! Markets recovered in {timeframe}. Those who panicked sold at the bottom. Those who stayed calm came out ahead. This is how generational wealth is built!",
        "💎 DIAMOND HANDS REWARDED! The 'crash' was a gift in disguise. Patient investors saw massive gains. You passed the emotional intelligence test!",
      ],
      bad: [
        "The market kept falling... but then recovered without you. Panic-selling locked in your losses. Remember: emotional decisions in investing almost always hurt you.",
        "You survived... barely. The volatility continued, but those who held on eventually recovered. The lesson: never let fear make your investment decisions.",
      ],
    },
    lessonsTemplates: [
      "🧠 EMOTIONAL INTELLIGENCE: Your biggest enemy isn't the market - it's your own panic. Every major crash in history was followed by recovery.",
      "🔥 CRISIS WISDOM: Warren Buffett made billions by buying DURING panics, not running from them. Fear is expensive - courage is profitable.",
    ],
    generationalWisdom: [
      "Family Offices survived 1929, 1987, 2000, 2008, and 2020 by NEVER panic selling. They buy when others flee.",
      "Your grandparents who held through every crisis retired wealthy. Those who sold in fear are still working.",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 2: FOMO FRENZY - Tests Emotional Intelligence + High Conviction
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fomo_trap",
    title: "FOMO Frenzy",
    themes: ["hype", "FOMO", "greed", "bubble"],
    primaryPrinciple: "emotionalIntelligence",
    secondaryPrinciple: "highConviction",
    emotionalChallenge: "FOMO - The fear of missing out on 'guaranteed' gains everyone is getting",
    convictionTest: "Can you stick to your research when everyone else seems to be getting rich quick?",
    contextTemplates: [
      "🚀 {technology} stocks are UP {percentage}% this month! Everyone's posting gains on social media. Your friend quit their job to day-trade. You feel like the only person not getting rich...",
      "THE NEXT BIG THING! {technology} is everywhere. Your uncle made ${amount} last week. Celebrities are promoting it. Every day you don't buy, you feel dumber. FOMO or opportunity?",
      "MILLIONAIRES BEING MADE! {technology} investors are buying Lambos. The gains seem endless. Missing out feels physically painful. But you remember what happened to dot-com investors...",
    ],
    situationTemplates: [
      "Your ${amount} sits in 'boring' investments while others get rich on {technology}. The FOMO is overwhelming. Do you YOLO in, or trust your long-term strategy?",
      "Everyone at school/work won't shut up about their {technology} gains. Your diversified portfolio looks pathetic in comparison. Is your conviction strong enough to resist?",
      "A friend who knows nothing about investing just 3x'd their money in {technology}. They're calling you 'too scared to get rich.' Can you handle the social pressure?",
    ],
    outcomeTemplates: {
      good: [
        "💎 HIGH CONVICTION VICTORY! The {technology} bubble eventually popped. Those who FOMO'd at the top lost 80%+. Your patience and research protected you!",
        "🏛️ GENERATIONAL THINKING WINS! While others chased quick gains, you built sustainable wealth. The hype faded, but your portfolio kept growing.",
      ],
      bad: [
        "The {technology} hype was real... for a while. But bubbles always pop. Those who got in early made money; those who FOMO'd late lost everything.",
        "You got lucky this time - the gains continued. But remember: FOMO-based investing is gambling, not investing. One day this approach will devastate you.",
      ],
    },
    lessonsTemplates: [
      "🧠 EMOTIONAL INTELLIGENCE: FOMO makes you buy at the TOP when everyone is euphoric. By the time your friend is bragging, it's usually too late.",
      "💎 HIGH CONVICTION: If you can't explain WHY an investment makes sense, you're gambling. Real conviction comes from research, not from watching others.",
    ],
    generationalWisdom: [
      "Every generation has its 'can't lose' investment that eventually crashes: railroads, radio stocks, dot-coms, crypto. FOMO is timeless - so is the crash.",
      "The Rothschilds built a 200-year fortune by ignoring fads and focusing on fundamentals. Where are the 1999 dot-com millionaires?",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 3: GENERATIONAL OPPORTUNITY - Tests Long-term Thinking
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "generational_opportunity",
    title: "Generational Opportunity",
    themes: ["long-term", "patience", "compounding", "decades"],
    primaryPrinciple: "generationalThinking",
    secondaryPrinciple: "highConviction",
    emotionalChallenge: "IMPATIENCE - The desire for quick returns instead of long-term wealth building",
    convictionTest: "Can you invest for 20 years while others play for quick profits?",
    contextTemplates: [
      "🏛️ A once-in-a-generation opportunity: Quality {sector} companies are trading at {percentage}% below long-term value. But recovery could take {timeframe}. Can you think in decades?",
      "THE 20-YEAR PLAY: Warren Buffett is buying {sector} stocks heavily. He says 'Think 20 years.' But your friends want returns by next month. Whose timeline do you follow?",
      "GENERATIONAL WEALTH MOMENT: The crash has created prices not seen since {historicalEvent}. Family Offices are quietly accumulating. But this requires PATIENCE - possibly years of waiting.",
    ],
    situationTemplates: [
      "Your ${amount} could chase quick trades OR be planted like a seed for generational wealth. The market rewards patience, but patience is hard. What's your time horizon?",
      "Index funds are 'boring' - they just track the market. But $10,000 in the S&P 500 in 1980 became $1,000,000 by 2020. Can you think like a Family Office?",
      "Two paths: Day-trade for excitement, or buy-and-hold for wealth. 95% of day traders lose money. 95% of long-term investors make money. Which 95% do you want to be?",
    ],
    outcomeTemplates: {
      good: [
        "🏛️ GENERATIONAL THINKING REWARDED! Years of patience paid off. Your 'boring' investments compounded into serious wealth. This is how dynasties are built.",
        "⏰ TIME IS THE ULTIMATE EDGE! While others traded frantically, you let compound interest do the work. Your wealth grew beyond what active traders could imagine.",
      ],
      bad: [
        "Impatience cost you. You sold too early, missing the compounding magic. Remember: wealth-building is measured in decades, not days.",
        "The quick returns you chased evaporated. Meanwhile, patient investors are still compounding. There are no shortcuts to generational wealth.",
      ],
    },
    lessonsTemplates: [
      "🏛️ GENERATIONAL THINKING: The wealthiest families in history built their fortunes over DECADES, not months. Impatience is the enemy of wealth.",
      "⏰ COMPOUND MAGIC: $1 invested in the S&P 500 in 1930 became $7,500 by 2020. That's the power of patience. Can you wait 20 years to become wealthy?",
    ],
    generationalWisdom: [
      "The Walton family (Walmart) held their shares for 60+ years. They're now worth $250 billion. They never 'took profits' - they thought in generations.",
      "Your parents' retirement depends on 40 years of compounding, not 40 days of trading. Think like your future grandchildren's guardian.",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 4: CONVICTION TEST - Tests Research-Based Decision Making
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "conviction_test",
    title: "Conviction Test",
    themes: ["research", "understanding", "conviction", "contrarian"],
    primaryPrinciple: "highConviction",
    secondaryPrinciple: "learningThroughCrisis",
    emotionalChallenge: "DOUBT - When the entire world disagrees with your carefully researched position",
    convictionTest: "Can you trust your own research when everyone says you're wrong?",
    contextTemplates: [
      "💎 THE CONTRARIAN MOMENT: Your research says {sector} is undervalued, but every 'expert' disagrees. Headlines call it a 'dead sector.' Your conviction will be tested.",
      "STANDING ALONE: You've done deep research on a {technology} company. You believe in it. But it just dropped {percentage}% and your friends think you're crazy.",
      "THE CONVICTION TEST: Warren Buffett bought American Express when everyone said it was finished. He trusted his research. Now you face a similar moment.",
    ],
    situationTemplates: [
      "Your ${amount} is in a position your research supports, but the market says you're WRONG. Prices keep falling. Do you trust your understanding or follow the crowd?",
      "You've studied this investment for months. You understand the business. But 'smart people' on TV say it's a bad bet. Whose analysis do you trust?",
      "The investment that matches your research just got crushed. Paper losses are mounting. But nothing changed about WHY you invested. Do you have diamond hands?",
    ],
    outcomeTemplates: {
      good: [
        "💎 CONVICTION REWARDED! Your research was right. While others panicked at headlines, you trusted your understanding. This separates investors from speculators.",
        "🏆 CONTRARIAN VICTORY! The 'dead' sector roared back. Those who did real research profited. High conviction based on understanding wins.",
      ],
      bad: [
        "Your conviction wasn't backed by enough research. Belief without understanding is just gambling. Next time, dig deeper before committing.",
        "The market proved you wrong... this time. But real conviction accepts short-term losses for long-term thesis. Did you understand the business, or just hope?",
      ],
    },
    lessonsTemplates: [
      "💎 HIGH CONVICTION: If you truly understand WHY you own something, price drops don't scare you - they're opportunities.",
      "📚 RESEARCH WINS: Peter Lynch beat the market by understanding businesses better than anyone. Can you explain every investment in simple terms?",
    ],
    generationalWisdom: [
      "Warren Buffett held Coca-Cola through multiple crashes because he understood the business. Understanding creates unshakeable conviction.",
      "The best investors spend 80% of their time researching and 20% acting. Most people do the opposite. Which are you?",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 5: CRISIS OPPORTUNITY - Tests Crisis Navigation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "crisis_opportunity",
    title: "Crisis Opportunity",
    themes: ["crisis", "opportunity", "fear", "courage"],
    primaryPrinciple: "learningThroughCrisis",
    secondaryPrinciple: "emotionalIntelligence",
    emotionalChallenge: "FEAR - When buying feels like catching a falling knife and could hurt badly",
    convictionTest: "Can you buy when every instinct tells you to run away?",
    contextTemplates: [
      "🔥 CRISIS = OPPORTUNITY: The {event} has crashed markets {percentage}%. Blood is in the streets. But Family Offices are quietly BUYING. They know something most don't...",
      "THE FEAR/GREED CROSSROADS: Headlines scream disaster. Prices are at {timeframe} lows. Your gut says hide. But history says: THIS is when fortunes are made.",
      "GENERATIONAL BUYING OPPORTUNITY: The crisis has created prices not seen since {historicalEvent}. In 10 years, people will wish they'd bought today. But buying feels terrifying.",
    ],
    situationTemplates: [
      "Your ${amount} could buy incredible assets at crisis prices. But what if things get worse? Every crisis eventually ended profitably for buyers - but DURING the crisis, buying feels insane.",
      "Quality companies are on sale at {percentage}% discounts. Buffett is buying. But your hands shake at the thought. Can you overcome fear with logic?",
      "The world is ending (again). Or is this the opportunity of a decade? Every past 'end of the world' was actually a beginning for brave investors.",
    ],
    outcomeTemplates: {
      good: [
        "🔥 CRISIS MASTERY! You bought when others fled. The recovery made you look like a genius - but really, you just understood how crises work.",
        "🦁 COURAGE REWARDED! While others were paralyzed by fear, you acted on history's lessons. Crisis buyers become generationally wealthy.",
      ],
      bad: [
        "Fear won this round. You watched from the sidelines as others bought the opportunity. Remember this feeling for the next crisis - there will always be another.",
        "Timing was off - the crisis deepened before recovering. But those who bought consistently through it still won big. Courage needs patience as its partner.",
      ],
    },
    lessonsTemplates: [
      "🔥 CRISIS WISDOM: Every single market crash in history eventually recovered to new highs. EVERY. SINGLE. ONE. The only permanent losses belong to panic sellers.",
      "🦁 COURAGE MATH: Buying during 2008's darkest days returned 400%+ in 10 years. Fear cost investors those gains. Courage multiplied wealth.",
    ],
    generationalWisdom: [
      "The Rockefellers TRIPLED their fortune during the Great Depression while others lost everything. They bought when everyone sold.",
      "2020's COVID crash lasted 33 days. Those who panicked missed a 100% recovery. Those who bought doubled their money. Which were you?",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 6: GREED TRAP - Tests Emotional Control at Success
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "greed_trap",
    title: "Greed Trap",
    themes: ["greed", "leverage", "risk", "overconfidence"],
    primaryPrinciple: "emotionalIntelligence",
    secondaryPrinciple: "generationalThinking",
    emotionalChallenge: "GREED - The temptation to maximize gains at any cost when you're winning",
    convictionTest: "Can you accept 'good enough' returns instead of chasing maximum gains?",
    contextTemplates: [
      "💰 DOUBLE OR NOTHING: Your investments are UP {percentage}%! You could lock in gains, but leveraged options could 3x returns. Why settle for good when you could have great?",
      "THE GREED TEST: Everything is going right. Your portfolio is crushing it. Why not use leverage to maximize gains? What could go wrong? (Hint: everything)",
      "MORE MORE MORE! You've made {percentage}% gains. Impressive! But that voice says 'not enough.' Leverage could multiply your success. This is how most investors blow up...",
    ],
    situationTemplates: [
      "Your ${amount} has grown beautifully. You could protect it, or risk it for more. Family Offices NEVER risk what they have for what they don't need. But that's so... boring?",
      "Gains of {percentage}% aren't sexy enough for social media. Leverage could make you a legend. Or bankrupt you. Greed is whispering. What does wisdom say?",
      "You're winning. The question is: can you stop? Or does greed demand you push until you lose everything? This is the test that destroys most investors.",
    ],
    outcomeTemplates: {
      good: [
        "🧘 GREED CONQUERED! You took solid gains and protected them. While others pushed too hard and blew up, your wealth survived. This is emotional mastery.",
        "🏛️ GENERATIONAL WISDOM: You understood that wealth preservation matters more than wealth maximization. Dynasties aren't built by gambling.",
      ],
      bad: [
        "Greed won. The leverage that promised riches delivered ruin instead. Remember: the market has unlimited ways to humble the greedy.",
        "You pushed too hard and paid the price. Every successful investor eventually learns to manage greed - usually through painful lessons like this.",
      ],
    },
    lessonsTemplates: [
      "🧠 EMOTIONAL INTELLIGENCE: Greed has destroyed more wealth than any market crash. The ones who stay wealthy know when to say 'enough.'",
      "🏛️ GENERATIONAL WISDOM: Family Offices don't try to maximize returns - they try to survive. Survival compounds into serious wealth. Greed compounds into zero.",
    ],
    generationalWisdom: [
      "The families that are STILL wealthy after 100+ years all have one thing in common: they never risked what they had for what they didn't need.",
      "LTCM hedge fund had genius PhDs, Nobel Prize winners, and 40% annual returns. Greed and leverage destroyed it in months. Intelligence doesn't protect against greed.",
    ],
  },
];

// ============================================================================
// INVESTMENT OPTIONS POOL - Pre-built options for random selection
// ============================================================================

interface InvestmentOptionTemplate {
  name: string;
  descriptionTemplates: string[];
  riskLevel: "none" | "low" | "medium" | "high" | "extreme";
  expectedReturnRange: [number, number];
  actualReturnRange: [number, number]; // Can be negative
  insightTemplates: string[];
  assetClass: AssetClass;
  timeHorizon: TimeHorizon;
  foAllocationRange: string;
  liquidityRating: "high" | "medium" | "low";
}

const investmentOptionsPool: InvestmentOptionTemplate[] = [
  // Safe options
  {
    name: "Government Bonds",
    descriptionTemplates: [
      "Park your money in safe government bonds",
      "Ultra-safe treasury bonds backed by the government",
      "Play it safe with sovereign debt",
    ],
    riskLevel: "low",
    expectedReturnRange: [3, 6],
    actualReturnRange: [2, 12],
    insightTemplates: [
      "Government bonds are the safest investment! 🛡️ You won't get rich, but you won't lose your shirt either.",
      "When chaos rules, bonds shine. Safe and steady wins the race sometimes.",
    ],
    assetClass: "fixed_income",
    timeHorizon: "medium",
    foAllocationRange: "15-30%",
    liquidityRating: "high",
  },
  {
    name: "Cash / Money Market",
    descriptionTemplates: [
      "Stay in cash and wait for better opportunities",
      "Keep powder dry in money market funds",
      "Sit this one out in safe cash equivalents",
    ],
    riskLevel: "none",
    expectedReturnRange: [2, 4],
    actualReturnRange: [1, 6],
    insightTemplates: [
      "Cash is king during uncertainty! 👑 No gains, but no losses either. Plus, you're ready to pounce on opportunities.",
      "Sometimes the best move is no move. Cash lets you sleep at night.",
    ],
    assetClass: "cash",
    timeHorizon: "short",
    foAllocationRange: "5-15%",
    liquidityRating: "high",
  },
  // Medium risk options
  {
    name: "Index Fund (S&P 500)",
    descriptionTemplates: [
      "Invest in America's 500 biggest companies",
      "Broad market exposure through index investing",
      "Own a piece of the entire stock market",
    ],
    riskLevel: "medium",
    expectedReturnRange: [8, 12],
    actualReturnRange: [-30, 40],
    insightTemplates: [
      "Index funds give you instant diversification! 📈 You get the market average, which beats most stock pickers.",
      "Why try to beat the market when you can BE the market? Low cost, low stress.",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "25-40%",
    liquidityRating: "high",
  },
  {
    name: "Dividend Stocks",
    descriptionTemplates: [
      "Invest in companies that pay regular dividends",
      "Build income through dividend aristocrats",
      "Get paid while you wait with dividend stocks",
    ],
    riskLevel: "medium",
    expectedReturnRange: [6, 10],
    actualReturnRange: [-20, 25],
    insightTemplates: [
      "Dividends are real money in your pocket! 💵 Even if stock prices fall, you still get paid.",
      "Companies that pay dividends tend to be more stable. Plus, reinvested dividends compound over time!",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "15-25%",
    liquidityRating: "high",
  },
  {
    name: "Gold / Precious Metals",
    descriptionTemplates: [
      "Stack gold as a store of value",
      "Diversify with precious metals",
      "Hedge with gold and silver",
    ],
    riskLevel: "medium",
    expectedReturnRange: [4, 10],
    actualReturnRange: [-15, 35],
    insightTemplates: [
      "Gold has been money for 5,000 years! 🥇 When everything else fails, gold tends to shine.",
      "The ultimate hedge against chaos. Central banks can't print gold!",
    ],
    assetClass: "commodities",
    timeHorizon: "long",
    foAllocationRange: "5-10%",
    liquidityRating: "high",
  },
  {
    name: "Real Estate Investment Trust (REIT)",
    descriptionTemplates: [
      "Own real estate without buying property",
      "Invest in property through REITs",
      "Get real estate exposure the easy way",
    ],
    riskLevel: "medium",
    expectedReturnRange: [6, 12],
    actualReturnRange: [-35, 30],
    insightTemplates: [
      "REITs let you own real estate without being a landlord! 🏢 Plus, they must pay 90% of income as dividends.",
      "Property prices rise with inflation. REITs give you that exposure with liquidity stocks provide.",
    ],
    assetClass: "alternatives",
    timeHorizon: "long",
    foAllocationRange: "5-15%",
    liquidityRating: "medium",
  },
  // High risk options
  {
    name: "Growth Tech Stocks",
    descriptionTemplates: [
      "Bet on high-growth technology companies",
      "Chase returns with tech stocks",
      "Go all-in on the tech sector",
    ],
    riskLevel: "high",
    expectedReturnRange: [15, 30],
    actualReturnRange: [-50, 80],
    insightTemplates: [
      "Tech stocks can go to the moon! 🚀 But they can also crash hard. High risk, high reward.",
      "The future is tech! But remember: not every tech company is a winner.",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "10-20%",
    liquidityRating: "high",
  },
  {
    name: "Emerging Markets",
    descriptionTemplates: [
      "Invest in rapidly developing economies",
      "Bet on emerging market growth",
      "Go global with emerging market exposure",
    ],
    riskLevel: "high",
    expectedReturnRange: [10, 20],
    actualReturnRange: [-45, 60],
    insightTemplates: [
      "Emerging markets = emerging opportunities! 🌍 Higher risk, but populations are growing and economies expanding.",
      "The next big thing might not be in America. Diversify globally!",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "5-15%",
    liquidityRating: "medium",
  },
  {
    name: "Small Cap Stocks",
    descriptionTemplates: [
      "Hunt for the next big company in small caps",
      "Invest in smaller, faster-growing companies",
      "Go small cap for bigger potential returns",
    ],
    riskLevel: "high",
    expectedReturnRange: [10, 18],
    actualReturnRange: [-40, 50],
    insightTemplates: [
      "Small caps can become big caps! 🌱 Amazon and Apple were once small companies too.",
      "More volatile than large caps, but historically higher returns over long periods.",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "5-15%",
    liquidityRating: "medium",
  },
  // Extreme risk options
  {
    name: "Cryptocurrency",
    descriptionTemplates: [
      "Dive into the crypto market",
      "Bet on digital currencies",
      "YOLO into crypto",
    ],
    riskLevel: "extreme",
    expectedReturnRange: [20, 100],
    actualReturnRange: [-80, 200],
    insightTemplates: [
      "Crypto is the wild west of investing! 🤠 Massive gains possible, but also massive losses. Only invest what you can afford to lose!",
      "The technology is revolutionary, but prices are pure speculation. Handle with extreme care.",
    ],
    assetClass: "alternatives",
    timeHorizon: "long",
    foAllocationRange: "0-5%",
    liquidityRating: "high",
  },
  {
    name: "Leveraged ETFs",
    descriptionTemplates: [
      "Amplify returns with 2x or 3x leverage",
      "Go aggressive with leveraged products",
      "Supercharge your bets with leverage",
    ],
    riskLevel: "extreme",
    expectedReturnRange: [30, 60],
    actualReturnRange: [-90, 150],
    insightTemplates: [
      "Leverage = amplified returns AND amplified losses! ⚡ These are trading tools, not investments.",
      "Warning: Leveraged ETFs decay over time. Great for short-term trades, terrible for long-term holds.",
    ],
    assetClass: "equities",
    timeHorizon: "short",
    foAllocationRange: "0-2%",
    liquidityRating: "high",
  },
  {
    name: "Speculative Growth Stocks",
    descriptionTemplates: [
      "Bet on unprofitable companies with big dreams",
      "Chase the hottest momentum stocks",
      "YOLO into speculative growth plays",
    ],
    riskLevel: "extreme",
    expectedReturnRange: [25, 80],
    actualReturnRange: [-80, 150],
    insightTemplates: [
      "Some of these could be the next Tesla... most won't! 🎰 High risk, high potential reward.",
      "These companies are burning cash hoping to become profitable. Many won't make it.",
    ],
    assetClass: "equities",
    timeHorizon: "long",
    foAllocationRange: "0-5%",
    liquidityRating: "medium",
  },
];

// ============================================================================
// COACH ADVICE TEMPLATES
// ============================================================================

const coachAdviceTemplates = {
  "steady-sam": [
    "This looks risky! I'd stick with bonds and maybe some gold 🛡️",
    "Slow and steady wins the race. Let's not get carried away here!",
    "Remember: protecting your money is priority one. Play it safe!",
    "When in doubt, stay out. Cash is never a bad option.",
  ],
  "growth-guru": [
    "Balance is key! Mix some growth with some safety ⚖️",
    "Diversification protects you from surprises. Spread your bets!",
    "I see opportunity here, but let's not go crazy. Measured approach!",
    "Long-term thinking beats short-term gambling every time.",
  ],
  "adventure-alex": [
    "Fortune favors the bold! Time to make moves 🚀",
    "Everyone else is scared = opportunity for us!",
    "High risk can mean high reward. Let's go for it!",
    "The best time to invest is when others are panicking!",
  ],
  "yield-yoda": [
    "Focus on income and real assets. They weather storms well 🧘",
    "Dividends and real assets protect purchasing power.",
    "Patience and income. The path to wealth is calm.",
    "Yield is your friend in uncertain times.",
  ],
};

// ============================================================================
// VARIATION DATA - Names, numbers, and details for templates
// ============================================================================

const variations = {
  percentages: [5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40],
  timeframes: ["a week", "two weeks", "a month", "three months", "six months", "a year", "18 months"],
  amounts: [10000, 25000, 50000, 100000],
  sectors: [
    "Technology", "Healthcare", "Energy", "Financial", "Consumer", 
    "Industrial", "Real Estate", "Utilities", "Communications", "Materials"
  ],
  technologies: [
    "AI", "Quantum Computing", "Blockchain", "Clean Energy", "Biotech",
    "Space Tech", "Autonomous Vehicles", "VR/AR", "Robotics", "Cybersecurity"
  ],
  events: [
    "A major trade war eruption",
    "Unexpected election results",
    "A regional military conflict",
    "A major bank failure",
    "A pandemic outbreak",
    "A natural disaster",
    "A cyber attack on infrastructure",
    "An energy crisis",
    "A currency crisis",
    "A supply chain breakdown"
  ],
  historicalEvents: [
    "1990 Japan", "1997 Asian Crisis", "2000 Dot-com", "2008 Financial Crisis", 
    "2020 COVID crash", "1987 Black Monday", "1929 Great Depression"
  ],
  rateActions: ["raised", "cut", "held steady on"],
  directions: ["plunged", "surged", "stayed flat"],
  reactions: ["booming", "crashing", "stabilizing"],
};

// ============================================================================
// RANDOM SCENARIO GENERATOR
// ============================================================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function _pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

function generateInvestmentOptions(): InvestmentOption[] {
  // Pick 4 options with varying risk levels
  const safeOptions = investmentOptionsPool.filter(o => o.riskLevel === "none" || o.riskLevel === "low");
  const mediumOptions = investmentOptionsPool.filter(o => o.riskLevel === "medium");
  const riskyOptions = investmentOptionsPool.filter(o => o.riskLevel === "high" || o.riskLevel === "extreme");
  
  const selected: InvestmentOptionTemplate[] = [
    pickRandom(safeOptions),
    pickRandom(mediumOptions),
    pickRandom(mediumOptions.filter(o => o.name !== selected[0]?.name) || mediumOptions),
    pickRandom(riskyOptions),
  ];
  
  return selected.map((template, index) => {
    const expectedReturn = template.expectedReturnRange[0] + 
      Math.random() * (template.expectedReturnRange[1] - template.expectedReturnRange[0]);
    const actualReturn = template.actualReturnRange[0] + 
      Math.random() * (template.actualReturnRange[1] - template.actualReturnRange[0]);
    
    const riskProfile: RiskReturnProfile = {
      riskLevel: template.riskLevel,
      historicalVolatility: `${Math.round(expectedReturn * 0.5)}-${Math.round(expectedReturn * 1.5)}%`,
      correlationWithStocks: template.assetClass === "fixed_income" || template.assetClass === "commodities" 
        ? "negative" 
        : template.assetClass === "cash" 
          ? "low" 
          : "high",
    };
    
    return {
      id: `option-${index}`,
      name: template.name,
      description: pickRandom(template.descriptionTemplates),
      risk: template.riskLevel.charAt(0).toUpperCase() + template.riskLevel.slice(1),
      expectedReturn: `${Math.round(expectedReturn)}-${Math.round(expectedReturn * 1.3)}%`,
      actualReturn: Math.round(actualReturn),
      investmentInsight: pickRandom(template.insightTemplates),
      assetClass: template.assetClass,
      timeHorizon: template.timeHorizon,
      riskReturnProfile: riskProfile,
      foAllocationRange: template.foAllocationRange,
      liquidityRating: template.liquidityRating,
    };
  });
}

function generateCoachAdvice(): Record<string, string> {
  return {
    "steady-sam": pickRandom(coachAdviceTemplates["steady-sam"]),
    "growth-guru": pickRandom(coachAdviceTemplates["growth-guru"]),
    "adventure-alex": pickRandom(coachAdviceTemplates["adventure-alex"]),
    "yield-yoda": pickRandom(coachAdviceTemplates["yield-yoda"]),
  };
}

export function generateRandomScenario(): { event: FinancialEvent; missionData: MissionData } {
  const template = pickRandom(scenarioTemplates);
  const isGoodOutcome = Math.random() > 0.4; // 60% chance of good outcome
  
  // Get the principle data for richer educational content (with safe defaults)
  const primaryPrincipleKey = template.primaryPrinciple ?? "emotionalIntelligence";
  const secondaryPrincipleKey = template.secondaryPrinciple ?? "learningThroughCrisis";
  const primaryPrinciple = corePrinciples[primaryPrincipleKey];
  const secondaryPrinciple = corePrinciples[secondaryPrincipleKey];
  
  // Generate variables for template filling
  const vars = {
    percentage: pickRandom(variations.percentages),
    timeframe: pickRandom(variations.timeframes),
    amount: pickRandom(variations.amounts).toLocaleString(),
    sector: pickRandom(variations.sectors),
    oldSector: pickRandom(variations.sectors),
    technology: pickRandom(variations.technologies),
    event: pickRandom(variations.events),
    historicalEvent: pickRandom(variations.historicalEvents),
    action: pickRandom(variations.rateActions),
    direction: pickRandom(variations.directions),
    reaction: pickRandom(variations.reactions),
  };
  
  // Generate unique year for this scenario (random year from current time period)
  const currentYear = new Date().getFullYear();
  const scenarioYear = currentYear + Math.floor(Math.random() * 3); // Current to 2 years ahead
  
  // Build a description that highlights the educational focus (with safe defaults)
  const principleEmoji = primaryPrinciple.emoji;
  const emotionalChallenge = template.emotionalChallenge ?? "Investment Challenge";
  const challengePart = emotionalChallenge.includes(' - ') ? emotionalChallenge.split(' - ')[0] : emotionalChallenge;
  const scenarioDescription = `${principleEmoji} ${challengePart}`;
  
  const event: FinancialEvent = {
    year: scenarioYear,
    title: `${template.title} #${Math.floor(Math.random() * 900) + 100}`, // Add unique ID
    description: scenarioDescription,
    impact: isGoodOutcome ? "positive" : "negative",
    difficulty: pickRandom(["intermediate", "advanced", "expert"]) as "intermediate" | "advanced" | "expert",
    unlocked: true,
    completed: false,
    reward: 150 + Math.floor(Math.random() * 200), // 150-350 XP
    unlockRequirements: [],
    image: "/images/inflation.png", // Default image
    imageAlt: "scenario",
  };
  
  const options = generateInvestmentOptions();
  const outcomeText = fillTemplate(
    pickRandom(isGoodOutcome ? template.outcomeTemplates.good : template.outcomeTemplates.bad),
    vars
  );
  
  // Build principle-based educational messages
  const wealthLesson = `🎓 WEALTH LESSON: ${pickRandom(template.lessonsTemplates)}`;
  
  // Use generational wisdom from the template (with safe default)
  const wisdomList = template.generationalWisdom ?? ["Diversification and patience are the cornerstones of generational wealth."];
  const foWisdom = `🏛️ FAMILY OFFICE WISDOM: ${pickRandom(wisdomList)}`;
  
  // Build conviction test as opportunity (with safe default)
  const convictionTest = template.convictionTest ?? "Can you make decisions based on research rather than emotion?";
  const historicalOpportunity = `💎 THE TEST: ${convictionTest}\n\n${secondaryPrinciple.emoji} ${secondaryPrinciple.name}: ${pickRandom(secondaryPrinciple.keyLessons)}`;
  
  // Build hope message incorporating the principles
  const hopeMessage = `✨ MASTERING ${primaryPrinciple.name.toUpperCase()}: ${primaryPrinciple.description}\n\n🔑 Key Insight: ${pickRandom(primaryPrinciple.keyLessons)}\n\n💪 Remember: Every scenario you complete builds your emotional intelligence and investment judgment. This practice will serve you for life!`;
  
  const missionData: MissionData = {
    context: fillTemplate(pickRandom(template.contextTemplates), vars),
    situation: fillTemplate(pickRandom(template.situationTemplates), vars),
    options,
    coachAdvice: generateCoachAdvice(),
    outcome: outcomeText,
    wealthLesson,
    foWisdom,
    historicalOpportunity,
    hopeMessage,
  };
  
  return { event, missionData };
}

// Generate multiple scenarios at once
export function generateRandomScenarios(count: number): { event: FinancialEvent; missionData: MissionData }[] {
  const scenarios: { event: FinancialEvent; missionData: MissionData }[] = [];
  const usedTitles = new Set<string>();
  
  while (scenarios.length < count) {
    const scenario = generateRandomScenario();
    // Ensure unique titles
    if (!usedTitles.has(scenario.event.title)) {
      usedTitles.add(scenario.event.title);
      scenarios.push(scenario);
    }
  }
  
  return scenarios;
}

// Export scenario categories for UI with principle information
export const scenarioCategories = scenarioTemplates.map(t => ({
  id: t.id,
  title: t.title,
  themes: t.themes,
  primaryPrinciple: t.primaryPrinciple,
  secondaryPrinciple: t.secondaryPrinciple,
  emotionalChallenge: t.emotionalChallenge,
  convictionTest: t.convictionTest,
}));

// Export for educational UI
export const principlesList = Object.entries(corePrinciples).map(([key, value]) => ({
  id: key,
  ...value,
}));

