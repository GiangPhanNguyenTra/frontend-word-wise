import { ApiWord } from "@/types";
import { Audio } from "expo-av";
import { Volume2 } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface StudyCardProps {
  word: ApiWord;
  mode: string;
  onAnswer?: (isCorrect: boolean) => void;
  isAnswered?: boolean;
}

export default function StudyCard({
  word,
  mode,
  onAnswer,
  isAnswered,
}: StudyCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState("");

  const playSound = async (url: string) => {
    if (!url) return;
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    await sound.playAsync();
  };

  const audioUrl = word.phonetics?.us?.audio || word.phonetics?.uk?.audio;

  if (mode === "flashcards") {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setFlipped(!flipped)}
        className="w-full h-[400px] bg-white rounded-2xl shadow-md items-center justify-center p-6"
      >
        {!flipped ? (
          <View className="items-center">
            <Text className="text-3xl font-[Montserrat-Bold] text-[#2563EB] mb-2">
              {word.wordText}
            </Text>
            <Text className="text-lg font-[Montserrat-Medium] text-gray-500 italic mb-4">
              {word.partOfSpeech}
            </Text>
            {audioUrl && (
              <TouchableOpacity
                onPress={() => playSound(audioUrl)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Volume2 size={24} color="#2563EB" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-2xl font-[Montserrat-Bold] text-[#1F2937] text-center mb-4">
              {word.wordVn}
            </Text>
            <Text className="text-base font-[Montserrat-Regular] text-gray-600 text-center mb-2">
              {word.definitionEn}
            </Text>
            {word.examples?.[0] && (
              <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                <Text className="text-sm font-[Montserrat-Italic] text-blue-800">
                  &quot;{word.examples[0].en}&quot;
                </Text>
              </View>
            )}
          </View>
        )}
        <Text className="absolute bottom-4 text-xs text-gray-400 font-[Montserrat-Medium]">
          Tap to flip
        </Text>
      </TouchableOpacity>
    );
  }

  if (mode === "translation") {
    return (
      <View className="w-full bg-white rounded-2xl shadow-md p-6 items-center">
        <Text className="text-sm font-[Montserrat-Bold] text-gray-400 uppercase mb-4">
          Translate this word
        </Text>
        <Text className="text-2xl font-[Montserrat-Bold] text-[#1F2937] text-center mb-6">
          {word.wordVn}
        </Text>

        {isAnswered && (
          <View className="w-full items-center mt-4">
            <Text className="text-xl font-[Montserrat-Bold] text-[#2563EB]">
              {word.wordText}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (mode === "definition") {
    return (
      <View className="w-full bg-white rounded-2xl shadow-md p-6 items-center">
        <Text className="text-sm font-[Montserrat-Bold] text-gray-400 uppercase mb-4">
          Guess the word
        </Text>
        <Text className="text-lg font-[Montserrat-Medium] text-[#1F2937] text-center mb-6">
          {word.definitionEn}
        </Text>
        {isAnswered && (
          <View className="w-full items-center mt-4">
            <Text className="text-xl font-[Montserrat-Bold] text-[#2563EB]">
              {word.wordText}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (mode === "fill") {
    const sentence = word.examples?.[0]?.en || `The word is ${word.wordText}`;
    const masked = sentence.replace(new RegExp(word.wordText, "gi"), "_____");
    return (
      <View className="w-full bg-white rounded-2xl shadow-md p-6 items-center">
        <Text className="text-sm font-[Montserrat-Bold] text-gray-400 uppercase mb-4">
          Fill in the blank
        </Text>
        <Text className="text-xl font-[Montserrat-Medium] text-[#1F2937] text-center mb-6 leading-8">
          {isAnswered ? sentence : masked}
        </Text>
      </View>
    );
  }

  return null;
}
