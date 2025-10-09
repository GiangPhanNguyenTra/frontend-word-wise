"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const conversations = [
  {
    id: 1,
    name: "Anna Nguyen",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Let's grab coffee tomorrow ☕",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    name: "David Tran",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Sure, I’ll send it later!",
    time: "5h ago",
    unread: false,
  },
  {
    id: 3,
    name: "Lisa Pham",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "That’s so funny 😂",
    time: "1d ago",
    unread: true,
  },
  {
    id: 4,
    name: "Tommy Le",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "See you soon!",
    time: "2d ago",
    unread: false,
  },
];

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto lg:p-2">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="bg-white rounded-xl shadow border divide-y">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => router.push(`/community/messages/${chat.id}`)}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full mb-3 object-cover"
              />
              {chat.unread && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{chat.name}</p>
              <p
                className={`text-sm truncate ${
                  chat.unread ? "text-gray-800 font-medium" : "text-gray-500"
                }`}
              >
                {chat.lastMessage}
              </p>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {chat.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
