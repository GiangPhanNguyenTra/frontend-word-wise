"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Word } from "../data/word-data";
import { Volume2 } from "lucide-react";

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
  word: Word;
  allWords: Word[];
  onAnswer?: (r: "correct" | "wrong") => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const wrongs = allWords
      .filter((w) => w.word !== word.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const opts = [...wrongs.map((w) => w.meaning), word.meaning].sort(
      () => 0.5 - Math.random()
    );

    setOptions(opts);
    setSelected(null);
    setShow(false);
  }, [word, allWords]);

  return (
    <div className="bg-white w-full h-[50vh] p-6 border rounded-xl shadow-md flex flex-col gap-4">
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

      <p className="text-xl font-bold text-center">{word.word}</p>

      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => {
          const isCorrect = opt === word.meaning;
          const isSelected = selected === opt;

          return (
            <Button
              key={idx}
              variant="outline"
              className={cn(
                "justify-start",
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
              onClick={() => !show && setSelected(opt)}
            >
              {opt}
            </Button>
          );
        })}
      </div>

      {/* Gộp nút Check lại thành 1 */}
      {!show && (
        <Button
          className="bg-[#2563EB] hover:bg-blue-800"
          onClick={() => {
            setShow(true);
            onAnswer?.(selected === word.meaning ? "correct" : "wrong");
          }}
          disabled={!selected}
        >
          Check
        </Button>
      )}

      {show && (
        <p
          className={
            selected === word.meaning ? "text-green-600" : "text-red-600"
          }
        >
          {selected === word.meaning
            ? "✔ Chính xác!"
            : `✘ Sai. Đáp án: ${word.meaning}`}
        </p>
      )}
    </div>
  );
}
