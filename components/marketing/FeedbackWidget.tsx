/**
 * FeedbackWidget.tsx - Quick feedback collection for user insights
 * Floating widget for gathering product feedback and feature requests
 */

"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Bug,
  Heart,
  Send,
  X,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FeedbackType = "love" | "idea" | "issue" | "general";
type FeedbackStatus = "idle" | "loading" | "success" | "error";

interface FeedbackOption {
  type: FeedbackType;
  icon: React.ReactNode;
  label: string;
  emoji: string;
  color: string;
  placeholder: string;
}

const feedbackOptions: FeedbackOption[] = [
  {
    type: "love",
    icon: <Heart className="h-4 w-4" />,
    label: "Love It",
    emoji: "💖",
    color: "from-pink-500 to-rose-500",
    placeholder: "What do you love about Legacy Guardians? Tell us!"
  },
  {
    type: "idea",
    icon: <Lightbulb className="h-4 w-4" />,
    label: "Feature Idea",
    emoji: "💡",
    color: "from-amber-500 to-orange-500",
    placeholder: "What feature would make this even better?"
  },
  {
    type: "issue",
    icon: <Bug className="h-4 w-4" />,
    label: "Report Issue",
    emoji: "🐛",
    color: "from-red-500 to-orange-500",
    placeholder: "What went wrong? Help us fix it!"
  },
  {
    type: "general",
    icon: <MessageSquare className="h-4 w-4" />,
    label: "Other",
    emoji: "💬",
    color: "from-blue-500 to-cyan-500",
    placeholder: "Any other thoughts or feedback?"
  }
];

interface QuickReaction {
  emoji: string;
  label: string;
  value: number;
}

const quickReactions: QuickReaction[] = [
  { emoji: "😍", label: "Love it!", value: 5 },
  { emoji: "😊", label: "Like it", value: 4 },
  { emoji: "😐", label: "It's okay", value: 3 },
  { emoji: "😕", label: "Needs work", value: 2 },
  { emoji: "😢", label: "Not for me", value: 1 }
];

interface FeedbackWidgetProps {
  variant?: "floating" | "inline" | "compact";
  pageContext?: string;
  className?: string;
  onSubmit?: (feedback: { type: FeedbackType; message: string; rating?: number }) => void;
}

export function FeedbackWidget({
  variant = "inline",
  pageContext = "general",
  className = "",
  onSubmit
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<FeedbackStatus>("idle");

  const handleSubmit = async () => {
    if (!selectedType || !message.trim()) return;
    
    setStatus("loading");
    
    try {
      // TODO: Replace with your actual feedback API
      // Could integrate with:
      // - Your backend /api/feedback endpoint
      // - Notion API for feedback database
      // - Airtable
      // - Google Sheets via Apps Script
      // - Discord webhook for real-time alerts
      
      const feedbackData = {
        type: selectedType,
        message: message.trim(),
        rating: rating || undefined,
        pageContext,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      };

      // Submit to API
      const response = await fetch('/api/feedback', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData) 
      });
      
      // Also call the onSubmit callback if provided
      onSubmit?.(feedbackData);
      setStatus("success");
      
      // Reset after delay
      setTimeout(() => {
        if (variant === "floating") {
          setIsOpen(false);
        }
        setSelectedType(null);
        setMessage("");
        setRating(null);
        setStatus("idle");
      }, 2000);
      
    } catch (error) {
      setStatus("error");
    }
  };

  const selectedOption = feedbackOptions.find(o => o.type === selectedType);

  // Floating button variant
  if (variant === "floating") {
    return (
      <>
        {/* Floating trigger button */}
        <button
          onClick={() => setIsOpen(true)}
          className={`
            fixed bottom-6 right-6 z-50
            p-4 rounded-full shadow-2xl
            bg-linear-to-r from-purple-500 to-pink-500
            hover:from-purple-600 hover:to-pink-600
            text-white transition-all duration-300
            hover:scale-110 active:scale-95
            ${isOpen ? 'hidden' : 'block'}
            ${className}
          `}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
        </button>

        {/* Floating panel */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-80 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-linear-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-slate-100">Share Feedback</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {status === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-slate-100">Thanks! 🙏</h4>
                    <p className="text-sm text-slate-400">Your feedback helps us improve!</p>
                  </div>
                ) : (
                  <>
                    {/* Type selection */}
                    {!selectedType ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400 mb-3">What would you like to share?</p>
                        {feedbackOptions.map((option) => (
                          <button
                            key={option.type}
                            onClick={() => setSelectedType(option.type)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800 transition-all group"
                          >
                            <div className={`p-2 rounded-lg bg-linear-to-br ${option.color} text-white`}>
                              {option.icon}
                            </div>
                            <span className="font-medium text-slate-200 group-hover:text-white">
                              {option.label}
                            </span>
                            <span className="ml-auto text-lg">{option.emoji}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Selected type badge */}
                        <div className="flex items-center justify-between">
                          <Badge className={`bg-linear-to-r ${selectedOption?.color} text-white border-0`}>
                            {selectedOption?.emoji} {selectedOption?.label}
                          </Badge>
                          <button
                            onClick={() => setSelectedType(null)}
                            className="text-xs text-slate-500 hover:text-slate-300"
                          >
                            Change
                          </button>
                        </div>

                        {/* Quick reactions for "love" type */}
                        {selectedType === "love" && (
                          <div className="flex justify-center gap-2">
                            {quickReactions.map((reaction) => (
                              <button
                                key={reaction.value}
                                onClick={() => setRating(reaction.value)}
                                className={`
                                  p-2 rounded-lg transition-all
                                  ${rating === reaction.value 
                                    ? 'bg-purple-500/20 scale-110' 
                                    : 'hover:bg-slate-800'
                                  }
                                `}
                                title={reaction.label}
                              >
                                <span className="text-xl">{reaction.emoji}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message input */}
                        <Textarea
                          placeholder={selectedOption?.placeholder}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 min-h-[100px] resize-none"
                        />

                        {/* Submit */}
                        <Button
                          onClick={handleSubmit}
                          disabled={!message.trim() || status === "loading"}
                          className={`w-full bg-linear-to-r ${selectedOption?.color} text-white hover:opacity-90`}
                        >
                          {status === "loading" ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Send Feedback
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Compact inline variant
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          {status === "success" ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Thanks for your feedback! 💚</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-200">Quick Feedback</span>
              </div>
              
              {/* Quick reaction buttons */}
              <div className="flex gap-2 mb-3">
                {quickReactions.slice(0, 3).map((reaction) => (
                  <button
                    key={reaction.value}
                    onClick={() => setRating(reaction.value)}
                    className={`
                      flex-1 p-2 rounded-lg border transition-all text-center
                      ${rating === reaction.value 
                        ? 'bg-purple-500/20 border-purple-500/30' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      }
                    `}
                  >
                    <span className="text-lg">{reaction.emoji}</span>
                  </button>
                ))}
              </div>
              
              {rating && (
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Tell us more (optional)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 min-h-[60px] resize-none text-sm"
                  />
                  <Button
                    onClick={() => {
                      setSelectedType("general");
                      handleSubmit();
                    }}
                    size="sm"
                    disabled={status === "loading"}
                    className="bg-purple-500 hover:bg-purple-600 self-end"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Full inline variant
  return (
    <div className={`${className}`}>
      <div className="bg-linear-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50">
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Thanks for your feedback! 🎉</h3>
            <p className="text-slate-400">Your input helps us build a better experience for everyone.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-pink-500">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">We&apos;d Love Your Feedback</h3>
                <p className="text-sm text-slate-400">Help us make Legacy Guardians even better!</p>
              </div>
            </div>

            {/* Feedback type grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {feedbackOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSelectedType(option.type)}
                  className={`
                    p-4 rounded-xl border transition-all
                    ${selectedType === option.type 
                      ? `bg-linear-to-br ${option.color} border-transparent text-white` 
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 text-slate-300'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Message area */}
            {selectedType && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-200">
                {/* Rating for positive feedback */}
                {selectedType === "love" && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">How much do you love it?</p>
                    <div className="flex justify-center gap-3">
                      {quickReactions.map((reaction) => (
                        <button
                          key={reaction.value}
                          onClick={() => setRating(reaction.value)}
                          className={`
                            p-3 rounded-xl transition-all
                            ${rating === reaction.value 
                              ? 'bg-linear-to-br from-pink-500/20 to-purple-500/20 scale-110 border border-pink-500/30' 
                              : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'
                            }
                          `}
                          title={reaction.label}
                        >
                          <span className="text-2xl">{reaction.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Textarea
                  placeholder={selectedOption?.placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 min-h-[120px]"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "loading"}
                  className={`w-full bg-linear-to-r ${selectedOption?.color} hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl`}
                >
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  Submit Feedback
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackWidget;

