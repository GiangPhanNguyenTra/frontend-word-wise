"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getChatTopics } from "@/services/chatService";
import { getUserFriends } from "@/services/userService";
import { ChatTopic } from "@/types/chat";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const [displayList, setDisplayList] = useState<ChatTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsData, friendsData] = await Promise.all([
          getChatTopics(),
          getUserFriends(),
        ]);

        const friendIdsInTopics = new Set(topicsData.map((t) => t.otherUserId));

        const friendsAsTopics: ChatTopic[] = friendsData
          .filter((f) => !friendIdsInTopics.has(f.userId))
          .map((f) => ({
            conversationId: 0,
            otherUserId: f.userId,
            name: f.username,
            avatar: f.avatarUrl,
            lastMessage: "",
            time: "",
            unreadCount: 0,
            online: false,
          }));

        setDisplayList([...topicsData, ...friendsAsTopics]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleItemClick = (chat: ChatTopic) => {
    if (chat.conversationId && chat.conversationId !== 0) {
      router.push(`/community/messages/${chat.conversationId}`);
    } else {
      router.push(`/community/messages/new?userId=${chat.otherUserId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto lg:p-2">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="bg-white rounded-xl shadow border divide-y">
        {displayList.length > 0 ? (
          displayList.map((chat) => (
            <div
              key={`${chat.otherUserId}-${chat.conversationId}`}
              onClick={() => handleItemClick(chat)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="relative">
                <img
                  src={
                    chat.avatar ||
                    "https://api.dicebear.com/6.x/bottts/png?seed=John"
                  }
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{chat.name}</p>
                <p
                  className={`text-sm truncate ${
                    chat.unreadCount > 0
                      ? "text-gray-800 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {chat.lastMessage || "Start a conversation"}
                </p>
              </div>

              {chat.time && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(chat.time), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No conversations or friends found.
          </div>
        )}
      </div>
    </div>
  );
}
