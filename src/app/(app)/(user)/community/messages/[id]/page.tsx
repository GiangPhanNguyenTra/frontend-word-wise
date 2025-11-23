"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, CircleArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import {
  getConversationDetail,
  sendMessageApi,
  getChatTopics,
} from "@/services/chatService";
import { getUserFriends } from "@/services/userService";
import { ChatMessage, ChatTopic } from "@/types/chat";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_API?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const conversationIdParam = params.id as string;
  const isNewChat = conversationIdParam === "new";
  const newChatUserId = searchParams.get("userId");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentChatUser, setCurrentChatUser] = useState<{
    id: number;
    name: string;
    avatar: string | null;
  } | null>(null);

  const [topics, setTopics] = useState<ChatTopic[]>([]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getChatTopics();
        setTopics(data);
      } catch (error) {
        console.error("Failed to load topics", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        if (isNewChat && newChatUserId) {
          const friends = await getUserFriends();
          const targetUser = friends.find(
            (f) => f.userId === Number(newChatUserId)
          );
          if (targetUser) {
            setCurrentChatUser({
              id: targetUser.userId,
              name: targetUser.username,
              avatar: targetUser.avatarUrl,
            });
          }
          setMessages([]);
        } else if (!isNewChat) {
          const convId = Number(conversationIdParam);
          const detail = await getConversationDetail(convId);
          setMessages(detail.messages);

          const topic = topics.find((t) => t.conversationId === convId);
          if (topic) {
            setCurrentChatUser({
              id: topic.otherUserId,
              name: topic.name,
              avatar: topic.avatar,
            });
          } else {
            if (detail.participants.length > 0) {
              const other = detail.participants[detail.participants.length - 1];
              setCurrentChatUser({
                id: other.userId,
                name: other.username,
                avatar: other.avatarUrl,
              });
            }
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load conversation");
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationIdParam) {
      initChat();
    }
  }, [conversationIdParam, isNewChat, newChatUserId, topics.length]);

  // Connect WebSocket
  useEffect(() => {
    if (isNewChat) return;

    const token = localStorage.getItem("accessToken");
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        const destination = `/topic/conversation/${conversationIdParam}`;
        client.subscribe(destination, (message) => {
          const body = JSON.parse(message.body);

          if (currentChatUser && body.senderId === currentChatUser.id) {
            const newMessage: ChatMessage = {
              messageId: body.messageId || Date.now(),
              senderId: body.senderId,
              content: body.content,
              timestamp: body.timestamp || new Date().toISOString(),
              sender: false, // Vì là người kia gửi
            };

            setMessages((prev) => {
              // Double check để chắc chắn không trùng messageId
              if (prev.some((m) => m.messageId === newMessage.messageId))
                return prev;
              return [...prev, newMessage];
            });
          }
        });
      },
      (error) => {
        console.error("Socket error", error);
      }
    );

    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        try {
          if (stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {});
          }
        } catch (error) {
          console.warn("Socket disconnect error:", error);
        }
      }
    };
  }, [conversationIdParam, isNewChat, currentChatUser?.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentChatUser) return;

    const contentToSend = input;
    setInput("");

    try {
      const sentMsg = await sendMessageApi(currentChatUser.id, contentToSend);

      if (isNewChat) {
        const updatedTopics = await getChatTopics();
        const newTopic = updatedTopics.find(
          (t) => t.otherUserId === currentChatUser.id
        );
        if (newTopic) {
          router.push(`/community/messages/${newTopic.conversationId}`);
        } else {
          setMessages((prev) => [...prev, sentMsg]);
        }
      } else {
        // Thêm tin nhắn của mình vào state
        setMessages((prev) => [...prev, sentMsg]);
      }
    } catch (error) {
      toast.error("Failed to send message");
      setInput(contentToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[85vh] overflow-hidden rounded-lg border bg-white w-full mx-auto my-4 shadow-sm">
      <div className="w-1/3 border-r overflow-y-auto hidden md:block">
        <div className="p-4 font-bold text-lg border-b bg-gray-50">
          Conversations
        </div>
        {topics.map((t) => (
          <div
            key={t.conversationId}
            onClick={() =>
              router.push(`/community/messages/${t.conversationId}`)
            }
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition ${
              Number(conversationIdParam) === t.conversationId
                ? "bg-blue-50"
                : ""
            }`}
          >
            <img
              src={t.avatar || "/ava.svg"}
              alt={t.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800">{t.name}</p>
              <p
                className={`text-sm truncate ${
                  t.unreadCount > 0 ? "font-bold text-black" : "text-gray-500"
                }`}
              >
                {t.lastMessage}
              </p>
            </div>
            {t.unreadCount > 0 && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 relative">
        <div className="border-b p-3 font-semibold bg-white flex items-center gap-3 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/community/messages")}
          >
            <CircleArrowLeft />
          </Button>
          {currentChatUser && (
            <>
              <img
                src={currentChatUser.avatar || "/ava.svg"}
                alt={currentChatUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-lg">{currentChatUser.name}</span>
            </>
          )}
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              Start a conversation
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.messageId || idx}
                className={`flex w-full ${
                  msg.sender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    msg.sender
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t bg-white flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
