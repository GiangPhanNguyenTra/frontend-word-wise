"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { ApiWord } from "@/types/collection";

const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
};

export function DefinitionChoice({
  word,
  allWords,
  onAnswer,
}: {
  word: ApiWord;
  allWords: ApiWord[];
  onAnswer?: (r: "correct" | "wrong") => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const wrongs = allWords
      .filter((w) => w.wordId !== word.wordId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((w) => w.wordVn);

    // Fallback if collection is too small
    while (wrongs.length < 2 && allWords.length > 1) {
      wrongs.push("...");
    }

    const opts = [...wrongs, word.wordVn].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setSelected(null);
    setShow(false);
  }, [word, allWords]);

  return (
    <div className="bg-white w-full h-[60vh] p-6 border rounded-xl shadow-md flex flex-col gap-4">
      <div className="flex justify-center gap-2 items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            typeStyles[word.partOfSpeech] || "bg-gray-200 text-gray-700"
          }`}
        >
          {word.partOfSpeech}
        </span>
        <Volume2 color="#363538" size={18} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-xl font-bold text-center">{word.wordText}</p>
        <p className="text-sm text-gray-500 italic text-center max-w-md">
          {word.definitionEn}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {options.map((opt, idx) => {
          const isCorrect = opt === word.wordVn;
          const isSelected = selected === opt;

          return (
            <Button
              key={idx}
              variant="outline"
              className={cn(
                "justify-start h-auto py-3 text-left whitespace-normal w-full",
                !show &&
                  isSelected &&
                  "border border-[#2563EB] text-black hover:bg-blue-50",
                show &&
                  isCorrect &&
                  "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]",
                show &&
                  isSelected &&
                  !isCorrect &&
                  "bg-[#FEE2E2] text-[#C41C1C] border-[#C41C1C]"
              )}
              disabled={show}
              onClick={() => {
                if (!show) {
                  setSelected(opt);
                }
              }}
            >
              {opt}
            </Button>
          );
        })}
      </div>

      {!show && (
        <Button
          className="bg-[#2563EB] hover:bg-blue-800 w-full mt-2"
          onClick={() => {
            setShow(true);
            onAnswer?.(selected === word.wordVn ? "correct" : "wrong");
          }}
          disabled={!selected}
        >
          Check
        </Button>
      )}

      {show && (
        <p
          className={`text-center font-medium ${
            selected === word.wordVn ? "text-green-600" : "text-red-600"
          }`}
        >
          {selected === word.wordVn
            ? "✔ Correct!"
            : `✘ Incorrect. Answer: ${word.wordVn}`}
        </p>
      )}
    </div>
  );
}
