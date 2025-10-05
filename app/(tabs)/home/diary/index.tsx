import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from "react-native";
import dayjs from "dayjs";
import { router } from "expo-router";
import Heading from "@/components/Heading";
import HappyIcon from "@/assets/images/happy.svg";
import AngryIcon from "@/assets/images/angry.svg";
import { Plus } from "lucide-react-native";

interface Entry {
  created_at: string;
  mood: "angry" | "happy";
}

const mockEntries: Entry[] = [
  { created_at: "2025-09-01", mood: "happy" },
  { created_at: "2025-09-02", mood: "angry" },
  { created_at: "2025-09-05", mood: "happy" },
  { created_at: "2025-09-12", mood: "angry" },
  { created_at: "2025-09-18", mood: "happy" },
  { created_at: "2025-09-21", mood: "angry" },
  { created_at: "2025-09-23", mood: "happy" },
];

export default function Calendar({ entries = mockEntries }: { entries?: Entry[] }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const year = currentDate.year();
  const month = currentDate.month();
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfWeek = dayjs(new Date(year, month, 1)).day(); // 0=Sun..6=Sat

  // Animation state
  const animValue = useRef(new Animated.Value(1)).current;
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const triggerAnim = (dir: "next" | "prev") => {
    setDirection(dir);
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const entryMap = useMemo(() => {
    const map: Record<number, Entry["mood"]> = {};
    (entries || []).forEach((e) => {
      const d = dayjs(e.created_at);
      if (d.year() === year && d.month() === month) {
        map[d.date()] = e.mood;
      }
    });
    return map;
  }, [entries, year, month]);

  const cellWidth = `${100 / 7}%`;

  const goPrev = () => {
    triggerAnim("prev");
    setCurrentDate((p) => p.subtract(1, "month"));
  };

  const goNext = () => {
    triggerAnim("next");
    setCurrentDate((p) => p.add(1, "month"));
  };

  const goCreate = (day: number) => {
    const dateStr = dayjs(new Date(year, month, day)).format("YYYY-MM-DD");
    router.push(`/(tabs)/diary?date=${dateStr}`);
  };

  // Anim translate
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: direction === "next" ? [50, 0] : [-50, 0],
  });
  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Diary" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 32,
            borderRadius: 12,
            backgroundColor: "#7F56D9",
          }}
        >
          <TouchableOpacity onPress={goPrev}>
            <Text className="text-3xl font-[Poppins-Regular] text-white">{"<"}</Text>
          </TouchableOpacity>
          <Text className="text-lg font-[Poppins-Regular] text-white">
            {currentDate.format("MMMM YYYY")}
          </Text>
          <TouchableOpacity onPress={goNext}>
            <Text className="text-3xl font-[Poppins-Regular] text-white">{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* week labels */}
        <View className="flex-row mb-1.5">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <Text
              key={d}
              className="text-center text-xs text-gray-500 font-[Poppins-Regular]"
              style={{ width: cellWidth }}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* dates grid */}
        <Animated.View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            transform: [{ translateX }],
            opacity,
          }}
        >
          {/* empty offsets */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <View
              key={`e-${i}`}
              className="items-center justify-center"
              style={{ width: cellWidth, height: 56 }}
            />
          ))}

          {/* days */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const mood = entryMap[day];
            const dateObj = dayjs(new Date(year, month, day));
            const isToday = dayjs().isSame(dateObj, "day");
            const isFuture = dateObj.isAfter(dayjs(), "day");

            return (
              <TouchableOpacity
                key={day}
                disabled={isFuture}
                onPress={() => !mood && !isFuture && goCreate(day)}
                className="items-center justify-center"
                style={{ width: cellWidth, height: 60 }}
                activeOpacity={0.8}
              >
                {mood ? (
                  <View className="items-center">
                    {mood === "angry" ? (
                      <AngryIcon width={32} height={32} />
                    ) : (
                      <HappyIcon width={32} height={32} />
                    )}
                    <Text className="text-xs text-gray-600 mt-1">{day}</Text>
                  </View>
                ) : isToday ? (
                  <View className="items-center">
                    <View className="bg-[#7F56D9] rounded-full p-2 mb-4">
                      <Text className="text-xs text-white w-9 h-7 text-center mt-2 font-[Poppins-Regular]">{day}</Text>
                    </View>
                  </View>
                ) : isFuture ? (
                  <Text className="text-xs text-gray-400 font-[Poppins-Regular]">{day}</Text>
                ) : (
                  <View className="items-center">
                    <View className="bg-[#F0EAFF] border-[5px] border-[#E0D7F9] rounded-full p-2 mb-1">
                      <Plus width={18} height={18} color={"#7F56D9"} />
                    </View>
                    <Text className="text-xs text-gray-600 font-[Poppins-Regular]">{day}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* History */}
        <View className="flex-1 w-full gap-2.5 px-4 mt-6">
          <Text className="text-black text-lg font-[Poppins-SemiBold]">History</Text>
          <TouchableOpacity
            className="w-full flex-row items-center gap-3 rounded-xl border-[2px] border-[#f4f4f4] bg-white p-4 shadow-md"
            onPress={() => router.push("/(tabs)/home/diary/detail")}
          >
            <AngryIcon width={43} height={43} />
            <View className="flex-1">
              <Text className="text-[16px] leading-6 font-[Poppins-Medium] text-[#090a0a]">
                22/09/2025
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="mt-1 text-[16px] h-[22px] font-[Poppins-Regular] text-[#736B66]"
              >
                I felt really angry, and I am still learning ...
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}