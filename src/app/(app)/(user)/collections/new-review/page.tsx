"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleArrowLeft, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WordCard } from "../components/WordCard";
import { createCollectionWithWords } from "@/services/collectionService";
import { ApiWord } from "@/types/collection";

// Định nghĩa Interface UIWord tương thích với WordCard và CollectionDetailPage
interface UIWord {
  id: number; // Tạm thời dùng index hoặc ID giả
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
  phoneticsUkText: string;
  phoneticsUkAudio: string;
  phoneticsUsText: string;
  phoneticsUsAudio: string;
  synonyms: string;
  idiomsCollocations: { en: string; vi: string }[];
  phrasalVerbs: { en: string; vi: string }[];
  source?: string;
}

export default function NewReviewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get("title") || "";

  const [words, setWords] = useState<UIWord[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("newCollectionData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.enrichedWords && Array.isArray(parsed.enrichedWords)) {
          // Map từ ApiWord sang UIWord
          const mappedWords: UIWord[] = parsed.enrichedWords.map(
            (w: ApiWord, idx: number) => ({
              id: idx, // ID tạm
              word: w.wordText,
              type: w.partOfSpeech,
              meaning: w.wordVn,
              definitionEn: w.definitionEn,
              definitionVi: w.definitionVi,
              exampleEn:
                w.examples && w.examples.length > 0 ? w.examples[0].en : "",
              exampleVi:
                w.examples && w.examples.length > 0 ? w.examples[0].vi : "",
              phoneticsUkText: w.phonetics?.uk?.text || "",
              phoneticsUkAudio: w.phonetics?.uk?.audio || "",
              phoneticsUsText: w.phonetics?.us?.text || "",
              phoneticsUsAudio: w.phonetics?.us?.audio || "",
              synonyms: w.synonyms || "", 
              idiomsCollocations: w.idiomsCollocations || [],
              phrasalVerbs: w.phrasalVerbs || [],
              source: w.sourceUrl,
            })
          );
          setWords(mappedWords);
        }
      } catch (error) {
        console.error("Error parsing stored words:", error);
        toast.error("Failed to load review data.");
      }
    }
  }, []);

  const handleEditWord = (index: number, updatedWord: UIWord) => {
    const newWords = [...words];
    newWords[index] = updatedWord;
    setWords(newWords);
  };

  const handleDeleteWord = (index: number) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleSave = async () => {
    if (words.length === 0) {
      toast.error("Collection must have at least one word.");
      return;
    }

    setIsSaving(true);
    try {
      const apiWordsPayload = words.map((w) => ({
        wordText: w.word,
        wordVn: w.meaning,
        partOfSpeech: w.type,
        definitionEn: w.definitionEn,
        definitionVi: w.definitionVi,
        phonetics: {
          uk: { text: w.phoneticsUkText, audio: w.phoneticsUkAudio },
          us: { text: w.phoneticsUsText, audio: w.phoneticsUsAudio },
        },
        examples: [
          {
            en: w.exampleEn,
            vi: w.exampleVi,
          },
        ],
        idiomsCollocations: w.idiomsCollocations,
        phrasalVerbs: w.phrasalVerbs,
        synonyms: w.synonyms,
        source: w.source,
      }));

      const res = await createCollectionWithWords(title, apiWordsPayload);

      toast.success("Collection created successfully!");
      localStorage.removeItem("newCollectionData");

      if (res.data && res.data.collectionId) {
        router.push(`/collections/${res.data.name }`);
      } else {
        router.push("/collections");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save collection.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredWords = useMemo(() => {
    return words.filter((w) =>
      w.word.toLowerCase().includes(search.toLowerCase())
    );
  }, [words, search]);

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
            Review: {title}
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
          disabled={isSaving}
          className="bg-[#2563EB] text-white hover:bg-blue-600 whitespace-nowrap"
        >
          {isSaving ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <>
              <span className="sm:hidden">Save</span>
              <span className="hidden sm:inline">Save Collection</span>
            </>
          )}
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
