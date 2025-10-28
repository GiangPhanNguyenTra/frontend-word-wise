"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WordCard } from "../components/WordCard";
import { CircleArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Word {
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
}

export default function NewReviewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get("title") || "";

  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("newCollectionData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.words) {
        const wordStrings: string[] = parsed.words.split("\n").filter(Boolean);
        const wordObjects: Word[] = wordStrings.map((wordStr) => ({
          word: wordStr,
          type: "...",
          meaning: "(auto-generate)",
          definitionEn: "...",
          definitionVi: "...",
          exampleEn: "...",
          exampleVi: "...",
        }));
        setWords(wordObjects);
      }
    }
  }, []);

  const handleEditWord = (index: number, updatedWord: Word) => {
    const newWords = [...words];
    newWords[index] = updatedWord;
    setWords(newWords);
  };

  const handleDeleteWord = (index: number) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleSave = () => {
    const newId = Math.floor(Math.random() * 10000);
    localStorage.removeItem("newCollectionData");
    router.push(`/collections/${newId}`);
  };

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="relative w-full">
        <div className="hidden sm:flex items-center relative">
          <Button
            className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100 flex items-center gap-1"
            onClick={() => router.push(`/collections`)}
          >
            <CircleArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl lg:text-2xl font-bold text-[#2563EB] text-center">
            Review New Collection: {title}
          </h1>
        </div>

        <div className="flex sm:hidden items-center justify-between w-full">
          <Button
            className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100 flex items-center gap-1"
            onClick={() => router.push(`/collections`)}
          >
            <CircleArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-[#2563EB] text-right truncate max-w-[70%]">
            Review collection: {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between w-full gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-6xl bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
          <Input
            placeholder="Search word..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          onClick={handleSave}
          className="bg-[#2563EB] text-white hover:bg-blue-600 whitespace-nowrap"
        >
          <span className="sm:hidden">Save</span>
          <span className="hidden sm:inline">Save Collection</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWords.map((word, idx) => (
          <WordCard
            key={`${word.word}-${idx}`}
            wordData={word}
            onEdit={(updatedWord) => handleEditWord(idx, updatedWord)}
            onDelete={() => handleDeleteWord(idx)}
          />
        ))}
      </div>
    </div>
  );
}
