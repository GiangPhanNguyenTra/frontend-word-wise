"use client";

import Heading from "@/components/Heading";
import ProgressCard from "@/components/ProgressCard";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import * as Speech from "expo-speech";
import { Frown, Laugh, Mic, Volume2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type Sentence = {
  id: number;
  sentence: string;
  phonetic: string;
};

const mockSentences: Sentence[] = [
  { id: 1, sentence: "Hello, nice to meet you.", phonetic: "/həˈloʊ, naɪs tə ˈmiːt juː/" },
  { id: 2, sentence: "How are you doing today?", phonetic: "/haʊ ɑːr juː ˈduːɪŋ təˈdeɪ/" },
  { id: 3, sentence: "I really like learning English.", phonetic: "/aɪ ˈrɪəli laɪk ˈlɜːrnɪŋ ˈɪŋɡlɪʃ/" },
  { id: 4, sentence: "Let's go for a walk outside.", phonetic: "/lɛts ɡoʊ fɔːr ə wɔːk ˈaʊtsaɪd/" },
];

export default function PracticeScreen() {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  const { count } = useLocalSearchParams<{ count?: string }>();
  const questionCount = count ? parseInt(count, 10) : 3; // mặc định 3 nếu không truyền

  const total = questionCount;
  const seletetedSentence = mockSentences.slice(0, total);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSentence = seletetedSentence[currentIndex];
  const displayIndex = currentIndex + 1;
  const [result, setResult] = useState<null | { score: number; correct: boolean }>(null);
  const [results, setResults] = useState<{ id: number; score: number; correct: boolean }[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const learnedCount = results.length;
  const progressPercent = Math.max(0, Math.min((learnedCount / total) * 100, 100));

  const speak = (text: string) => {
    Speech.speak(text, { language: "en", rate: 0.9 });
  };

  const handleRecord = async () => {
    if (!currentSentence) return;

    setIsRecording(true);
    setResult(null);

    // Giả lập đang ghi âm trong 2s
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 100);
      const correct = randomScore >= 70;
      const newResult = { id: currentSentence.id, score: randomScore, correct };
      setResult({ score: randomScore, correct });
      setResults((prev) => [...prev, newResult]);
    }, 2000);
  };

  const handleNext = () => {
    setResult(null);

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const correctCount = [...results, result!].filter((r) => r?.correct).length;
      const accuracy = Math.round((correctCount / total) * 100);

      router.push({
        pathname: "/(tabs)/speak/sentence/result",
        params: {
          correct: correctCount,
          total,
          accuracy,
        },
      });
    }
  };

  if (!currentSentence) return null;

  return (
    <View className="flex-1 bg-[#F6F6F6] px-4">
      <Heading title={`${displayIndex}/${total}`} />

      {/* Progress bar */}
      <View className="w-full h-[4px] bg-gray-200 rounded-full mb-4">
        <View
          className="h-full bg-[#2563EB] rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </View>

      <View className="bg-white rounded-[16px] flex-1 px-6">
        <TouchableOpacity
          onPress={() => speak(currentSentence.sentence)}
          className="flex-col items-left mb-3 mt-6"
        >
          <Volume2 size={22} color="#2563EB" />
          <Text className="mt-10 text-2xl font-[Montserrat-Bold] text-[#111]">
            {currentSentence.sentence}
          </Text>
        </TouchableOpacity>
        <Text className="text-[#939393] font-[Montserrat-SemiBold] mb-6">
          {currentSentence.phonetic}
        </Text>
      </View>

      {/* Feedback box */}
      {result && (
        <View
          className={`w-full rounded-[16px] px-5 py-4 mt-6 ${
            result.correct ? "bg-[#D5FFD9]" : "bg-[#FEE2E2]"
          }`}
        >
          <View className="flex-row flex-wrap items-center justify-between gap-3">
            {result.correct ? (
              <Laugh color="#55BA5D" />
            ) : (
              <Frown color="#FF4040" />
            )}

            {/* Text Box */}
            <View className="flex-1 min-w-[60%]">
              <Text
                className={`text-lg font-[Montserrat-Bold] mb-1 ${
                  result.correct ? "text-[#16A34A]" : "text-[#DC2626]"
                }`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {result.correct ? "Great!" : "Oh no!"}
              </Text>

              <Text
                className={`font-[Montserrat-Medium] ${
                  result.correct ? "text-[#14532D]" : "text-[#7F1D1D]"
                }`}
                style={{ flexWrap: "wrap" }}
              >
                {result.correct
                  ? "You sound very close to a native speaker!"
                  : "Try again slowly and focus on tricky sounds."}
              </Text>
            </View>

            {/* Progress Card */}
            <View className="ml-2">
              <ProgressCard compact percent={result.score} color={result.correct ? "#16A34A" : "#DC2626"}/>
            </View>
          </View>
        </View>
      )}

      <View className="pb-20">
        <View className="items-center mt-4">
          <Pressable
            onPress={handleRecord}
            disabled={isRecording}
            className={`w-[70px] h-[70px] rounded-full items-center justify-center ${
              isRecording ? "bg-[#93C5FD]" : "bg-[#2563EB]"
            }`}
          >
            <Mic size={32} color="white" />
          </Pressable>
          <Text className="text-gray-500 mt-4 font-[Montserrat-Medium]">
            {isRecording ? "Listening..." : "Press and Hold to talk"}
          </Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity
            onPress={handleNext}
            disabled={!result}
            className={`mt-10 w-[160px] py-3 rounded-full ${
              result ? "bg-[#2563EB]" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-center font-[Montserrat-Bold] text-lg">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}