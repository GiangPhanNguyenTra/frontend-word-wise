import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { BookCheck } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestResultTypeScreen() {
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
                  <Text className="font-[Montserrat-Bold] text-xl text-black">
                    PHQ-10
                  </Text>
                  <Text className="font-[Montserrat-Regular] text-xs text-gray-500">
                    Completed on April 26, 2025
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View className="items-end">
                <View className="bg-[#FFE9F2] px-3 py-1 rounded-full mb-2">
                  <Text className="text-base font-[Montserrat-SemiBold] text-[#F43F5E]">
                    Severe
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center mt-4">
              <Text className="text-3xl font-[Montserrat-Bold] text-black">
                19/20
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/explore/test/done")}
              >
                <Text className="text-sm font-[Montserrat-SemiBold] text-[#7F56D9]">
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
