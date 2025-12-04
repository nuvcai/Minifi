import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/shared/StatusBadge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trophy,
  Play,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
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
      return "bg-primary border-primary text-primary-foreground";
    }
    if (event.unlocked) {
      return "bg-background border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer";
    }
    return "bg-muted border-muted-foreground text-muted-foreground";
  };

  return (
    <div className="relative flex items-start gap-3 sm:gap-6">
      {/* Timeline Node - Smaller on mobile */}
      <div
        className={`relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border-4 ${getNodeStyle()} transition-all duration-300 shrink-0`}
        onClick={() => onEventClick(event)}
      >
        {event.completed ? <Trophy className="h-5 w-5 sm:h-6 sm:w-6" /> : getImpactIcon()}
      </div>

      {/* Event Card */}
      <div className={`flex-1 min-w-0 ${!event.unlocked ? "opacity-50" : ""}`}>
        <Card
          style={{
            backgroundImage: `url(${event.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`relative overflow-hidden transition-all duration-300 transform 
    ${
      event.unlocked
        ? "hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] cursor-pointer active:scale-[0.99]"
        : ""
    }
  `}
          onClick={() => onEventClick(event)}
        >
          {/* Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-white/90 z-[1]" />
          {/* Card Content */}
          <div className="relative z-[2]">
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-serif text-base sm:text-lg">
                      {event.year}
                    </CardTitle>
                    {/* Mobile: Inline XP badge */}
                    <span className="sm:hidden inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
                      <Trophy className="h-3 w-3" />
                      {event.reward}
                    </span>
                  </div>
                  <CardDescription className="font-medium text-foreground mt-0.5 sm:mt-1 text-sm sm:text-base line-clamp-1 sm:line-clamp-none">
                    {event.title}
                  </CardDescription>
                </div>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                  <StatusBadge
                    status={
                      event.completed
                        ? "completed"
                        : event.unlocked
                        ? "available"
                        : "locked"
                    }
                  />
                  <span className="hidden sm:inline">
                    <StatusBadge status={event.difficulty as StatusType} />
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {/* Description - Hidden on mobile for compactness */}
              <p className="hidden sm:block text-sm text-muted-foreground mb-3">
                {event.description}
              </p>
              {!event.unlocked && event.unlockDescription && (
                <div className="mb-2 sm:mb-3 p-2 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="line-clamp-1 sm:line-clamp-none">{event.unlockDescription}</span>
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                {/* XP - Desktop only (mobile shows inline above) */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{event.reward} XP</span>
                </div>
                
                {/* Mobile: spacer */}
                <div className="sm:hidden" />
                
                {/* New Mission - Available but not completed */}
                {event.unlocked && !event.completed && (
                  <Button
                    size="sm"
                    className="font-medium text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden xs:inline">Start </span>Mission
                  </Button>
                )}
                
                {/* Completed Mission - Can be replayed */}
                {event.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-medium border-slate-400 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-500 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    Replay
                  </Button>
                )}
                
                {/* Locked Mission */}
                {!event.unlocked && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="font-medium bg-transparent text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
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
