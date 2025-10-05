import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();

export default function ListScreen() {
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

  const inputs = [1, 2, 3];

  return (
    <View className="flex-1 bg-[#FAF9FF]" onLayout={onLayoutRootView}>
      <Heading title="Action List" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        <View className="mt-4 mb-4 items-center gap-4">
          <Text className="text-[#000000] font-[Poppins-Bold] text-3xl text-center">
            What are three positive things that made you smile today?
          </Text>
          <Text className="mt-1 text-[#736B66] font-[Poppins-Medium] text-base mb-4">
            21/09/2025
          </Text>
        </View>

        {/* Ba ô input */}
        <View className="gap-4">
          {inputs.map((num) => (
            <View
              key={num}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                elevation: 3, // Android shadow
              }}
            >
              <Text className="text-[#ABABAB] font-[Poppins-Bold] text-3xl mr-3">
                {num}
              </Text>
              <TextInput
                className="flex-1 text-[#000000] font-[Poppins-Regular] text-base"
                placeholder="Share your positive thing…"
              />
            </View>
          ))}
        </View>

        {/* Button */}
        <View className="flex-row justify-center mt-12">
          <TouchableOpacity
            className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center w-full"
            onPress={() => router.push("/(tabs)/home/plant/action")}
          >
            <Text className="text-white font-[Poppins-Bold] text-base">
              Cultivate My Thoughts
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
