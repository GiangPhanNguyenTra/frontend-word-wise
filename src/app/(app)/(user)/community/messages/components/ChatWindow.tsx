"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import MessageInput from "./MessageInput";

const mockMessages = [
  { from: "them", text: "Hey! How’s it going?" },
  { from: "me", text: "Pretty good, just finishing up my project." },
  { from: "them", text: "Nice! Can't wait to see it." },
];

export default function ChatWindow({ userId }: { userId: string }) {
  const chat = mockMessages;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Chat with User {userId}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                msg.from === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
