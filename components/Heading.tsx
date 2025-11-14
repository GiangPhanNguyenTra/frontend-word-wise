import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ChevronLeft } from "lucide-react-native";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HeadingProps = {
  title: string;
  showBack?: boolean; // Có hiển thị nút back không
  onBack?: () => void; // Custom hành vi back
};

const Heading: React.FC<HeadingProps> = ({ title, showBack = true, onBack }) => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("@/assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Light": require("@/assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-ExtraBold": require("@/assets/fonts/Montserrat-ExtraBold.ttf"),
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
    <View
      onLayout={onLayoutRootView}
      className="w-full flex-row items-center justify-between py-4 px-4 mt-8"
    >
      <View className="flex-row items-center">
        {showBack && (
          <View className="px-2">
            <TouchableOpacity
              onPress={onBack || (() => router.back())}
              className="w-12 h-12 bg-white rounded-full items-center justify-center"
              activeOpacity={0.8}
            >
              <ChevronLeft size={28} color="#000000" />
            </TouchableOpacity>
          </View>
        )}
        <Text className="font-[Montserrat-Bold] text-xl ml-2">{title}</Text>
      </View>
    </View>
  );
};

export default Heading;