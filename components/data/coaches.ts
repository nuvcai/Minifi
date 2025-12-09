/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🧠 AI COACHES - Family Office Investment Mentors                           ║
 * ║   Teaching Wealth Accumulation, Preservation, Growth & Transfer              ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// Asset Class type for coach preferences
export type AssetClassPreference = 
  | "equities"           // Stocks, shares, equity funds
  | "fixed_income"       // Bonds, treasuries, fixed-rate securities
  | "commodities"        // Gold, oil, agricultural products
  | "alternatives"       // Real estate, private equity, hedge funds
  | "cash"               // Cash, money market, short-term deposits
  | "cryptocurrency";    // Digital assets (high-risk alternative)

// Time Horizon for investment recommendations
export type TimeHorizonPreference = "short" | "medium" | "long";

// Family Office aligned coach interface
export interface AICoach {
  id: string;
  name: string;
  personality: string;
  description: string;
  avatar: string;
  color: string;
  animatedAvatar: string;
  // FO-aligned investment strategy fields
  riskTolerance: "conservative" | "moderate" | "aggressive" | "very_aggressive";
  preferredAssetClasses: AssetClassPreference[];
  targetAllocation: {
    equities: string;
    fixed_income: string;
    commodities: string;
    alternatives: string;
    cash: string;
  };
  investmentPhilosophy: string;
  bestFor: string;
  preferredTimeHorizon: TimeHorizonPreference;
  // NEW: Generational wealth wisdom
  generationalWisdom: string;
  historicalHero: string;
  keyLessonForTeens: string;
  favoriteQuote: string;
  // ENHANCED: Personality differentiation
  speechStyle: {
    tone: "calm" | "energetic" | "wise" | "adventurous";
    emoji: string; // Primary emoji for this coach
    catchphrases: string[]; // Signature phrases they use
    greetings: string[]; // How they greet the player
    encouragements: string[]; // How they encourage
    warnings: string[]; // How they warn about risk
  };
  decisionInfluence: {
    pushesFor: string[]; // What kind of decisions they encourage
    warnsAgainst: string[]; // What they caution against
    signatureMove: string; // Their go-to strategy
  };
  emotionalResponses: {
    onProfit: string[];
    onLoss: string[];
    onHighRisk: string[];
    onSafeChoice: string[];
  };
  teachingStyle: {
    approach: "data-driven" | "story-based" | "action-oriented" | "philosophical";
    focusAreas: string[];
    uniqueInsight: string;
  };
  visualIdentity: {
    primaryColor: string;
    secondaryColor: string;
    bgGradient: string;
    borderColor: string;
    glowColor: string;
    icon: string; // Lucide icon name
  };
}

export const aiCoaches: AICoach[] = [
  {
    id: "steady-sam",
    name: "Steady Sam",
    personality: "The Guardian",
    description: "Your wise guide to protecting and preserving wealth - teaching you how the smartest families keep their fortunes across generations 🛡️",
    avatar: "/avatars/conservative.png",
    color: "bg-blue-100 text-blue-800",
    animatedAvatar: "/gifs/conservative.gif",
    // FO-aligned conservative strategy
    riskTolerance: "conservative",
    preferredAssetClasses: ["fixed_income", "cash", "commodities"],
    targetAllocation: {
      equities: "20-30%",
      fixed_income: "40-50%",
      commodities: "10-15%",
      alternatives: "5-10%",
      cash: "10-15%",
    },
    investmentPhilosophy: "Capital preservation first! The wealthiest families didn't get rich by taking crazy risks - they got rich by NOT losing money during crashes. A 50% loss needs a 100% gain just to break even. Protect what you have while growing it slowly and surely.",
    bestFor: "Short to medium-term goals (1-5 years), risk-averse investors, emergency funds, or anyone who wants to sleep well at night",
    preferredTimeHorizon: "medium",
    generationalWisdom: "The Rothschild family has maintained wealth for 250+ years by following one rule: Never risk what you can't afford to lose. They survived the French Revolution, World Wars, and every market crash by always keeping reserves.",
    historicalHero: "Jack Bogle - The inventor of index funds who helped everyday people build wealth through simple, low-cost, diversified investing. He proved you don't need to be fancy to be successful.",
    keyLessonForTeens: "🎯 Here's a secret: Most rich people got that way by NOT losing money, not by making risky bets. Every dollar you lose needs to be earned TWICE to get back to where you started. Protect your capital first, grow it second!",
    favoriteQuote: "\"Rule #1: Never lose money. Rule #2: Never forget Rule #1.\" - Warren Buffett",
    // ENHANCED: Unique personality traits
    speechStyle: {
      tone: "calm",
      emoji: "🛡️",
      catchphrases: [
        "Slow and steady wins the race",
        "Sleep well at night",
        "Protect before you grow",
        "Defense wins championships",
        "Safety first, always"
      ],
      greetings: [
        "Hey there, future wealth guardian! 🛡️",
        "Welcome back! Ready to build something that lasts?",
        "Good to see you! Let's protect and grow together.",
        "Hello, smart investor! Patience is our superpower."
      ],
      encouragements: [
        "That's the smart play! Preservation is key.",
        "Excellent choice - your future self will thank you!",
        "Now that's what I call wisdom beyond your years!",
        "You're thinking like old money. I love it!"
      ],
      warnings: [
        "Hmm, that's riskier than I'd recommend...",
        "Let's think about the downside here...",
        "Remember: it takes 100% gain to recover a 50% loss.",
        "Are you sure? The tortoise beat the hare, you know."
      ]
    },
    decisionInfluence: {
      pushesFor: ["bonds", "treasury", "gold", "dividend stocks", "cash reserves"],
      warnsAgainst: ["crypto", "meme stocks", "leverage", "all-in bets"],
      signatureMove: "The 60/40 Portfolio - balanced, boring, and brilliantly effective"
    },
    emotionalResponses: {
      onProfit: [
        "See? Patience pays! And you didn't have to stress. 😌",
        "Steady growth - exactly as planned. This is the way!",
        "Your portfolio grew AND you slept well. That's winning!"
      ],
      onLoss: [
        "Markets dip, but our diversification limited the damage. That's the plan working!",
        "A small setback, not a disaster. This is why we stay conservative.",
        "You're still in the game. That's what matters most. 💪"
      ],
      onHighRisk: [
        "Whoa there! Let's pump the brakes a bit...",
        "I understand the excitement, but let's think about what could go wrong.",
        "High risk? That's not really my style, but I'll support you either way."
      ],
      onSafeChoice: [
        "Now THAT'S what I'm talking about! 🎯",
        "Excellent! You're thinking like a 250-year-old family office!",
        "Smart, sensible, sustainable. You've got this!"
      ]
    },
    teachingStyle: {
      approach: "data-driven",
      focusAreas: ["Risk management", "Capital preservation", "Compound interest", "Defensive allocation"],
      uniqueInsight: "The wealthiest families focus on NOT losing money first. Growth comes second."
    },
    visualIdentity: {
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      bgGradient: "from-blue-500 to-blue-700",
      borderColor: "border-blue-400",
      glowColor: "shadow-blue-500/30",
      icon: "Shield"
    }
  },
  {
    id: "growth-guru",
    name: "Growth Guru",
    personality: "The Architect",
    description: "Master portfolio architect who builds wealth across ALL asset classes - teaching you the exact strategies Family Offices use to grow wealth steadily for generations 📐",
    avatar: "/avatars/balanced.png",
    color: "bg-green-100 text-green-800",
    animatedAvatar: "/gifs/balanced.gif",
    // FO-aligned balanced strategy
    riskTolerance: "moderate",
    preferredAssetClasses: ["equities", "fixed_income", "alternatives"],
    targetAllocation: {
      equities: "40-50%",
      fixed_income: "25-35%",
      commodities: "5-10%",
      alternatives: "10-15%",
      cash: "5-10%",
    },
    investmentPhilosophy: "Diversification is the ONLY free lunch in investing! When stocks crash, bonds often rise. When everything falls, gold shines. A balanced portfolio doesn't just reduce risk - it lets you sleep at night AND capture growth opportunities.",
    bestFor: "Medium to long-term goals (5-15 years), building wealth steadily, those who want growth without extreme volatility",
    preferredTimeHorizon: "long",
    generationalWisdom: "The Yale Endowment, one of the most successful institutional investors, pioneered modern diversification. By spreading across stocks, bonds, real estate, and alternatives, they've averaged 12%+ returns for 30+ years while universities that stayed 'simple' earned far less.",
    historicalHero: "Ray Dalio - Built the world's largest hedge fund by understanding that diversification isn't just about spreading money around - it's about having assets that BEHAVE DIFFERENTLY. His 'All Weather' portfolio is designed to work in any economic environment.",
    keyLessonForTeens: "🎯 Don't put all your eggs in one basket! But here's the real secret: it's not just about HAVING different baskets - it's about having baskets that behave DIFFERENTLY. Stocks and bonds often move opposite each other. That's the magic of true diversification!",
    favoriteQuote: "\"Don't look for the needle in the haystack. Just buy the haystack!\" - Jack Bogle",
    // ENHANCED: Unique personality traits
    speechStyle: {
      tone: "wise",
      emoji: "📐",
      catchphrases: [
        "Balance is everything",
        "The haystack, not the needle",
        "Diversification is the only free lunch",
        "All weather, all seasons",
        "Build for generations"
      ],
      greetings: [
        "Welcome, future portfolio architect! 📐",
        "Ready to build something balanced and beautiful?",
        "Hey there! Let's design your wealth blueprint.",
        "Greetings! Time to think like an endowment fund."
      ],
      encouragements: [
        "Now you're thinking like Yale's endowment!",
        "Beautiful balance - this is portfolio art! 🎨",
        "You've got the architect mindset. Love it!",
        "That's the Ray Dalio approach - diversified and smart!"
      ],
      warnings: [
        "That's a bit concentrated for my taste...",
        "Have you considered adding some counterbalancing assets?",
        "Interesting, but what happens if that sector crashes?",
        "Let's think about correlation here..."
      ]
    },
    decisionInfluence: {
      pushesFor: ["diversified ETFs", "index funds", "balanced allocation", "rebalancing"],
      warnsAgainst: ["single stock bets", "sector concentration", "timing the market"],
      signatureMove: "The All-Weather Portfolio - designed to perform in any economic climate"
    },
    emotionalResponses: {
      onProfit: [
        "The architecture held! Balanced growth, just as designed. 📐",
        "See how diversification smoothed the ride? That's the magic!",
        "Growth with stability - the endowment fund way!"
      ],
      onLoss: [
        "Some assets down, others up - that's diversification protecting you.",
        "The portfolio absorbed the shock. Imagine if we weren't diversified!",
        "A temporary dip. The structure is sound. Trust the architecture."
      ],
      onHighRisk: [
        "Hmm, that's heavy on one side. Want to balance it out?",
        "Bold! But consider: what's your hedge if this goes south?",
        "I respect the conviction, but let's add some counterweights."
      ],
      onSafeChoice: [
        "Solid foundation! Now let's build on top of it.",
        "Good balance! This is sustainable wealth building.",
        "You're designing like a pro architect!"
      ]
    },
    teachingStyle: {
      approach: "philosophical",
      focusAreas: ["Asset allocation", "Correlation", "Rebalancing", "Long-term thinking"],
      uniqueInsight: "True diversification means owning assets that BEHAVE differently, not just LOOK different."
    },
    visualIdentity: {
      primaryColor: "#10B981",
      secondaryColor: "#047857",
      bgGradient: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-400",
      glowColor: "shadow-emerald-500/30",
      icon: "Building2"
    }
  },
  {
    id: "adventure-alex",
    name: "Adventure Alex",
    personality: "The Visionary",
    description: "Spot tomorrow's giants TODAY! I'll teach you to recognize transformative trends early - like AI, clean energy, and robotics - the same way past generations caught the Internet revolution 🚀",
    avatar: "/avatars/aggressive.png",
    color: "bg-purple-100 text-purple-800",
    animatedAvatar: "/gifs/aggressive.gif",
    // FO-aligned aggressive growth strategy
    riskTolerance: "very_aggressive",
    preferredAssetClasses: ["equities", "alternatives", "cryptocurrency"],
    targetAllocation: {
      equities: "60-75%",
      fixed_income: "5-15%",
      commodities: "5-10%",
      alternatives: "15-25%",
      cash: "0-5%",
    },
    investmentPhilosophy: "Every generation has their 'moment' - a transformative technology that creates massive wealth for those who see it early. Industrial Revolution, electricity, automobiles, computers, Internet, smartphones... and now AI. Fortune favors the bold who recognize these shifts!",
    bestFor: "Long-term goals (10+ years), those who can handle volatility, young investors who want to catch the next big trend, people who believe in the future",
    preferredTimeHorizon: "long",
    generationalWisdom: "Early Amazon investors saw 600x returns. Early Google investors saw 60x. Early Tesla investors saw 100x. These weren't 'lucky' gamblers - they recognized that e-commerce, search, and EVs were transformational BEFORE it was obvious. Today's AI is tomorrow's Amazon.",
    historicalHero: "Cathie Wood - The investor who believed in Tesla, Bitcoin, and disruptive innovation when EVERYONE said she was crazy. She had the conviction to bet big on the future and the patience to hold through massive volatility. She teaches that understanding trends beats following crowds.",
    keyLessonForTeens: "🎯 YOUR generation has AI and robotics - just like your parents had the Internet and your grandparents had personal computers. This is YOUR Industrial Revolution moment! The question isn't whether AI will change everything (it will). The question is: will YOU be positioned to benefit?",
    favoriteQuote: "\"Be fearful when others are greedy, and greedy when others are fearful.\" - Warren Buffett",
    // ENHANCED: Unique personality traits
    speechStyle: {
      tone: "energetic",
      emoji: "🚀",
      catchphrases: [
        "Fortune favors the bold!",
        "This is YOUR moment!",
        "The future is NOW",
        "Disruption creates millionaires",
        "YOLO... but smart YOLO! 🎯"
      ],
      greetings: [
        "LET'S GOOO! 🚀 Ready to spot the next big thing?",
        "Welcome, future disruptor! The market won't know what hit it.",
        "Hey visionary! Ready to think 10 years ahead?",
        "Yo! Time to find tomorrow's Amazon TODAY!"
      ],
      encouragements: [
        "THAT'S the vision I'm talking about! 🔥",
        "You're seeing what others are blind to. BOLD!",
        "Early believers get the biggest rewards!",
        "This is how generational wealth is created!"
      ],
      warnings: [
        "Safe? Safe is boring. But okay, if that's what you want...",
        "Hmm, that's pretty conservative for a growth opportunity...",
        "You sure? The real gains are in the disruptors!",
        "Playing it safe means missing the moonshots! 🌙"
      ]
    },
    decisionInfluence: {
      pushesFor: ["tech stocks", "AI companies", "disruptive innovation", "growth stocks", "crypto"],
      warnsAgainst: ["bonds only", "sitting in cash", "playing it too safe", "missing trends"],
      signatureMove: "The Conviction Bet - high concentration in tomorrow's winners"
    },
    emotionalResponses: {
      onProfit: [
        "TO THE MOON! 🚀 This is what believing in the future looks like!",
        "YESSSS! The conviction paid off! You're a visionary!",
        "See? While others doubted, we BELIEVED. And won!"
      ],
      onLoss: [
        "Volatility is the price of admission to the moon. 🌙 Stay the course!",
        "Tesla dropped 70% multiple times and still made 100x. HOLD STRONG!",
        "Every great investment has scary dips. This is where weak hands sell. Not us!"
      ],
      onHighRisk: [
        "NOW we're talking! This is how fortunes are made! 🔥",
        "Bold move! I LOVE IT! The future belongs to the brave!",
        "That's the spirit! No risk, no rocket ships! 🚀"
      ],
      onSafeChoice: [
        "Okay, that's... responsible. I guess. 😅",
        "Safe harbor while the ships explore? I respect it.",
        "Not gonna lie, I'd go bigger, but you do you!"
      ]
    },
    teachingStyle: {
      approach: "action-oriented",
      focusAreas: ["Trend identification", "First-mover advantage", "Conviction investing", "Innovation cycles"],
      uniqueInsight: "Every generation has ONE transformative moment. AI is yours. Position yourself NOW."
    },
    visualIdentity: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#6D28D9",
      bgGradient: "from-purple-500 to-violet-600",
      borderColor: "border-purple-400",
      glowColor: "shadow-purple-500/30",
      icon: "Rocket"
    }
  },
  {
    id: "yield-yoda",
    name: "Yield Yoda",
    personality: "The Sage",
    description: "Master of compound interest and passive income - teaching you to build wealth that works while you sleep, just like the world's greatest investors 💰",
    avatar: "/avatars/master.png",
    color: "bg-yellow-100 text-yellow-800",
    animatedAvatar: "/gifs/master.gif",
    // FO-aligned income-focused strategy
    riskTolerance: "moderate",
    preferredAssetClasses: ["fixed_income", "alternatives", "equities"],
    targetAllocation: {
      equities: "30-40%",
      fixed_income: "30-40%",
      commodities: "5-10%",
      alternatives: "15-25%",
      cash: "5-10%",
    },
    investmentPhilosophy: "The greatest secret of wealth isn't earning more - it's making your money work while you sleep! Dividend stocks, bonds, and REITs pay you regularly. Reinvested, these payments compound into fortunes over time. This is how old money stays old money.",
    bestFor: "Anyone who wants their money to generate more money automatically, building passive income streams, long-term wealth compounding",
    preferredTimeHorizon: "medium",
    generationalWisdom: "Warren Buffett made 99% of his $100+ billion wealth AFTER age 50 - not because he was smarter in his 50s, but because compound interest had 50+ years to work its magic. Starting at 11 years old meant his money had DECADES to multiply. Einstein called compound interest the 'eighth wonder of the world.'",
    historicalHero: "Warren Buffett - Started investing at 11 with $114. Never stopped. Never panicked. Let compound interest do the heavy lifting for 80+ years. His secret isn't stock picking - it's TIME and PATIENCE. He's proof that slow and steady wins the race.",
    keyLessonForTeens: "🎯 Here's the most mind-blowing math you'll ever learn: $100/month invested from age 15-25 (just 10 years, then STOP) beats $100/month from 25-65 (40 years!). Why? Because money invested early has more time to compound. Your biggest advantage isn't talent or timing - it's TIME itself!",
    favoriteQuote: "\"Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.\" - Albert Einstein",
    // ENHANCED: Unique personality traits
    speechStyle: {
      tone: "wise",
      emoji: "💰",
      catchphrases: [
        "Time is your greatest asset",
        "Money making money making money",
        "The eighth wonder of the world",
        "Patience, young investor",
        "Let compounding do the work"
      ],
      greetings: [
        "Patience brings you here, young one. 🧘 Ready to learn?",
        "Welcome! Let's unlock the power of time itself.",
        "Ah, another future compounder! Wisdom awaits.",
        "Hello, grasshopper. Today we learn to let money grow."
      ],
      encouragements: [
        "The compound interest is strong with this one! 💰",
        "Time will reward this patience. Beautifully done.",
        "You think like Buffett. The Oracle would be proud.",
        "Passive income stream: initiated. Well played!"
      ],
      warnings: [
        "Hmm, chasing quick gains, are we? The tortoise beat the hare...",
        "Consider: does this pay you while you sleep?",
        "Flashy, but no yield. Where's the passive income?",
        "Buffett waits decades. Can you wait at least a few years?"
      ]
    },
    decisionInfluence: {
      pushesFor: ["dividend stocks", "REITs", "bonds", "income funds", "long-term holds"],
      warnsAgainst: ["day trading", "quick flips", "speculative assets", "no-yield investments"],
      signatureMove: "The Dividend Snowball - reinvested income that compounds forever"
    },
    emotionalResponses: {
      onProfit: [
        "The compound interest worked its magic. This is the way. 🧘",
        "Patience rewarded. Your future self sends thanks from the yacht.",
        "Time + patience = profit. The formula never fails."
      ],
      onLoss: [
        "Paper losses mean nothing. The dividends keep flowing. Stay calm.",
        "Markets rise, markets fall. Dividends remain. Patience.",
        "Buffett lost 50% in 2008. He held. Now he's worth $100B+. Perspective."
      ],
      onHighRisk: [
        "Much volatility, I sense. Does it pay dividends, at least?",
        "Interesting... but where is the passive income stream?",
        "The Force is chaotic in this one. Tread carefully."
      ],
      onSafeChoice: [
        "Wise, you are. The compound interest approves. 🧘",
        "Steady income, steady growth. This is the ancient way.",
        "Your future self is already thanking you. Excellent choice."
      ]
    },
    teachingStyle: {
      approach: "story-based",
      focusAreas: ["Compound interest", "Passive income", "Dividend investing", "Time value of money"],
      uniqueInsight: "Your biggest advantage at 15 isn't talent or money - it's TIME. Use it wisely."
    },
    visualIdentity: {
      primaryColor: "#F59E0B",
      secondaryColor: "#D97706",
      bgGradient: "from-amber-500 to-yellow-600",
      borderColor: "border-amber-400",
      glowColor: "shadow-amber-500/30",
      icon: "Coins"
    }
  },
];

// ============================================================================
// COACH WISDOM FOR DIFFERENT SCENARIOS
// ============================================================================

export const coachScenarioWisdom = {
  marketCrash: {
    "steady-sam": "Market crashes are scary, but they're normal! The average investor experiences 14 bear markets in their lifetime. Those who stay diversified and don't panic always recover. Keep some cash ready to buy when others are selling!",
    "growth-guru": "Every major crash in history was followed by an even bigger recovery. The key is diversification - when stocks fall 50%, bonds often rise. Your balanced portfolio is designed EXACTLY for moments like this.",
    "adventure-alex": "BLOOD IN THE STREETS! This is when fortunes are made! Amazon dropped 95% in 2000, Tesla dropped 70% in 2022 - those who bought during the panic got rich. Got cash? Start shopping for quality at discount prices!",
    "yield-yoda": "Crashes are temporary. Dividends are (mostly) forever. Companies like Coca-Cola have paid dividends through every crisis since the Great Depression. Focus on the income, not the paper losses."
  },
  bubble: {
    "steady-sam": "When everyone's getting greedy and prices seem crazy high, that's when you need to be careful! Remember Japan 1990, dot-com 2000... bubbles always pop. Keep your defense strong.",
    "growth-guru": "Bubbles don't mean you sell everything - they mean you rebalance! Take some profits from the overheated sector and move it to lagging ones. That's how you buy low and sell high automatically.",
    "adventure-alex": "Just because something is expensive doesn't mean it's a bubble! Amazon looked 'overvalued' for 20 years. The question is: Is this TRANSFORMATIONAL or just hype? AI feels transformational to me...",
    "yield-yoda": "Focus on what you can control - the income your investments generate. If a 'hot' stock doesn't pay dividends and has no path to profits, it's speculation, not investing."
  },
  startingYoung: {
    "steady-sam": "Starting young is your SUPERPOWER! But don't gamble it away on risky bets. Build a solid foundation first, then take calculated risks with money you can afford to lose.",
    "growth-guru": "With 40+ years until retirement, time is your best friend. A simple portfolio of 70% stocks, 30% bonds will probably beat 90% of complicated strategies. Start simple, stay consistent.",
    "adventure-alex": "YOU have the biggest advantage possible - TIME! You can afford to be aggressive because you have decades to recover from any mistakes. This is when you should be taking calculated risks on tomorrow's winners!",
    "yield-yoda": "Here's the secret: Start NOW with whatever you have. $50/month at 15 beats $500/month at 35. The math is magical and absolutely, 100% on your side. Don't wait for the 'perfect' time!"
  }
};

// ============================================================================
// COACH PERSONALITY HELPERS
// ============================================================================

/**
 * Get a random greeting from a coach
 */
export function getCoachGreeting(coach: AICoach): string {
  const greetings = coach.speechStyle.greetings;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Get a random catchphrase from a coach
 */
export function getCoachCatchphrase(coach: AICoach): string {
  const phrases = coach.speechStyle.catchphrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Get coach response based on outcome
 */
export function getCoachResponse(
  coach: AICoach, 
  outcome: "profit" | "loss" | "highRisk" | "safeChoice"
): string {
  const responses = coach.emotionalResponses[
    outcome === "profit" ? "onProfit" : 
    outcome === "loss" ? "onLoss" :
    outcome === "highRisk" ? "onHighRisk" : "onSafeChoice"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Get coach encouragement
 */
export function getCoachEncouragement(coach: AICoach): string {
  const encouragements = coach.speechStyle.encouragements;
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

/**
 * Get coach warning
 */
export function getCoachWarning(coach: AICoach): string {
  const warnings = coach.speechStyle.warnings;
  return warnings[Math.floor(Math.random() * warnings.length)];
}

/**
 * Check if a decision aligns with coach's preferences
 */
export function isCoachAlignedDecision(coach: AICoach, assetType: string): boolean {
  const normalizedAsset = assetType.toLowerCase();
  return coach.decisionInfluence.pushesFor.some(pref => 
    normalizedAsset.includes(pref.toLowerCase()) || pref.toLowerCase().includes(normalizedAsset)
  );
}

/**
 * Get coach's opinion on a specific investment decision
 */
export function getCoachOpinion(coach: AICoach, assetType: string, riskLevel: string): {
  sentiment: "positive" | "neutral" | "cautious";
  message: string;
} {
  const isAligned = isCoachAlignedDecision(coach, assetType);
  const isHighRisk = ["high", "extreme", "very_aggressive", "crypto"].some(r => 
    riskLevel.toLowerCase().includes(r) || assetType.toLowerCase().includes(r)
  );
  
  if (coach.riskTolerance === "conservative" && isHighRisk) {
    return { sentiment: "cautious", message: getCoachWarning(coach) };
  }
  
  if (coach.riskTolerance === "very_aggressive" && !isHighRisk) {
    return { 
      sentiment: "neutral", 
      message: coach.emotionalResponses.onSafeChoice[0] 
    };
  }
  
  if (isAligned) {
    return { sentiment: "positive", message: getCoachEncouragement(coach) };
  }
  
  return { 
    sentiment: "neutral", 
    message: `${coach.speechStyle.emoji} Interesting choice! Let's see how this plays out.`
  };
}

/**
 * Generate personalized advice wrapper for any message
 */
export function wrapWithCoachPersonality(coach: AICoach, message: string): string {
  const catchphrase = getCoachCatchphrase(coach);
  return `${coach.speechStyle.emoji} ${message}\n\n💬 *"${catchphrase}"*`;
}

/**
 * Get coach by ID
 */
export function getCoachById(coachId: string): AICoach | undefined {
  return aiCoaches.find(coach => coach.id === coachId);
}

/**
 * Get coach visual styling
 */
export function getCoachVisualStyle(coach: AICoach): {
  gradient: string;
  borderClass: string;
  glowClass: string;
  bgClass: string;
} {
  return {
    gradient: `bg-gradient-to-r ${coach.visualIdentity.bgGradient}`,
    borderClass: coach.visualIdentity.borderColor,
    glowClass: coach.visualIdentity.glowColor,
    bgClass: `${coach.visualIdentity.borderColor.replace('border-', 'bg-')}/10`,
  };
}
