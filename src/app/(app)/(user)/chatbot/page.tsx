"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, BookOpenText } from "lucide-react";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
  wordData?: {
    word: string;
    meaning: string;
    definition: string;
    example: string;
    type: string;
  };
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I’m your AI Vocabulary Assistant. How can I help you with words today?",
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // tự động scroll xuống cuối mỗi khi có tin nhắn mới
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleUserOption = (option: string) => {
    setSelectedOption(option);

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: option === "help" ? "Help guide" : "Add word",
    };

    const botReply: Message =
      option === "help"
        ? {
            id: Date.now() + 1,
            sender: "bot",
            text: "Our vocabulary learning app is designed to make studying English fun, personalized, and effective.\n\n• Add & organize your own vocabulary lists\n• Multiple learning modes: flashcards, quizzes, mini games\n• Daily reminders to keep you on track\n• Track your progress & learning statistics\n• Built-in dictionary with real-life examples\n• Personalized study plan based on your goals",
          }
        : {
            id: Date.now() + 1,
            sender: "bot",
            text: "Added “innovate” to your Technology collection!",
            wordData: {
              word: "Revolutionary",
              meaning: "cách mạng; đột phá",
              definition: "involving or causing a complete or dramatic change",
              example:
                "This new drug is revolutionary in its approach to treating cancer.",
              type: "Adjective",
            },
          };

    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    const botMsg: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: `You said: "${input.trim()}". (This is a mock response 🤖)`,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-h-[90vh] flex flex-col items-center justify-between h-screen bg-white mt-2 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white p-4 flex items-center gap-3 sticky top-0 z-10 rounded-t-[16px]">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E9EFFD]">
          {/* Icon sách */}
          <BookOpenText color="#2563EB" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Vocabulary Assistant
          </h2>
          <p>AI-powered language learning</p>
        </div>
      </div>
      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 bg-[#F3F4F6]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-[#3675FF] text-white px-4 py-2 rounded-2xl rounded-br-none"
                  : "text-gray-800"
              }`}
            >
              {msg.text}

              {msg.wordData && (
                <Card className="mt-3 border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {msg.wordData.word}
                      </h3>
                      <span className="bg-[#E9EFFD] text-[#2563EB] text-xs px-2 py-1 rounded-md">
                        {msg.wordData.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Vietnamese meaning:</strong>{" "}
                      {msg.wordData.meaning}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Definition:</strong> {msg.wordData.definition}
                    </p>
                    <p className="italic text-sm text-gray-600 mt-1">
                      Example: "{msg.wordData.example}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input + buttons */}
      <div className="w-full border-t p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Type your message or command"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-full h-12"
          />
          <Button
            className="bg-[#3675FF] hover:bg-[#2563EB] rounded-full"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-start gap-3">
          <Button
            className={`h-8 px-4 rounded-full border text-[12px] font-medium ${
              selectedOption === "help"
                ? "border-[#3675FF] text-[#3675FF] font-semibold bg-[#E9EFFD] hover:bg-[#2563EB] hover:text-white"
                : "border-gray-300 bg-white text-gray-500 hover:bg-[#E9EFFD]"
            }`}
            onClick={() => handleUserOption("help")}
          >
            Help guide
          </Button>

          <Button
            className={`h-8 px-4 rounded-full border text-[12px] font-medium ${
              selectedOption === "add"
                ? "border-[#3675FF] text-[#3675FF] font-semibold bg-[#E9EFFD] hover:bg-[#2563EB] hover:text-white"
                : "border-gray-300 bg-white text-gray-500 hover:bg-[#E9EFFD]"
            }`}
            onClick={() => handleUserOption("add")}
          >
            Add word
          </Button>
        </div>
      </div>
    </div>
  );
}
