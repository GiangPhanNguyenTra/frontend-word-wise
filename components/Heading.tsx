import { useFonts } from "expo-font";
import { useRouter } from "expo-router"; // ✅ Dùng expo-router
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft, Bell, Settings } from "lucide-react-native";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HeadingProps = {
  title: string;
};

const Heading: React.FC<HeadingProps> = ({ title }) => {
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
      className="w-full flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-[#FAF9FF] mt-8"
    >
      <View className="flex-row items-center">
        {/* Nút quay lại → quay về trang trước trong stack */}
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={40} height={30} />
        </TouchableOpacity>

        <Text className="font-[Montserrat-Bold] text-2xl text-[#7F56D9] ml-4">
          {title || "SOULSPACE"}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <Bell strokeWidth={1.5} />
        <Settings strokeWidth={1.5} />
      </View>
    </View>
  );
};

export default Heading;
