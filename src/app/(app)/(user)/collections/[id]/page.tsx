"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wordCollections } from "../data/word-data";
import { WordCard } from "../components/WordCard";
import { useRouter } from "next/navigation";

import {
  PlusCircle,
  CircleArrowLeft,
  Search,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import ContinueLearningButton from "../components/ContinueLearningButton";

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const collection = wordCollections.find((c) => c.id === Number(id));

  const [search, setSearch] = useState("");

  if (!collection) {
    return <div className="p-6">Collection not found</div>;
  }

  // Lọc từ theo search
  const filteredWords = collection.words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Collection name */}
      <div className="w-full flex flex-row items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/collections")}
          className="border-[#363538] text-[#363538] hover:bg-grey-100 flex items-center gap-2"
        >
          <CircleArrowLeft className="h-5 w-5 text-[#363538]" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-[#2563EB]">
          {collection.title}
        </h1>
        <Button
          variant="outline"
          className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2"
          onClick={() => router.push(`/collections/${id}/new-word`)}
        >
          <PlusCircle className="h-5 w-5 text-[#2563EB]" />
          New Word
        </Button>
      </div>

      {/* Collection information */}
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-row items-center justify-center gap-3">
          <p className="text-[#939393]">{collection.words.length} words</p>
          <p className="text-[#939393] before:content-['•'] before:mx-2">
            Last studied: {collection.lastStudied}
          </p>
          <p className="text-[#939393] before:content-['•'] before:mx-2">
            Created: {collection.createdAt}
          </p>
        </div>
      </div>

      {/* Toolbar row */}
      <div className="flex items-center justify-between gap-4">
        {/* Search + Filter */}
        <div className="flex items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative w-full max-w-lg bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
            <Input
              placeholder="Search word..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Dropdown filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Noun</DropdownMenuItem>
              <DropdownMenuItem>Verb</DropdownMenuItem>
              <DropdownMenuItem>Adjective</DropdownMenuItem>
              <DropdownMenuItem>Adverb</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Continue Learning button */}
        <ContinueLearningButton id={id} />
      </div>

      {/* Word list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWords.map((w, idx) => (
          <WordCard key={idx} {...w} />
        ))}
      </div>
    </div>
  );
}
