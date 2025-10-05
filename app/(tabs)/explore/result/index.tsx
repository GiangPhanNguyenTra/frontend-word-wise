import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { BookCheck } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestResultTypeScreen() {
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
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Test done" />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Test Result */}
        <View className="py-3 px-1">
          <View className="w-full rounded-2xl bg-white px-4 py-4 shadow">
            <View className="flex-row justify-between items-center">
              {/* Left */}
              <View className="flex-row items-center gap-3">
                <View className="bg-purple-100 p-3 rounded-xl">
                  <BookCheck color="#7F56D9" />
                </View>
                <View>
                  <Text className="font-[Poppins-Bold] text-xl text-black">
                    PHQ-10
                  </Text>
                  <Text className="font-[Poppins-Regular] text-xs text-gray-500">
                    Completed on April 26, 2025
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View className="items-end">
                <View className="bg-[#FFE9F2] px-3 py-1 rounded-full mb-2">
                  <Text className="text-base font-[Poppins-SemiBold] text-[#F43F5E]">
                    Severe
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center mt-4">
              <Text className="text-3xl font-[Poppins-Bold] text-black">
                19/20
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/explore/test/done")}
              >
                <Text className="text-sm font-[Poppins-SemiBold] text-[#7F56D9]">
                  View results
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
