import { ApiWord } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, Vibration, View } from "react-native";

interface Props {
  words: ApiWord[]; // Danh sách 4-5 từ để nối
  onComplete: (results: { wordId: number; isCorrect: boolean }[]) => void;
}

export default function MatchView({ words, onComplete }: Props) {
  const [leftCol, setLeftCol] = useState<ApiWord[]>([]);
  const [rightCol, setRightCol] = useState<ApiWord[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });

  // Lưu kết quả để báo cáo về SessionPage (mặc định là đúng, nếu sai lần đầu thì đánh dấu sai)
  const [results, setResults] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Khởi tạo bảng kết quả mặc định là true
    const initResults: Record<number, boolean> = {};
    words.forEach((w) => (initResults[w.wordId] = true));
    setResults(initResults);

    setLeftCol(words);
    setRightCol([...words].sort(() => Math.random() - 0.5));
  }, [words]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Đúng
        setMatchedIds((prev) => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Sai
        Vibration.vibrate();
        setWrongPair({ left: selectedLeft, right: selectedRight });

        // Đánh dấu từ này là sai (cả 2 từ đều bị tính là sai trong lần match này)
        setResults((prev) => ({
          ...prev,
          [selectedLeft]: false,
          [selectedRight]: false,
        }));

        setTimeout(() => {
          setWrongPair({ left: null, right: null });
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (words.length > 0 && matchedIds.length === words.length) {
      // Hoàn thành tất cả
      setTimeout(() => {
        const finalResults = Object.entries(results).map(([id, isCorrect]) => ({
          wordId: Number(id),
          isCorrect,
        }));
        onComplete(finalResults);
      }, 500);
    }
  }, [matchedIds]);

  return (
    <View className="flex-1 w-full justify-center">
      <Text className="text-center font-[Montserrat-Bold] text-gray-400 mb-6 uppercase tracking-widest">
        Match the pairs
      </Text>
      <View className="flex-row justify-between w-full gap-4">
        {/* Cột Trái (Tiếng Anh) */}
        <View className="flex-1 gap-3">
          {leftCol.map((item) => {
            const isMatched = matchedIds.includes(item.wordId);
            const isSelected = selectedLeft === item.wordId;
            const isWrong = wrongPair.left === item.wordId;

            if (isMatched) return <View key={item.wordId} className="h-16" />; // Placeholder ẩn

            return (
              <TouchableOpacity
                key={item.wordId}
                onPress={() => setSelectedLeft(item.wordId)}
                className={`h-16 items-center justify-center rounded-xl border-2 ${
                  isWrong
                    ? "bg-red-50 border-red-200"
                    : isSelected
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-100"
                }`}
              >
                <Text
                  className={`font-[Montserrat-SemiBold] text-center ${isWrong ? "text-red-500" : isSelected ? "text-blue-600" : "text-gray-700"}`}
                >
                  {item.wordText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cột Phải (Tiếng Việt) */}
        <View className="flex-1 gap-3">
          {rightCol.map((item) => {
            const isMatched = matchedIds.includes(item.wordId);
            const isSelected = selectedRight === item.wordId;
            const isWrong = wrongPair.right === item.wordId;

            if (isMatched) return <View key={item.wordId} className="h-16" />;

            return (
              <TouchableOpacity
                key={item.wordId}
                onPress={() => setSelectedRight(item.wordId)}
                className={`h-16 items-center justify-center rounded-xl border-2 ${
                  isWrong
                    ? "bg-red-50 border-red-200"
                    : isSelected
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-100"
                }`}
              >
                <Text
                  className={`font-[Montserrat-Medium] text-xs text-center ${isWrong ? "text-red-500" : isSelected ? "text-blue-600" : "text-gray-600"}`}
                >
                  {item.wordVn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
