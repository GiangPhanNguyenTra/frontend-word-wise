import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MBTICard from "./components/ADHD";
import GADCard from "./components/GAD";
import PHQCard from "./components/PHQ";
import PSSCard from "./components/PSS";

export default function ExploreScreen() {
  const percent = 24;

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
      {/* Header */}
      <Heading title="Explore" />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Description */}
        <View className="pt-3">
          <Text className="text-[#605D67] font-[Montserrat-Bold] text-2xl">
            Discover Yourself
          </Text>
          <Text className="text-[#605D67] font-[Montserrat-Regular] text-sm mt-1">
            Start your journey of self-understanding through engaging
            psychological tests.
          </Text>
        </View>

        {/* Test Result */}
        <View className=" w-full pt-2">
          <TouchableOpacity
            className="w-full rounded-xl border border-white bg-[#E0D7F9] p-4 justify-center"
            onPress={() => router.push("/(tabs)/explore/result")}
          >
            <Text className="text-[#7F56D9] font-[Montserrat-Bold] text-xl">
              Tests
            </Text>
            <View className="w-full flex-row items-center mt-3 mb-2 gap-2">
              {/* Số % */}
              <Text className="text-[#7F56D9] font-semibold">{percent}%</Text>

              {/* Thanh progress */}
              <View className="flex-1 h-4 bg-white rounded-full overflow-hidden mr-2">
                <View
                  className="h-4 bg-[#7F56D9]"
                  style={{ width: `${percent}%` }}
                />
              </View>
            </View>

            <Text className="text-[#7F56D9] font-[Montserrat-Regular] text-base mt-2">
              to complete
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="p-2 font-[Montserrat-Bold] text-xl text-[#605D67] mb-2">
          Explore Tests
        </Text>
        <MBTICard />
        <PHQCard />
        <GADCard />
        <PSSCard />
      </ScrollView>
    </View>
  );
}
