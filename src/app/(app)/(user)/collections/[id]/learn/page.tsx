"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { wordCollections, Word } from "../../data/word-data";
import { Flashcard } from "../../components/Flashcard";
import { Translation } from "../../components/Translation";
import { DefinitionChoice } from "../../components/DefinitionChoice";
import { FillBlank } from "../../components/FillBlank";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type WordWithMode = { word: Word; mode: string };

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const router = useRouter();

  const collection = wordCollections.find((c) => c.id === id);
  const modes = searchParams.get("modes")?.split(",") || [];

  const [words, setWords] = useState<WordWithMode[]>(() => {
    if (collection && modes.length > 0) {
      return shuffleArray(collection.words).map((w) => ({
        word: w,
        mode: modes[Math.floor(Math.random() * modes.length)],
      }));
    }
    return [];
  });

  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [skip, setSkip] = useState(0);
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);

  if (!collection) return <div>Collection not found</div>;
  if (words.length === 0) return <div>Loading...</div>;

  if (index >= words.length) {
    return (
      <div className="p-6 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-[#00966D]">🎉 Done!</h1>
        <p>You have finished learning this set.</p>

        <div className="flex gap-6 text-lg">
          <p className="text-[#00966D] font-bold">Studied: {correct}</p>
          <p className="text-[#C30000] font-bold">Wrong: {wrong}</p>
          <p className="text-[#EBAD25] font-bold">Skipped: {skip}</p>
        </div>

        <div className="w-full self-stretch inline-flex flex-row justify-center items-center gap-2.5">
          <Button
            className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
            onClick={() => {
              setIndex(0);
              setCorrect(0);
              setWrong(0);
              setSkip(0);
              setAnswered(null);
              setWords(
                shuffleArray(collection.words).map((w) => ({
                  word: w,
                  mode: modes[Math.floor(Math.random() * modes.length)],
                }))
              );
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

  const current = words[index];

  const handleAnswer = (result: "correct" | "wrong") => {
    if (answered) return;
    setAnswered(result);
    if (result === "correct") setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
  };

  const nextQuestion = () => {
    if (!answered) {
      setSkip((s) => s + 1);
    }
    setAnswered(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-[#2563EB]">{collection.title}</h1>

      <div className="flex gap-6 text-lg">
        <p className="text-[#00966D] font-bold">Correct: {correct}</p>
        <p className="text-[#C30000] font-bold">Wrong: {wrong}</p>
        <p className="text-[#EBAD25] font-bold">Skipped: {skip}</p>
        <p className="text-black font-bold">
          Progress: {index + 1}/{words.length}
        </p>
      </div>

      <div className="w-3/4 p-6 flex flex-col items-center gap-6">
        {current.mode === "flashcards" && <Flashcard word={current.word} />}
        {current.mode === "translation" && (
          <Translation
            word={current.word}
            onAnswer={handleAnswer}
            forceDontKnow={answered === "wrong"}
          />
        )}

        {current.mode === "definition" && (
          <DefinitionChoice
            word={current.word}
            allWords={collection.words}
            onAnswer={handleAnswer}
          />
        )}
        {current.mode === "fill" && (
          <FillBlank
            word={current.word}
            onAnswer={handleAnswer}
            forceDontKnow={answered === "wrong"}
          />
        )}

        <div className="w-full flex-row justify-between inline-flex mt-4 gap-4">
          <Button
            className="!border !border-[#363538] bg-white text-[#363538]"
            onClick={() => handleAnswer("wrong")}
            disabled={!!answered}
          >
            I don’t know
          </Button>

          {current.mode === "flashcards" && (
            <Button
              className="bg-[#00966D] hover:bg-green-800 text-white"
              onClick={() => handleAnswer("correct")}
              disabled={!!answered}
            >
              <Check />I know this
            </Button>
          )}

          <Button
            className="bg-[#2563EB] hover:bg-blue-800"
            onClick={nextQuestion}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
