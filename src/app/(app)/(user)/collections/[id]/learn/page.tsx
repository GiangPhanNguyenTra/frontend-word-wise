"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { Flashcard } from "../../components/Flashcard";
import { Translation } from "../../components/Translation";
import { DefinitionChoice } from "../../components/DefinitionChoice";
import { FillBlank } from "../../components/FillBlank";

import {
  getPracticeSession,
  completePracticeSession,
  completeCustomPracticeSession,
} from "@/services/practiceService";
import { getCollectionDetail } from "@/services/collectionService";
import { ApiWord } from "@/types/collection";
import { PracticeCompletionResponse } from "@/types/practice";

type WordWithMode = { word: ApiWord; mode: string; attempts: number };

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const router = useRouter();

  // Sử dụng useRef để tránh gọi API 2 lần trong dev mode (React Strict Mode)
  const initialized = useRef(false);

  const selectedModes = searchParams.get("modes")?.split(",") || ["flashcards"];

  // States
  const [viewState, setViewState] = useState<
    "loading" | "studying" | "finished" | "error"
  >("loading");
  const [queue, setQueue] = useState<WordWithMode[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allCollectionWords, setAllCollectionWords] = useState<ApiWord[]>([]); // Dùng cho trắc nghiệm

  // Stats tracking
  const [totalWords, setTotalWords] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [wordStats, setWordStats] = useState<Record<number, number>>({});
  const [resultSummary, setResultSummary] =
    useState<PracticeCompletionResponse | null>(null);

  // Current question logic
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initSession = async () => {
      try {
        let wordsToLearn: ApiWord[] = [];
        let currentCollectionName = "";
        let currentSessionId: string | null = null;

        // 1. Thử lấy Scheduled Practice Session
        try {
          const sessionData = await getPracticeSession(id);
          if (sessionData.list_words && sessionData.list_words.length > 0) {
            wordsToLearn = sessionData.list_words;
            currentSessionId = sessionData.sessionId;
            currentCollectionName = sessionData.collection.collectionName;
          }
        } catch (err) {
          // Nếu lỗi (ví dụ 404 do không có bài tập scheduled), bỏ qua và fallback sang custom
          console.log(
            "Scheduled session not found or error, falling back to custom mode."
          );
        }

        // 2. Fallback: Nếu không có scheduled words, lấy tất cả từ trong collection (Custom Practice)
        if (wordsToLearn.length === 0) {
          const collectionData = await getCollectionDetail(id);
          wordsToLearn = collectionData.words;
          currentCollectionName = collectionData.name;
        }

        if (wordsToLearn.length === 0) {
          toast.info("This collection has no words to learn.");
          setViewState("error");
          return;
        }

        // Set Data
        setSessionId(currentSessionId);
        setCollectionName(currentCollectionName);
        setAllCollectionWords(wordsToLearn);
        setTotalWords(wordsToLearn.length);

        // Init Queue & Stats
        const initialQueue = shuffleArray(wordsToLearn).map((w) => ({
          word: w,
          mode: selectedModes[Math.floor(Math.random() * selectedModes.length)],
          attempts: 0,
        }));
        setQueue(initialQueue);

        const initialStats: Record<number, number> = {};
        wordsToLearn.forEach((w) => (initialStats[w.wordId] = 0));
        setWordStats(initialStats);

        setViewState("studying");
      } catch (error) {
        console.error("Init Error:", error);
        toast.error("Failed to initialize session");
        setViewState("error");
      }
    };

    initSession();
  }, [id, selectedModes]);

  const current = queue[0];
  const progressValue =
    totalWords > 0 ? (completedCount / totalWords) * 100 : 0;

  const handleAnswer = (result: "correct" | "wrong") => {
    if (answered) return;
    setAnswered(result);

    // Tăng số lần học của từ này
    if (current) {
      setWordStats((prev) => ({
        ...prev,
        [current.word.wordId]: (prev[current.word.wordId] || 0) + 1,
      }));
    }
  };

  const nextQuestion = () => {
    if (!current) return;

    if (answered === "correct") {
      // Đúng -> Xóa khỏi hàng đợi
      setCompletedCount((c) => c + 1);
      setQueue((prev) => prev.slice(1));
    } else {
      // Sai hoặc Skip -> Đẩy xuống cuối hàng đợi với mode ngẫu nhiên khác
      const reQueuedWord = {
        ...current,
        mode: selectedModes[Math.floor(Math.random() * selectedModes.length)],
        attempts: current.attempts + 1,
      };
      setQueue((prev) => [...prev.slice(1), reQueuedWord]);
    }

    setAnswered(null);
  };

  // Tự động check hoàn thành khi queue rỗng
  useEffect(() => {
    if (viewState === "studying" && queue.length === 0 && totalWords > 0) {
      finishSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length, viewState, totalWords]);

  const finishSession = async () => {
    setViewState("loading"); // Show loading khi đang submit

    // Đảm bảo count ít nhất là 1 nếu từ đó đã xuất hiện trong session (dù skip)
    // Nhưng logic ở trên đã setWordStats từ đầu là 0, và tăng khi handleAnswer.
    // Nếu user skip liên tục mà không handleAnswer, count vẫn là 0.
    // Tuỳ logic BE, ở đây ta gửi count thực tế.
    const resultsPayload = Object.entries(wordStats).map(([wordId, count]) => ({
      wordId: Number(wordId),
      learn_count: count,
    }));

    try {
      let response;
      if (sessionId) {
        response = await completePracticeSession({
          sessionId,
          results: resultsPayload,
        });
      } else {
        response = await completeCustomPracticeSession(resultsPayload);
      }

      setResultSummary(response);
      setViewState("finished");
    } catch (error) {
      console.error("Finish Error:", error);
      toast.error("Failed to submit results");
      setViewState("finished"); // Vẫn hiện màn hình finish dù lỗi mạng để user không bị kẹt
    }
  };

  // --- RENDER UI ---

  if (viewState === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Unable to load practice session.
        </p>
        <Button onClick={() => router.push(`/collections/${id}`)}>
          Back to Collection
        </Button>
      </div>
    );
  }

  if (viewState === "finished") {
    const summary = resultSummary?.summary || {
      correct: completedCount,
      incorrect: 0,
      totalWords,
      reviewTomorrow: 0,
    };

    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center">
        <h1 className="text-3xl font-bold text-[#00966D]">
          🎉 Session Complete!
        </h1>
        <p className="text-gray-600">You have finished reviewing this set.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center bg-gray-50 p-6 rounded-xl w-full max-w-lg shadow-sm border">
          <div>
            <p className="text-2xl font-bold text-primary">
              {summary.totalWords}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00966D]">
              {summary.correct}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Correct
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#C30000]">
              {summary.incorrect}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Incorrect
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#EBAD25]">
              {summary.reviewTomorrow}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Review Tmr
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Button
            variant="outline"
            className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={16} /> Study Again
          </Button>
          <Button
            className="bg-[#2563EB] hover:bg-blue-800"
            onClick={() => router.push(`/collections/${id}`)}
          >
            Return to Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8 w-full">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={() => router.push(`/collections/${id}`)}
          >
            <CircleArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2563EB]">
            {collectionName}
          </h1>
          <div className="w-20" />
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-3 rounded-full" />
        </div>

        {/* Main Card Area */}
        <div className="flex-1 flex flex-col items-center w-full">
          {current && (
            <>
              <div className="w-full mb-6">
                {current.mode === "flashcards" && (
                  <Flashcard word={current.word} />
                )}
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
                    allWords={allCollectionWords}
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
              </div>

              {/* Footer Actions */}
              <div className="w-full flex items-center justify-between gap-4 h-16">
                {!answered ? (
                  <>
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
                  </>
                ) : (
                  <Button
                    className="bg-[#2563EB] hover:bg-blue-800 text-white w-full sm:w-auto align-right "
                    onClick={nextQuestion}
                  >
                    Next
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
