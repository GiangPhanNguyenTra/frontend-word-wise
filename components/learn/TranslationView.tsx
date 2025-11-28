import { ApiWord } from "@/types";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";

interface Props {
  word: ApiWord;
  onAnswer: (isCorrect: boolean) => void;
  forceShowAnswer?: boolean;
}

export default function TranslationView({
  word,
  onAnswer,
  forceShowAnswer,
}: Props) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    setInput("");
    setStatus("idle");
  }, [word]);

  // Khi user bấm "I don't know" từ màn hình cha
  useEffect(() => {
    if (forceShowAnswer) {
      setStatus("wrong");
      setInput(word.wordText);
    }
  }, [forceShowAnswer, word]);

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === word.wordText.toLowerCase()) {
      setStatus("correct");
      const url = word.phonetics?.us?.audio || word.phonetics?.uk?.audio;
      if (url)
        Audio.Sound.createAsync({ uri: url }).then(({ sound }) =>
          sound.playAsync()
        );
      setTimeout(() => onAnswer(true), 1000);
    } else {
      setStatus("wrong");
      Vibration.vibrate();
      // Không clear input ngay để user thấy mình sai ở đâu
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="w-full bg-white p-6 rounded-[24px] shadow-sm min-h-[350px] items-center justify-center">
        <Text className="text-gray-400 font-[Montserrat-Bold] text-xs uppercase mb-6 tracking-widest">
          Translate this word
        </Text>

        <Text className="text-3xl font-[Montserrat-Bold] text-[#1F2937] mb-8 text-center leading-9">
          {word.wordVn}
        </Text>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type the English word"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={checkAnswer}
          editable={status !== "correct"}
          className={`w-full h-14 border-b-2 text-xl font-[Montserrat-Medium] text-center mb-8 ${
            status === "wrong"
              ? "border-red-500 text-red-600"
              : status === "correct"
                ? "border-green-500 text-green-600"
                : "border-gray-200 text-gray-800"
          }`}
        />

        {status === "wrong" && (
          <Text className="text-red-500 font-[Montserrat-Medium] mb-4">
            Correct answer: <Text className="font-bold">{word.wordText}</Text>
          </Text>
        )}

        <TouchableOpacity
          onPress={checkAnswer}
          disabled={input.length === 0 || status === "correct"}
          className={`w-full py-4 rounded-full shadow-md ${
            input.length > 0 ? "bg-[#2563EB]" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-center font-[Montserrat-Bold] text-lg ${input.length > 0 ? "text-white" : "text-gray-400"}`}
          >
            Check
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
