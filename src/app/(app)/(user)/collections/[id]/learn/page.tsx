"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { wordCollections, Word } from "../../data/word-data";
import { Flashcard } from "../../components/Flashcard";
import { Translation } from "../../components/Translation";
import { DefinitionChoice } from "../../components/DefinitionChoice";
import { FillBlank } from "../../components/FillBlank";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const router = useRouter();

  const collection = wordCollections.find((c) => c.id === id);
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<string | null>(null);

  const modes = searchParams.get("modes")?.split(",") || [];

  // Khi mount → shuffle words
  useEffect(() => {
    if (collection) {
      setWords(shuffleArray(collection.words));
    }
  }, [collection]);

  // Mỗi khi sang từ mới → random mode
  useEffect(() => {
    if (modes.length > 0) {
      setMode(modes[Math.floor(Math.random() * modes.length)]);
    }
  }, [index, modes]);

  if (!collection) return <div>Collection not found</div>;
  if (words.length === 0) return <div>Loading...</div>;

  // Hết từ
  if (index >= words.length) {
    return (
      <div className="p-6 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-green-600">🎉 Done!</h1>
        <p>You have finished learning this set.</p>
        <div className="w-full self-stretch inline-flex flex-row justify-center items-center gap-2.5">
          <Button
            className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
            onClick={() => {
              setIndex(0);
              setWords(shuffleArray(collection.words));
            }}
          >
            Restart
          </Button>
          <Button
            className="bg-[#2563EB] hover:bg-blue-800"
            onClick={() => router.push(`/collections/${id}`)}
          >
            Return
          </Button>
        </div>
      </div>
    );
  }

  const word = words[index];
  if (!mode) return <div>Loading mode...</div>;

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-[#2563EB]">{collection.title}</h1>

      <div className="w-3/4 p-6 flex flex-col items-center gap-6">
        {mode === "flashcards" && <Flashcard word={word} />}

        {mode === "translation" && <Translation word={word} />}

        {mode === "definition" && (
          <DefinitionChoice word={word} allWords={collection.words} />
        )}

        {mode === "fill" && <FillBlank word={word} />}

        <div className="w-full flex-row justify-between inline-flex">
          <Button className="!border !border-[#363538] bg-white text-[#363538]">
            Previous
          </Button>
          <Button
            className="bg-[#2563EB] hover:bg-blue-800"
            onClick={() => setIndex((i) => i + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
