import Heading from "@/components/Heading";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Sun } from "lucide-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import tất cả hình SVG
import Plant1 from "@/assets/images/plant1.svg";
import Plant2 from "@/assets/images/plant2.svg";
import Plant3 from "@/assets/images/plant3.svg";
import Plant4 from "@/assets/images/plant4.svg";
import Plant5 from "@/assets/images/plant5.svg";
import Plant6 from "@/assets/images/plant6.svg";
import Plant7 from "@/assets/images/plant7.svg";
import Plant8 from "@/assets/images/plant8.svg";

SplashScreen.preventAutoHideAsync();

export default function PlantScreen() {
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

  // ===== Mock dữ liệu =====
  const currentXp = 2000; // thử đổi số này để test
  const streakDays = 12; // streak giả lập

  // Các mốc XP để lên level
  const xpThresholds = [0, 50, 100, 200, 300, 500, 1000, 2000];

  const getLevel = (xp: number) => {
    let level = 1;
    for (let i = 1; i < xpThresholds.length; i++) {
      if (xp >= xpThresholds[i]) {
        level = i + 1;
      }
    }
    return level > 8 ? 8 : level;
  };

  const level = getLevel(currentXp);

  // Chọn hình SVG theo level
  const PlantImages = {
    1: Plant1,
    2: Plant2,
    3: Plant3,
    4: Plant4,
    5: Plant5,
    6: Plant6,
    7: Plant7,
    8: Plant8,
  };

  const CurrentPlant = PlantImages[level as keyof typeof PlantImages];

  // Tính toán progress
  const nextLevelXp = level < 8 ? xpThresholds[level] : null;
  const currentLevelXp = xpThresholds[level - 1] || 0;
  const progress =
    level < 8
      ? ((currentXp - currentLevelXp) / (nextLevelXp! - currentLevelXp)) * 100
      : 100;

  return (
    <View className="flex-1 bg-[#FAF9FF]" onLayout={onLayoutRootView}>
      <Heading title="Plant" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4"
      >
        <View className="py-3 px-1 gap-8 items-center">
          {/* Hình cây hiện tại */}
          <View className="mt-10">
            <CurrentPlant width={200} height={250} />
          </View>
          {/* Thanh Level/XP giống mẫu */}
          <View className="w-full p-3">
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center">
                <Text className="text-[#4F3422] font-[Poppins-Medium] text-base mr-2">
                  Level {level}:
                </Text>
                <FontAwesome
                  name="tree"
                  size={14}
                  color="#4A3728"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#4F3422] font-[Poppins-Medium] text-base">
                  {currentXp}/{nextLevelXp ?? currentXp} XP
                </Text>
              </View>
              <View className="flex-row items-center">
                <Sun strokeWidth={1.5} color="#ABABAB" />
                <Text className="text-[#ABABAB] font-[Poppins-Medium] text-base ml-2">
                  {streakDays} Day Streak
                </Text>
              </View>
            </View>
            <View className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <View
                className="h-3 rounded-full"
                style={{ width: `${progress}%`, backgroundColor: "#7CB342" }}
              />
            </View>

            {/* Button */}
            <View className=" flex-row justify-center mt-14">
              <TouchableOpacity
                className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center w-full"
                onPress={() => router.push("/(tabs)/home/plant/list")}
              >
                <Text className="text-white font-[Poppins-Bold] text-base">
                  Nourish Your Tree Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
