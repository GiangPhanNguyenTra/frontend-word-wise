import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconColorVariants = {
  "Total Words": "bg-blue-100 text-blue-600",
  Collections: "bg-green-100 text-green-600",
  "Today's Words": "bg-purple-100 text-purple-600",
  "Learning Streak": "bg-red-100 text-red-600",
};

interface StatCardProps {
  title: keyof typeof iconColorVariants;
  value: string;
  icon: LucideIcon;
}

export const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <Card className="shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            iconColorVariants[title] || "bg-gray-100 text-gray-600"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
