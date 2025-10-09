import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DateNavigator = () => {
  return (
    <div className="flex items-center justify-between rounded-lg text-card-foreground pt-8 pb-3 bg-background">
      {/* Nút Previous */}
      <Button
        variant="outline"
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Previous Day</span>
      </Button>

      {/* Giữa màn hình */}
      <div className="text-center flex-1">
        <h2 className="text-lg sm:text-2xl font-semibold">
          Today&apos;s Vocabulary
        </h2>
        <p className="text-sm sm:text-sm text-muted-foreground">
          June 15, 2023
        </p>
      </div>

      {/* Nút Next */}
      <Button
        variant="outline"
        className="!text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center gap-2"
      >
        <span className="hidden sm:inline">Next Day</span>
        <ChevronRight className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
};
