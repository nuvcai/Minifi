import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { FinancialEvent } from "@/components/data/events";
import { EventCard } from "./EventCard";
import { CompetitionCard } from "./CompetitionCard";

interface TimelineSectionProps {
  events: FinancialEvent[];
  competitionUnlocked: boolean;
  onEventClick: (event: FinancialEvent) => void;
  onStartCompetition: () => void;
}

export function TimelineSection({ 
  events, 
  competitionUnlocked, 
  onEventClick, 
  onStartCompetition 
}: TimelineSectionProps) {
  return (
    <Card className="border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6 pb-3 sm:pb-6">
        <CardTitle className="font-serif flex items-center gap-2 text-lg sm:text-xl">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          Financial History Timeline
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          <span className="hidden sm:inline">Travel through time and experience major financial events. </span>
          Tap events to start missions!
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="relative">
          {/* Timeline Line - Adjusted position for mobile */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          {/* Timeline Events */}
          <div className="space-y-4 sm:space-y-8">
            {events.map((event) => (
              <EventCard
                key={event.year}
                event={event}
                onEventClick={onEventClick}
              />
            ))}

            <CompetitionCard
              unlocked={competitionUnlocked}
              onStartCompetition={onStartCompetition}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}