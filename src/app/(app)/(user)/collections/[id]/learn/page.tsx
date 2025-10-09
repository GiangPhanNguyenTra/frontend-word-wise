"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { wordCollections, Word } from "../../data/word-data";
import { Flashcard } from "../../components/Flashcard";
import { Translation } from "../../components/Translation";
import { DefinitionChoice } from "../../components/DefinitionChoice";
import { FillBlank } from "../../components/FillBlank";
import { Button } from "@/components/ui/button";
import { Check, CircleArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
      <div className="p-6 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-[#00966D]">🎉 Done!</h1>
        <p>You have finished learning this set.</p>

        <div className="flex flex-wrap justify-center gap-4 text-base sm:text-lg">
          <p className="text-[#00966D] font-medium">Studied: {correct}</p>
          <p className="text-[#C30000] font-medium">Wrong: {wrong}</p>
          <p className="text-[#EBAD25] font-medium">Skipped: {skip}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
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
  const progressValue = ((index + 1) / words.length) * 100;

  const handleAnswer = (result: "correct" | "wrong") => {
    if (answered) return;
    setAnswered(result);
    if (result === "correct") setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
  };

  const nextQuestion = () => {
    if (!answered) setSkip((s) => s + 1);
    setAnswered(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center gap-4 w-full">
      {/* Header */}
      <div className="relative w-full">
        {/* Desktop layout */}
        <div className="hidden sm:flex items-center relative">
          <Button
            className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100 flex items-center gap-1"
            onClick={() => router.push(`/collections`)}
          >
            <CircleArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl lg:text-2xl font-bold text-[#2563EB] text-center">
            Review New Collection: {collection.title}
          </h1>
        </div>

        {/* Mobile layout */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <Button
            className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100 flex items-center gap-1"
            onClick={() => router.push(`/collections`)}
          >
            <CircleArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-base font-bold text-[#2563EB] text-right truncate max-w-[70%]">
            {collection.title}
          </h1>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-lg">
        <p className="text-[#00966D] font-medium">Correct: {correct}</p>
        <p className="text-[#C30000] font-medium">Wrong: {wrong}</p>
        <p className="text-[#EBAD25] font-medium">Skipped: {skip}</p>
        <p className="text-black font-medium">
          Progress: {index + 1}/{words.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full sm:w-3/4 md:w-2/3 flex flex-col gap-2 px-2 sm:px-0">
        <div className="flex justify-between text-xs sm:text-sm font-medium">
          <span>Progress</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2 sm:h-3 rounded-full" />
      </div>

      {/* Main content */}
      <div className="w-full sm:w-3/4 lg:w-2/3 p-4 sm:p-6 flex flex-col items-center gap-6">
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

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-2">
          <Button
            className="bg-gray-200 text-black hover:bg-gray-300 w-full sm:w-auto"
            onClick={() => handleAnswer("wrong")}
            disabled={!!answered}
          >
            I don’t know
          </Button>

          {current.mode === "flashcards" && (
            <Button
              className="bg-[#00966D] hover:bg-green-800 text-white w-full sm:w-auto"
              onClick={() => handleAnswer("correct")}
              disabled={!!answered}
            >
              <Check className="mr-1" /> I know this
            </Button>
          )}

          <Button
            className="bg-[#2563EB] hover:bg-blue-800 text-white w-full sm:w-auto"
            onClick={nextQuestion}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
