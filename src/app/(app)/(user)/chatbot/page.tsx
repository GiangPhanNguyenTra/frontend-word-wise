"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  BookOpenText,
  Loader2,
  Sparkles,
  PlusCircle,
  HelpCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { sendChatMessage } from "@/services/chatbotService";
import { ChatResponse } from "@/types/chatbot";

interface WordPayload {
  word: string;
  word_vn: string | null;
  partOfSpeech: string | null;
  definition_en: string | null;
  definition_vi: string | null;
  examples: { en: string; vi: string }[];
  phonetics: {
    uk: { text: string; audio: string };
    us: { text: string; audio: string };
  };
}

interface AppQuestionPayload {
  answer_en: string;
  answer_vi: string;
  detail: string;
}

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
  wordData?: WordPayload;
  questionData?: AppQuestionPayload;
};

const generateSessionId = () => {
  return `session-create-${Date.now()}`;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I’m your AI Vocabulary Assistant. You can ask me about app features, add words to collections, or create new collections.",
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(
        sessionId,
        textToSend
      );

      let botText = response.message || "";
      let wordData: WordPayload | undefined = undefined;
      let questionData: AppQuestionPayload | undefined = undefined;

      if (response.intent === "app_question" && response.type === "result") {
        const payload = response.payload as unknown as AppQuestionPayload;
        if (payload) {
          questionData = payload;
          botText = "";
        }
      } else if (response.intent === "add_word" && response.type === "result") {
        const payload = response.payload as unknown as WordPayload;
        if (payload) {
          wordData = payload;
        }
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: botText,
        wordData,
        questionData,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.type === "result") {
        setSessionId(generateSessionId());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to get response");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUserOption = (option: string) => {
    switch (option) {
      case "help":
        handleSend("Hệ thống Word Wise là gì?");
        break;
      case "add":
        setInput("Add the word '...' into the collection '...'");
        break;
      case "create":
        setInput("Create collection '...'");
        break;
      case "helper":
        handleSend("Bạn có thể giúp tôi làm những gì vậy?");
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-h-[85vh] flex flex-col items-center justify-between h-screen bg-white mt-2 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white p-4 flex items-center gap-3 sticky top-0 z-10 rounded-t-[16px] border-b">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E9EFFD]">
          <BookOpenText color="#2563EB" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Vocabulary Assistant
          </h2>
          <p className="text-xs text-gray-500">AI-powered language learning</p>
        </div>
      </div>

      {/* Chat Area */}
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
              className={`max-w-[85%] sm:max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-[#3675FF] text-white px-4 py-2 rounded-2xl rounded-br-none whitespace-pre-line"
                  : "text-gray-800"
              }`}
            >
              {msg.text && (
                <div
                  className={
                    msg.sender === "bot"
                      ? "bg-white p-3 rounded-2xl rounded-bl-none shadow-sm whitespace-pre-line"
                      : ""
                  }
                >
                  {msg.text}
                </div>
              )}

              {msg.questionData && (
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-md space-y-3 text-sm text-gray-800">
                  <div>
                    <h4 className="font-bold text-[#2563EB]">English Answer</h4>
                    <p>{msg.questionData.answer_en}</p>
                  </div>
                  <hr className="border-gray-100" />
                  <div>
                    <h4 className="font-bold text-[#2563EB]">
                      Vietnamese Answer
                    </h4>
                    <p>{msg.questionData.answer_vi}</p>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="bg-blue-50 p-2 rounded-md">
                    <p className="italic text-gray-600">
                      💡 {msg.questionData.detail}
                    </p>
                  </div>
                </div>
              )}

              {msg.wordData && (
                <Card className="mt-2 border border-gray-200 bg-white shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-xl text-[#2563EB]">
                          {msg.wordData.word}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono">
                          {msg.wordData.phonetics?.uk?.text ||
                            msg.wordData.phonetics?.us?.text}
                        </span>
                      </div>
                      {msg.wordData.partOfSpeech && (
                        <span className="bg-[#E9EFFD] text-[#2563EB] text-xs px-2 py-1 rounded-md font-medium capitalize">
                          {msg.wordData.partOfSpeech}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      {msg.wordData.word_vn && (
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold text-gray-900">
                            Meaning:
                          </span>{" "}
                          {msg.wordData.word_vn}
                        </p>
                      )}

                      {msg.wordData.definition_en && (
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold text-gray-900">
                            Definition:
                          </span>{" "}
                          {msg.wordData.definition_en}
                        </p>
                      )}

                      {msg.wordData.examples &&
                        msg.wordData.examples.length > 0 && (
                          <div className="bg-gray-50 p-2 rounded border-l-2 border-[#2563EB] mt-2">
                            <p className="italic text-sm text-gray-600">
                              &quot;{msg.wordData.examples[0].en}&quot;
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#3675FF]" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full border-t p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Type your message or command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 rounded-full h-12"
          />
          <Button
            className="bg-[#3675FF] hover:bg-[#2563EB] rounded-full h-10 w-10 p-0"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* 4 Buttons Area */}
        <div className="flex flex-wrap items-center justify-start gap-2">
          <Button
            variant="outline"
            className="h-8 px-3 rounded-full text-[11px] sm:text-xs font-medium border-gray-300 text-gray-600 hover:bg-[#E9EFFD] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors gap-1"
            onClick={() => handleUserOption("help")}
            disabled={isLoading}
          >
            <Sparkles className="h-3 w-3" />
            Ask features
          </Button>

          <Button
            variant="outline"
            className="h-8 px-3 rounded-full text-[11px] sm:text-xs font-medium border-gray-300 text-gray-600 hover:bg-[#E9EFFD] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors gap-1"
            onClick={() => handleUserOption("add")}
            disabled={isLoading}
          >
            <PlusCircle className="h-3 w-3" />
            Add word
          </Button>

          <Button
            variant="outline"
            className="h-8 px-3 rounded-full text-[11px] sm:text-xs font-medium border-gray-300 text-gray-600 hover:bg-[#E9EFFD] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors gap-1"
            onClick={() => handleUserOption("create")}
            disabled={isLoading}
          >
            <PlusCircle className="h-3 w-3" />
            Create Collection
          </Button>

          <Button
            variant="outline"
            className="h-8 px-3 rounded-full text-[11px] sm:text-xs font-medium border-gray-300 text-gray-600 hover:bg-[#E9EFFD] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors gap-1"
            onClick={() => handleUserOption("helper")}
            disabled={isLoading}
          >
            <HelpCircle className="h-3 w-3" />
            Helper
          </Button>
        </div>
      </div>
    </div>
  );
}
