/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏛️ GENERATIONAL WEALTH WISDOM - A Family Office Perspective               ║
 * ║   Teaching Young People About Wealth Creation Across Generations             ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Every generation has had their moment to build wealth. The key is recognizing
 * the transformative trends of your era and having the courage to act.
 */

// ============================================================================
// THE FOUR PILLARS OF GENERATIONAL WEALTH (Family Office Framework)
// ============================================================================

export interface WealthPillar {
  id: string;
  name: string;
  emoji: string;
  principle: string;
  foWisdom: string;
  forTeens: string;
  keyActions: string[];
  historicalExample: string;
}

export const wealthPillars: WealthPillar[] = [
  {
    id: "accumulation",
    name: "Wealth Accumulation",
    emoji: "🌱",
    principle: "Start early, invest consistently, let compound growth work its magic",
    foWisdom: "The greatest wealth is built not by timing markets, but by time IN markets. Family Offices understand that a single generation's consistent investing creates the foundation for multi-generational prosperity.",
    forTeens: "Here's the secret adults wish they knew at your age: Starting to invest at 15-18 gives you a MASSIVE advantage! 🚀 Thanks to compound growth, $100/month starting at 15 beats $500/month starting at 35. Time is your superpower!",
    keyActions: [
      "Pay yourself first - save 10-20% of any income",
      "Start with whatever you have - even $10 matters",
      "Automate your investments - remove emotion from the equation",
      "Diversify across asset classes like a Family Office",
      "Reinvest all dividends and gains"
    ],
    historicalExample: "The Rockefellers started with a single oil refinery in 1863. By reinvesting profits and expanding strategically, they built a fortune that still supports future generations 160+ years later."
  },
  {
    id: "preservation",
    name: "Wealth Preservation",
    emoji: "🛡️",
    principle: "Protect what you've built - defense wins championships",
    foWisdom: "Making money is hard, but keeping it is harder. Family Offices allocate 30-50% to defensive assets (bonds, gold, cash) because they know that avoiding major losses is as important as capturing gains. A 50% loss requires a 100% gain just to break even!",
    forTeens: "Think of wealth like health 🏥 - prevention is easier than cure! Smart investors don't just chase gains; they protect against big losses. That's why we diversify and keep some 'boring' safe investments. It's not about being scared; it's about being smart!",
    keyActions: [
      "Never put all eggs in one basket - diversify always",
      "Keep 3-6 months expenses in emergency cash",
      "Use bonds and gold to cushion stock market falls",
      "Avoid get-rich-quick schemes (if it sounds too good...)",
      "Protect against inflation with real assets"
    ],
    historicalExample: "The families who survived the Great Depression weren't the richest - they were the most diversified. While others lost everything in stocks, prudent families with bonds, gold, and cash could buy assets cheaply and thrive in the recovery."
  },
  {
    id: "growth",
    name: "Wealth Growth",
    emoji: "🚀",
    principle: "Embrace calculated risks and transformative trends",
    foWisdom: "True wealth is built by recognizing paradigm shifts early. Every generation has their 'Industrial Revolution moment.' Family Offices dedicate 15-30% of portfolios to growth investments, understanding that a few big winners can transform a family's trajectory for generations.",
    forTeens: "YOUR generation has AI and robotics - just like past generations had the railroad, electricity, internet, and mobile phones! 📱 Those who recognized these shifts early and invested in them built generational wealth. The opportunity is ALWAYS there for those who see it!",
    keyActions: [
      "Study emerging trends - what's changing the world?",
      "Allocate a portion (15-25%) to high-growth opportunities",
      "Think long-term - transformative companies need time",
      "Accept volatility as the price of admission for big gains",
      "Learn continuously - knowledge compounds like money"
    ],
    historicalExample: "Early Amazon investors who held through the dot-com crash saw $10,000 become over $20 million. The key wasn't buying at the perfect time - it was recognizing the e-commerce trend and having conviction to hold through volatility."
  },
  {
    id: "transfer",
    name: "Generational Transfer",
    emoji: "🎓",
    principle: "Wealth without wisdom is wasted in three generations",
    foWisdom: "The Chinese proverb says 'Wealth doesn't pass three generations.' Family Offices break this curse by transferring not just money, but financial education, values, and investment philosophy. Teaching the next generation is the ultimate investment.",
    forTeens: "One day, YOU might teach YOUR kids about investing! 👨‍👩‍👧 The knowledge you're building now isn't just for you - it's a gift to your future family. This is how lasting legacies are built: by passing down wisdom, not just wealth.",
    keyActions: [
      "Learn actively - you're building knowledge capital",
      "Teach others what you learn (teaching reinforces learning)",
      "Document your investment decisions and lessons learned",
      "Understand the 'why' behind investment strategies",
      "Think in decades and generations, not days"
    ],
    historicalExample: "The Rothschild family has maintained wealth for 250+ years. Their secret? Each generation receives extensive financial education and is required to work in the family business before inheriting wealth. Knowledge before capital."
  }
];

// ============================================================================
// WEALTH-BUILDING ERAS: Every Generation's Opportunity
// ============================================================================

export interface WealthEra {
  era: string;
  period: string;
  emoji: string;
  transformativeTrend: string;
  whatChanged: string;
  wealthCreators: string[];
  howPeopleGotRich: string;
  lessonsForToday: string;
  keyInvestments: string[];
  populationContext: string;
  forTeens: string;
}

export const wealthEras: WealthEra[] = [
  {
    era: "Industrial Revolution",
    period: "1760-1840",
    emoji: "🏭",
    transformativeTrend: "Machines replacing manual labor",
    whatChanged: "Steam power and factories transformed how things were made. Productivity exploded. Cities grew as people moved from farms to factories.",
    wealthCreators: [
      "Andrew Carnegie (Steel) - Immigrated with nothing, became richest American",
      "Cornelius Vanderbilt (Railroads) - Started with $100, built $100M empire",
      "John D. Rockefeller (Oil) - First US billionaire, started as bookkeeper"
    ],
    howPeopleGotRich: "They recognized that machines would multiply human productivity. They invested in steel, railroads, and oil - the 'infrastructure' that powered industrial growth. Many started with almost nothing but saw the trend early.",
    lessonsForToday: "New technology creates new wealth. Those who build the 'infrastructure' of change (today: AI chips, cloud computing, robotics) capture enormous value.",
    keyInvestments: ["Railroad companies", "Steel manufacturers", "Oil producers", "Banking institutions"],
    populationContext: "World population grew from 1B to 1.2B as better food production and medicine improved survival rates. More people = more consumption = more growth.",
    forTeens: "🎯 These weren't lucky rich kids! Carnegie came to America as a poor immigrant. Vanderbilt had $100. Rockefeller was a bookkeeper. They saw that MACHINES would change everything and acted on it. What's YOUR generation's 'machine'? (Hint: It starts with 'A' and ends with 'I'!)"
  },
  {
    era: "Age of Electricity & Mass Production",
    period: "1870-1920",
    emoji: "💡",
    transformativeTrend: "Electricity and assembly line production",
    whatChanged: "Electric power brought factories to life 24/7. Ford's assembly line made products affordable for the masses. Communication (telegraph, telephone) connected the world.",
    wealthCreators: [
      "Thomas Edison (Electric utilities) - Started as poor newspaper boy",
      "Henry Ford (Automobiles) - Farm boy who democratized car ownership",
      "JP Morgan (Finance) - Built infrastructure for American growth"
    ],
    howPeopleGotRich: "They brought revolutionary products to the masses. Ford made cars affordable; Edison brought light to homes. They understood that making things cheap and accessible created huge markets.",
    lessonsForToday: "Democratizing technology creates massive wealth. Today's equivalent: making AI accessible to everyone, making clean energy affordable, making education available globally.",
    keyInvestments: ["Electric utilities", "Automobile manufacturers", "Telecommunications", "Consumer products"],
    populationContext: "Population hit 2B by 1927. Urbanization accelerated. Middle class emerged. Mass consumption became possible.",
    forTeens: "💡 Edison failed 10,000 times before inventing the light bulb. Ford's first companies went bankrupt. JP Morgan's father was just a merchant. They didn't have special advantages - they had PERSISTENCE and recognized that electricity would change EVERYTHING. Sound familiar? (AI is today's electricity!)"
  },
  {
    era: "Post-War Boom & Globalization",
    period: "1945-1980",
    emoji: "🌍",
    transformativeTrend: "Global trade and consumer economy",
    whatChanged: "World rebuilt after WWII. American companies went global. TV brought advertising to every home. Credit cards enabled consumer spending.",
    wealthCreators: [
      "Sam Walton (Walmart) - Started with one small store in Arkansas",
      "Warren Buffett (Investing) - Started with $100, now worth $100B+",
      "Ray Kroc (McDonald's) - Was 52 years old when he started franchising"
    ],
    howPeopleGotRich: "They scaled simple ideas globally. Walton brought low prices to rural America. Kroc standardized restaurants worldwide. Buffett simply bought good companies and held forever.",
    lessonsForToday: "Scale and patience beat complexity. The best investments are often simple businesses that can grow globally. Long-term thinking beats short-term trading.",
    keyInvestments: ["Consumer brands", "Retail chains", "Fast food franchises", "Quality stocks held long-term"],
    populationContext: "Population 2.5B to 4.4B. Baby boom created huge consumer class. Suburbs spread. Everyone wanted cars, TVs, and appliances.",
    forTeens: "🎯 Ray Kroc was 52 - older than your parents - when he started McDonald's! Sam Walton opened his first store in a tiny Arkansas town. Buffett bought his first stock at age 11. AGE and STARTING POINT don't matter. What matters is recognizing TRENDS and taking ACTION!"
  },
  {
    era: "The Digital & Internet Revolution",
    period: "1980-2010",
    emoji: "🌐",
    transformativeTrend: "Computers and the Internet connecting everyone",
    whatChanged: "Personal computers brought computing power to every home and office. The Internet connected billions of people. E-commerce changed how we shop. Social media changed how we communicate.",
    wealthCreators: [
      "Bill Gates (Microsoft) - College dropout, started in a garage",
      "Jeff Bezos (Amazon) - Left Wall Street job to sell books online",
      "Steve Jobs (Apple) - College dropout, started in parents' garage",
      "Mark Zuckerberg (Facebook) - Built social network in college dorm"
    ],
    howPeopleGotRich: "They built platforms that connected people and businesses. Microsoft put a computer on every desk. Amazon made every product available to everyone. Apple made technology beautiful and personal.",
    lessonsForToday: "Platforms that connect people create enormous value. The winners aren't just users of technology - they build the platforms others use.",
    keyInvestments: ["Tech hardware", "Software companies", "E-commerce platforms", "Digital advertising"],
    populationContext: "Population 4.4B to 7B. Internet connected billions. Middle class emerged in China and India. Global consumers could reach any product.",
    forTeens: "🚀 Gates, Jobs, and Zuckerberg were YOUR AGE when they started! They didn't have special resources - Gates started in a garage, Zuckerberg in a dorm room. They saw that COMPUTERS and INTERNET would connect everyone. They were right. Now AI is connecting human intelligence with machine intelligence. Same opportunity, new technology!"
  },
  {
    era: "Mobile & Cloud Era",
    period: "2007-2020",
    emoji: "📱",
    transformativeTrend: "Smartphones and cloud computing",
    whatChanged: "iPhone launched 2007, putting a supercomputer in everyone's pocket. Cloud computing let startups scale instantly. Apps created new business models. Social media became essential.",
    wealthCreators: [
      "Evan Spiegel (Snapchat) - Created app as Stanford student, became youngest billionaire",
      "Brian Chesky (Airbnb) - Started renting air mattresses, built $100B company",
      "Travis Kalanick (Uber) - Turned 'pressing a button for a ride' into global transport",
      "Jensen Huang (NVIDIA) - Bet on graphics chips, now powers AI revolution"
    ],
    howPeopleGotRich: "They built on top of smartphones and cloud. Uber couldn't exist without GPS in everyone's pocket. Airbnb couldn't scale without cloud infrastructure. Instagram couldn't share photos without smartphone cameras.",
    lessonsForToday: "Build on top of new platforms. Every major technology shift creates opportunities for new businesses. The smartphone era created trillion-dollar companies from scratch.",
    keyInvestments: ["Cloud providers (AWS, Azure)", "Smartphone ecosystem", "App-based services", "Semiconductor companies"],
    populationContext: "Population 7B to 7.8B. Smartphone penetration reached 80%+ in developed countries. Digital natives grew up. Everyone became connected.",
    forTeens: "📱 Evan Spiegel built Snapchat while he was in COLLEGE! Brian Chesky was broke and renting air mattresses in his apartment. These weren't genius moves - they saw that everyone having a smartphone camera created new possibilities. NOW, everyone having access to AI creates NEW possibilities. What will you build?"
  },
  {
    era: "AI & Robotics Revolution",
    period: "2020-2040+",
    emoji: "🤖",
    transformativeTrend: "Artificial Intelligence and automation transforming every industry",
    whatChanged: "AI can now write, code, create art, drive cars, and make decisions. Robotics is automating physical work. Every industry is being reimagined. This is YOUR generation's moment!",
    wealthCreators: [
      "Sam Altman (OpenAI) - Building AI for everyone",
      "Jensen Huang (NVIDIA) - The 'picks and shovels' of AI",
      "Elon Musk (Tesla, xAI) - Betting big on AI and robotics",
      "YOU? - This revolution is just beginning..."
    ],
    howPeopleGotRich: "We're in the early stages! Those investing in AI infrastructure (chips, cloud, data centers) are winning now. The next winners will build AI-powered products and services.",
    lessonsForToday: "This is THE moment. Just like the Internet in 1995 or smartphones in 2007, AI is transforming everything. The biggest winners will be those who start learning and building NOW.",
    keyInvestments: ["AI chip makers (NVIDIA, AMD)", "Cloud AI providers", "AI-first companies", "Robotics and automation", "Companies using AI to transform old industries"],
    populationContext: "Population 8B+. But AI means productivity per person can 10x. This could be the biggest wealth creation opportunity in human history.",
    forTeens: "🌟 THIS IS YOUR INDUSTRIAL REVOLUTION! Just like Carnegie saw steam power, Ford saw assembly lines, and Jobs saw personal computers - YOU are witnessing AI transform everything. The question isn't whether AI will change the world. It's whether YOU will be a creator or just a consumer. Every generation has their moment. THIS IS YOURS! 🚀"
  }
];

// ============================================================================
// INSPIRING MESSAGES FROM THE WORLD'S TOP INVESTORS
// ============================================================================

export interface InvestorWisdom {
  investor: string;
  era: string;
  backgroundStory: string;
  quote: string;
  lesson: string;
  forTeens: string;
}

export const investorWisdom: InvestorWisdom[] = [
  {
    investor: "Warren Buffett",
    era: "1930-Present",
    backgroundStory: "Son of a stockbroker who lost everything in the Great Depression. Started investing at age 11. Now one of the world's richest people.",
    quote: "Someone's sitting in the shade today because someone planted a tree a long time ago.",
    lesson: "Long-term thinking is the ultimate competitive advantage. Start early, stay consistent.",
    forTeens: "Buffett bought his first stock at 11 years old. He's now 93 and still learning! He made 99% of his wealth AFTER age 50 because of compound growth. YOUR advantage? You have decades more than he did at your age! 🌳"
  },
  {
    investor: "Peter Lynch",
    era: "1944-Present",
    backgroundStory: "Father died when he was 10. Worked as a caddy to help support family. Became the greatest mutual fund manager ever.",
    quote: "Know what you own, and know why you own it.",
    lesson: "Invest in what you understand. Everyday observations can lead to great investments.",
    forTeens: "Lynch made money by noticing what products teens and families loved! He invested in Dunkin' Donuts, The Gap, and McDonald's just by watching what people actually bought. What products and services do YOU and your friends love? That's where opportunities hide! 👀"
  },
  {
    investor: "Ray Dalio",
    era: "1949-Present",
    backgroundStory: "Middle-class kid from Queens, NY. Started Bridgewater in his apartment. Built the world's largest hedge fund.",
    quote: "Pain + Reflection = Progress. Every failure contains a lesson if you're willing to learn.",
    lesson: "Embrace mistakes as learning opportunities. Diversification protects you from being wrong.",
    forTeens: "Dalio nearly went bankrupt in his 30s by making a wrong call on the economy. Instead of giving up, he studied WHY he was wrong and built systems to prevent future mistakes. His 'failure' made him billions! 💪"
  },
  {
    investor: "Cathie Wood",
    era: "1955-Present",
    backgroundStory: "First-generation American, father was immigrant. Worked in male-dominated Wall Street. Now leads revolutionary tech investing firm.",
    quote: "We believe innovation is key to growth. Disruptive technologies will change the world.",
    lesson: "Have conviction in transformative trends. Be willing to be different when you've done the research.",
    forTeens: "Cathie was one of the few investors who believed electric cars and Bitcoin would transform the world BEFORE it was obvious. She got criticized for years. Then Tesla became the most valuable car company and Bitcoin hit $69K. Lesson: Do your research, have conviction, ignore the haters! 🔮"
  },
  {
    investor: "Jack Bogle",
    era: "1929-2019",
    backgroundStory: "Family lost everything in the Great Depression. Created the index fund, democratizing investing for everyone.",
    quote: "Don't look for the needle in the haystack. Just buy the haystack!",
    lesson: "Simple beats complex. Low-cost index funds beat most professional investors over time.",
    forTeens: "Bogle's idea was GENIUS in its simplicity: Why try to pick winning stocks when you can own ALL of them? Index funds let you own pieces of hundreds of companies at once. It's like buying a slice of the entire economy! Most professionals can't beat it. 🎯"
  }
];

// ============================================================================
// HOPE & OPPORTUNITY MESSAGES
// ============================================================================

export interface HopeMessage {
  title: string;
  message: string;
  evidence: string;
  callToAction: string;
}

export const hopeMessages: HopeMessage[] = [
  {
    title: "You Don't Need to Be Rich to Start",
    message: "Every great fortune started with a first small step. Carnegie arrived in America with nothing. Buffett bought his first stock with money from a paper route. The Walton family's $200+ billion empire started with one small-town store.",
    evidence: "80% of millionaires are first-generation wealthy. They built it themselves, not inherited it. The tools to invest are now more accessible than ever - you can start with just $1 through apps like Stake or CommSec Pocket.",
    callToAction: "Start today with whatever you have. $10 invested at 15 becomes $450+ by 65 with average returns. Your future self will thank you!"
  },
  {
    title: "Every Generation Has Their Moment",
    message: "Your grandparents had post-war growth and manufacturing. Your parents had the Internet boom. You have AI, clean energy, biotechnology, and space exploration. The opportunities aren't fewer - they're BIGGER!",
    evidence: "The companies that will dominate 2040 may not even exist yet. Google was founded 1998, Facebook 2004, Uber 2009, OpenAI 2015. The next giants are being built right now - maybe by someone reading this!",
    callToAction: "Learn about AI, robotics, biotech, and clean energy. These are the 'railroads' and 'electricity' of your generation. Understanding them is your competitive advantage!"
  },
  {
    title: "Knowledge Is Your Unfair Advantage",
    message: "You're learning about investing as a teenager - something most adults never properly learned! This financial literacy puts you ahead of 90% of people. Family Offices guard this knowledge carefully; now you have access to it.",
    evidence: "Studies show financially literate teens become wealthier adults. They make better decisions about debt, savings, and investments. This knowledge compounds just like money!",
    callToAction: "Keep learning! Every mission you complete, every concept you master, builds your 'financial intelligence.' This is worth more than any amount of starting capital."
  },
  {
    title: "Time Is Your Greatest Asset",
    message: "Here's math that should excite you: $100/month invested from age 15-25 (just 10 years) then left alone beats $100/month invested from age 25-65 (40 years!). Early money has more time to compound.",
    evidence: "If you invest $5,000 at age 15 and never add another cent, with average 10% returns it becomes $470,000+ by age 65. The same $5,000 invested at 35 becomes only $70,000. Time literally multiplies your money!",
    callToAction: "Don't wait until you have 'enough' to invest. Start NOW with whatever you have. Time beats amount every single time!"
  },
  {
    title: "You Can Create Your Own Luck",
    message: "Success isn't random. The 'lucky' investors were usually the ones who studied trends, stayed informed, and positioned themselves early. When opportunities appeared, they were ready.",
    evidence: "Amazon's early investors weren't lucky - they understood e-commerce would grow. Tesla's early believers weren't lucky - they saw the electric vehicle transition coming. The 'lucky' ones simply did the homework.",
    callToAction: "Study trends, stay curious, invest in what you understand. When AI or the next big thing has its 'Amazon moment,' you'll be ready to act!"
  }
];

// ============================================================================
// FAMILY OFFICE PRINCIPLES FOR YOUNG INVESTORS
// ============================================================================

export interface FOPrinciple {
  number: number;
  principle: string;
  explanation: string;
  howFamilyOfficesApplyIt: string;
  howTeensCanApplyIt: string;
}

export const foPrinciples: FOPrinciple[] = [
  {
    number: 1,
    principle: "Think in Decades, Not Days",
    explanation: "Wealthy families don't check their portfolios daily. They set a strategy and let it work for years. Short-term noise becomes irrelevant over long periods.",
    howFamilyOfficesApplyIt: "FOs typically review portfolios quarterly, not daily. They ignore short-term market movements and focus on 10-30 year outcomes. Some investments (like private equity) are locked up for 10+ years by design.",
    howTeensCanApplyIt: "When you invest, imagine NOT looking at it for 5 years. Choose investments you'd be happy holding that long. Daily price checking leads to emotional decisions. Set it and forget it!"
  },
  {
    number: 2,
    principle: "Diversification Is the Only Free Lunch",
    explanation: "Spreading investments across different asset classes reduces risk without sacrificing returns. It's the closest thing to magic in finance.",
    howFamilyOfficesApplyIt: "A typical FO allocates across stocks (40-60%), bonds (20-40%), real estate (10-20%), commodities (5-10%), and alternatives (10-20%). No single investment can sink the portfolio.",
    howTeensCanApplyIt: "Start with a simple mix: 60% stocks (maybe an index fund), 30% bonds, 10% gold or commodities. As you learn more, add complexity. Never put more than 5% in any single stock!"
  },
  {
    number: 3,
    principle: "Be Greedy When Others Are Fearful",
    explanation: "The best buying opportunities come during crises when everyone else is panicking. Great investors love market crashes - it's when things go on sale!",
    howFamilyOfficesApplyIt: "FOs keep 5-15% in cash specifically to deploy during market crashes. In 2008 and 2020, smart FOs were buying while others were panic selling. They made fortunes.",
    howTeensCanApplyIt: "When markets crash and news is scary, that's usually the BEST time to invest more. Keep some cash ready for these opportunities. Everyone's fear = your opportunity!"
  },
  {
    number: 4,
    principle: "Compound Interest Is the Eighth Wonder of the World",
    explanation: "Einstein allegedly called compound interest the eighth wonder of the world. Money earning money earning money creates exponential growth over time.",
    howFamilyOfficesApplyIt: "FOs reinvest ALL dividends and gains, never withdrawing during accumulation years. They understand that interrupting compounding is incredibly costly.",
    howTeensCanApplyIt: "Always choose to reinvest dividends. Never cash out early. Every $1 removed from your investments is actually $10-$100 lost when you factor in decades of compounding!"
  },
  {
    number: 5,
    principle: "Pay Attention to Fees - They're Silent Wealth Killers",
    explanation: "A 2% annual fee might seem small, but over 30 years it can cost you 50%+ of your potential wealth! Low-cost investing is smart investing.",
    howFamilyOfficesApplyIt: "FOs negotiate aggressively on fees and prefer low-cost index funds for most equity exposure. They know that high fees rarely deliver better results.",
    howTeensCanApplyIt: "Choose low-cost index funds and ETFs (look for expense ratios under 0.2%). Avoid actively managed funds that charge 1-2%. That fee difference could mean hundreds of thousands of dollars over your lifetime!"
  },
  {
    number: 6,
    principle: "Your Biggest Risk Is Not Taking Any Risk",
    explanation: "Playing it 'too safe' with all cash guarantees you'll lose to inflation. The biggest risk for young investors is being too conservative.",
    howFamilyOfficesApplyIt: "Even conservative FOs keep 20-30% in growth assets. They know that over long periods, the risk of NOT owning stocks exceeds the risk of owning them.",
    howTeensCanApplyIt: "With 40+ years until retirement, you can afford stock market volatility. A portfolio that's 'too safe' (all cash/bonds) will get destroyed by inflation. Young = more stocks, not less!"
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getWealthPillarById = (id: string): WealthPillar | undefined => {
  return wealthPillars.find(pillar => pillar.id === id);
};

export const getWealthEraByName = (era: string): WealthEra | undefined => {
  return wealthEras.find(e => e.era === era);
};

export const getCurrentEra = (): WealthEra => {
  return wealthEras[wealthEras.length - 1]; // AI & Robotics Revolution
};

export const getRandomHopeMessage = (): HopeMessage => {
  return hopeMessages[Math.floor(Math.random() * hopeMessages.length)];
};

export const getRandomInvestorWisdom = (): InvestorWisdom => {
  return investorWisdom[Math.floor(Math.random() * investorWisdom.length)];
};

