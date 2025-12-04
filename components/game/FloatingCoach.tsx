"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  Send,
  Sparkles,
} from "lucide-react";
import { AICoach } from "@/components/data/coaches";

interface FloatingCoachProps {
  coach: AICoach;
  onAskQuestion?: (question: string) => void;
  notification?: {
    type: "tip" | "warning" | "celebration";
    message: string;
  } | null;
  onDismissNotification?: () => void;
}

const quickActions = [
  { id: "explain", icon: HelpCircle, label: "Explain this", prompt: "Can you explain what's happening in the market right now?" },
  { id: "tip", icon: Lightbulb, label: "Give me a tip", prompt: "What's a good investment tip for my current situation?" },
  { id: "strategy", icon: TrendingUp, label: "Strategy help", prompt: "What strategy should I consider for my portfolio?" },
];

export function FloatingCoach({
  coach,
  onAskQuestion,
  notification,
  onDismissNotification,
}: FloatingCoachProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Animate notification badge
  useEffect(() => {
    if (notification) {
      setHasNewMessage(true);
    }
  }, [notification]);

  const handleQuickAction = (prompt: string) => {
    onAskQuestion?.(prompt);
    setShowQuickActions(false);
    setIsExpanded(false);
  };

  const handleCustomQuestion = () => {
    if (customQuestion.trim()) {
      onAskQuestion?.(customQuestion);
      setCustomQuestion("");
      setIsExpanded(false);
    }
  };

  const getNotificationStyle = () => {
    switch (notification?.type) {
      case "celebration":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "warning":
        return "bg-gradient-to-r from-red-400 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white";
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {/* Notification Popup */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute bottom-20 right-0 w-72 p-4 rounded-2xl shadow-2xl ${getNotificationStyle()}`}
          >
            <button
              onClick={onDismissNotification}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <img
                src={coach.avatar}
                alt={coach.name}
                className="w-10 h-10 rounded-full border-2 border-white/50"
              />
              <div>
                <p className="font-semibold text-sm">{coach.name}</p>
                <p className="text-sm opacity-90 mt-1">{notification.message}</p>
              </div>
            </div>
            {notification.type === "celebration" && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              </div>
            )}
          </motion.div>
        )}

        {/* Expanded Panel */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80"
          >
            <Card className="p-4 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  />
                  <div>
                    <p className="font-semibold text-sm">{coach.name}</p>
                    <p className="text-xs text-muted-foreground">{coach.personality}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.prompt)}
                      className="justify-start gap-2 h-10 hover:bg-primary/10 hover:border-primary transition-all"
                    >
                      <action.icon className="h-4 w-4 text-primary" />
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Question */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Ask Anything
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomQuestion()}
                    className="h-10 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleCustomQuestion}
                    disabled={!customQuestion.trim()}
                    className="h-10 px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => {
          setIsExpanded(!isExpanded);
          setHasNewMessage(false);
        }}
        className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden border-4 border-white bg-gradient-to-br from-primary to-primary/80 hover:scale-110 transition-transform active:scale-95"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={hasNewMessage ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: hasNewMessage ? Infinity : 0, duration: 1 }}
      >
        <img
          src={coach.gif || coach.avatar}
          alt={coach.name}
          className="w-full h-full object-cover"
        />
        
        {/* Notification Badge */}
        {hasNewMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        )}

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>
    </div>
  );
}

