// File: AddScreen.js (hoặc file tương ứng của bạn)
import CircularTimeSelector from "@/components/CircularTimeSelector";
import CustomSwitch from "@/components/CustomSwitch";
import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Bell } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // <-- IMPORT GESTURE HANDLER

export default function AddScreen() {
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

  const [once, setOnce] = useState(true);
  const [daily, setDaily] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // State thời gian vẫn như cũ
  const [time, setTime] = useState(() => {
    return new Date();
  });

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-[#FAF9FF]">
        <Heading title="Add new reminder" />

        {/* Body */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TouchableOpacity>
            <Text className="text-[#7F56D9] font-[Poppins-Bold] text-lg text-right">
              Save
            </Text>
          </TouchableOpacity>
          {/* Time display */}

          <View className="items-center mt-4">
            <CircularTimeSelector time={time} setTime={setTime} />
          </View>

          {/* Title */}
          <View className="mt-8">
            <Text className="text-lg font-[Poppins-SemiBold] text-gray-700 mb-2">
              Title
            </Text>
            <TextInput
              placeholder="Enter reminder title ..."
              className="bg-white rounded-xl px-4 py-3 border border-gray-200 text-base font-[Poppins-Regular]"
            />
          </View>

          {/* Description */}
          <View className="mt-4">
            <Text className="text-lg font-[Poppins-SemiBold] text-gray-700 mb-2">
              Description
            </Text>
            <TextInput
              placeholder="Enter reminder description ..."
              className="bg-white rounded-xl px-4 py-3 border border-gray-200 text-base font-[Poppins-Regular]"
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          {/* Repeat */}
          <View className="bg-white rounded-2xl mt-6 p-4">
            <View className="flex-row items-center mb-4">
              <Bell size={18} color="#7F56D9" />
              <Text className="ml-2 font-[Poppins-SemiBold] text-base">
                Repeat
              </Text>
            </View>

            {/* Days */}
            <View className="flex-row justify-between mb-4">
              {days.map((d) => {
                const active = selectedDays.includes(d);
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => toggleDay(d)}
                    className={`w-9 h-9 rounded-full border items-center justify-center ${
                      active
                        ? "bg-[#7F56D9] border-[#7F56D9]"
                        : "border-[#7F56D9]"
                    }`}
                  >
                    <Text
                      className={`text-sm font-[Poppins-Regular] ${
                        active ? "text-white" : "text-[#7F56D9]"
                      }`}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Once / Daily */}
            <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
              <Text className="text-base font-[Poppins-Regular]">Once</Text>
              <CustomSwitch value={once} onValueChange={setOnce} />
            </View>
            <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
              <Text className="text-base font-[Poppins-Regular]">Daily</Text>
              <CustomSwitch value={daily} onValueChange={setDaily} />
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
