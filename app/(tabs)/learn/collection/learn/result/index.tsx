"use client";

import Heading from "@/components/Heading";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { RotateCw, Volume2 } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
  const { from, collectionName } = useLocalSearchParams();
  const { correct, wrong, total, results } = useLocalSearchParams();
  const router = useRouter();
  const resultList = results ? JSON.parse(results as string) : [];

  const correctNum = Number(correct || 0);
  const wrongNum = Number(wrong || 0);
  const totalNum = Number(total || correctNum + wrongNum);
  const percent = Math.round((correctNum / totalNum) * 100);
  const score = Math.round((10 / totalNum) * correctNum);
  const isGood = percent >= 70;
  const [activeTab, setActiveTab] = useState<"total" | "correct" | "wrong">("total");

  const filteredList =
    activeTab === "correct"
      ? resultList.filter((i: any) => i.isCorrect)
      : activeTab === "wrong"
      ? resultList.filter((i: any) => !i.isCorrect)
      : resultList;

  const speak = (text: string) => {
    Speech.speak(text, { language: "en", rate: 0.9 });
  };

  const handleBack = () => {
    if (from === "learn") {
      router.replace("/(tabs)/learn");
    } else if (from === "collection") {
      router.replace({
        pathname: "/(tabs)/learn/collection/view",
        params: { collectionName },
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title="Learn Results" showBack={false} />
      <ScrollView>
        {/* Header */}
        <View className="flex shadow-lg mx-6 mb-6 gap-2 p-6 items-center justify-center bg-[#E9EFFD] rounded-[20px]">
          <Text className=" text-lg text-[#2563EB] font-[Montserrat-ExtraBold]">Score</Text>
          <Text className="text-2xl text-[#EBAD25] font-[Montserrat-ExtraBold]">{score} points</Text>
          <Text className="text-xl font-[Montserrat-Bold]">Congratulations!</Text>
          <Text className="text-xl font-[Montserrat-Bold] text-[#111] mb-2">
            {isGood ? "You do the best! 🎉" : "You can do better next time!"}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap justify-between px-6 shadow-lg">
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-3xl font-[Montserrat-ExtraBold] text-[#2563EB]">{totalNum}</Text>
            <Text className="text-[#616161] font-[Montserrat-Bold]">Total Questions</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#EBAD25] text-3xl font-[Montserrat-ExtraBold]">{percent}%</Text>
            <Text className="text-[#616161] font-[Montserrat-Bold]">Accuracy</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#00966D] text-3xl font-[Montserrat-ExtraBold]">{correctNum}</Text>
            <Text className="text-[#616161] font-[Montserrat-Bold]">Correct Answers</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#C30000] text-3xl font-[Montserrat-ExtraBold]">{wrongNum}</Text>
            <Text className="text-[#616161] font-[Montserrat-Bold]">Wrong Answers</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around mt-6 mb-4 px-6">
          {[
            { key: "total", label: `Total (${totalNum})` },
            { key: "correct", label: `Correct (${correctNum})` },
            { key: "wrong", label: `Wrong (${wrongNum})` },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-full ${
                  isActive ? "bg-[#2563EB]" : "bg-white"
                }`}
              >
                <Text
                  className={`font-[Montserrat-SemiBold] ${
                    isActive ? "text-white" : "text-[#111]"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Result list */}
        <View className="px-6 mb-8">
          {filteredList.length === 0 ? (
            <Text className="text-center text-gray-500 font-[Montserrat-Medium]">
              No results in this tab.
            </Text>
          ) : (
            filteredList.map((item: any) => (
              <View
                key={item.id}
                className="bg-white rounded-[16px] p-5 mb-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-lg font-[Montserrat-Bold]">{item.word}</Text>
                    <Text className="text-[#939393] font-[Montserrat-Medium]">
                      {item.type}
                    </Text>
                  </View>
                  <Text
                    className={`font-[Montserrat-Bold] ${
                      item.isCorrect ? "text-[#16A34A]" : "text-[#EF4444]"
                    }`}
                  >
                    {item.isCorrect ? "✔️" : "❌"}
                  </Text>
                </View>

                {/* Phonetic */}
                <View className="flex-row gap-2">
                  <TouchableOpacity className="mt-2" onPress={() => speak(item.word)}>
                    <Volume2 size={20} color="#939393" />
                  </TouchableOpacity>
                  <Text className="font-[Montserrat-Regular] text-[#939393] mt-2">
                    {item.phonetic}
                  </Text>
                </View>

                {/* Meaning */}
                <Text className="font-[Montserrat-Medium] mt-2 text-base">{item.meaning}</Text>

                {!item.isCorrect && (
                  <View className="mt-3">
                    <Text className="text-[#C30000] font-[Montserrat-Medium]">
                      ❌ Your answer: {item.selectedAnswer}
                    </Text>
                    <Text className="text-[#00966D] font-[Montserrat-Medium]">
                      ✅ Correct answer: {item.correctAnswer}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Buttons */}
        <View className="w-full items-center mb-6">
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/(tabs)/learn/collection/learn/choose",
                params: { reset: "true" },
              })
            }
            className="bg-[#2563EB] w-[200px] py-3 rounded-full mb-4 items-center justify-center flex-row gap-2"
          >
            <RotateCw size="20" color="white"/>
            <Text className="text-white text-center font-[Montserrat-Bold]">
              Retry Quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
  onPress={handleBack}
  className="bg-white border border-[#2563EB] w-[200px] py-3 rounded-full"
>
  <Text className="text-[#2563EB] text-center font-[Montserrat-Bold]">
    Back to Collection
  </Text>
</TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}