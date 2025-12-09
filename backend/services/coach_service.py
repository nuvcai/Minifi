import os
from typing import Dict, List, Any
from openai import AsyncOpenAI
from models import CoachRequest, CoachResponse


class CoachService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        if self.api_key:
            self.client = AsyncOpenAI(api_key=self.api_key)

    async def get_advice(self, request: CoachRequest) -> CoachResponse:
        """Get personalized AI coach advice"""

        if not self.api_key:
            print("❌ No OpenAI API key found - using mock advice")
            return await self._get_mock_advice(request)

        print(f"🤖 Using OpenAI API for AI coach advice...")
        print(f"📊 Player Level: {request.player_level}")
        print(f"📊 Risk Tolerance: {request.risk_tolerance}")
        print(f"📊 Investment Goal: {request.investment_goal}")
        print(f"📊 Portfolio: {request.current_portfolio}")

        try:
            # Generate AI advice
            advice = await self._generate_ai_advice(request)
            print("✅ Successfully generated AI advice!")
            return advice
        except Exception as e:
            print(f"❌ Error generating AI advice: {e}")
            print("🔄 Falling back to mock advice...")
            return await self._get_mock_advice(request)

    async def _generate_ai_advice(self, request: CoachRequest) -> CoachResponse:
        """Generate AI advice using OpenAI"""

        print("🔧 Creating AI prompts...")

        # Extract coach personality from player context
        coach_personality = None
        if request.player_context:
            # Look for coach personality in the context
            if "Conservative Coach" in request.player_context:
                coach_personality = "Conservative Coach"
            elif "Balanced Coach" in request.player_context:
                coach_personality = "Balanced Coach"
            elif "Aggressive Coach" in request.player_context:
                coach_personality = "Aggressive Coach"
            elif "Income Coach" in request.player_context:
                coach_personality = "Income Coach"

        print(f"🎯 Coach Personality: {coach_personality}")

        # Create system prompt based on coach level and personality
        system_prompt = self._create_system_prompt(
            request.player_level, coach_personality)
        print(f"📝 System prompt length: {len(system_prompt)} characters")

        # Create user prompt with context
        user_prompt = self._create_user_prompt(request)
        print(f"📝 User prompt length: {len(user_prompt)} characters")

        print("🚀 Calling OpenAI API...")

        # Call OpenAI API with improved parameters
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=800,
            temperature=0.8,
            presence_penalty=0.6,
            frequency_penalty=0.3
        )

        advice_text = response.choices[0].message.content
        print(f"📄 Raw OpenAI response length: {len(advice_text)} characters")
        print("="*60)
        print("🤖 RAW OPENAI RESPONSE:")
        print("="*60)
        print(advice_text)
        print("="*60)

        # Parse the response into structured format
        parsed_response = await self._parse_advice_response(advice_text, request)

        print("📋 Parsed response:")
        print(f"   Advice: {parsed_response.advice[:100]}...")
        print(
            f"   Recommendations: {len(parsed_response.recommendations)} items")
        print(f"   Next Steps: {len(parsed_response.next_steps)} items")

        return parsed_response

    def _create_system_prompt(self, player_level: str, coach_personality: str = None) -> str:
        """Create system prompt based on player level and coach personality"""

        base_prompt = """You are an AI financial coach for Australian teenagers (12-18) learning to invest like a family office.

Your mission: Teach sophisticated wealth management through exploration and effort.

Core principles:
- REWARD EFFORT over outcomes - praise trying new asset classes and strategies
- Teach FAMILY OFFICE thinking: diversification, long-term wealth preservation, multi-generational planning
- Encourage EXPLORATION of different asset classes (stocks, bonds, ETFs, crypto, REITs, commodities)
- Focus on LEARNING through experimentation, not just winning
- Celebrate CURIOSITY and STRATEGIC THINKING
- Use conversational, teen-friendly language
- Turn every trade into a learning opportunity about asset class behavior

Family Office Philosophy:
- Diversify across asset classes, not just within them
- Think in decades, not days
- Preserve capital while seeking growth
- Understand how different assets behave in different market conditions
- Build a portfolio that works in all seasons

RESPONSE STRUCTURE (follow exactly):

**Main Advice:** (2-3 sentences addressing their specific situation)

**Key Recommendations:**
- [Actionable recommendation 1]
- [Actionable recommendation 2]
- [Actionable recommendation 3]

**Next Steps:**
- [Specific action they can take now]
- [Specific action for their next move]

**Risk Assessment:** (1-2 sentences about their current risk position)

**Educational Insights:**
- [Key financial concept they should understand]
- [How it applies to their situation]

**Encouragement:** (Motivational message that reflects your coaching style)
"""

        # Enhanced coach personalities with distinct voices
        if coach_personality:
            if "Conservative" in coach_personality:
                base_prompt += """

🛡️ YOUR PERSONALITY: Steady Sam (Conservative Family Office Advisor)
Voice: Calm wealth preservation expert

Your philosophy:
- Family offices prioritize CAPITAL PRESERVATION across generations
- Reward exploring defensive asset classes: bonds, gold, dividend aristocrats, REITs
- Praise effort in building diversified income streams
- Teach how wealthy families protect wealth through multiple asset classes
- Celebrate trying new defensive strategies, even if returns are modest

Language style:
- "Family offices think in generations, not quarters"
- "You're exploring like a wealth manager - excellent effort!"
- "Trying bonds shows sophisticated thinking"
- "Diversifying across asset classes is how dynasties preserve wealth"

Focus: Reward exploration of bonds, gold, defensive stocks, REITs, stable crypto (if any)
"""
            elif "Balanced" in coach_personality:
                base_prompt += """

⚖️ YOUR PERSONALITY: Wise Wendy (Balanced Family Office Strategist)
Voice: Strategic wealth allocation expert

Your philosophy:
- Family offices balance growth AND preservation across asset classes
- Reward exploring different asset class combinations
- Praise effort in understanding asset class correlations
- Teach how wealthy families allocate across stocks, bonds, alternatives, real estate
- Celebrate strategic experimentation with portfolio mixes

Language style:
- "You're thinking like a family office CIO - great effort!"
- "Exploring different asset classes shows maturity"
- "Family offices diversify across 6-8 asset classes minimum"
- "Your curiosity about asset allocation is impressive"

Focus: Reward exploration of stocks, bonds, ETFs, REITs, balanced crypto exposure
"""
            elif "Aggressive" in coach_personality:
                base_prompt += """

🚀 YOUR PERSONALITY: Adventure Alex (Growth Family Office Advisor)
Voice: Bold wealth creation expert

Your philosophy:
- Family offices take CALCULATED risks in growth asset classes
- Reward exploring high-growth assets: tech stocks, crypto, emerging markets
- Praise effort in researching innovative asset classes
- Teach how wealthy families build wealth through strategic risk-taking
- Celebrate bold exploration, even if some bets don't pay off

Language style:
- "Family offices built wealth by exploring new frontiers - you're doing it!"
- "Trying crypto shows you're thinking ahead"
- "Your effort in exploring growth assets is commendable"
- "Wealthy families weren't afraid to try new asset classes early"

Focus: Reward exploration of growth stocks, crypto, tech ETFs, emerging market exposure
"""
            elif "Income" in coach_personality:
                base_prompt += """

💰 YOUR PERSONALITY: Income Izzy (Cash Flow Family Office Expert)
Voice: Passive income strategist

Your philosophy:
- Family offices build INCOME STREAMS across multiple asset classes
- Reward exploring income-generating assets: dividend stocks, bonds, REITs, yield farming
- Praise effort in building diversified cash flow
- Teach how wealthy families create passive income from various sources
- Celebrate trying different income strategies

Language style:
- "Family offices create 7+ income streams - you're learning how!"
- "Exploring dividend stocks shows sophisticated effort"
- "Your curiosity about income assets is exactly right"
- "Wealthy families build cash flow machines across asset classes"

Focus: Reward exploration of dividend stocks, bonds, REITs, income-focused ETFs
"""

        # Level-specific guidance
        if player_level == "beginner":
            return base_prompt + """

BEGINNER FOCUS (Exploration Phase):
- REWARD trying different asset classes (stocks, bonds, ETFs, crypto)
- Praise EFFORT in learning about each asset class, not just returns
- Celebrate CURIOSITY: "You tried bonds - that's how family offices think!"
- Explain how each asset class behaves differently
- Encourage exploring at least 3-4 different asset classes
- Make experimentation feel safe and rewarding
- Teach: "Family offices explore everything before committing big capital"
"""
        elif player_level == "intermediate":
            return base_prompt + """

INTERMEDIATE FOCUS (Asset Class Mastery):
- REWARD building diversified portfolios across 4+ asset classes
- Praise STRATEGIC THINKING about asset class correlations
- Celebrate EFFORT in understanding when to use each asset class
- Teach portfolio construction like family offices do
- Encourage exploring asset class combinations
- Reward rebalancing efforts across asset classes
- Teach: "Family offices master asset allocation, not stock picking"
"""
        else:  # advanced
            return base_prompt + """

ADVANCED FOCUS (Family Office Sophistication):
- REWARD sophisticated multi-asset strategies
- Praise EFFORT in optimizing across 5+ asset classes
- Celebrate INNOVATION in portfolio construction
- Teach advanced family office techniques: hedging, alternatives, tactical allocation
- Encourage exploring complex asset class interactions
- Reward risk management across asset classes
- Teach: "You're thinking like a family office CIO - keep exploring!"
"""

    def _create_user_prompt(self, request: CoachRequest) -> str:
        """Create user prompt with player context"""

        # Extract investment result
        investment_result = "neutral"
        investment_return = 0
        
        if request.player_context:
            if "profit" in request.player_context.lower():
                investment_result = "profit"
            elif "loss" in request.player_context.lower():
                investment_result = "loss"
            
            import re
            return_match = re.search(r'(-?\d+(?:\.\d+)?)%', request.player_context)
            if return_match:
                investment_return = float(return_match.group(1))

        prompt = f"""PLAYER PROFILE:
Level: {request.player_level.upper()}
Risk Tolerance: {request.risk_tolerance:.0%}
Investment Goal: {request.investment_goal.replace('_', ' ').title()}
Time Horizon: {request.time_horizon} days
Missions Completed: {len(request.completed_missions)}

CURRENT PORTFOLIO (Asset Class Diversification):"""

        # Analyze asset class diversity
        asset_classes = set()
        for asset in request.current_portfolio.keys():
            if 'BTC' in asset or 'ETH' in asset:
                asset_classes.add('Crypto')
            elif 'Bond' in asset or 'Treasury' in asset:
                asset_classes.add('Bonds')
            elif 'Gold' in asset:
                asset_classes.add('Commodities')
            elif 'REIT' in asset or 'Real Estate' in asset:
                asset_classes.add('Real Estate')
            elif 'ETF' in asset or 'S&P' in asset:
                asset_classes.add('ETFs')
            else:
                asset_classes.add('Stocks')

        for asset, weight in request.current_portfolio.items():
            prompt += f"\n• {asset}: {weight:.1%}"
        
        prompt += f"\n\nAsset Classes Explored: {len(asset_classes)} ({', '.join(asset_classes)})"
        prompt += f"\nFamily Office Target: 4-6 asset classes"

        if request.recent_performance:
            prompt += f"\n\nRECENT PERFORMANCE:\n{request.recent_performance}"

        # Add result-specific context with EFFORT FOCUS
        if investment_result == "profit":
            prompt += f"""

🎉 LATEST RESULT: PROFIT (+{investment_return:.1f}%)
Your response should REWARD EFFORT and EXPLORATION:
- Praise their COURAGE in trying this asset class
- Celebrate the LEARNING, not just the profit
- Ask what they LEARNED about this asset class behavior
- Encourage exploring OTHER asset classes to compare
- Teach how family offices use this asset class
- Suggest: "Great effort! Now try [different asset class] to see how it compares"
- Focus: "You're building family office thinking by exploring different assets"
"""
        elif investment_result == "loss":
            prompt += f"""

📉 LATEST RESULT: LOSS ({investment_return:.1f}%)
Your response should REWARD EFFORT despite the loss:
- Praise their BRAVERY in exploring this asset class
- Celebrate the LEARNING experience - losses teach the most
- Explain what they learned about this asset class's risk profile
- Encourage: "Family offices learn by trying - you did great!"
- Suggest exploring a DIFFERENT asset class with different characteristics
- Teach: "Now you understand how this asset behaves - that's valuable!"
- Focus: "Your effort in exploration is exactly what family offices do"
"""
        else:
            prompt += f"""

➡️ LATEST RESULT: NEUTRAL ({investment_return:.1f}%)
Your response should REWARD EXPLORATION EFFORT:
- Praise their effort in trying this asset class
- Celebrate learning about asset class stability
- Encourage exploring MORE asset classes for comparison
- Teach how family offices use stable assets
- Suggest: "You've explored this - now try [different asset class]"
- Focus: "Building knowledge across asset classes is the goal"
"""

        if request.current_mission:
            prompt += f"\n\nCURRENT MISSION: {request.current_mission}"

        if request.player_context:
            prompt += f"\n\nADDITIONAL CONTEXT:\n{request.player_context}"

        prompt += f"""

REQUIREMENTS (EFFORT & EXPLORATION FOCUSED):
1. REWARD their effort in exploring this asset class (regardless of outcome)
2. Praise CURIOSITY and STRATEGIC THINKING
3. Encourage exploring {6 - len(asset_classes)} more asset classes to reach family office diversification
4. Teach how family offices use this specific asset class
5. Suggest a DIFFERENT asset class to explore next
6. Make them feel PROUD of their exploration effort
7. Use family office language: "You're thinking like a wealth manager!"

Remember: EFFORT and EXPLORATION matter more than short-term returns. Family offices learn by trying everything!"""

        return prompt

    async def _parse_advice_response(self, advice_text: str, request: CoachRequest) -> CoachResponse:
        """Parse AI response into structured format"""

        print("🔍 Parsing OpenAI response...")

        # Split into sections
        sections = advice_text.split('\n\n')

        advice = ""
        recommendations = []
        next_steps = []
        risk_assessment = ""
        educational_insights = []
        encouragement = ""

        for section in sections:
            section = section.strip()
            if not section:
                continue

            # Extract main advice - more flexible matching
            if any(keyword in section for keyword in ["**Main Advice:**", "1. **Main Advice:**", "Main Advice:", "1. Main Advice:"]):
                # Remove various possible prefixes
                for prefix in ["1. **Main Advice:**", "**Main Advice:**", "1. Main Advice:", "Main Advice:"]:
                    if prefix in section:
                        advice = section.replace(prefix, "").strip()
                        break

            # Extract recommendations - more flexible matching
            elif any(keyword in section for keyword in ["**Key Recommendations:**", "2. **Key Recommendations:**", "Key Recommendations:", "2. Key Recommendations:"]):
                lines = section.split('\n')
                for line in lines:
                    line = line.strip()
                    # Support multiple bullet point formats
                    if any(line.startswith(bullet) for bullet in ['-', '•', '*', '1.', '2.', '3.', '4.']):
                        # Clean up the line
                        for bullet in ['-', '•', '*', '1.', '2.', '3.', '4.']:
                            if line.startswith(bullet):
                                rec = line.replace(bullet, '').strip()
                                if rec and len(rec) > 5:  # Ensure meaningful content
                                    recommendations.append(rec)
                                break

            # Extract next steps - more flexible matching
            elif any(keyword in section for keyword in ["**Next Steps:**", "3. **Next Steps:**", "Next Steps:", "3. Next Steps:"]):
                lines = section.split('\n')
                for line in lines:
                    line = line.strip()
                    # Support multiple bullet point formats
                    if any(line.startswith(bullet) for bullet in ['-', '•', '*', '1.', '2.', '3.']):
                        # Clean up the line
                        for bullet in ['-', '•', '*', '1.', '2.', '3.']:
                            if line.startswith(bullet):
                                step = line.replace(bullet, '').strip()
                                if step and len(step) > 5:  # Ensure meaningful content
                                    next_steps.append(step)
                                break

            # Extract risk assessment - more flexible matching
            elif any(keyword in section for keyword in ["**Risk Assessment:**", "4. **Risk Assessment:**", "Risk Assessment:", "4. Risk Assessment:"]):
                # Remove various possible prefixes
                for prefix in ["4. **Risk Assessment:**", "**Risk Assessment:**", "4. Risk Assessment:", "Risk Assessment:"]:
                    if prefix in section:
                        risk_assessment = section.replace(prefix, "").strip()
                        break

            # Extract educational insights - more flexible matching
            elif any(keyword in section for keyword in ["**Educational Insights:**", "5. **Educational Insights:**", "Educational Insights:", "5. Educational Insights:"]):
                lines = section.split('\n')
                insights = []
                for line in lines:
                    line = line.strip()
                    # Support multiple bullet point formats
                    if any(line.startswith(bullet) for bullet in ['-', '•', '*', '1.', '2.']):
                        # Clean up the line
                        for bullet in ['-', '•', '*', '1.', '2.']:
                            if line.startswith(bullet):
                                insight = line.replace(bullet, '').strip()
                                # Ensure meaningful content
                                if insight and len(insight) > 5:
                                    insights.append(insight)
                                break
                if insights:
                    educational_insights = insights

            # Extract encouragement - more flexible matching
            elif any(keyword in section for keyword in ["**Encouragement:**", "6. **Encouragement:**", "Encouragement:", "6. Encouragement:"]):
                # Remove various possible prefixes
                for prefix in ["6. **Encouragement:**", "**Encouragement:**", "6. Encouragement:", "Encouragement:"]:
                    if prefix in section:
                        encouragement = section.replace(prefix, "").strip()
                        break

        # Enhanced fallback with personality-based content only when AI fails to provide content
        if not advice:
            # Extract coach personality for personalized fallback
            coach_personality = None
            if request.player_context:
                if "Conservative Coach" in request.player_context:
                    coach_personality = "Conservative"
                elif "Balanced Coach" in request.player_context:
                    coach_personality = "Balanced"
                elif "Aggressive Coach" in request.player_context:
                    coach_personality = "Aggressive"
                elif "Income Coach" in request.player_context:
                    coach_personality = "Income"

            # Create personalized fallback advice only if AI completely failed
            if coach_personality == "Conservative":
                advice = "Steady as she goes! Your investment journey is about building lasting wealth through careful, calculated decisions."
            elif coach_personality == "Balanced":
                advice = "Balance is key in investing. You're learning to find the sweet spot between growth and stability."
            elif coach_personality == "Aggressive":
                advice = "Embrace the challenge! Every investment is a learning opportunity to grow your wealth and knowledge."
            elif coach_personality == "Income":
                advice = "Cash flow is king! Focus on building investments that work for you consistently."
            else:
                # Use the raw AI response as fallback
                advice = advice_text[:200] + \
                    "..." if len(advice_text) > 200 else advice_text

        # Only provide fallback recommendations if AI completely failed
        if not recommendations:
            # Extract coach personality for minimal fallback
            coach_personality = None
            if request.player_context:
                if "Conservative Coach" in request.player_context:
                    coach_personality = "Conservative"
                elif "Balanced Coach" in request.player_context:
                    coach_personality = "Balanced"
                elif "Aggressive Coach" in request.player_context:
                    coach_personality = "Aggressive"
                elif "Income Coach" in request.player_context:
                    coach_personality = "Income"

            # Minimal fallback only when AI fails completely
            if coach_personality == "Conservative":
                recommendations = [
                    "Focus on capital preservation and steady growth",
                    "Learn about bonds and defensive stocks"
                ]
            elif coach_personality == "Balanced":
                recommendations = [
                    "Maintain diversified asset allocation",
                    "Learn about risk-reward trade-offs"
                ]
            elif coach_personality == "Aggressive":
                recommendations = [
                    "Embrace high-growth opportunities",
                    "Learn about emerging markets and innovation"
                ]
            elif coach_personality == "Income":
                recommendations = [
                    "Focus on dividend-paying investments",
                    "Learn about compound interest effects"
                ]
            else:
                recommendations = [
                    "Focus on diversification",
                    "Learn about different asset classes"
                ]

        # Only provide fallback next steps if AI completely failed
        if not next_steps:
            # Extract coach personality for minimal fallback
            coach_personality = None
            if request.player_context:
                if "Conservative Coach" in request.player_context:
                    coach_personality = "Conservative"
                elif "Balanced Coach" in request.player_context:
                    coach_personality = "Balanced"
                elif "Aggressive Coach" in request.player_context:
                    coach_personality = "Aggressive"
                elif "Income Coach" in request.player_context:
                    coach_personality = "Income"

            # Minimal fallback only when AI fails completely
            if coach_personality == "Conservative":
                next_steps = [
                    "Continue building your safe investment foundation"
                ]
            elif coach_personality == "Balanced":
                next_steps = [
                    "Try different portfolio balance strategies"
                ]
            elif coach_personality == "Aggressive":
                next_steps = [
                    "Explore high-growth investment opportunities"
                ]
            elif coach_personality == "Income":
                next_steps = [
                    "Focus on income-generating investments"
                ]
            else:
                next_steps = [
                    "Continue learning about investing"
                ]

        # Only provide fallback risk assessment if AI completely failed
        if not risk_assessment:
            risk_assessment = "Consider your risk tolerance and investment goals when making decisions."

        # Only provide fallback educational insights if AI completely failed
        if not educational_insights:
            educational_insights = [
                "Diversification helps reduce overall portfolio risk"]

        # Only provide fallback encouragement if AI completely failed
        if not encouragement:
            encouragement = "Keep learning and practicing! Every investment is a learning opportunity."

        print(
            f"📋 Parsed: Advice={len(advice)} chars, Recs={len(recommendations)}, Steps={len(next_steps)}")

        return CoachResponse(
            advice=advice,
            recommendations=recommendations[:4],
            next_steps=next_steps[:3],
            risk_assessment=risk_assessment,
            educational_insights=educational_insights,
            encouragement=encouragement
        )

    async def _get_mock_advice(self, request: CoachRequest) -> CoachResponse:
        """Get mock advice when AI is not available"""

        if request.player_level == "beginner":
            return CoachResponse(
                advice="Great job starting your investment journey! Remember, diversification is key to managing risk.",
                recommendations=[
                    "Start with low-risk assets like bonds and ETFs",
                    "Learn about compound interest and time value of money",
                    "Practice with different asset allocations",
                    "Focus on long-term goals rather than short-term gains"
                ],
                next_steps=[
                    "Complete more beginner missions to unlock new assets",
                    "Try different portfolio combinations",
                    "Read about basic investment concepts"
                ],
                risk_assessment="Your current portfolio shows good diversification for a beginner.",
                educational_insights=[
                    "Diversification helps reduce overall portfolio risk",
                    "Time in the market beats timing the market"
                ],
                encouragement="You're building great financial habits! Keep learning and practicing."
            )

        elif request.player_level == "intermediate":
            return CoachResponse(
                advice="You're developing a solid understanding of investment principles. Consider optimizing your risk-return profile.",
                recommendations=[
                    "Rebalance your portfolio regularly",
                    "Consider adding more growth assets if your risk tolerance allows",
                    "Learn about market cycles and economic indicators",
                    "Practice with different time horizons"
                ],
                next_steps=[
                    "Try the portfolio optimization feature",
                    "Experiment with different rebalancing strategies",
                    "Complete advanced missions to unlock more assets"
                ],
                risk_assessment="Your portfolio shows good balance between growth and stability.",
                educational_insights=[
                    "Rebalancing helps maintain target risk levels",
                    "Market volatility is normal and expected"
                ],
                encouragement="You're becoming a confident investor! Keep exploring and learning."
            )

        else:  # advanced
            return CoachResponse(
                advice="Excellent work! You're ready to explore advanced investment strategies and optimization techniques.",
                recommendations=[
                    "Use portfolio optimization tools to maximize risk-adjusted returns",
                    "Consider alternative assets and strategies",
                    "Learn about advanced risk management techniques",
                    "Prepare for real-world investing with proper research"
                ],
                next_steps=[
                    "Master the portfolio optimization features",
                    "Try complex multi-asset strategies",
                    "Learn about advanced financial concepts"
                ],
                risk_assessment="Your portfolio demonstrates sophisticated understanding of risk management.",
                educational_insights=[
                    "Advanced optimization can improve risk-adjusted returns",
                    "Real-world investing requires continuous learning and adaptation"
                ],
                encouragement="You're well-prepared for real-world investing! Keep pushing your knowledge boundaries."
            )
