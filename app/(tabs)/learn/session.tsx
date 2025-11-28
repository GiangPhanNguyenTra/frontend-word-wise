import Heading from "@/components/Heading";
import FillBlankView from "@/components/learn/FillBlankView";
import FlashcardView from "@/components/learn/FlashcardView";
import MatchView from "@/components/learn/MatchView";
import MultipleChoiceView from "@/components/learn/MultipleChoiceView";
import TranslationView from "@/components/learn/TranslationView";
import { getCollectionDetail } from "@/services/collectionService";
import {
  completeCustomPracticeSession,
  completePracticeSession,
  getPracticeSession,
} from "@/services/practiceService";
import { ApiWord, PracticeCompletionResponse } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, RotateCw, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import Toast from "react-native-toast-message";

type QueueItem =
  | { type: "single"; word: ApiWord; mode: string; attempts: number }
  | { type: "match"; words: ApiWord[]; attempts: number };

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SessionPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode: string;
    type: string;
    collectionId?: string;
    collectionName?: string;
  }>();

  const selectedModes = params.mode ? JSON.parse(params.mode) : ["flashcards"];

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [allWords, setAllWords] = useState<ApiWord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Thống kê: Map<WordId, Số lần học> (bao gồm cả đúng và sai)
  const [wordStats, setWordStats] = useState<Record<number, number>>({});
  const [resultSummary, setResultSummary] =
    useState<PracticeCompletionResponse | null>(null);

  // State điều khiển đáp án cho Translation/Flashcard
  const [forceShowAnswer, setForceShowAnswer] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        let wordsToLearn: ApiWord[] = [];
        let currentSessionId = null;

        if (params.type === "today") {
          const session = await getPracticeSession();
          wordsToLearn = session.list_words || [];
          currentSessionId = session.sessionId;
        } else if (params.type === "collection" && params.collectionId) {
          try {
            const session = await getPracticeSession(params.collectionName);
            if (session.list_words.length > 0) {
              wordsToLearn = session.list_words;
              currentSessionId = session.sessionId;
            } else {
              throw new Error("No session");
            }
          } catch (e) {
            const detail = await getCollectionDetail(params.collectionId);
            wordsToLearn = detail.words;
          }
        }

        if (!wordsToLearn || wordsToLearn.length === 0) {
          Toast.show({
            type: "info",
            text1: "Empty",
            text2: "No words to learn",
          });
          router.back();
          return;
        }

        setAllWords(wordsToLearn);
        setSessionId(currentSessionId);

        // --- Xây dựng hàng đợi (Queue) ---
        const initialQueue: QueueItem[] = [];
        const shuffledWords = shuffleArray(wordsToLearn);

        // Init stats
        const stats: Record<number, number> = {};
        wordsToLearn.forEach((w) => (stats[w.wordId] = 0));
        setWordStats(stats);

        // Nếu chỉ chọn mode Match -> Gom nhóm 4 từ
        if (selectedModes.length === 1 && selectedModes[0] === "match") {
          for (let i = 0; i < shuffledWords.length; i += 4) {
            initialQueue.push({
              type: "match",
              words: shuffledWords.slice(i, i + 4),
              attempts: 0,
            });
          }
        } else {
          // Các mode khác (Flashcard, Fill, Translate...)
          shuffledWords.forEach((w) => {
            // Chọn ngẫu nhiên mode từ danh sách đã chọn (trừ 'all')
            let mode = selectedModes.includes("all")
              ? ["flashcards", "definition", "fill", "translation"][
                  Math.floor(Math.random() * 4)
                ]
              : selectedModes[Math.floor(Math.random() * selectedModes.length)];

            // Nếu mode là match nhưng đang học trộn -> fallback về flashcards (vì match cần nhóm)
            if (mode === "match") mode = "flashcards";

            initialQueue.push({
              type: "single",
              word: w,
              mode,
              attempts: 0,
            });
          });
        }

        setQueue(initialQueue);
        setTotalItems(initialQueue.length);
        setIsLoading(false);
      } catch (error) {
        console.error("Init Error:", error);
        router.back();
      }
    };
    initSession();
  }, []);

  const currentItem = queue[0];

  // Xử lý kết quả bài đơn (Single)
  const handleSingleResult = (isCorrect: boolean) => {
    if (currentItem?.type !== "single") return;
    const wordId = currentItem.word.wordId;
    setForceShowAnswer(false);

    // Tăng số lần học (learn_count)
    setWordStats((prev) => ({ ...prev, [wordId]: (prev[wordId] || 0) + 1 }));

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
      setQueue((prev) => prev.slice(1));
    } else {
      setWrongCount((prev) => prev + 1);
      // Sai -> Đẩy lại vào cuối hàng đợi (chuyển về Flashcard để ôn lại dễ hơn)
      const retryItem: QueueItem = {
        ...currentItem,
        mode: "flashcards",
        attempts: currentItem.attempts + 1,
      };
      setQueue((prev) => [...prev.slice(1), retryItem]);
    }
  };

  // Xử lý kết quả bài Match
  const handleMatchResult = (
    results: { wordId: number; isCorrect: boolean }[]
  ) => {
    let allCorrect = true;
    results.forEach((r) => {
      setWordStats((prev) => ({
        ...prev,
        [r.wordId]: (prev[r.wordId] || 0) + 1,
      }));
      if (!r.isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      setCorrectCount((prev) => prev + results.length); // Cộng điểm cho tất cả từ trong nhóm
    } else {
      setWrongCount((prev) => prev + 1); // Tính là 1 lần sai chung
    }

    setCompletedCount((prev) => prev + 1);
    setQueue((prev) => prev.slice(1));
  };

  // Nút "I don't know" cho Translation
  const handleDontKnow = () => {
    setForceShowAnswer(true);
    // Logic: Hiện đáp án, sau đó user phải tự bấm Correct/Wrong hoặc auto tính sai
    // Ở đây ta tính là sai luôn nhưng cho user xem đáp án trước khi next
  };

  useEffect(() => {
    if (!isLoading && queue.length === 0 && totalItems > 0 && !isFinished) {
      finishSession();
    }
  }, [queue.length, isLoading]);

  const finishSession = async () => {
    setIsLoading(true);
    const resultsPayload = Object.entries(wordStats).map(([wid, count]) => ({
      wordId: Number(wid),
      learn_count: count,
    }));

    try {
      let res;
      if (sessionId) {
        res = await completePracticeSession({
          sessionId,
          results: resultsPayload,
        });
      } else {
        res = await completeCustomPracticeSession(resultsPayload);
      }
      setResultSummary(res);
    } catch (e) {
      // Fallback UI
      setResultSummary({
        message: "Done",
        updated_streak: null,
        summary: {
          totalWords: totalItems,
          correct: correctCount,
          incorrect: wrongCount,
          reviewTomorrow: 0,
        },
      });
    } finally {
      setIsFinished(true);
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-[#F6F6F6]">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  // --- Màn hình Kết quả ---
  if (isFinished) {
    // Fix lỗi logic tính điểm
    const totalAnswers = correctCount + wrongCount;
    const score =
      totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
    const summary = resultSummary?.summary || {
      totalWords: totalItems,
      correct: correctCount,
      incorrect: wrongCount,
    };

    return (
      <View className="flex-1 bg-[#F6F6F6]">
        <Heading title="Session Results" showBack={false} />
        <ScrollView
          contentContainerStyle={{ padding: 24, alignItems: "center" }}
        >
          <View className="bg-white w-full rounded-[32px] p-8 items-center shadow-sm mb-6 border border-gray-100">
            <Text className="text-lg font-[Montserrat-Bold] text-gray-400 uppercase mb-2 tracking-widest">
              Accuracy
            </Text>
            <Text className="text-6xl font-[Montserrat-ExtraBold] text-[#2563EB] mb-4">
              {score}%
            </Text>
            <Text className="text-gray-600 font-[Montserrat-Medium] text-lg">
              {score >= 80 ? "Excellent job! 🎉" : "Keep practicing! 💪"}
            </Text>
          </View>

          <View className="flex-row gap-4 w-full mb-10">
            <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm border border-gray-100">
              <Text className="text-3xl font-[Montserrat-Bold] text-[#00966D] mb-1">
                {summary.correct}
              </Text>
              <Text className="text-xs text-gray-400 font-bold uppercase">
                Correct
              </Text>
            </View>
            <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm border border-gray-100">
              <Text className="text-3xl font-[Montserrat-Bold] text-[#D15743] mb-1">
                {summary.incorrect}
              </Text>
              <Text className="text-xs text-gray-400 font-bold uppercase">
                Incorrect
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#2563EB] w-full py-4 rounded-full items-center mb-4 shadow-md shadow-blue-200"
          >
            <Text className="text-white font-[Montserrat-Bold] text-lg">
              Back to Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsFinished(false);
              setCompletedCount(0);
              setCorrectCount(0);
              setWrongCount(0);
              // Reload lại component bằng cách replace chính nó
              router.replace({ pathname: "/(tabs)/learn/session", params });
            }}
            className="flex-row items-center gap-2 py-3"
          >
            <RotateCw size={18} color="#6B7280" />
            <Text className="text-gray-500 font-[Montserrat-Bold] text-base">
              Practice Again
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // --- Render Learning View ---
  // Fix lỗi "cannot read property 'mode' of undefined": Kiểm tra currentItem tồn tại
  if (!currentItem) return null;

  const progress = totalItems > 0 ? completedCount / totalItems : 0;

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title={params.collectionName || "Practice Session"}
        onBack={() => router.back()}
      />

      <View className="px-6 mt-4 mb-6">
        <Progress.Bar
          progress={progress}
          width={null}
          color="#2563EB"
          unfilledColor="#E5E7EB"
          borderWidth={0}
          height={8}
          borderRadius={4}
        />
        <Text className="text-right text-xs text-gray-400 font-[Montserrat-Bold] mt-2">
          {completedCount} / {totalItems}
        </Text>
      </View>

      <View className="flex-1 justify-center px-4 pb-4">
        {/* --- MATCH MODE --- */}
        {currentItem.type === "match" && (
          <MatchView words={currentItem.words} onComplete={handleMatchResult} />
        )}

        {/* --- SINGLE MODES --- */}
        {currentItem.type === "single" && (
          <>
            {/* 1. Flashcard Mode */}
            {currentItem.mode === "flashcards" && (
              <View className="flex-1 justify-center">
                <FlashcardView word={currentItem.word} />
                <View className="flex-row gap-4 mt-8 h-20">
                  <TouchableOpacity
                    onPress={() => handleSingleResult(false)}
                    className="flex-1 bg-white border border-gray-200 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
                  >
                    <X color="#D15743" size={24} />
                    <Text className="text-[#D15743] font-[Montserrat-Bold] text-lg">
                      Study Again
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSingleResult(true)}
                    className="flex-1 bg-[#2563EB] rounded-2xl items-center justify-center flex-row gap-2 shadow-md shadow-blue-200"
                  >
                    <Check color="white" size={24} />
                    <Text className="text-white font-[Montserrat-Bold] text-lg">
                      Got It
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 2. Multiple Choice Mode */}
            {currentItem.mode === "definition" && (
              <MultipleChoiceView
                word={currentItem.word}
                options={shuffleArray([
                  currentItem.word,
                  ...shuffleArray(
                    allWords.filter((w) => w.wordId !== currentItem.word.wordId)
                  ).slice(0, 3),
                ])}
                onAnswer={handleSingleResult}
              />
            )}

            {/* 3. Fill Blank Mode */}
            {currentItem.mode === "fill" && (
              <FillBlankView
                word={currentItem.word}
                onAnswer={handleSingleResult}
              />
            )}

            {/* 4. Translation Mode (Mới thêm) */}
            {currentItem.mode === "translation" && (
              <View className="w-full">
                <TranslationView
                  word={currentItem.word}
                  onAnswer={handleSingleResult}
                  forceShowAnswer={forceShowAnswer}
                />
                {/* Nút "I don't know" chỉ hiện khi chưa show đáp án */}
                {!forceShowAnswer && (
                  <TouchableOpacity
                    onPress={handleDontKnow}
                    className="mt-4 w-full py-4 rounded-full border border-gray-300 items-center"
                  >
                    <Text className="text-gray-500 font-[Montserrat-Bold]">
                      I don&apos;t know
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
