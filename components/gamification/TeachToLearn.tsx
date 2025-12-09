'use client';

/**
 * 🎓 TEACH TO LEARN - Feynman Technique Implementation
 * 
 * "If you can't explain it simply, you don't understand it well enough"
 * - Richard Feynman
 * 
 * This component appears after mission completion to reinforce learning
 * by having users explain the concept in their own words.
 * 
 * EDUCATIONAL RESEARCH:
 * - Teaching increases retention by 90% (Learning Pyramid)
 * - Explaining creates "elaborative interrogation" (deeper processing)
 * - Creates shareable content that feels authentic, not ads
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Lightbulb,
  BookOpen,
  MessageCircle,
  Sparkles,
  Share2,
  Trophy,
  Zap,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

interface TeachToLearnProps {
  // Mission context
  missionYear: number;
  missionTitle: string;
  
  // The key concept to explain
  conceptName: string;
  conceptExplanation: string; // The "correct" simple explanation
  
  // Example prompts
  examplePrompts: string[];
  
  // Rewards
  xpReward: number;
  bonusXpForShare: number;
  
  // Callbacks
  onComplete: (explanation: string, quality: 'basic' | 'good' | 'excellent') => void;
  onSkip: () => void;
  onShare?: (explanation: string) => void;
}

// Quality assessment keywords for each concept
const qualityIndicators = {
  bubble: ['euphoria', 'disconnect', 'price', 'value', 'fomo', 'real', 'hype'],
  diversification: ['spread', 'different', 'balance', 'protect', 'correlation', 'risk'],
  crisis: ['opportunity', 'fear', 'greedy', 'patient', 'discount', 'buy'],
  trend: ['accelerate', 'existing', 'fast-forward', 'change', 'adapt'],
};

export function TeachToLearn({
  missionYear,
  missionTitle,
  conceptName,
  conceptExplanation,
  examplePrompts,
  xpReward = 50,
  bonusXpForShare = 25,
  onComplete,
  onSkip,
  onShare,
}: TeachToLearnProps) {
  const [showModal, setShowModal] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [stage, setStage] = useState<'intro' | 'writing' | 'feedback'>('intro');
  const [quality, setQuality] = useState<'basic' | 'good' | 'excellent'>('basic');
  const [earnedXp, setEarnedXp] = useState(0);
  
  // Analyze the quality of the explanation
  const analyzeQuality = (text: string): 'basic' | 'good' | 'excellent' => {
    const lowerText = text.toLowerCase();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    // Count quality indicators
    let indicatorCount = 0;
    Object.values(qualityIndicators).forEach(indicators => {
      indicators.forEach(indicator => {
        if (lowerText.includes(indicator)) indicatorCount++;
      });
    });
    
    // Check for personal connection
    const hasPersonalTouch = /i think|my friend|like when|for example|imagine/i.test(text);
    
    // Determine quality
    if (wordCount >= 30 && indicatorCount >= 3 && hasPersonalTouch) {
      return 'excellent';
    } else if (wordCount >= 15 && indicatorCount >= 2) {
      return 'good';
    }
    return 'basic';
  };
  
  const handleSubmit = () => {
    const assessedQuality = analyzeQuality(explanation);
    setQuality(assessedQuality);
    
    // Calculate XP
    const multiplier = assessedQuality === 'excellent' ? 2 : assessedQuality === 'good' ? 1.5 : 1;
    const earned = Math.round(xpReward * multiplier);
    setEarnedXp(earned);
    
    setStage('feedback');
  };
  
  const handleComplete = () => {
    onComplete(explanation, quality);
    setShowModal(false);
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare(explanation);
    }
    // Also complete
    onComplete(explanation, quality);
    setShowModal(false);
  };
  
  const handleSkip = () => {
    onSkip();
    setShowModal(false);
  };

  const feedbackMessages = {
    basic: {
      emoji: '👍',
      title: 'Good Start!',
      message: "You've got the basics! Try adding an example next time for even better retention.",
      tip: 'Tip: Explain it like you\'re texting a friend',
    },
    good: {
      emoji: '🔥',
      title: 'Nice Explanation!',
      message: 'You clearly understand this concept. Your brain just locked in this knowledge!',
      tip: 'Fun fact: Teaching doubles your retention',
    },
    excellent: {
      emoji: '🏆',
      title: 'Expert Level!',
      message: 'You explained this better than most textbooks! You could teach this to others.',
      tip: 'You\'re in the top 10% of explainers!',
    },
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-indigo-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-900">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            {stage === 'feedback' ? 'Great Job!' : 'Teach to Learn'}
          </DialogTitle>
          <DialogDescription>
            {stage === 'intro' && 'The best way to remember is to teach. Can you explain what you learned?'}
            {stage === 'writing' && 'Write it like you\'re explaining to a friend who knows nothing about investing.'}
            {stage === 'feedback' && 'Here\'s how you did:'}
          </DialogDescription>
        </DialogHeader>

        {/* Stage: Intro */}
        {stage === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-900">
                    You just learned: {conceptName}
                  </p>
                  <p className="text-sm text-indigo-700 mt-1">
                    From the {missionYear} {missionTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">Why explain it?</strong> Research shows that teaching a concept increases your retention by 90%! 🧠
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-amber-800">Reward</span>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                +{xpReward}-{xpReward * 2} 🪙 based on quality
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStage('writing')}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Explain It
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-gray-500 border-gray-300"
              >
                Skip (-50% XP)
              </Button>
            </div>
          </div>
        )}

        {/* Stage: Writing */}
        {stage === 'writing' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="font-medium text-indigo-900 mb-2">
                💡 Prompt: Explain "{conceptName}" to a friend
              </p>
              <p className="text-sm text-indigo-700">
                Imagine your friend asks: "What did you learn about investing today?"
              </p>
            </div>

            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={examplePrompts[0] || "So basically what I learned is..."}
              className="min-h-[120px] bg-white border-indigo-200 focus:border-indigo-400"
            />

            {/* Character count and tips */}
            <div className="flex items-center justify-between text-sm">
              <span className={`${explanation.length < 50 ? 'text-gray-400' : 'text-green-600'}`}>
                {explanation.length} characters
                {explanation.length < 50 && ' (aim for 50+)'}
              </span>
              <span className="text-gray-400">
                Tip: Add an example or analogy for bonus XP!
              </span>
            </div>

            {/* Starter prompts */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Need help starting?</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setExplanation(prompt + ' ')}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                  >
                    {prompt}...
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={explanation.length < 20}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Submit & Get XP
              </Button>
              <Button
                variant="outline"
                onClick={() => setStage('intro')}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Stage: Feedback */}
        {stage === 'feedback' && (
          <div className="space-y-4">
            {/* Quality feedback */}
            <div className={`p-4 rounded-xl text-center ${
              quality === 'excellent' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300' :
              quality === 'good' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300' :
              'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
            } border-2`}>
              <div className="text-4xl mb-2">{feedbackMessages[quality].emoji}</div>
              <h3 className="font-bold text-lg text-gray-900">
                {feedbackMessages[quality].title}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                {feedbackMessages[quality].message}
              </p>
            </div>

            {/* XP earned */}
            <div className="flex items-center justify-center gap-2 py-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                +{earnedXp} 🪙 earned!
              </span>
            </div>

            {/* Your explanation */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Your explanation:</p>
              <p className="text-sm text-gray-700 italic">"{explanation}"</p>
            </div>

            {/* Tip */}
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700">
                💡 {feedbackMessages[quality].tip}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              {/* Share option */}
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share my explanation (+{bonusXpForShare} 🪙)
              </Button>
              
              {/* Continue */}
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Pre-built prompts for each major concept
export const CONCEPT_PROMPTS: Record<string, {
  name: string;
  prompts: string[];
}> = {
  bubble_recognition: {
    name: "Spotting Market Bubbles",
    prompts: [
      "So when everyone's super excited about stocks",
      "I learned that bubbles happen when",
      "It's like when prices go way higher than",
    ]
  },
  diversification: {
    name: "Diversification",
    prompts: [
      "Diversification is basically like having",
      "Rich families spread their money because",
      "When one investment goes down",
    ]
  },
  crisis_investing: {
    name: "Crisis Investing",
    prompts: [
      "During market crashes, smart investors",
      "The trick is to be greedy when",
      "Crashes are actually good for long-term investors because",
    ]
  },
  trend_acceleration: {
    name: "Trend Acceleration",
    prompts: [
      "Big events don't create new trends, they",
      "COVID didn't invent remote work, it",
      "The smart question during a crisis is",
    ]
  },
};

export default TeachToLearn;
