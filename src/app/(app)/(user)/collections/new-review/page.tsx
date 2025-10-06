"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WordCard } from "../components/WordCard";
import { CircleArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NewReviewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get("title") || "";

  const [words, setWords] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("newCollectionData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.words) {
        setWords(parsed.words.split("\n").filter(Boolean));
      }
    }
  }, []);

  const handleSave = () => {
    const newId = Math.floor(Math.random() * 10000);
    localStorage.removeItem("newCollectionData");
    router.push(`/collections/${newId}`);
  };

  // Lọc từ theo input search
  const filteredWords = words.filter((word) =>
    word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative w-full flex items-center">
        <Button
          className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100"
          onClick={() => router.push(`/collections`)}
        >
          <CircleArrowLeft className="mr-1" />
          Back
        </Button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[#2563EB]">
          Review New Collection: {title}
        </h1>
      </div>

      <div className="flex items-center justify-between w-full gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
          <Input
            placeholder="Search word..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          className="bg-[#2563EB] text-white hover:bg-blue-600 whitespace-nowrap"
        >
          Save Collection
        </Button>
      </div>

      {/* Word list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWords.map((word, idx) => (
          <WordCard
            key={idx}
            word={word}
            type="..."
            meaning="(auto-generate)"
            definitionEn="..."
            definitionVi="..."
            exampleEn="..."
            exampleVi="..."
          />
        ))}
      </div>
    </div>
  );
}
