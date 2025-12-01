"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useRouter } from "next/navigation";

const mockChats = [
  {
    id: "1",
    name: "Linh Nguyen",
    lastMessage: "Hey, how are you?",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "Minh Tran",
    lastMessage: "Let's meet tomorrow!",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    name: "Quang Le",
    lastMessage: "Cool 😎",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

export default function ChatList() {
  const router = useRouter();

  return (
    <div className="h-full overflow-y-auto">
      {mockChats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
          onClick={() => router.push(`/community/messages/${chat.id}`)}
        >
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium">{chat.name}</h3>
            <p className="text-sm text-gray-500 truncate w-40">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
