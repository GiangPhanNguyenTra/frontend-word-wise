"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wordCollections as initialWordCollections } from "../data/word-data";
import { WordCard } from "../components/WordCard";
import { PlusCircle, CircleArrowLeft, Search, ChevronDown } from "lucide-react";
import ContinueLearningButton from "../components/ContinueLearningButton";

interface Word {
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [collections, setCollections] = useState(initialWordCollections);
  const [search, setSearch] = useState("");

  const collectionIndex = collections.findIndex((c) => c.id === Number(id));
  const collection = collections[collectionIndex];

  const handleEditWord = (updatedWord: Word) => {
    const newCollections = [...collections];
    const words = newCollections[collectionIndex].words;
    const wordIndex = words.findIndex((w) => w.word === updatedWord.word);
    if (wordIndex !== -1) {
      words[wordIndex] = updatedWord;
      setCollections(newCollections);
    }
  };

  const handleDeleteWord = (wordToDelete: string) => {
    const newCollections = [...collections];
    const originalWords = newCollections[collectionIndex].words;
    newCollections[collectionIndex].words = originalWords.filter(
      (w) => w.word !== wordToDelete
    );
    setCollections(newCollections);
  };

  if (!collection) {
    return <div className="p-6">Collection not found</div>;
  }

  const filteredWords = collection.words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-4 lg:p-6 space-y-6">
      <div className="w-full flex flex-row items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/collections")}
          className="border-[#363538] text-[#363538] hover:bg-grey-100 flex items-center gap-2"
        >
          <CircleArrowLeft className="h-5 w-5 text-[#363538]" />
          Back
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2563EB]">
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

      <div className="flex justify-center">
        <div className="w-full sm:w-1/2 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#939393] text-center">
          <p>{collection.words.length} words</p>
          <p className="before:content-['•'] before:mx-2">{`Last studied: ${collection.lastStudied}`}</p>
          <p className="before:content-['•'] before:mx-2">{`Created: ${collection.createdAt}`}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full max-w-lg bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
            <Input
              placeholder="Search word..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
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
        <ContinueLearningButton id={id} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWords.map((w, idx) => (
          <WordCard
            key={`${w.word}-${idx}`}
            wordData={w}
            onEdit={handleEditWord}
            onDelete={() => handleDeleteWord(w.word)}
          />
        ))}
      </div>
    </div>
  );
}
