import Activity1 from "@/assets/images/activity1.svg";
import Activity2 from "@/assets/images/activity2.svg";
import Activity3 from "@/assets/images/activity3.svg";
import Activity4 from "@/assets/images/activity4.svg";
import Activity5 from "@/assets/images/activity5.svg";
import Decor from "@/assets/images/decor.svg";
import Logo from "@/assets/images/logo.svg";
import ProgressCard from "@/components/ProgressCard";
import { useRouter } from "expo-router";
import { FileSearch, MessageSquareText, MicVocal, Play, Settings } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activitiesY, setActivitiesY] = useState(0);

  const activities = [
    {
      id: 1,
      icon: <Activity1 />,
      label: "Daily Vocabulary Review",
      bg: "#E9EFFD",
      color: "#2563EB",
      route: "/(tabs)/learn",
    },
    {
      id: 2,
      icon: <Activity2 />,
      label: "Quick Flashcard Quiz",
      bg: "#FEF3E5",
      color: "#FFB34D",
      route: "/(tabs)/learn/collection/learn/flashcard",
    },
    {
      id: 3,
      icon: <Activity3 />,
      label: "Pronunciation Practice",
      bg: "#E5FFFC",
      color: "#106057",
      route: "/(tabs)/speak",
    },
    {
      id: 4,
      icon: <Activity4 />,
      label: "Chat & Learn with Friends",
      bg: "#E6FFE3",
      color: "#4DC93E",
      route: "/(tabs)/home/review",
    },
    {
      id: 5,
      icon: <Activity5 />,
      label: "Progress Statistics",
      bg: "#FFE9E5",
      color: "#D15743",
      route: "/(tabs)/home/review",
    },
  ];

  const handleExploreMore = () => {
    scrollRef.current?.scrollTo({
      y: activitiesY - 10,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between px-4 mt-8">
        <View className="flex-row items-center">
          <Logo width={80} height={50} />
          <Text className="font-[Montserrat-ExtraBold] text-2xl text-[#2563EB] ml-2">
            WORDWISE
          </Text>
        </View>
        <View className="flex-row items-center gap-6">
          <MessageSquareText strokeWidth={1.5} />
          <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
            <Settings strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        ref={scrollRef}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Greeting Card */}
        <View className="flex-row justify-between items-center bg-[#2563EB] rounded-2xl">
          <View className="flex-1 pl-4 pt-4 pb-4">
            <Text className="text-white font-[Montserrat-Bold] text-xl">
              Hello, phangiang293
            </Text>
            <Text className="text-white mt-2 font-[Montserrat-Regular] text-sm">
              Hope you are enjoying your day. If not then we are here for you
              as always.
            </Text>
            <TouchableOpacity
              className="mt-4 bg-white rounded-full px-4 py-2 self-start"
              onPress={handleExploreMore}
            >
              <Text className="text-[#2563EB] font-[Montserrat-SemiBold]">
                Explore
              </Text>
            </TouchableOpacity>
          </View>
          <Decor width={100} height={170} />
        </View>

        {/* Progress */}
        <Text className="text-black font-[Montserrat-Bold] text-2xl mt-6">
          Today's review progress
        </Text>
        <View className="flex-row justify-between mt-6">
          <ProgressCard
            icon={<FileSearch size={24} color="white" />}
            color="#2563EB"
            label="Collection"
            percent={73}
          />
          <ProgressCard
            icon={<MicVocal size={24} color="white" />}
            color="#EBAD25"
            label="Pronunciation"
            percent={16}
          />
        </View>

        {/* Activities */}
        <View
          className="mt-6"
          onLayout={(e) => setActivitiesY(e.nativeEvent.layout.y)}
        >
          <Text className="text-black font-[Montserrat-Bold] text-2xl mb-6">
            What should we do today?
          </Text>

          {activities.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as any)}
              className="w-full flex-row items-center justify-between rounded-2xl p-4 mb-4 shadow-sm"
              style={{
                backgroundColor: item.bg,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center gap-4">
                {item.icon}
                <Text
                  className="text-base font-[Montserrat-Bold]"
                  style={{ color: item.color }}
                >
                  {item.label}
                </Text>
              </View>
              <View
                className="rounded-full p-2"
                style={{ backgroundColor: item.color }}
              >
                <Play size={18} color="white" fill="white" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}