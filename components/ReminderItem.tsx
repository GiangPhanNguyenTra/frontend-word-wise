import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ToggleLeft, ToggleRight } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ReminderItemProps {
  title: string;
  time: string;
  initialOn?: boolean; // mặc định bật/tắt
}

export default function ReminderItem({ title, time, initialOn = false }: ReminderItemProps) {
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
  const [isOn, setIsOn] = useState(initialOn);

  return (
    <View className="w-full h-[90px] bg-white/30 border border-white rounded-lg p-2 justify-center">
      <View className="flex-row items-center w-full justify-between">
        {/* Nội dung bên trái */}
        <View className="ml-2 gap-2">
          <Text className="text-lg font-[Montserrat-Bold] text-white">{title}</Text>
          <Text className="text-base text-white font-[Montserrat-Regular]">{time}</Text>
        </View>

        {/* Nút toggle bên phải */}
        <TouchableOpacity onPress={() => setIsOn(!isOn)}>
          {isOn ? (
            <ToggleLeft size={36} color="#BBBBBB" />
          ) : (
            <ToggleRight size={36} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}