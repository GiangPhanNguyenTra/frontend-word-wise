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
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("@/assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Light": require("@/assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-ExtraBold": require("@/assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-Black": require("@/assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Thin": require("@/assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat-ExtraLight": require("@/assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Italic": require("@/assets/fonts/Montserrat-Italic.ttf"),
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
          <Text className="text-[#000000] font-[Montserrat-Bold] text-3xl text-center">
            What are three positive things that made you smile today?
          </Text>
          <Text className="mt-1 text-[#736B66] font-[Montserrat-Medium] text-base mb-4">
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
              <Text className="text-[#ABABAB] font-[Montserrat-Bold] text-3xl mr-3">
                {num}
              </Text>
              <TextInput
                className="flex-1 text-[#000000] font-[Montserrat-Regular] text-base"
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
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Cultivate My Thoughts
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
