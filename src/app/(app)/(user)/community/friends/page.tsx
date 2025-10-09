"use client";

import { useState } from "react";
import { MessageSquare, UserMinus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data bạn bè
const friends = [
  {
    id: 1,
    name: "Linh Nguyen",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastOnline: "5 minutes ago",
  },
  {
    id: 2,
    name: "Minh Tran",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastOnline: "2 hours ago",
  },
  {
    id: 3,
    name: "Quang Le",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastOnline: "1 day ago",
  },
  {
    id: 4,
    name: "Trang Pham",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastOnline: "3 days ago",
  },
  {
    id: 5,
    name: "Tuan Vo",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastOnline: "1 week ago",
  },
  {
    id: 6,
    name: "Huyen Do",
    avatar: "https://i.pravatar.cc/150?img=6",
    lastOnline: "2 weeks ago",
  },
];

// Mock data pending requests
const pendingRequests = [
  {
    id: 101,
    name: "Khoa Phan",
    avatar: "https://i.pravatar.cc/150?img=7",
    lastOnline: "Active now",
  },
  {
    id: 102,
    name: "Lan Huynh",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastOnline: "10 minutes ago",
  },
  {
    id: 103,
    name: "Bao Nguyen",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastOnline: "30 minutes ago",
  },
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");

  const renderUserGrid = (
    users: typeof friends,
    type: "friends" | "pending"
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {users.map((user) => (
        <Card
          key={user.id}
          className="rounded-2xl shadow-sm border border-gray-200"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex-row inline-flex w-full justify-start gap-4 items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full mb-3 object-cover"
              />

              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-[#A5A6B0] mb-3">{user.lastOnline}</p>
              </div>
            </div>

            {type === "friends" ? (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  className="flex-1 bg-[#2563EB] hover:bg-blue-800 text-white"
                >
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-[#FEF1F1] border-none shadow-none text-[#C30000] hover:bg-[#FBD6D6] hover:text-[#C30000]"
                >
                  Unfriend
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  className="flex-1 bg-[#00966D] hover:bg-[#007A58] text-white"
                >
                  <Check className="w-4 h-4 mr-1" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1  text-red-500 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="w-4 h-4 mr-1" /> Decline
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "friends"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          All Friends
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
      </div>

      {/* Content */}
      {activeTab === "friends"
        ? renderUserGrid(friends, "friends")
        : renderUserGrid(pendingRequests, "pending")}
    </div>
  );
}
