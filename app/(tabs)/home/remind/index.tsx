import CustomSwitch from "@/components/CustomSwitch";
import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pencil, PlusCircle } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const initialReminders = [
  {
    id: 1,
    title: "Write journal",
    time: "07:00 PM",
    active: true,
  },
  {
    id: 2,
    title: "Write journal",
    time: "07:00 PM",
    active: true,
  },
  {
    id: 3,
    title: "Drink water",
    time: "07:00 AM, 09:00 AM, 2 PM",
    active: false,
  },
  {
    id: 4,
    title: "Drink water",
    time: "07:00 AM, 09:00 AM, 2 PM",
    active: true,
  },
  {
    id: 5,
    title: "Drink water",
    time: "07:00 AM, 09:00 AM, 2 PM",
    active: false,
  },
  {
    id: 6,
    title: "Drink water",
    time: "07:00 AM, 09:00 AM, 2 PM",
    active: false,
  },
];

export default function RemindScreen() {
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

  const [reminders, setReminders] = useState(initialReminders);

  const router = useRouter();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Hàm toggle trạng thái
  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Remind" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Button create reminder */}
        <TouchableOpacity
          className="flex-row items-center justify-center mb-4"
          onPress={() => router.push("/(tabs)/home/remind/add")}
        >
          <PlusCircle size={22} color="#7F56D9" />
          <Text className="ml-2 text-lg font-[Montserrat-SemiBold] text-[#7F56D9]">
            Create a reminder
          </Text>
        </TouchableOpacity>

        {/* List reminders */}
        {reminders.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center justify-between bg-white rounded-2xl p-4 mb-3 shadow-sm"
            onPress={() => router.push("/(tabs)/home/remind/update")}
            activeOpacity={0.8}
          >
            {/* Left */}
            <View className="flex-row items-center">
              <View className="bg-[#fff1f1] p-3 rounded-xl mr-3">
                <Pencil size={20} color="#FF6B6B" strokeWidth={2.75} />
              </View>
              <View>
                <Text className="text-xl font-[Montserrat-SemiBold] text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-base text-gray-500 font-[Montserrat-Regular]">
                  {item.time}
                </Text>
              </View>
            </View>

            {/* Right - toggle */}
            <CustomSwitch
              value={item.active}
              onValueChange={() => toggleReminder(item.id)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
