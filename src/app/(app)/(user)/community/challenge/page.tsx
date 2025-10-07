"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Pencil, Crosshair, Share2 } from "lucide-react";

export default function ChallengePage() {
  const games = [
    {
      title: "Definition Match",
      description:
        "Drag words to their correct definitions. Test your vocabulary knowledge!",
      icon: <Link className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#2563EB] to-[#5087FF]",
      buttonColor: "bg-[#2563EB] hover:bg-[#1E4FCC]",
    },
    {
      title: "Fill in the Blank",
      description:
        "Complete sentences with missing words. Challenge your contextual understanding!",
      icon: <Pencil className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#00966D] to-[#27F8BF]",
      buttonColor: "bg-[#00966D] hover:bg-[#007C5A]",
    },
    {
      title: "Word Shooter",
      description:
        "Shoot the correct words as definitions fall. Fast-paced vocabulary action!",
      icon: <Crosshair className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#C30000] to-[#FD9898]",
      buttonColor: "bg-[#C30000] hover:bg-[#A00000]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center gap-8">
      {games.map((game, index) => (
        <Card
          key={index}
          className="w-full max-w-5xl overflow-hidden shadow-lg border-0 rounded-2xl"
        >
          {/* Header màu gradient */}
          <div
            className={`${game.color} flex justify-center items-center py-10`}
          >
            {game.icon}
          </div>

          {/* Nội dung chính */}
          <CardContent className="p-8 flex flex-col gap-4 relative">
            {/* Nút share góc phải */}
            <Share2 className="absolute top-8 right-8 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {game.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{game.description}</p>
            </div>

            {/* Nút Play now ở dưới cùng */}
            <div className="pt-2 w-full inline-flex justify-center">
              <Button className={`${game.buttonColor} text-white px-6 mt-2`}>
                Play now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
