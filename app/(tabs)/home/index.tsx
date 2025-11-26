import Activity1 from "@/assets/images/activity1.svg";
import Activity2 from "@/assets/images/activity2.svg";
import Activity3 from "@/assets/images/activity3.svg";
import Activity4 from "@/assets/images/activity4.svg";
import Activity5 from "@/assets/images/activity5.svg";
import Decor from "@/assets/images/decor.svg";
import Logo from "@/assets/images/logo.svg";
import HomeStatisticCard from "@/components/HomeStatisticCard";
import { getHomeStatistics } from "@/services/statisticService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import {
  BookOpen,
  Library,
  MessageSquareText,
  Mic,
  Play,
  Settings,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface HomeStatistics {
  totalWords: number;
  totalCollections: number;
  todayWords: number;
  avgPronunciationScore: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activitiesY, setActivitiesY] = useState(0);
  const [username, setUsername] = useState("User");
  const [stats, setStats] = useState<HomeStatistics>({
    totalWords: 0,
    totalCollections: 0,
    todayWords: 0,
    avgPronunciationScore: 0,
  });

  const activities = [
    {
      id: 1,
      icon: <Activity1 />,
      label: "Collections Review",
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
      route: "/(tabs)/chat",
    },
    {
      id: 5,
      icon: <Activity5 />,
      label: "Progress Statistics",
      bg: "#FFE9E5",
      color: "#D15743",
      route: "/(tabs)/progress",
    },
  ];

  const fetchData = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUsername(user.username || user.fullName || "User");
      }

      const response = await getHomeStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load home data", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleExploreMore = () => {
    scrollRef.current?.scrollTo({
      y: activitiesY - 10,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <View className="w-full flex-row items-center justify-between pr-4 mt-8">
        <View className="flex-row items-center">
          <Logo width={80} height={50} />
          <Text className="font-[Montserrat-ExtraBold] text-2xl text-[#2563EB] ml-2">
            WORDWISE
          </Text>
        </View>
        <View className="flex-row items-center gap-6">
          <TouchableOpacity onPress={() => router.push("/(tabs)/chat")}>
            <MessageSquareText strokeWidth={1.5} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home/settings")}
          >
            <Settings strokeWidth={1.5} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center bg-[#2563EB] rounded-2xl mb-8 shadow-sm">
          <View className="flex-1 pl-4 pt-4 pb-4">
            <Text className="text-white font-[Montserrat-Bold] text-xl">
              Hello, {username}
            </Text>
            <Text className="text-white mt-2 font-[Montserrat-Regular] text-sm leading-5">
              Hope you are enjoying your day. If not then we are here for you as
              always.
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
          <View className="pr-2">
            <Decor width={100} height={170} />
          </View>
        </View>

        <Text className="text-[#1F2937] font-[Montserrat-Bold] text-xl mb-4">
          Daily Overview
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          <View className="w-[48%]">
            <HomeStatisticCard
              icon={<BookOpen size={24} color="#2563EB" />}
              color="#2563EB"
              value={stats.totalWords}
              label="Total Words"
            />
          </View>
          <View className="w-[48%]">
            <HomeStatisticCard
              icon={<Library size={24} color="#F59E0B" />}
              color="#F59E0B"
              value={stats.totalCollections}
              label="Collections"
            />
          </View>
          <View className="w-[48%]">
            <HomeStatisticCard
              icon={<Zap size={24} color="#10B981" />}
              color="#10B981"
              value={stats.todayWords}
              label="Learned Today"
            />
          </View>
          <View className="w-[48%]">
            <HomeStatisticCard
              icon={<Mic size={24} color="#EF4444" />}
              color="#EF4444"
              value={Math.round(stats.avgPronunciationScore)}
              label="Avg. Score"
            />
          </View>
        </View>

        <View
          className="mt-8"
          onLayout={(e) => setActivitiesY(e.nativeEvent.layout.y)}
        >
          <Text className="text-[#1F2937] font-[Montserrat-Bold] text-xl mb-4">
            Suggested Activities
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
