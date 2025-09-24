import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DateNavigator = () => {
  return (
    <div className="flex items-center justify-between rounded-lg text-card-foreground pt-8 pb-3 bg-background">
      <Button
        variant="outline"
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        <ChevronLeft className="h-4 w-4 mr-2 text-primary" />
        Previous Day
      </Button>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Today&apos;s Vocabulary</h2>
        <p className="text-sm text-muted-foreground">June 15, 2023</p>
      </div>
      <Button
        variant="outline"
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        Next Day
        <ChevronRight className="h-4 w-4 ml-2 text-primary" />
      </Button>
    </div>
  );
};
