import { ApiWord } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  word: ApiWord;
  options: ApiWord[]; // Danh sách các từ để làm đáp án nhiễu
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultipleChoiceView({ word, options, onAnswer }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setIsAnswered(false);
  }, [word]);

  const handleSelect = (selectedWord: ApiWord) => {
    if (isAnswered) return;
    setSelectedId(selectedWord.wordId);
    setIsAnswered(true);

    const correct = selectedWord.wordId === word.wordId;

    // Delay 1 chút để user thấy màu đúng/sai trước khi chuyển
    setTimeout(() => {
      onAnswer(correct);
    }, 800);
  };

  return (
    <View className="w-full flex-1 justify-center">
      <View className="bg-white p-8 rounded-[24px] shadow-sm mb-8 items-center min-h-[180px] justify-center border border-gray-100">
        <Text className="text-gray-400 font-[Montserrat-Bold] text-xs uppercase mb-4 tracking-widest">
          Which word matches this definition?
        </Text>
        <Text className="text-xl font-[Montserrat-Medium] text-center text-[#1F2937] leading-8">
          &quot;{word.definitionEn}&quot;
        </Text>
      </View>

      <View className="gap-3">
        {options.map((opt) => {
          const isSelected = selectedId === opt.wordId;
          const isCorrect = opt.wordId === word.wordId;

          let bg = "bg-white";
          let border = "border-gray-200";
          let text = "text-[#374151]";

          if (isAnswered) {
            if (isCorrect) {
              bg = "bg-green-100";
              border = "border-green-500";
              text = "text-green-700";
            } else if (isSelected && !isCorrect) {
              bg = "bg-red-100";
              border = "border-red-500";
              text = "text-red-700";
            }
          }

          return (
            <TouchableOpacity
              key={opt.wordId}
              onPress={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`p-5 rounded-2xl border ${bg} ${border} active:scale-[0.98]`}
            >
              <Text
                className={`text-lg font-[Montserrat-SemiBold] text-center ${text}`}
              >
                {opt.wordText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
