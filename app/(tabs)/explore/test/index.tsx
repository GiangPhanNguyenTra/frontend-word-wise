import Mock from "@/assets/images/mock.svg";
import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { CheckCheck, Clock, Grip } from "lucide-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CircularProgress from "../components/CircularProgress";

export default function TestInfoScreen() {
  const percentage = 25;

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
  const { testType } = useLocalSearchParams<{ testType?: string }>();

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Test Information" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="flex-1 gap-4">
          {/* Ảnh minh họa */}
          <View className="w-full items-center mt-2">
            <Mock width={200} height={200} />
          </View>
          {/* Nội dung */}
          <View className="w-full flex-row self-stretch inline-flex justify-between items-center">
            <View>
              <Text className="text-[#605D67] text-3xl font-[Montserrat-Bold]">
                Feeling low or losing
              </Text>
              <Text className="text-[#605D67] text-3xl font-[Montserrat-Bold]">
                interest?
              </Text>
            </View>
            <CircularProgress percentage={percentage} />
          </View>
          <Text className="text-[#605D67] font-[Montserrat-Regular] text-base">
            This test helps you reflect on mood changes and signs of depression.
            It offers a simple way to notice patterns in your emotions and
            energy levels. By completing it, you can gain clearer insights into
            your overall well-being.
          </Text>

          {/* Estimate time */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#7F56D9] p-2">
                <Clock color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Montserrat-Regular]">
                Estimated time:
              </Text>
            </View>
            <Text className="text-[#FF4267] text-base font-[Montserrat-Regular]">
              10 minutes
            </Text>
          </View>

          {/* Number of questions */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#FF4267] p-2">
                <Grip color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Montserrat-Regular]">
                Number of Questions:
              </Text>
            </View>
            <Text className="text-[#FF4267] text-base font-[Montserrat-Regular]">
              10 questions
            </Text>
          </View>

          {/* Purpose */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#67C6E3] p-2">
                <CheckCheck color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Montserrat-Regular]">
                Purpose:
              </Text>
            </View>
            <Text className="text-[#918D8D] text-base font-[Montserrat-Regular] max-w-[70%] text-right">
              Explore mood and depressive symptoms.
            </Text>
          </View>
          {/* Button */}
          <View className="flex-row justify-center mt-4">
            <TouchableOpacity
              className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center w-1/2"
              onPress={() => router.push("/(tabs)/explore/test/doing")}
            >
              <Text className="text-white font-[Montserrat-Bold] text-base">
                Start Test Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
