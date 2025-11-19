"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigator = ({
  currentDate,
  onDateChange,
}: DateNavigatorProps) => {
  const isToday = isSameDay(currentDate, new Date());

  const handlePrevious = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (!isToday) {
      onDateChange(addDays(currentDate, 1));
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg text-card-foreground pt-8 pb-3 bg-background">
      <Button
        variant="outline"
        onClick={handlePrevious}
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Previous Day</span>
      </Button>

      <div className="text-center flex-1">
        <h2 className="text-lg sm:text-2xl font-semibold">
          {isToday ? "Today's Vocabulary" : "Vocabulary Highlights"}
        </h2>
        <p className="text-sm sm:text-sm text-muted-foreground">
          {format(currentDate, "MMMM dd, yyyy")}
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={isToday}
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next Day</span>
        <ChevronRight className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
};
