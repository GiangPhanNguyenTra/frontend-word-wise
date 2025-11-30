import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import { Lightbulb, RotateCw } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
  const { correct, total, accuracy } = useLocalSearchParams<{
    correct?: string;
    total?: string;
    accuracy?: string;
  }>();

  const acc = Number(accuracy) || 0;
  const isGood = acc >= 70;

  const getAdvice = (acc: number) => {
    if (acc >= 90)
      return {
        message:
          "You sound almost like a native speaker! Keep practicing daily 💪",
      };
    if (acc >= 70)
      return {
        message:
          "You're improving fast! Try focusing on pronunciation details 🎯",
      };
    if (acc >= 50)
      return {
        message: "You’re getting there — repeat and focus on vowel sounds 👂",
      };
    return {
      message: "Don't give up! Practice speaking slowly and clearly 🗣️",
    };
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Practice Results" showBack={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex shadow-lg mx-6 mt-4 mb-6 gap-2 p-6 items-center justify-center bg-[#E9EFFD] rounded-[20px]">
          <Text className=" text-lg text-[#2563EB] font-[Montserrat-ExtraBold]">
            Accuracy
          </Text>
          <Text className="text-6xl text-[#EBAD25] font-[Montserrat-ExtraBold] my-2">
            {acc}%
          </Text>
          <Text className="text-xl font-[Montserrat-Bold]">
            Congratulations!
          </Text>
          <Text className="text-lg font-[Montserrat-Medium] text-[#111] mb-2 text-center">
            {isGood ? "You did great! 🎉" : "Keep practicing!"}
          </Text>
        </View>

        <View className="bg-white p-6 rounded-[24px] mb-8 shadow-sm mx-6 border border-gray-100">
          <View className="flex-row gap-3 items-center mb-2">
            <View className="bg-[#E9EFFD] rounded-full w-8 h-8 items-center justify-center">
              <Lightbulb size={18} color="#2563EB" />
            </View>
            <Text className="font-[Montserrat-Bold] text-[#1F2937]">
              Feedback
            </Text>
          </View>
          <Text className="text-base mt-2 font-[Montserrat-Medium] text-gray-600 leading-6">
            {getAdvice(acc).message}
          </Text>
        </View>

        <View className="w-full items-center mb-6 px-6">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/speak/word")}
            className="bg-[#2563EB] w-full py-4 rounded-full mb-4 items-center justify-center flex-row gap-2 shadow-md shadow-blue-200"
          >
            <RotateCw size={20} color="white" />
            <Text className="text-white text-center font-[Montserrat-Bold] text-lg">
              Practice Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/speak")}
            className="bg-white border border-[#2563EB] w-full py-4 rounded-full"
          >
            <Text className="text-[#2563EB] text-center font-[Montserrat-Bold] text-lg">
              Back to Menu
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
