"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Award, List, Book } from "lucide-react";

interface Word {
  word: string;
  definition: string;
}

export default function DefinitionMatchPage() {
  const initialWords: Word[] = [
    {
      word: "eloquent",
      definition: "Fluent or persuasive in speaking or writing",
    },
    {
      word: "pragmatic",
      definition:
        "Dealing with things sensibly and realistically based on practical rather than theoretical considerations",
    },
    { word: "verbose", definition: "Using more words than needed; wordy" },
    {
      word: "concise",
      definition:
        "Giving a lot of information clearly and in few words; brief but comprehensive",
    },
    {
      word: "ambiguous",
      definition:
        "Open to more than one interpretation; having a double meaning",
    },
  ];

  // state
  const [availableWords, setAvailableWords] = useState<Word[]>(initialWords);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  // zoneStatus: 'idle' | 'correct' | 'incorrect'
  const [zoneStatus, setZoneStatus] = useState<
    Record<string, "idle" | "correct" | "incorrect">
  >({});

  // start timer
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

  // handle drag start
  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text/plain", word);
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  // drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // drop
  const handleDrop = (e: React.DragEvent, definitionWord: string) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain") || draggedWord;
    if (!word) return;

    if (word === definitionWord) {
      // correct
      setMatched((prev) => [...prev, word]);
      setAvailableWords((prev) => prev.filter((w) => w.word !== word)); // remove from left column
      setZoneStatus((prev) => ({ ...prev, [definitionWord]: "correct" }));
      setScore((prev) => prev + 20);
      // keep correct state visible
    } else {
      // incorrect
      setZoneStatus((prev) => ({ ...prev, [definitionWord]: "incorrect" }));
      setScore((prev) => prev - 5);
      // remove incorrect highlight after short delay
      setTimeout(() => {
        setZoneStatus((prev) => ({ ...prev, [definitionWord]: "idle" }));
      }, 900);
    }

    setDraggedWord(null);

    // check completion
    setTimeout(() => {
      const remaining =
        availableWords.length - (word === definitionWord ? 1 : 0);
      if (remaining <= 0) {
        alert(
          `Congratulations! You completed all matches with ${
            score + (word === definitionWord ? 20 : -5)
          } points!`
        );
        // Note: timer will be cleared by useEffect cleanup when component unmounts or page change
      }
    }, 300);
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
            <h1 className="text-xl font-semibold">Challenge room: </h1>
            <p className="text-xl font-bold text-[#2563EB]">Definition Match</p>
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

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Words column (left) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <List className="w-5 h-5 mr-2" />
              Words to Match
            </h2>
            <div className="grid grid-cols-1 gap-3" id="words-container">
              {availableWords.map((item) => (
                <div
                  key={item.word}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.word)}
                  onDragEnd={handleDragEnd}
                  className={`bg-blue-50 border rounded-lg p-3 transition-all ${
                    matched.includes(item.word)
                      ? "opacity-50 cursor-not-allowed hidden"
                      : "cursor-grab hover:scale-[1.02] border-blue-200"
                  }`}
                >
                  <p className="font-semibold">{item.word}</p>
                </div>
              ))}

              {availableWords.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  All words matched 🎉
                </div>
              )}
            </div>
          </div>

          {/* Definitions column (right) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2" />
              Definitions
            </h2>
            <div className="space-y-4" id="definitions-container">
              {initialWords.map((item) => {
                const status =
                  zoneStatus[item.word] ||
                  (matched.includes(item.word) ? "correct" : "idle");
                return (
                  <div
                    key={item.word}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.word)}
                    className={`border-2 border-dashed rounded-lg p-4 bg-gray-50 min-h-[60px] transition-all
                      ${
                        status === "correct"
                          ? "bg-green-50 border-green-500"
                          : status === "incorrect"
                          ? "bg-red-50 border-red-500"
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                  >
                    {matched.includes(item.word) ? (
                      <div>
                        <p className="font-semibold text-green-700">
                          {item.word}
                        </p>
                        <p>{item.definition}</p>
                      </div>
                    ) : (
                      <p>{item.definition}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LeaderboardItem({
  rank,
  name,
  points,
  highlight = false,
}: {
  rank: number;
  name: string;
  points: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg ${
        highlight ? "bg-indigo-50 border-l-4 border-indigo-500" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            highlight
              ? "bg-white"
              : rank === 1
              ? "bg-yellow-100"
              : "bg-gray-100"
          }`}
        >
          <span className="font-semibold">{rank}</span>
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <span className="font-semibold text-indigo-600">{points}</span>
    </div>
  );
}
