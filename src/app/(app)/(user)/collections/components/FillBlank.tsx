"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2 } from "lucide-react";
import { ApiWord } from "@/types/collection";

const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
};

export function FillBlank({
  word,
  onAnswer,
  forceDontKnow = false,
}: {
  word: ApiWord;
  onAnswer?: (r: "correct" | "wrong") => void;
  forceDontKnow?: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setAnswer("");
    setShow(false);
  }, [word]);

  useEffect(() => {
    if (forceDontKnow && !show) {
      setShow(true);
      onAnswer?.("wrong");
    }
  }, [forceDontKnow, show, onAnswer]);

  const exampleSentence =
    word.examples && word.examples.length > 0 ? word.examples[0].en : "";
  const sentence = exampleSentence.replace(
    new RegExp(word.wordText, "gi"),
    "_____"
  );
  const isCorrect = answer.trim().toLowerCase() === word.wordText.toLowerCase();

  return (
    <div className="bg-white w-full h-[50vh] p-6 border rounded-xl shadow-md flex flex-col gap-4">
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

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-lg italic text-gray-500">Fill in the blank:</p>
        <p className="text-xl text-center font-medium leading-relaxed">
          {sentence}
        </p>
      </div>

      <Input
        className="text-black mb-4 text-center text-lg"
        placeholder="Your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={show || forceDontKnow}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !show && answer.trim()) {
            setShow(true);
            onAnswer?.(isCorrect ? "correct" : "wrong");
          }
        }}
      />

      {!show && !forceDontKnow && (
        <Button
          className="bg-[#2563EB] hover:bg-blue-800 mt-4 w-full"
          onClick={() => {
            setShow(true);
            onAnswer?.(isCorrect ? "correct" : "wrong");
          }}
          disabled={!answer.trim()}
        >
          Check
        </Button>
      )}

      {show && (
        <p
          className={`text-center font-medium ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "✔ Correct!" : `✘ Incorrect. Answer: ${word.wordText}`}
        </p>
      )}
    </div>
  );
}
