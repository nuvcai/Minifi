import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/shared/DataCard";
import { Trophy, BookOpen, Play, Target } from "lucide-react";
import { FinancialEvent } from "@/components/data/events";
import { AICoach } from "@/components/data/coaches";
import { Badge } from "@/components/ui/badge";
import { III_CONFIG } from "@/hooks/useIII";

interface EventDetailModalProps {
  event: FinancialEvent | null;
  selectedCoach: AICoach;
  onClose: () => void;
  onStartMission: () => void;
}

export function EventDetailModal({
  event,
  selectedCoach,
  onClose,
  onStartMission,
}: EventDetailModalProps) {
  if (!event) return null;

  const getCoachStrategy = () => {
    switch (selectedCoach.id) {
      case "steady-sam":
        return "Keep cool when things get crazy! 😎 Safe picks like bonds and gold are our jam.";
      case "growth-guru":
        return "Don't put all your eggs in one basket! Mix it up with different investments for the win. ⚖️";
      case "adventure-alex":
        return "When everyone else panics, that's when the real opportunities pop up! Let's hunt for gems! 💎";
      case "yield-yoda":
        return "Make your money work for YOU. Passive income + compound interest = magic! ✨";
      default:
        return "Let's read the market vibes and make smart moves! 🎯";
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[95dvh] sm:h-auto overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {event.year} - {event.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DataCard
              icon={<Trophy className="h-8 w-8 text-accent" />}
              title={`Reward ${III_CONFIG.symbol}`}
              value={`${event.reward} ${III_CONFIG.symbol}`}
            />
            <DataCard
              icon={<BookOpen className="h-8 w-8 text-secondary" />}
              title="Difficulty Level"
              value={
                event.difficulty === "beginner"
                  ? "Beginner"
                  : event.difficulty === "intermediate"
                  ? "Intermediate"
                  : event.difficulty === "advanced"
                  ? "Advanced"
                  : "Expert"
              }
            />
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="relative">
                    <Image
                      src={selectedCoach.avatar}
                      alt={selectedCoach.name}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-primary/20 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Target className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h4 className="font-bold text-lg">
                        {selectedCoach.name}
                      </h4>
                      <Badge className="text-primary bg-primary/10">
                        {selectedCoach.personality}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoach.description}
                    </p>
                  </div>
                  <div className="bg-accent/10 pl-4 pr-3 py-3 rounded-md border-l-2 border-accent/30 -ml-4">
                    <p className="text-sm">
                      <span className="font-semibold text-accent-foreground flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4" />
                        My Game Plan:
                      </span>
                      <span className="text-muted-foreground">
                        {getCoachStrategy()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button onClick={onStartMission} className="w-full min-h-[48px] font-medium bg-gradient-to-r from-[#9898f2] to-[#7070c0] hover:from-[#8585e0] hover:to-[#6060b0] text-white">
              <Play className="h-4 w-4 mr-2" />
              Let&apos;s Go! 🚀
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full min-h-[48px]">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
