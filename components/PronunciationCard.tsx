import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { Ear, Volume2 } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  text: string;
  ipa?: string;
  userIpa?: string;
  userAudioUri?: string | null;
  analysis?: {
    is_letter_correct_all_words: string;
  };
}

export default function PronunciationCard({
  text,
  ipa,
  userIpa,
  userAudioUri,
  analysis,
}: Props) {
  // Nghe giọng mẫu
  const playNative = (textToSpeak: string) => {
    Speech.speak(textToSpeak, { language: "en", rate: 0.8 });
  };

  // Nghe lại giọng mình
  const playUserRecording = async () => {
    if (userAudioUri) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: userAudioUri },
          { shouldPlay: true }
        );
        await sound.playAsync();
      } catch (error) {
        console.log("Error playing user audio", error);
      }
    }
  };

  // --- RENDER VĂN BẢN (Tô màu từng ký tự) ---
  const renderColoredText = () => {
    if (!analysis) {
      return (
        <TouchableOpacity onPress={() => playNative(text)}>
          <Text className="text-3xl font-[Montserrat-Bold] text-[#1F2937] text-center leading-10">
            {text}
          </Text>
        </TouchableOpacity>
      );
    }

    const words = text.split(" ");
    const correctnessGroups = analysis.is_letter_correct_all_words
      .trim()
      .split(/\s+/);

    return (
      <View className="flex-row flex-wrap justify-center gap-x-2 gap-y-1">
        {words.map((word, wordIdx) => {
          const bits = correctnessGroups[wordIdx] || "";

          return (
            <TouchableOpacity
              key={wordIdx}
              onPress={() => playNative(word)} // Bấm vào từ nào đọc từ đó
              className="flex-row"
            >
              {word.split("").map((char, charIdx) => {
                const status = bits[charIdx];
                let colorClass = "text-[#1F2937]";
                if (status === "1") colorClass = "text-[#16A34A]"; // Green
                if (status === "0") colorClass = "text-[#DC2626]"; // Red

                return (
                  <Text
                    key={charIdx}
                    className={`text-3xl font-[Montserrat-Bold] ${colorClass}`}
                  >
                    {char}
                  </Text>
                );
              })}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View className="bg-white p-6 rounded-[24px] shadow-sm w-full border border-gray-100">
      {/* 1. TEXT AREA */}
      <View className="items-center mb-6 min-h-[60px] justify-center">
        {renderColoredText()}
      </View>

      {/* 2. IPA COMPARISON */}
      <View className="bg-[#F9FAFB] rounded-2xl p-4 mb-6">
        {/* Target IPA */}
        <View className="flex-row justify-between mb-3 border-b border-gray-200 pb-2">
          <Text className="text-gray-400 font-[Montserrat-Bold] text-xs uppercase tracking-wider mt-1">
            Target
          </Text>
          <Text className="text-[#2563EB] font-[Montserrat-Medium] text-lg">
            /{ipa}/
          </Text>
        </View>

        {/* User IPA (Chỉ hiện khi có kết quả) */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 font-[Montserrat-Bold] text-xs uppercase tracking-wider">
            You Said
          </Text>
          {userIpa ? (
            <Text className="text-[#1F2937] font-[Montserrat-Medium] text-lg">
              /{userIpa}/
            </Text>
          ) : (
            <Text className="text-gray-300 italic font-[Montserrat-Regular] text-sm">
              ...
            </Text>
          )}
        </View>
      </View>

      {/* 3. ACTION BUTTONS (Listen Model / Listen My Voice) */}
      <View className="flex-row justify-center gap-4">
        {/* Listen Model */}
        <TouchableOpacity
          onPress={() => playNative(text)}
          className="flex-row items-center gap-2 bg-[#E9EFFD] px-5 py-3 rounded-full"
        >
          <Volume2 size={20} color="#2563EB" />
          <Text className="text-[#2563EB] font-[Montserrat-Bold] text-sm">
            Listen Model
          </Text>
        </TouchableOpacity>

        {userAudioUri && (
          <TouchableOpacity
            onPress={playUserRecording}
            className="flex-row items-center gap-2 bg-gray-100 px-5 py-3 rounded-full"
          >
            <Ear size={20} color="#4B5563" />
            <Text className="text-[#4B5563] font-[Montserrat-Bold] text-sm">
              My Voice
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
