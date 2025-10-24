import Heading from "@/components/Heading";
import WeekMonthYearSelector from "@/components/WeekMonthYearSelector";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EmotionChartWrapper from "../home/components/EmotionChartWrapper";

export default function ProgressPage() {
  const forgottenWords = [
    { id: 1, word: "revolutionary", type: "noun" },
    { id: 2, word: "accomplish", type: "verb" },
    { id: 3, word: "schedule", type: "verb" },
  ];

  const { tab: initialTab } = useLocalSearchParams<{
      tab?: "week" | "month" | "year";
    }>();
    const [tab, setTab] = useState<"week" | "month" | "year">("week");
    useEffect(() => {
      if (
        initialTab === "week" ||
        initialTab === "month" ||
        initialTab === "year"
      ) {
        setTab(initialTab);
      }
    }, [initialTab]);
  return(
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Progress" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Learning Trend */}
        <Text className="text-center font-[Montserrat-Bold] text-xl mb-2">Learning Trend</Text>
        <View className="flex-row items-center justify-between px-4 mt-4">
          <View className="flex-row rounded-full overflow-hidden bg-[#E5E7EB]">
            {["week", "month", "year"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t as any)}
                className={`px-3 py-1.5 ${
                  tab === t ? "bg-[#E9EFFD]" : "bg-transparent"
                } rounded-full`}
              >
                <Text
                  className={`text-sm font-[Montserrat-SemiBold] ${
                    tab === t ? "text-[#2563EB]" : "text-[#9CA3AF]"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <WeekMonthYearSelector
            mode={tab}
            onChange={(range) => console.log(`Selected ${tab}:`, range)}
          />
        </View>

        {/* Chart */}
        <View className="mb-6 ml-4 mr-4">
          <EmotionChartWrapper type={tab} />
        </View>
        {/* Overview */}
        <View className="px-6 shadow-lg">
          <Text className="text-center font-[Montserrat-Bold] text-xl mb-4">Overview</Text>
          <View className="w-full bg-white rounded-[20px] px-4 py-6 mb-4 gap-2">
            <View>
              <Text className="text-3xl text-[#2563EB] font-[Montserrat-ExtraBold]">
                1
                <Text className="text-[#616161] text-lg font-[Montserrat-Medium]">
                  /7
                </Text>
              </Text>
            </View>
            <Text className="text-[#616161] font-[Montserrat-SemiBold]">Total Words Learned</Text>
          </View>
          <View className="w-full bg-white rounded-[20px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#00966D] text-3xl font-[Montserrat-ExtraBold]">1</Text>
            <Text className="text-[#616161] font-[Montserrat-SemiBold]">Words Reviewed Today</Text>
          </View>
          <View className="w-full bg-white rounded-[20px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#EBAD25] text-3xl font-[Montserrat-ExtraBold]">1%</Text>
            <Text className="text-[#616161] font-[Montserrat-SemiBold]">Retention Rate</Text>
          </View>
          <View className="w-full bg-[#FFEDEB] rounded-[20px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#C30000] text-3xl font-[Montserrat-ExtraBold]">1%</Text>
            <Text className="text-[#616161] font-[Montserrat-SemiBold]">Pronunciation Accuracy</Text>
          </View>
        </View>
        {/* Most Forgotten Words */}
        <View className="px-6">
          <Text className="text-center font-[Montserrat-Bold] text-xl mt-2 mb-4">Most Forgotten Words</Text>
          <View className="w-full bg-[#E9EFFD] rounded-[16px] px-6 py-6 gap-2">
              {forgottenWords.map((item) => (
                <View key={item.id} className="flex-row justify-between"> 
                  <Text className="font-[Montserrat-Bold]">{item.word}</Text>
                  <Text className="text-[#939393] font-[Montserrat-Medium]">{item.type}</Text>
                </View>
              ))}
          </View>
        </View>
        {/* Pronunciation Improvement */}
        <Text className="text-center font-[Montserrat-Bold] text-xl mt-8 mb-2">Pronunciation Improvement</Text>
        <View className="flex-row items-center justify-between px-4 mt-4">
          <View className="flex-row rounded-full overflow-hidden bg-[#E5E7EB]">
            {["week", "month", "year"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t as any)}
                className={`px-3 py-1.5 ${
                  tab === t ? "bg-[#E9EFFD]" : "bg-transparent"
                } rounded-full`}
              >
                <Text
                  className={`text-sm font-[Montserrat-SemiBold] ${
                    tab === t ? "text-[#2563EB]" : "text-[#9CA3AF]"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <WeekMonthYearSelector
            mode={tab}
            onChange={(range) => console.log(`Selected ${tab}:`, range)}
          />
        </View>

        {/* Chart */}
        <View className="mb-6 ml-4 mr-4">
          <EmotionChartWrapper type={tab} />
        </View>
      </ScrollView>
    </View>
  );
}