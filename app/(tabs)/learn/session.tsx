import Heading from "@/components/Heading";
import FillBlankView from "@/components/learn/FillBlankView";
import FlashcardView from "@/components/learn/FlashcardView";
import MultipleChoiceView from "@/components/learn/MultipleChoiceView";
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

type WordWithMode = { word: ApiWord; mode: string; attempts: number };

// Hàm trộn mảng ngẫu nhiên
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

  // Parse mode từ params (ví dụ: ["flashcards", "fill"])
  const selectedModes = params.mode ? JSON.parse(params.mode) : ["flashcards"];

  const [queue, setQueue] = useState<WordWithMode[]>([]);
  const [allWords, setAllWords] = useState<ApiWord[]>([]); // Dùng để làm đáp án nhiễu cho trắc nghiệm
  const [totalItems, setTotalItems] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [wordStats, setWordStats] = useState<Record<number, number>>({});
  const [resultSummary, setResultSummary] =
    useState<PracticeCompletionResponse | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        let wordsToLearn: ApiWord[] = [];
        let currentSessionId = null;

        // Logic lấy bài học: Hôm nay hoặc Từ Collection cụ thể
        if (params.type === "today") {
          const session = await getPracticeSession();
          wordsToLearn = session.list_words || [];
          currentSessionId = session.sessionId;
        } else if (params.type === "collection" && params.collectionId) {
          try {
            // Ưu tiên lấy session practice chuẩn của server
            const session = await getPracticeSession(params.collectionName);
            if (session.list_words.length > 0) {
              wordsToLearn = session.list_words;
              currentSessionId = session.sessionId;
            } else {
              throw new Error("No practice session");
            }
          } catch (e) {
            // Fallback: Lấy toàn bộ từ trong collection (học tự do)
            const detail = await getCollectionDetail(params.collectionId);
            wordsToLearn = detail.words;
          }
        }

        if (wordsToLearn.length === 0) {
          Toast.show({
            type: "info",
            text1: "Empty",
            text2: "No words to learn right now.",
          });
          router.back();
          return;
        }

        setAllWords(wordsToLearn);
        setSessionId(currentSessionId);

        // Tạo hàng đợi bài tập (Queue)
        // Mỗi từ sẽ được gán ngẫu nhiên 1 chế độ học trong danh sách selectedModes
        const initialQueue = shuffleArray(wordsToLearn).map((w) => ({
          word: w,
          mode: selectedModes.includes("all")
            ? ["flashcards", "definition", "fill"][
                Math.floor(Math.random() * 3)
              ]
            : selectedModes[Math.floor(Math.random() * selectedModes.length)],
          attempts: 0,
        }));

        setQueue(initialQueue);
        setTotalItems(initialQueue.length);

        // Init thống kê
        const stats: Record<number, number> = {};
        wordsToLearn.forEach((w) => (stats[w.wordId] = 0));
        setWordStats(stats);

        setIsLoading(false);
      } catch (error) {
        console.error("Init Session Error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to start session",
        });
        router.back();
      }
    };
    initSession();
  }, []);

  const currentItem = queue[0];

  const handleResult = (isCorrect: boolean) => {
    if (!currentItem) return;
    const wordId = currentItem.word.wordId;

    // Cập nhật thống kê gửi về server
    setWordStats((prev) => ({ ...prev, [wordId]: (prev[wordId] || 0) + 1 }));

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
      setQueue((prev) => prev.slice(1)); // Xóa khỏi hàng đợi
    } else {
      setWrongCount((prev) => prev + 1);
      // Nếu sai, đẩy lại từ này xuống cuối hàng đợi và chuyển về chế độ Flashcard để ôn lại
      const retryItem = {
        ...currentItem,
        mode: "flashcards",
        attempts: currentItem.attempts + 1,
      };
      setQueue((prev) => [...prev.slice(1), retryItem]);
    }
  };

  // Check kết thúc session
  useEffect(() => {
    if (!isLoading && queue.length === 0 && totalItems > 0 && !isFinished) {
      finishSession();
    }
  }, [queue.length, isLoading]);

  const finishSession = async () => {
    setIsLoading(true);
    // Format data trả về server
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
      setIsFinished(true);
    } catch (e) {
      console.error("Finish Error:", e);
      // Vẫn hiện kết quả ở local dù API lỗi
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
      setIsFinished(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-[#F6F6F6]">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  // --- Màn hình Kết quả (Result View) ---
  if (isFinished) {
    const summary = resultSummary?.summary || {
      totalWords: totalItems,
      correct: correctCount,
      incorrect: wrongCount,
    };
    const score = Math.round(
      (correctCount / (correctCount + wrongCount || 1)) * 100
    );

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
              // Reload lại logic init
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

  const progress = totalItems > 0 ? completedCount / totalItems : 0;

  // --- Màn hình Học (Learning View) ---
  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title={params.collectionName || "Practice Session"}
        onBack={() => router.back()}
      />

      {/* Thanh tiến trình */}
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

      {/* Khu vực hiển thị bài tập */}
      <View className="flex-1 justify-center px-4 pb-4">
        {/* 1. Flashcard Mode */}
        {currentItem.mode === "flashcards" && (
          <View className="flex-1 justify-center">
            <FlashcardView word={currentItem.word} />

            {/* Nút điều hướng cho Flashcard */}
            <View className="flex-row gap-4 mt-8 h-20">
              <TouchableOpacity
                onPress={() => handleResult(false)}
                className="flex-1 bg-white border border-gray-200 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
              >
                <X color="#D15743" size={24} />
                <Text className="text-[#D15743] font-[Montserrat-Bold] text-lg">
                  Study Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleResult(true)}
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
            // Tạo danh sách options: bao gồm từ đúng + 3 từ ngẫu nhiên khác
            options={shuffleArray([
              currentItem.word,
              ...shuffleArray(
                allWords.filter((w) => w.wordId !== currentItem.word.wordId)
              ).slice(0, 3),
            ])}
            onAnswer={handleResult}
          />
        )}

        {/* 3. Fill Blank Mode */}
        {currentItem.mode === "fill" && (
          <FillBlankView word={currentItem.word} onAnswer={handleResult} />
        )}

        {/* Fallback nếu mode không hợp lệ -> Hiện Flashcard */}
        {!["flashcards", "definition", "fill"].includes(currentItem.mode) && (
          <FlashcardView word={currentItem.word} />
        )}
      </View>
    </View>
  );
}
