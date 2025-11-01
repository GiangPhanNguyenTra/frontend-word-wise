"use client";

import Heading from "@/components/Heading";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";

type WordQuestion = {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
};

const mockQuestions: WordQuestion[] = [
  { id: 1, word: "Accommodation", phonetic: "/əˌkɒməˈdeɪʃən/", meaning: "Nơi để ở hoặc sinh sống" },
  { id: 2, word: "Innovate", phonetic: "/ˈɪnəveɪt/", meaning: "Tạo ra cái mới hoặc cải tiến" },
  { id: 3, word: "Compassion", phonetic: "/kəmˈpæʃ.ən/", meaning: "Sự đồng cảm, thương người" },
  { id: 4, word: "Confidence", phonetic: "/ˈkɒn.fɪ.dəns/", meaning: "Sự tự tin" },
];

export default function TypingWordScreen() {
  const total = mockQuestions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [learnedCount, setLearnedCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  const current = mockQuestions[currentIndex];
  const toLearn = total - learnedCount;
  const progress = (learnedCount / total) * 100;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const triggerShake = () => {
    Vibration.vibrate(80);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const prefilled = current.word[0];
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleInput = (text: string) => {
    if (text.length > current.word.length - 1) return;
    setInputValue(text);

    const fullWord = prefilled + text;

    if (text.length === current.word.length - 1) {
      inputRef.current?.blur(); //ẩn bàn phím sau khi nhập xong
      if (fullWord.toLowerCase() === current.word.toLowerCase()) {
        setFeedback("correct");
        Speech.speak(current.word, { language: "en", rate: 0.9 });
        setLearnedCount((prev) => prev + 1);
        setTimeout(() => {
          if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setInputValue("");
            setFeedback(null);
          } else {
            setShowComplete(true);
          }
        }, 1000);
      } else {
        triggerShake();
        setFeedback("wrong");
      }
    } else {
      setFeedback(null);
    }
  };

  const { from } = useLocalSearchParams();
  const handleBack = () => {
    if (from === "learn") {
      router.replace("/(tabs)/learn");
    } else if (from === "collection") {
      router.replace("/(tabs)/learn/collection");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      {/* Header */}
      <Heading title={`${currentIndex + 1}/${total}`} />

      {/* Progress bar */}
      <View className="px-4">
        <View className="w-full h-[4px] bg-gray-200 rounded-full mb-5">
          <View
            className="h-full bg-[#2563EB] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mb-6 gap-2 px-4">
        <View className="flex-1 items-center bg-white rounded-[12px] p-2">
          <Text className="text-[#E11D48] font-[Montserrat-Bold] text-lg">{toLearn}</Text>
          <Text className="text-gray-500 font-[Montserrat-Medium]">To Learn</Text>
        </View>
        <View className="flex-1 items-center bg-white rounded-[12px] p-2">
          <Text className="text-[#16A34A] font-[Montserrat-Bold] text-lg">{learnedCount}</Text>
          <Text className="text-gray-500 font-[Montserrat-Medium]">Learned</Text>
        </View>
      </View>

      {/* Meaning */}
      <View className="bg-white mx-4 h-[500px] px-8 py-20 rounded-[16px] items-top justify-top">
        <Text className="text-2xl text-center text-[#373346] font-[Montserrat-Bold] mb-8">
          {current.meaning}
        </Text>

        {/* Input */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View className="items-center justify-center">
            <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
              <View className="flex-row justify-center flex-wrap mb-6">
                {Array.from({ length: current.word.length }).map((_, i) => {
                  const char = i === 0 ? prefilled : inputValue[i - 1] ?? "";
                  const isFilled = !!char;
                  return (
                    <View
                      key={i}
                      style={{
                        width: 38,
                        height: 50,
                        marginHorizontal: 4,
                        borderBottomWidth: 3,
                        borderColor: isFilled ? "#2563EB" : "#D1D5DB",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          fontFamily: "Montserrat-Bold",
                          color: i === 0 ? "#2563EB" : "#111",
                          textTransform: "uppercase",
                        }}
                      >
                        {char}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>

            {/* Input ẩn */}
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={handleInput}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={current.word.length - 1}
              keyboardType="default"
              // blurOnSubmit={false}
              style={{
                opacity: 0.01,
                height: 40,
                width: 200,
                position: "absolute",
              }}
            />
          </View>
        </Animated.View>

        {/* Feedback */}
        {feedback && (
          <View
            className={`rounded-xl px-6 py-3 mt-5 ${
              feedback === "correct" ? "bg-[#D5FFD9]" : "bg-[#FEE2E2]"
            }`}
          >
            <Text
              className={`text-base font-[Montserrat-Bold] ${
                feedback === "correct" ? "text-[#16A34A]" : "text-[#EF4444]"
              }`}
            >
              {feedback === "correct" ? "Tuyệt vời! 🎉" : "Sai rồi, thử lại!"}
            </Text>
          </View>
        )}
      </View>

      {showComplete && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 items-center justify-center z-50">
          <View className="bg-white rounded-[20px] w-[80%] p-6 items-center shadow-lg">
            <Text className="text-2xl font-[Montserrat-Bold] text-[#2563EB] mb-2">
              🎉 All Words Learned!
            </Text>
            <Text className="text-gray-600 font-[Montserrat-Medium] text-center mb-6">
              You’ve successfully filled all words. Great job!
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowComplete(false);
                handleBack();
              }}
              className="bg-[#2563EB] px-6 py-3 rounded-full"
            >
              <Text className="text-white font-[Montserrat-Bold] text-lg">Back to Learn</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}