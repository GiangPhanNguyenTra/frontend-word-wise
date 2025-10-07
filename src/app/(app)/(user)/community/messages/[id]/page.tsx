"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const friends = [
  {
    id: 1,
    name: "Anna Nguyen",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Let's grab coffee tomorrow ☕",
  },
  {
    id: 2,
    name: "David Tran",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Sure, I’ll send it later!",
  },
  {
    id: 3,
    name: "Lisa Pham",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "That’s so funny 😂",
  },
];

export default function ChatPage() {
  const [selected, setSelected] = useState(1);
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey, how are you?" },
    { from: "me", text: "I'm good! You?" },
  ]);
  const [input, setInput] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Scroll chỉ trong khung tin nhắn, không cuộn cả trang
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "me", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "them", text: "Haha okay 😄" }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const currentFriend = friends.find((f) => f.id === selected);

  return (
    <div className="flex h-[90vh] overflow-hidden rounded-lg border bg-white">
      {/* Sidebar danh sách bạn bè */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 font-bold text-lg">Messages</div>
        {friends.map((f) => (
          <div
            key={f.id}
            onClick={() => setSelected(f.id)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition ${
              selected === f.id ? "bg-[#F3F6FD]" : ""
            }`}
          >
            <img
              src={f.avatar}
              alt={f.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800">{f.name}</p>
              <p className="text-sm text-gray-500 truncate">{f.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Khung chat chính */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="border-b p-4 font-semibold bg-white flex items-center gap-3">
          <img
            src={currentFriend?.avatar}
            alt={currentFriend?.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span>{currentFriend?.name}</span>
        </div>

        {/* Nội dung tin nhắn */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                  msg.from === "me"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Ô nhập tin nhắn */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          />
          <Button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
