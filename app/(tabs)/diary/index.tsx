import EmotionPicker from "@/components/EmotionPicker";
import Heading from "@/components/Heading";
import React, { useState } from "react";
import { router } from "expo-router";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";

export default function DiaryScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<{
    label: string;
    emoji: any;
  } | null>(null);

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Diary" />

      <ScrollView
        className="flex-1 mt-8 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-col gap-y-6">
          {/* Emotion */}
          <View>
            <Text className="text-black text-3xl text-center font-[Poppins-Bold]">
              How are you feeling?
            </Text>
            <EmotionPicker
              onSelect={(em) =>
                setSelectedEmotion({ label: em.name, emoji: em.icon })
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push({ pathname: "/(tabs)/diary/next" })}
            className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center"
          >
            <Text className="text-white text-base font-[Poppins-Bold]">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}