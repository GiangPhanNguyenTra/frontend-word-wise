// 📂 collections/components/CollectionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Play, Share2 } from "lucide-react";

interface CollectionCardProps {
  title: string;
  words: number;
  lastStudied: string;
}

export function CollectionCard({
  title,
  words,
  lastStudied,
}: CollectionCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">{words} words</p>
          </div>
          <div className="flex gap-2">
            <Pencil className="h-4 w-4 text-gray-400 cursor-pointer" />
            <Play className="h-4 w-4 text-[#2563EB] cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-gray-400">Last studied: {lastStudied}</p>
          <Share2 className="h-4 w-4 text-gray-400 cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  );
}
