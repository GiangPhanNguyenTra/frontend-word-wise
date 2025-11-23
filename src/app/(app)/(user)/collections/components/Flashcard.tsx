"use client";
import { useState } from "react";
import { Volume2 } from "lucide-react";
import { ApiWord } from "@/types/collection";

const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
};

export function Flashcard({ word }: { word: ApiWord }) {
  const [flipped, setFlipped] = useState(false);

  const playAudio = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url) {
      new Audio(url).play();
    }
  };

  const audioUrl = word.phonetics?.us?.audio || word.phonetics?.uk?.audio;

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full max-w-3xl cursor-pointer perspective-1000"
    >
      <div
        className="relative transition-transform duration-500 [transform-style:preserve-3d] grid"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face */}
        <div className="col-start-1 row-start-1 bg-white rounded-xl border shadow-md p-6 flex flex-col [backface-visibility:hidden] min-h-[400px]">
          <div className="flex justify-center gap-2 items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                typeStyles[word.partOfSpeech] || "bg-gray-200 text-gray-700"
              }`}
            >
              {word.partOfSpeech}
            </span>
            {audioUrl && (
              <div onClick={(e) => playAudio(e, audioUrl)}>
                <Volume2 color="#363538" size={18} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-2xl font-bold text-black">{word.wordText}</p>
            <p className="text-base text-gray-500 italic text-center">
              Do you know the meaning of this word?
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-400">
              Click the card to see the definition
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="col-start-1 row-start-1 bg-white rounded-xl border shadow-md p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] min-h-[400px]">
          <div className="flex justify-center gap-2 items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                typeStyles[word.partOfSpeech] || "bg-gray-200 text-gray-700"
              }`}
            >
              {word.partOfSpeech}
            </span>
            {audioUrl && (
              <div onClick={(e) => playAudio(e, audioUrl)}>
                <Volume2 color="#363538" size={18} />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <p className="text-2xl font-bold">{word.wordText}</p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="text-center w-full bg-[#ECECF0] p-4 rounded-[10px]">
              <p className="text-[16px] font-bold">Definition</p>
              <p className="text-sm text-[#939393] mt-2">{word.definitionEn}</p>
            </div>

            {word.examples && word.examples.length > 0 && (
              <div className="text-center w-full bg-[#ECECF0] p-4 rounded-[10px]">
                <p className="text-[16px] font-bold">Example</p>
                <p className="text-sm text-[#939393] mt-2">
                  {word.examples[0].en}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-400">Click card to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}
