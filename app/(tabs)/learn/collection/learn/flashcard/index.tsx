"use client";

import Heading from "@/components/Heading";
import * as Speech from "expo-speech";
import { CheckCheck, Volume2, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, TouchableOpacity, View } from "react-native";

type Word = {
  id: number;
  word: string;
  type: string;
  phonetic: string;
  definition: string;
  example: string;
};

const mockWords: Word[] = [
  {
    id: 1,
    word: "Resilient",
    type: "Adjective",
    phonetic: "/rɪˈzɪ.li.ənt/",
    definition:
      "Able to withstand or recover quickly from difficult conditions.",
    example: '"She remained resilient despite facing many challenges."',
  },
  {
    id: 2,
    word: "Innovate",
    type: "Verb",
    phonetic: "/ˈɪn.ə.veɪt/",
    definition:
      "Make changes in something established, especially by introducing new methods.",
    example: '"Tech companies must innovate to stay ahead of competition."',
  },
  {
    id: 3,
    word: "Compassion",
    type: "Noun",
    phonetic: "/kəmˈpæʃ.ən/",
    definition:
      "Sympathetic pity and concern for the sufferings of others.",
    example: '"She was filled with compassion for the victims."',
  },
];

export default function LearnFlashcardScreen() {
  const [learnedCount, setLearnedCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const total = mockWords.length;
  const currentIndex = learnedCount;
  const currentWord = mockWords[currentIndex];
  const toLearn = total - learnedCount;

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const speak = (text: string) => {
    Speech.speak(text, { language: "en", rate: 0.9 });
  };

  const handleFlip = () => {
    Animated.timing(animatedValue, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  // useEffect(() => {
  //   if (learnedCount === total) {
  //     setTimeout(() => {
  //       alert("🎉 You've completed all words!");
  //     }, 300);
  //   }
  // }, [learnedCount, total]);

  const handleGotIt = () => {
    if (learnedCount < total) {
      setFlipped(false);
      animatedValue.setValue(0);
      setLearnedCount((prev) => prev + 1);
    }
  };

  const handleAgain = () => {
    setFlipped(false);
    animatedValue.setValue(0);
  };

  return (
    <View className="flex-1 bg-[#F6F6F6] px-4">
      <Heading title={`${currentIndex}/${total}`} />
      <View className="w-full h-[4px] bg-gray-200 rounded-full mb-4">
        <View
          className="h-full bg-[#2563EB] rounded-full"
          style={{ width: `${(learnedCount / total) * 100}%` }}
        />
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mb-6 gap-2">
        <View className="flex-1 items-center bg-white rounded-[12px] w-full p-2">
          <Text className="text-[#E11D48] font-[Montserrat-Bold] text-lg">
            {toLearn > 0 ? toLearn : 0}
          </Text>
          <Text className="text-gray-500 font-[Montserrat-Medium]">
            To Learn
          </Text>
        </View>
        <View className="flex-1 items-center bg-white rounded-[12px] w-full p-2">
          <Text className="text-[#16A34A] font-[Montserrat-Bold] text-lg">
            {learnedCount}
          </Text>
          <Text className="text-gray-500 font-[Montserrat-Medium]">
            Learned
          </Text>
        </View>
      </View>

      {/* Flashcard */}
      {currentWord ? (
        <View className="flex-1 items-center justify-center relative">
          <Pressable onPress={handleFlip} className="relative w-full h-full z-0">
            {/* Front */}
            <Animated.View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backfaceVisibility: "hidden",
                transform: [{ rotateY: frontInterpolate }],
              }}
            >
              <View className="items-center">
                <Text className="text-[#2563EB] bg-[#E9EFFD] text-xs mb-2 p-2 rounded-[8px] font-[Montserrat-SemiBold]">
                  {currentWord.type}
                </Text>
                <Text className="text-2xl font-[Montserrat-Bold] mb-1">
                  {currentWord.word}
                </Text>
                <Text className="text-gray-500 font-[Montserrat-Medium] mb-8">
                  {currentWord.phonetic}
                </Text>
                <Text className="text-gray-400 font-[Montserrat-Medium]">
                  Tap to flip the card
                </Text>
              </View>
            </Animated.View>

            {/* Back */}
            <Animated.View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backfaceVisibility: "hidden",
                transform: [{ rotateY: backInterpolate }],
              }}
            >
              <View className="items-center">
                <Text className="text-[#2563EB] bg-[#E9EFFD] text-xs p-2 rounded-[8px] mb-2 font-[Montserrat-SemiBold]">
                  {currentWord.type}
                </Text>
                <Text className="text-2xl font-[Montserrat-Bold] mb-1">
                  {currentWord.word}
                </Text>
                <Text className="text-gray-500 font-[Montserrat-Medium] mb-5">
                  {currentWord.phonetic}
                </Text>

                <View className="bg-gray-100 rounded-xl px-4 py-3 mb-3 w-full">
                  <Text className="font-[Montserrat-Bold] text-[#333] mb-1">
                    Definition
                  </Text>
                  <Text className="text-gray-700 font-[Montserrat-Regular]">
                    {currentWord.definition}
                  </Text>
                </View>

                <View className="bg-gray-100 rounded-xl px-4 py-3 mb-5 w-full">
                  <Text className="font-[Montserrat-Bold] text-[#333] mb-1">
                    Example
                  </Text>
                  <Text className="text-gray-700 italic font-[Montserrat-Regular]">
                    {currentWord.example}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </Pressable>

          {/* Volume button */}
          <TouchableOpacity
            onPress={() => speak(currentWord.word)}
            className="absolute bottom-8 w-12 h-12 bg-[#2563EB] rounded-full items-center justify-center"
          >
            <Volume2 size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-[Montserrat-Bold] text-[#2563EB]">
            🎉 All words learned!
          </Text>
        </View>
      )}
      {/* Buttons */}
      {currentWord && (
        <View className="flex-row justify-between mt-6 mb-8">
          <TouchableOpacity
            onPress={handleAgain}
            className="flex-1 h-12 bg-[#FBBF24] gap-2 mx-2 rounded-full items-center justify-center flex-row"
          >
            <X color="white" />
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGotIt}
            className="flex-1 h-12 bg-[#16A34A] gap-2 mx-2 rounded-full items-center justify-center flex-row"
          >
            <CheckCheck color="white" />
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}