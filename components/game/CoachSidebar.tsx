/**
 * CoachSidebar - Enhanced coach selection
 * Interactive cards with animations and status indicators
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AICoach } from "@/components/data/coaches";
import { 
  MessageCircle, 
  Star, 
  Sparkles, 
  Check, 
  ChevronRight,
  Brain,
  Zap,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CoachSidebarProps {
  coaches: AICoach[];
  selectedCoach: AICoach;
  onCoachSelect: (coach: AICoach) => void;
}

const coachSpecialties: Record<string, { icon: React.ReactNode; specialty: string; color: string }> = {
  sage: { icon: <Brain className="h-3 w-3" />, specialty: "Deep Analysis", color: "from-blue-500 to-indigo-500" },
  mentor: { icon: <Heart className="h-3 w-3" />, specialty: "Patient Teaching", color: "from-rose-500 to-pink-500" },
  strategist: { icon: <Zap className="h-3 w-3" />, specialty: "Quick Decisions", color: "from-amber-500 to-orange-500" },
  analyst: { icon: <Star className="h-3 w-3" />, specialty: "Data Expert", color: "from-emerald-500 to-teal-500" },
};

export function CoachSidebar({
  coaches,
  selectedCoach,
  onCoachSelect,
}: CoachSidebarProps) {
  const [hoveredCoach, setHoveredCoach] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const getCoachSpecialty = (coachId: string) => {
    return coachSpecialties[coachId] || coachSpecialties.mentor;
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xl shadow-indigo-100/50 border border-indigo-100 overflow-hidden">
      {/* Header - Clickable on mobile to expand/collapse */}
      <button 
        className="w-full flex items-center gap-2 mb-4 sm:mb-5 lg:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="text-left flex-1">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Your AI Coach</h3>
          <p className="text-xs text-gray-500">Choose your guide</p>
        </div>
        <Sparkles className="h-4 w-4 text-amber-400" />
        {/* Mobile expand indicator */}
        <ChevronRight className={`h-4 w-4 text-gray-400 lg:hidden transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {/* Selected Coach Preview - Always visible, compact on mobile */}
      <div className="relative mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-2 border-indigo-200 shadow-lg">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl" />
        
        <div className="relative flex items-center gap-3 sm:gap-4">
          {/* Avatar with ring */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full blur opacity-50" />
            <Image
              src={selectedCoach.avatar}
              alt={selectedCoach.name}
              width={64}
              height={64}
              className="relative rounded-full ring-4 ring-white shadow-xl w-12 h-12 sm:w-16 sm:h-16"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 rounded-full border-2 sm:border-3 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base sm:text-lg truncate">{selectedCoach.name}</p>
            <p className="text-xs sm:text-sm text-indigo-600 font-medium truncate">{selectedCoach.personality}</p>
            
            {/* Specialty badge */}
            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
              <Badge 
                className={`bg-gradient-to-r ${getCoachSpecialty(selectedCoach.id).color} text-white border-0 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5`}
              >
                {getCoachSpecialty(selectedCoach.id).icon}
                <span className="ml-1">{getCoachSpecialty(selectedCoach.id).specialty}</span>
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Quick message preview - hidden on mobile by default */}
        <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl bg-white/80 border border-indigo-100 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
          <p className="text-[11px] sm:text-xs text-gray-600 italic">
            &ldquo;Ready to help you master investing! Let&apos;s learn together! 🚀&rdquo;
          </p>
        </div>
      </div>

      {/* Coach List - Collapsible on mobile */}
      <div className={`space-y-2 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <p className="text-xs text-gray-500 font-medium px-1 mb-3">Available Coaches</p>
        
        {coaches.map((coach) => {
          const isSelected = selectedCoach.id === coach.id;
          const isHovered = hoveredCoach === coach.id;
          const specialty = getCoachSpecialty(coach.id);
          
          return (
            <button
              key={coach.id}
              onClick={() => onCoachSelect(coach)}
              onMouseEnter={() => setHoveredCoach(coach.id)}
              onMouseLeave={() => setHoveredCoach(null)}
              className={`w-full p-3 rounded-xl transition-all duration-300 text-left relative overflow-hidden group ${
                isSelected
                  ? "bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-indigo-300 shadow-lg scale-[1.02]"
                  : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-md"
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r" />
              )}
              
              {/* Hover glow effect */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-transparent" />
              )}
              
              <div className="relative flex items-center gap-3">
                {/* Coach Avatar */}
                <div className="relative">
                  <Image
                    src={coach.avatar}
                    alt={coach.name}
                    width={44}
                    height={44}
                    className={`rounded-full transition-all duration-300 ${
                      isSelected 
                        ? "ring-2 ring-indigo-400 shadow-lg" 
                        : isHovered 
                          ? "ring-2 ring-gray-300" 
                          : "opacity-80"
                    }`}
                  />
                  {/* Online dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors ${
                    isSelected ? "bg-emerald-400" : "bg-gray-300"
                  }`} />
                </div>
                
                {/* Coach Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold transition-colors ${
                      isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-800"
                    }`}>
                      {coach.name}
                    </p>
                    {isSelected && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px] px-1.5 py-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs truncate transition-colors ${
                    isSelected ? "text-indigo-600" : "text-gray-500"
                  }`}>
                    {coach.personality}
                  </p>
                  
                  {/* Specialty on hover */}
                  {(isHovered || isSelected) && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className={`p-0.5 rounded bg-gradient-to-r ${specialty.color}`}>
                        <div className="text-white">{specialty.icon}</div>
                      </div>
                      <span className="text-[10px] text-gray-500">{specialty.specialty}</span>
                    </div>
                  )}
                </div>
                
                {/* Selection indicator */}
                <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                  isSelected 
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" 
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                }`}>
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Footer tip - Also collapsible on mobile */}
      <div className={`mt-4 sm:mt-5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-[11px] sm:text-xs text-amber-700">
            Each coach has a unique teaching style. Try them all!
          </p>
        </div>
      </div>
      
      {/* Mobile: Show expand hint when collapsed */}
      {!isExpanded && (
        <p className="lg:hidden text-[10px] text-center text-gray-400 mt-2">
          Tap to see all coaches
        </p>
      )}
    </div>
  );
}
