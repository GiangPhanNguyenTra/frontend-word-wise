"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Crosshair,
  Share2,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

export default function ChallengePage() {
  // Mock danh sách bạn bè
  const friends = [
    {
      id: 1,
      name: "Alex Turner",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    {
      id: 2,
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=emma",
    },
    {
      id: 3,
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=michael",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
  ];

  // Quản lý trạng thái popup + checkbox
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const handleToggleFriend = (id: number) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    alert(
      `🎉 Shared with: ${friends
        .filter((f) => selectedFriends.includes(f.id))
        .map((f) => f.name)
        .join(", ")}`
    );
    setOpen(false);
    setSelectedFriends([]);
  };

  // Dữ liệu game
  const games = [
    {
      title: "Definition Match",
      description:
        "Drag words to their correct definitions. Test your vocabulary knowledge!",
      icon: <LinkIcon className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#2563EB] to-[#5087FF]",
      buttonColor: "bg-[#2563EB] hover:bg-[#1E4FCC]",
      href: "/community/challenge/definition",
    },
    {
      title: "Fill in the Blank",
      description:
        "Complete sentences with missing words. Challenge your contextual understanding!",
      icon: <Pencil className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#00966D] to-[#27F8BF]",
      buttonColor: "bg-[#00966D] hover:bg-[#007C5A]",
      href: "/community/challenge/fill-blank",
    },
    {
      title: "Word Shooter",
      description:
        "Shoot the correct words as definitions fall. Fast-paced vocabulary action!",
      icon: <Crosshair className="w-12 h-12 text-white" />,
      color: "bg-gradient-to-r from-[#C30000] to-[#FD9898]",
      buttonColor: "bg-[#C30000] hover:bg-[#A00000]",
      href: "/community/challenge/word-shooter",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:p-4 flex flex-col items-center gap-8">
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
            {/* Nút Share mở Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Share2 className="absolute top-8 right-8 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share with friends</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{friend.name}</span>
                      </div>
                      <Checkbox
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={() => handleToggleFriend(friend.id)}
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button
                    className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white w-full"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {game.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{game.description}</p>
            </div>

            {/* Nút Play now */}
            <div className="pt-2 w-full inline-flex justify-center">
              <Link href={game.href} className="w-fit">
                <Button className={`${game.buttonColor} text-white px-6 mt-2`}>
                  Play now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
