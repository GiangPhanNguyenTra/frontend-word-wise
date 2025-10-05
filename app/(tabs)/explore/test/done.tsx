import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft, Check, X } from "lucide-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Giữ splash screen hiển thị cho đến khi fonts được load
SplashScreen.preventAutoHideAsync();

export default function TestDoneScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const score = 19;
  const level =
    score <= 4 ? "None" : score <= 14 ? "Mild to Moderate" : "Severe";
  const percentage = (score / 27) * 100;

  // Xác định màu thanh progress
  const progressColor =
    level === "Mild to Moderate"
      ? "#B5A2E9" // Trung bình
      : level === "Severe"
        ? "#6F04D9" // Nặng
        : "#C9B6F2"; // Nhẹ hơn cho None

  return (
    <View className="flex-1 bg-[#FAF9FF]" onLayout={onLayoutRootView}>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/explore")}>
            <ArrowLeft width={28} height={28} color="#000000" />
          </TouchableOpacity>
          <Text
            className="ml-3 text-xl text-[#7F56D9]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            PHQ-9 Test
          </Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1 px-4 py-8"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Kết quả PHQ-9 */}
        <View className="bg-[#E0D7F9] rounded-3xl p-5 items-start">
          <Text
            className="text-5xl text-[#555555]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {score}
          </Text>
          <Text
            className="mt-2 text-lg text-[#555555]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Your PHQ-9 Score
          </Text>
          <Text
            className="text-base text-[#555555]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Depression level: {level}
          </Text>

          {/* Thang đo */}
          <View className="flex-row justify-between w-full mt-4 px-2">
            <Text className="text-xs text-[#6F04D9]">0–4: None</Text>
            <Text className="text-xs text-[#6F04D9]">10–14: Moderate</Text>
            <Text className="text-xs text-[#6F04D9]">15–27: Severe</Text>
          </View>

          {/* Thanh progress */}
          <View className="h-3 w-full bg-white rounded-full mt-2 overflow-hidden">
            <View
              className="h-3"
              style={{
                width: `${percentage}%`,
                backgroundColor: progressColor,
              }}
            />
          </View>
        </View>

        <View className="bg-white rounded-3xl p-5 mt-6">
          <View className="bg-[#F7F4F2] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
            <Check color={"#926247"} strokeWidth={2.75} />
          </View>
          <Text className="font-[Poppins-Bold] text-base text-[#4F3422] mb-2">
            Take a few minutes each day to practice deep breathing and calm your
            mind.
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-5 mt-6">
          <View className="bg-[#F7F4F2] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
            <Check color={"#926247"} strokeWidth={2.75} />
          </View>
          <Text className="font-[Poppins-Bold] text-base text-[#4F3422] mb-2">
            Reach out and connect with a mental health professional for support.
          </Text>
        </View>

        <View className="bg-[#FF6B6B] rounded-3xl p-5 mt-6">
          <View className="bg-[#FECECE] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
            <X color={"#ffffff"} strokeWidth={2.75} />
          </View>
          <Text className="font-[Poppins-Bold] text-base text-[#ffffff] mb-2">
            Don’t ignore your feelings—acknowledge them instead of pushing them
            away.
          </Text>
        </View>

        <View className="bg-[#FF6B6B] rounded-3xl p-5 mt-6">
          <View className="bg-[#FECECE] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
            <X color={"#ffffff"} strokeWidth={2.75} />
          </View>
          <Text className="font-[Poppins-Bold] text-base text-[#ffffff] mb-2">
            Don’t overwork yourself; allow time for rest and recovery.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
