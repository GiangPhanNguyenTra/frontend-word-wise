"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Word } from "../data/word-data";
import { Volume2 } from "lucide-react";

// map style cho loại từ
const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
};

export function FillBlank({ word }: { word: Word }) {
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);

  // Reset state mỗi khi đổi word
  useEffect(() => {
    setAnswer("");
    setShow(false);
  }, [word]);

  // Tạo câu với chỗ trống (ẩn từ gốc)
  const sentence = word.exampleEn.replace(new RegExp(word.word, "gi"), "_____");

  const isCorrect = answer.trim().toLowerCase() === word.word.toLowerCase();

  return (
    <div className="w-full h-[50vh] p-6 border rounded-xl shadow-md flex flex-col gap-4">
      {/* Loại từ */}
      <div className="flex justify-center gap-2 items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            typeStyles[word.type] || "bg-gray-200 text-gray-700"
          }`}
        >
          {word.type}
        </span>
        <Volume2 color="#363538" size={18} />
      </div>

      <p className="text-lg italic">Fill in the blank:</p>
      <p className="text-xl">{sentence}</p>

      <Input
        placeholder="Your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={show} // disable input sau khi check
      />

      {/* Nút Check chỉ hiện khi chưa show */}
      {!show && (
        <Button
          className="bg-[#2563EB] hover:bg-blue-800"
          onClick={() => setShow(true)}
          disabled={!answer.trim()} // thêm: tránh check khi input trống
        >
          Check
        </Button>
      )}

      {/* Đáp án */}
      {show && (
        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
          {isCorrect ? "✔ Chính xác!" : `✘ Sai. Đáp án: ${word.word}`}
        </p>
      )}
    </div>
  );
}
