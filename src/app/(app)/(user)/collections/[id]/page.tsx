"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  PlusCircle,
  CircleArrowLeft,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { WordCard } from "../components/WordCard";
import ContinueLearningButton from "../components/ContinueLearningButton";
import {
  getCollectionDetail,
  updateWord,
  deleteWord,
} from "@/services/collectionService";
import { CollectionDetail, ApiWord } from "@/types/collection";

interface UIWord {
  id: number;
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
}

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getCollectionDetail(id);
        setCollection(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load collection details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleEditWord = async (updatedUIWord: UIWord) => {
    if (!collection) return;

    const updatePayload = {
      word: updatedUIWord.word,
      word_vn: updatedUIWord.meaning,
      partOfSpeech: updatedUIWord.type,
      definition_en: updatedUIWord.definitionEn,
      definition_vi: updatedUIWord.definitionVi,
      phonetics: {
        uk: {
          text: updatedUIWord.phoneticsUkText,
          audio: updatedUIWord.phoneticsUkAudio,
        },
        us: {
          text: updatedUIWord.phoneticsUsText,
          audio: updatedUIWord.phoneticsUsAudio,
        },
      },
      examples: [
        {
          en: updatedUIWord.exampleEn,
          vi: updatedUIWord.exampleVi,
        },
      ],
      synonyms: updatedUIWord.synonyms
        ? updatedUIWord.synonyms.split(",").map((s) => s.trim())
        : [],
      idioms_collocations: updatedUIWord.idiomsCollocations,
      phrasal_verbs: updatedUIWord.phrasalVerbs,
    };

    try {
      const updatedApiWord = await updateWord(updatedUIWord.id, updatePayload);

      const updatedWords = collection.words.map((w) =>
        w.wordId === updatedApiWord.wordId ? updatedApiWord : w
      );

      setCollection({ ...collection, words: updatedWords });
      toast.success("Word updated successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message || "Failed to update word");
    }
  };

  const handleDeleteWord = async (wordIdToDelete: number) => {
    if (!collection) return;

    try {
      await deleteWord(collection.collectionId, wordIdToDelete);

      const updatedWords = collection.words.filter(
        (w) => w.wordId !== wordIdToDelete
      );

      setCollection({
        ...collection,
        words: updatedWords,
        totalWords: collection.totalWords - 1,
      });
      toast.success("Word removed from collection successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message || "Failed to delete word");
    }
  };

  const filteredWords: UIWord[] = useMemo(() => {
    if (!collection) return [];

    let result = collection.words;

    if (search) {
      result = result.filter((w) =>
        w.wordText.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter(
        (w) => w.partOfSpeech.toLowerCase() === filterType.toLowerCase()
      );
    }

    return result.map((w) => ({
      id: w.wordId,
      word: w.wordText,
      type: w.partOfSpeech,
      meaning: w.wordVn,
      definitionEn: w.definitionEn,
      definitionVi: w.definitionVi,
      exampleEn: w.examples && w.examples.length > 0 ? w.examples[0].en : "",
      exampleVi: w.examples && w.examples.length > 0 ? w.examples[0].vi : "",
      phoneticsUkText: w.phonetics?.uk?.text || "",
      phoneticsUkAudio: w.phonetics?.uk?.audio || "",
      phoneticsUsText: w.phonetics?.us?.text || "",
      phoneticsUsAudio: w.phonetics?.us?.audio || "",
      synonyms: w.synonyms || "",
      idiomsCollocations: w.idiomsCollocations || [],
      phrasalVerbs: w.phrasalVerbs || [],
    }));
  }, [collection, search, filterType]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Collection not found
      </div>
    );
  }

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
          {collection.name}
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
          <p>{collection.totalWords} words</p>
          <p className="before:content-['•'] before:mx-2">
            Last studied:{" "}
            {collection.lastStudiedAt
              ? format(new Date(collection.lastStudiedAt), "MMM dd, yyyy")
              : "Never"}
          </p>
          <p className="before:content-['•'] before:mx-2">
            Created: {format(new Date(collection.createdAt), "MMM dd, yyyy")}
          </p>
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
                {filterType ? filterType : "Filter"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("noun")}>
                Noun
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("verb")}>
                Verb
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("adjective")}>
                Adjective
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("adverb")}>
                Adverb
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ContinueLearningButton id={id} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWords.map((w, idx) => (
          <WordCard
            key={`${w.id}-${idx}`}
            wordData={w}
            onEdit={handleEditWord}
            onDelete={() => handleDeleteWord(w.id)}
          />
        ))}
      </div>
    </div>
  );
}
