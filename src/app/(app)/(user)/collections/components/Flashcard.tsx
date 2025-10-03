"use client";
import { useState } from "react";
import { Word } from "../data/word-data";
import { Volume2 } from "lucide-react";

// map style cho loại từ
const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
};

export function Flashcard({ word }: { word: Word }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="relative w-full h-[50vh] cursor-pointer"
    >
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col rounded-xl border bg-white shadow-md [backface-visibility:hidden] p-6">
          {/* Loại từ + icon */}
          <div className="flex justify-center gap-2 items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                typeStyles[word.type] || "bg-gray-200 text-gray-700"
              }`}
            >
              {word.type}
            </span>
            <Volume2 color="#363538" size={18} />
          </div>

          {/* Word ở giữa */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-2xl font-bold">{word.word}</p>
            <p className="text-base text-gray-500 italic">
              Do you know the meaning of this word?
            </p>
          </div>

          {/* Footer hướng dẫn */}
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-400">
              Click the card to see the definition
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col rounded-xl border bg-white shadow-md p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
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
          {/* Word ở giữa */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-2xl font-bold">{word.word}</p>
          </div>
          {/* Nghĩa */}
          {/* <div className="text-center">
            <p className="font-semibold text-lg mb-2">{word.meaning}</p>
          </div> */}

          {/* Định nghĩa */}
          <div className="text-center w-full bg-[#ECECF0] p-4 rounded-[10px]">
            <p className="text-[16px] font-bold">Definition</p>
            <p className="text-sm text-[#939393] mt-2">{word.definitionEn}</p>
          </div>

          {/* Ví dụ */}
          <div className="text-center w-full bg-[#ECECF0] p-4 rounded-[10px] mt-4">
            <p className="text-[16px] font-bold">Definition</p>
            <p className="text-sm text-[#939393] mt-2"> {word.exampleEn}</p>
          </div>
          {/* Footer hướng dẫn */}
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-400">Click card to flip back </p>
          </div>
        </div>
      </div>
    </div>
  );
}
