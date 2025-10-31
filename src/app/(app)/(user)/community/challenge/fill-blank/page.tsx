"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const initialQuestions = [
  {
    sentence: "He said ___ when he met me.",
    options: ["hello", "goodbye", "please", "thanks"],
    answer: "hello",
    difficulty: "Medium",
  },
  {
    sentence: "The sky is usually ___ on a sunny day.",
    options: ["green", "blue", "red", "yellow"],
    answer: "blue",
    difficulty: "Easy",
  },
  {
    sentence: "An apple is a type of ___.",
    options: ["vegetable", "fruit", "animal", "mineral"],
    answer: "fruit",
    difficulty: "Easy",
  },
  {
    sentence: "To be successful, you must be ___ and never give up.",
    options: ["lazy", "persistent", "hesitant", "careless"],
    answer: "persistent",
    difficulty: "Hard",
  },
];

export default function FillBlankPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selected, setSelected] = useState<string | null>(null);
  const [blankWord, setBlankWord] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.answer;
  const sentenceParts = currentQuestion.sentence.split("___");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/community/leaderboard?game=fill-the-blank");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleSelect = (answer: string) => {
    if (selected) return;
    setSelected(answer);

    if (answer === correctAnswer) {
      setBlankWord(answer);
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => prev - 5);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(null);
      setBlankWord("");
    } else {
      router.push("/community/leaderboard?game=fill-the-blank");
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="bg-gray-100 min-h-screen">
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
        <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-xl mb-4">
                Complete the sentence with the most appropriate word:
              </p>
              <p className="text-2xl font-medium text-center leading-relaxed">
                {sentenceParts[0]}
                <span
                  className={`border-b-2 border-dashed mx-2 px-2 pb-1 ${
                    blankWord
                      ? "text-green-600 font-semibold border-green-600"
                      : "border-indigo-500"
                  }`}
                >
                  {blankWord || "        "}
                </span>
                {sentenceParts[1]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((opt, index) => {
                const isCorrect = opt === correctAnswer;
                const isSelected = selected === opt;
                let style =
                  "bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-indigo-400 transition-all font-medium disabled:cursor-not-allowed";

                if (selected) {
                  if (isSelected && isCorrect) {
                    style += " bg-green-100 border-green-500 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    style += " bg-red-100 border-red-500 text-red-800";
                  } else if (!isSelected && isCorrect) {
                    style += " bg-green-50 border-green-400";
                  } else {
                    style += " opacity-60";
                  }
                }
                return (
                  <button
                    key={opt}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={style}
                  >
                    <span className="font-semibold mr-2 text-indigo-600">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selected}
                className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 w-full sm:w-auto"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
