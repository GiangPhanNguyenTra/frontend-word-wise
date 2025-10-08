"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Award, List, Book } from "lucide-react";
export default function page() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

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
            <h1 className="text-xl font-semibold">Challenge room: </h1>
            <p className="text-xl font-bold text-[#2563EB]">Word Shooter</p>
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
    </div>
  );
}
