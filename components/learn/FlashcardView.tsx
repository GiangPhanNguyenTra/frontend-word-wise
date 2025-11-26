import { ApiWord } from "@/types";
import { Audio } from "expo-av";
import { Volume2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Helper style màu sắc
const typeStyles: Record<string, string> = {
  noun: "bg-[#E9EFFD] text-[#2563EB]",
  verb: "bg-[#FEE2E2] text-[#C41C1C]",
  adjective: "bg-[#F0FDF4] text-[#16A34A]",
  adverb: "bg-[#F3ECC0] text-[#C38902]",
  default: "bg-gray-100 text-gray-600",
};

export default function FlashcardView({ word }: { word: ApiWord }) {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setFlipped(false);
    animatedValue.setValue(0);
  }, [word]);

  const playAudio = async () => {
    const url = word.phonetics?.us?.audio || word.phonetics?.uk?.audio;
    if (url) {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
    }
  };

  const handleFlip = () => {
    Animated.timing(animatedValue, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  const typeStyle =
    typeStyles[word.partOfSpeech?.toLowerCase()] || typeStyles.default;

  return (
    <Pressable
      onPress={handleFlip}
      className="w-full h-[450px] items-center justify-center perspective-1000"
    >
      {/* Front Side */}
      <Animated.View
        style={{
          transform: [{ rotateY: frontInterpolate }],
          backfaceVisibility: "hidden",
        }}
        className="absolute w-full h-full bg-white rounded-[24px] shadow-sm border border-gray-100 items-center justify-center p-6"
      >
        <View
          className={`px-4 py-1.5 rounded-full mb-6 ${typeStyle.split(" ")[0]}`}
        >
          <Text
            className={`text-sm font-bold uppercase ${typeStyle.split(" ")[1]}`}
          >
            {word.partOfSpeech}
          </Text>
        </View>
        <Text className="text-4xl font-[Montserrat-Bold] text-[#1F2937] mb-3 text-center">
          {word.wordText}
        </Text>
        <Text className="text-gray-400 font-[Montserrat-Medium] text-sm italic mb-8">
          Tap card to flip
        </Text>

        <TouchableOpacity
          onPress={playAudio}
          className="w-14 h-14 bg-gray-50 rounded-full items-center justify-center"
        >
          <Volume2 size={28} color="#2563EB" />
        </TouchableOpacity>
      </Animated.View>

      {/* Back Side */}
      <Animated.View
        style={{
          transform: [{ rotateY: backInterpolate }],
          backfaceVisibility: "hidden",
        }}
        className="absolute w-full h-full bg-white rounded-[24px] shadow-sm border border-gray-100 items-center justify-center p-6"
      >
        <Text className="text-3xl font-[Montserrat-Bold] text-[#2563EB] mb-6 text-center">
          {word.wordVn}
        </Text>

        <View className="bg-[#F8F9FA] w-full p-5 rounded-2xl mb-4">
          <Text className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-wider">
            Definition
          </Text>
          <Text className="text-gray-700 font-[Montserrat-Medium] text-base leading-6">
            {word.definitionEn}
          </Text>
        </View>

        {word.examples && word.examples.length > 0 && (
          <View className="bg-[#F8F9FA] w-full p-5 rounded-2xl">
            <Text className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-wider">
              Example
            </Text>
            <Text className="text-gray-600 italic font-[Montserrat-Regular] text-base">
              &quot;{word.examples[0].en}&quot;
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
