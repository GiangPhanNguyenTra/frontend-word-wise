import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Check, ChevronRight } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CustomScreen() {
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
  const [showModal, setShowModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
      <View className="flex-1 bg-[#020659]">
        <Heading
          title="Custom reminder"
          showBack={true}
          onBackPress={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="py-3 px-1">
            {/* Once */}
            <TouchableOpacity
              className="w-full h-14 rounded-xl border border-white/20 bg-white/10 px-4 justify-center mb-4"
              onPress={() => router.back()}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-[Montserrat-Bold] text-base">Once</Text>
              </View>
            </TouchableOpacity>

            {/* Daily */}
            <TouchableOpacity
              className="w-full h-14 rounded-xl border border-white/20 bg-white/10 px-4 justify-center mb-4"
              onPress={() => router.back()}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-[Montserrat-Bold] text-base">Daily</Text>
              </View>
            </TouchableOpacity>

            {/* Custom */}
            <TouchableOpacity
              className="w-full h-14 rounded-xl border border-white/20 bg-white/10 px-4 justify-center mb-4"
              onPress={() => setShowModal(true)}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-[Montserrat-Bold] text-base">Custom</Text>
                <ChevronRight width={20} height={20} color="#BBBBBB" />
              </View>
            </TouchableOpacity>

            {/* Popup Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#2b2b2b] rounded-t-2xl p-4 max-h-[70%]">
                  <Text className="text-white text-lg font-[Montserrat-Bold] mb-4 text-center">Customize</Text>

                  <ScrollView>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day}
                        className="flex-row justify-between items-center py-4 border-b border-white/10"
                        onPress={() => toggleDay(day)}
                      >
                        <Text className="text-white font-[Montserrat-Regular] text-base">{day}</Text>
                        <View
                          className={`w-6 h-6 rounded-full border items-center justify-center ${
                            selectedDays.includes(day) ? "bg-blue-500 border-blue-500" : "border-white/40"
                          }`}
                        >
                          {selectedDays.includes(day) && <Check width={16} height={16} color="white"/>}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Buttons */}
                  <View className="flex-row justify-end gap-4 mt-4">
                    <TouchableOpacity
                      className="px-5 py-2 rounded-lg bg-gray-500"
                      onPress={() => setShowModal(false)}
                    >
                      <Text className="text-white font-[Montserrat-Bold]">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="px-5 py-2 rounded-lg bg-blue-600"
                      onPress={() => {
                        console.log("Selected Days:", selectedDays);
                        setShowModal(false);
                      }}
                    >
                      <Text className="text-white font-[Montserrat-Bold]">OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
  );
}