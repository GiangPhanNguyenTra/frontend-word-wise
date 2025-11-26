import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CheckCircle, Info, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import "react-native-reanimated";
import Toast, { ToastConfig } from "react-native-toast-message";

import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View className="w-[90%] bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-row items-center mt-10">
      <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
        <CheckCircle size={24} color="#16a34a" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-[#1a1a1a] font-[InterBold] text-base">
          {text1}
        </Text>
        <Text className="text-gray-500 font-[InterMedium] text-sm mt-1">
          {text2}
        </Text>
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View className="w-[90%] bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-row items-center mt-10">
      <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
        <XCircle size={24} color="#dc2626" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-[#1a1a1a] font-[InterBold] text-base">
          {text1}
        </Text>
        <Text className="text-gray-500 font-[InterMedium] text-sm mt-1">
          {text2}
        </Text>
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View className="w-[90%] bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-row items-center mt-10">
      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
        <Info size={24} color="#2563EB" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-[#1a1a1a] font-[InterBold] text-base">
          {text1}
        </Text>
        <Text className="text-gray-500 font-[InterMedium] text-sm mt-1">
          {text2}
        </Text>
      </View>
    </View>
  ),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    InterExtraBold: Inter_800ExtraBold,
    InterMedium: Inter_500Medium,
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="(auth)/welcome"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          presentation: "card",
        }}
      >
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen
          name="(auth)/introduce"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/forgot-pw/index" />
        <Stack.Screen name="(auth)/forgot-pw/confirm-otp" />
        <Stack.Screen name="(auth)/forgot-pw/new-pw" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />

      <Toast config={toastConfig} topOffset={10} />
    </ThemeProvider>
  );
}
