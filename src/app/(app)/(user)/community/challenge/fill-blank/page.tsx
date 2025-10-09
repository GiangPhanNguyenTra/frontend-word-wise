"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Star, Award, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FillBlankPage() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selected, setSelected] = useState<string | null>(null);
  const [blankWord, setBlankWord] = useState("");
  const correctAnswer = "hello";
  const options = ["hello", "goodbye", "please", "thanks"];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert(`Time's up! Your final score: ${score}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [score]);

  const handleSelect = (answer: string) => {
    if (selected) return; // disable after first click
    setSelected(answer);
    const timeTaken = 120 - timeLeft;
    const speedBonus = Math.max(0, 15 - timeTaken) * 2;

    if (answer === correctAnswer) {
      setBlankWord(answer);
      setScore((prev) => prev + 10 + speedBonus);
      setTimeout(() => {
        alert(`✅ Correct! +10 points +${speedBonus} speed bonus`);
      }, 400);
    } else {
      setScore((prev) => prev - 5);
      setTimeout(() => {
        alert(`❌ Incorrect. The right answer was "${correctAnswer}"`);
      }, 400);
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              href="/community/challenge"
              className="text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Challenge room:</h1>
            <p className="text-xl font-bold text-[#2563EB]">
              Fill in the Blank
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {minutes}:{seconds}
              </span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Question area full width */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Question 3 of 10</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Medium
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-xl mb-4">
                Complete the sentence with the most appropriate word:
              </p>
              <p className="text-2xl font-medium text-center">
                &quot;He said{" "}
                <span
                  className={`border-b-2 border-dashed px-2 ${
                    blankWord
                      ? "text-green-600 font-semibold"
                      : "border-indigo-500"
                  }`}
                >
                  {blankWord || " "}
                </span>{" "}
                when he met me.&quot;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {options.map((opt, index) => {
                const isCorrect = opt === correctAnswer;
                const isSelected = selected === opt;
                let style =
                  "bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-indigo-300 transition-all";
                if (selected) {
                  if (isSelected && isCorrect)
                    style += " bg-green-100 border-green-500";
                  else if (isSelected && !isCorrect)
                    style += " bg-red-100 border-red-500";
                  else if (!isSelected && isCorrect)
                    style += " bg-green-50 border-green-400";
                  else style += " opacity-60";
                }
                return (
                  <button
                    key={opt}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={style}
                  >
                    <span className="font-semibold mr-1">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Previous
              </Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Next Question
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
