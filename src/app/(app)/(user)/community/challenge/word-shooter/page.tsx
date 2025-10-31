"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VocabularyShooterGame } from "@/components/games/VocabularyShooterGame";
const sampleWords = [
  { en: "apple", vi: "quả táo" },
  { en: "banana", vi: "quả chuối" },
  { en: "cat", vi: "con mèo" },
  { en: "dog", vi: "con chó" },
  { en: "house", vi: "ngôi nhà" },
  { en: "car", vi: "xe hơi" },
  { en: "book", vi: "quyển sách" },
  { en: "computer", vi: "máy tính" },
  { en: "school", vi: "trường học" },
  { en: "water", vi: "nước" },
  { en: "tree", vi: "cái cây" },
  { en: "sun", vi: "mặt trời" },
];

export default function Page() {
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
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <VocabularyShooterGame wordsToReview={sampleWords} />
      </main>
    </div>
  );
}
