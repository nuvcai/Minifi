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
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Clock className="h-5 w-5 text-cyan-400" />
          Financial History Timeline
        </CardTitle>
        <CardDescription className="text-slate-400">
          Travel through time and experience major financial events.
          Click on events to start your investment missions!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-emerald-500/50 via-teal-500/50 to-cyan-500/50"></div>

          {/* Timeline Events */}
          <div className="space-y-8">
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