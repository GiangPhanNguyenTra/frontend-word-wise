import { ApiWord } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

interface Props {
  word: ApiWord;
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlankView({ word, onAnswer }: Props) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const sentence = word.examples?.[0]?.en || `The word is ${word.wordText}`;
  // Thay thế từ cần điền bằng ________
  const maskedSentence = sentence.replace(
    new RegExp(word.wordText, "gi"),
    "_______"
  );

  useEffect(() => {
    setInput("");
    setStatus("idle");
  }, [word]);

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === word.wordText.toLowerCase()) {
      setStatus("correct");
      setTimeout(() => onAnswer(true), 1000);
    } else {
      setStatus("wrong");
      Vibration.vibrate();
      setTimeout(() => {
        setStatus("idle");
        setInput("");
      }, 800);
    }
  };

  return (
    <View className="w-full bg-white p-8 rounded-[24px] shadow-sm min-h-[400px] items-center justify-center">
      <Text className="text-gray-400 font-[Montserrat-Bold] text-xs uppercase mb-8 tracking-widest">
        Fill in the blank
      </Text>

      <Text className="text-2xl font-[Montserrat-Medium] text-center text-[#1F2937] mb-3 leading-9">
        {maskedSentence}
      </Text>
      <Text className="text-gray-500 italic mb-10 text-center font-[Montserrat-Regular]">
        ({word.wordVn})
      </Text>

      {/* Ô hiển thị từng ký tự */}
      <View className="w-full flex-row flex-wrap justify-center gap-2 mb-6">
        {word.wordText.split("").map((char, index) => (
          <View
            key={index}
            className={`w-10 h-12 border-b-2 items-center justify-center ${
              status === "wrong"
                ? "border-red-500"
                : status === "correct"
                  ? "border-green-500"
                  : "border-gray-300"
            }`}
          >
            <Text
              className={`text-2xl font-[Montserrat-Bold] uppercase ${
                status === "wrong"
                  ? "text-red-500"
                  : status === "correct"
                    ? "text-green-500"
                    : "text-black"
              }`}
            >
              {input[index] || ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Input ẩn để hứng bàn phím */}
      <TextInput
        value={input}
        onChangeText={(t) => {
          if (t.length <= word.wordText.length) setInput(t);
        }}
        autoCapitalize="none"
        autoFocus
        className="absolute opacity-0 w-full h-full"
        onSubmitEditing={checkAnswer}
      />

      <TouchableOpacity
        onPress={checkAnswer}
        disabled={input.length === 0}
        className={`mt-auto w-full py-4 rounded-full shadow-md ${
          input.length > 0 ? "bg-[#2563EB]" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-center font-[Montserrat-Bold] text-lg ${input.length > 0 ? "text-white" : "text-gray-400"}`}
        >
          Check Answer
        </Text>
      </TouchableOpacity>
    </View>
  );
}
