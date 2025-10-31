// app/(auth)/login.tsx
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignIn = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* phần trên */}
      <View className="bg-[#92B1F5] rounded-b-[70%] pb-[20%] -mx-40 pl-40 pr-40 pt-20">
        {/* Nút back */}
        <View className="px-4">
          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: "/(auth)/welcome",
              });
            }}
            className="w-12 h-12 bg-white rounded-[10px] items-center justify-center"
          >
            <ChevronLeft size={30} color="#000000" />
          </TouchableOpacity>
        </View>
        <View className="w-full">
          {/* Title */}
          <View className="px-6 mt-24">
            <Text className="text-black text-3xl font-[Montserrat-Bold]">
              Welcome back! Glad
            </Text>
            <Text className="text-black text-3xl font-[Montserrat-Bold] leading-[50px]">
              to see you, Again!
            </Text>
          </View>

          {/* Email */}
          <View className="px-6 mt-20">
            <Text className="text-white mb-1 font-[Montserrat-Medium]">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#8391A1"
              className="w-full h-16 bg-[#F7F8F9] border border-[#DADADA] rounded-xl px-4 mb-4 font-[Montserrat-Regular]"
            />

            {/* Password */}
            <Text className="text-white mb-1 font-[Montserrat-Medium]">
              Password
            </Text>
            <View className="w-full h-16 bg-[#F7F8F9] border border-[#DADADA] rounded-xl px-4 flex-row items-center">
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#8391A1"
                secureTextEntry={!showPassword}
                className="flex-1 font-[Montserrat-Regular]"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={22} color="#6A707C" />
                ) : (
                  <EyeOff size={22} color="#6A707C" />
                )}
              </Pressable>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-pw")}
                className="self-end mt-2"
              >
                <Text className="text-[#ffffff] font-[Montserrat-Italic]">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* phần dưới */}
      <View className="flex-1 px-6 pt-10">
        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-[#2563EB] h-16 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-[Montserrat-Bold] text-base">
            Login
          </Text>
        </TouchableOpacity>

        {/* Register */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-black font-[Montserrat-Regular]">
            Don’t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-[#2563EB] font-[Montserrat-Medium]">
              Register Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
