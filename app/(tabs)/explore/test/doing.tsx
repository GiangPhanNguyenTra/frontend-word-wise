import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { questions } from "./data/questions";

export default function TestDoingScreen() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const total = questions.length;
  const percent = Math.round(((current + 1) / total) * 100);

  const handleSelect = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (current < total - 1) setCurrent((c) => c + 1);
    else router.push("/(tabs)/explore/test/done");
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-[#FAF9FF] mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={28} height={28} />
          </TouchableOpacity>
          <Text className="font-[Poppins-Bold] text-xl text-[#7F56D9] ml-3">
            PHQ-9 Test
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-black text-lg font-[Poppins-Bold]">
            {current + 1}
          </Text>
          <Text className="text-[#ADADAD] text-lg font-[Poppins-Bold]">
            /{total}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View className="h-2 bg-gray-200 mx-4 mt-3 rounded-full overflow-hidden">
        <View
          style={{ width: `${percent}%` }}
          className="h-2 bg-[#7F56D9] rounded-full"
        />
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1 mt-4 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-[Poppins-Bold] text-[#605D67] mb-6">
          {questions[current].question}
        </Text>

        {questions[current].options.map((opt, idx) => {
          const selected = answers[current] === idx;
          return (
            <Pressable
              key={idx}
              onPress={() => handleSelect(idx)}
              className={`flex-row justify-between items-center rounded-xl border px-4 py-3 mb-4 ${
                selected
                  ? "border-[#7F56D9] bg-[#EFE9FB]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-base font-[Poppins-Regular] ${
                  selected ? "text-[#7F56D9]" : "text-gray-800"
                }`}
              >
                {opt}
              </Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selected ? "bg-[#7F56D9] border-[#7F56D9]" : "border-gray-300"
                }`}
              />
            </Pressable>
          );
        })}

        {/* Footer */}
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            disabled={current === 0}
            onPress={() => setCurrent((c) => c - 1)}
            className={`h-14 rounded-xl flex-1 mr-2 items-center justify-center ${
              current === 0 ? "bg-gray-300" : "bg-[#E0D7F9]"
            }`}
          >
            <Text
              className={`font-[Poppins-Bold] text-base ${
                current === 0 ? "text-white" : "text-[#7F56D9]"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextQuestion}
            className="bg-[#7F56D9] h-14 rounded-xl flex-1 ml-2 items-center justify-center"
          >
            <Text className="text-white font-[Poppins-Bold] text-base">
              {current === total - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
