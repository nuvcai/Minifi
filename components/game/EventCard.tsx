import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DifficultyMeter } from "./DifficultyMeter";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trophy,
  Play,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";

interface EventCardProps {
  event: FinancialEvent;
  onEventClick: (event: FinancialEvent) => void;
}

export function EventCard({ event, onEventClick }: EventCardProps) {
  const getImpactIcon = () => {
    switch (event.impact) {
      case "negative":
        return <TrendingDown className="h-6 w-6" />;
      case "mixed":
        return <DollarSign className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getNodeStyle = () => {
    if (event.completed) {
      return "bg-emerald-500 border-emerald-500 text-white";
    }
    if (event.unlocked) {
      return "bg-slate-800 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white cursor-pointer";
    }
    return "bg-slate-800 border-slate-600 text-slate-500";
  };

  // Check if this is a "new" event (unlocked but not completed)
  const isNewEvent = event.unlocked && !event.completed;

  return (
    <div className="relative flex items-start gap-6">
      {/* Timeline Node */}
      <div
        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${getNodeStyle()} transition-all duration-300`}
        onClick={() => onEventClick(event)}
      >
        {event.completed ? <Trophy className="h-6 w-6" /> : getImpactIcon()}
        
        {/* NEW Badge - Pulsing indicator for available missions */}
        {isNewEvent && (
          <div className="absolute -top-1 -right-1 z-20">
            <Badge 
              className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg animate-pulse"
            >
              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
              NEW
            </Badge>
          </div>
        )}
      </div>

      {/* Event Card */}
      <div className={`flex-1 ${!event.unlocked ? "opacity-50" : ""}`}>
        <Card
          style={{
            backgroundImage: `url(${event.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`relative overflow-hidden transition-all duration-300 transform border-slate-700/50
    ${
      event.unlocked
        ? "hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:scale-[1.01] cursor-pointer hover:border-emerald-500/30"
        : ""
    }
    ${
      isNewEvent
        ? "ring-2 ring-amber-500/30 ring-offset-2 ring-offset-slate-900"
        : ""
    }
  `}
          onClick={() => onEventClick(event)}
        >
          {/* Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-slate-900/90 z-[1]" />
          {/* Card Content */}
          <div className="relative z-[2]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-100">
                    {event.year}
                  </CardTitle>
                  <CardDescription className="font-medium text-slate-300 mt-1">
                    {event.title}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <DifficultyMeter 
                    difficulty={event.difficulty as "beginner" | "intermediate" | "advanced" | "expert"} 
                    size="sm"
                  />
                  <StatusBadge
                    status={
                      event.completed
                        ? "completed"
                        : event.unlocked
                        ? "available"
                        : "locked"
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-3">
                {event.description}
              </p>
              {!event.unlocked && event.unlockDescription && (
                <div className="mb-3 p-2 bg-slate-800/50 rounded-md border border-slate-700/50">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    {event.unlockDescription}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span>{event.reward} XP</span>
                </div>
                
                {/* New Mission - Available but not completed */}
                {event.unlocked && !event.completed && (
                  <Button
                    size="sm"
                    className="font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Mission
                  </Button>
                )}
                
                {/* Completed Mission - Can be replayed */}
                {event.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-medium border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700 hover:border-emerald-500/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Replay Mission
                  </Button>
                )}
                
                {/* Locked Mission */}
                {!event.unlocked && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="font-medium bg-transparent border-slate-700 text-slate-500"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Locked
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
