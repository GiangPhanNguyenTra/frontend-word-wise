"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Send:", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 flex items-center gap-2 bg-white">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button
        size="sm"
        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleSend}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
