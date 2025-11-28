import Heading from "@/components/Heading";
import StatisticChart from "@/components/StatisticChart";
import WeekMonthYearSelector from "@/components/WeekMonthYearSelector";
import {
  GeneralStatistics,
  getGeneralStatistics,
} from "@/services/statisticService";
import { format } from "date-fns";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProgressPage() {
  const { tab: initialTab } = useLocalSearchParams<{
    tab?: "week" | "month" | "year";
  }>();

  const [tab, setTab] = useState<"week" | "month" | "year">("week");
  const [stats, setStats] = useState<GeneralStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State lưu khoảng thời gian hiện tại đang chọn
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), "yyyy-MM-dd"), // Default today
    end: format(new Date(), "yyyy-MM-dd"),
  });

  // Init tab từ params
  useFocusEffect(
    useCallback(() => {
      if (initialTab) setTab(initialTab);
    }, [initialTab])
  );

  // Fetch API khi tab hoặc dateRange thay đổi
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Gọi API với dateRange hiện tại
      const data = await getGeneralStatistics(
        tab,
        dateRange.start,
        dateRange.end
      );
      setStats(data);
    } catch (error) {
      console.error("Fetch Stats Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch khi state thay đổi
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [tab, dateRange])
  );

  const handleDateChange = (range: { start: Date; end: Date }) => {
    const formattedStart = format(range.start, "yyyy-MM-dd");
    const formattedEnd = format(range.end, "yyyy-MM-dd");

    // Chỉ update nếu khác giá trị cũ để tránh loop
    if (formattedStart !== dateRange.start || formattedEnd !== dateRange.end) {
      setDateRange({ start: formattedStart, end: formattedEnd });
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Progress" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION 1: LEARNING TREND --- */}
        <Text className="text-center font-[Montserrat-Bold] text-xl mb-2 mt-4 text-[#1F2937]">
          Learning Trend
        </Text>

        {/* Filter Bar */}
        <View className="flex-row items-center justify-between px-4 mt-2 mb-4">
          <View className="flex-row rounded-full overflow-hidden bg-white border border-gray-100 p-1 shadow-sm">
            {["week", "month", "year"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t as any)}
                className={`px-4 py-1.5 rounded-full ${
                  tab === t ? "bg-[#2563EB]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-[Montserrat-Bold] uppercase ${
                    tab === t ? "text-white" : "text-gray-400"
                  }`}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <WeekMonthYearSelector mode={tab} onChange={handleDateChange} />
        </View>

        {/* Learning Chart */}
        <View className="px-4">
          {isLoading ? (
            <View className="h-[220px] bg-white rounded-2xl items-center justify-center">
              <ActivityIndicator color="#2563EB" />
            </View>
          ) : (
            <StatisticChart
              data={stats?.learning_trend || []}
              color="#2563EB"
            />
          )}
        </View>

        {/* --- SECTION 2: OVERVIEW --- */}
        <View className="px-4 mt-8">
          <Text className="text-center font-[Montserrat-Bold] text-xl mb-4 text-[#1F2937]">
            Overview
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {/* Total Learned */}
            <View className="w-[48%] bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-blue-600">
              <Text className="text-3xl text-[#2563EB] font-[Montserrat-ExtraBold]">
                {stats?.overview.totalWordsLearned || 0}
              </Text>
              <Text className="text-gray-500 text-xs font-[Montserrat-SemiBold] mt-1">
                Total Learned
              </Text>
            </View>

            {/* Reviewed Today */}
            <View className="w-[48%] bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-green-600">
              <Text className="text-3xl text-[#00966D] font-[Montserrat-ExtraBold]">
                {stats?.overview.wordsReviewedToday || 0}
              </Text>
              <Text className="text-gray-500 text-xs font-[Montserrat-SemiBold] mt-1">
                Reviewed Today
              </Text>
            </View>

            {/* Retention Rate */}
            <View className="w-[48%] bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-yellow-500">
              <Text className="text-3xl text-[#EBAD25] font-[Montserrat-ExtraBold]">
                {Math.round((stats?.overview.retentionRate || 0) * 100)}%
              </Text>
              <Text className="text-gray-500 text-xs font-[Montserrat-SemiBold] mt-1">
                Retention Rate
              </Text>
            </View>

            {/* Pronunciation Accuracy */}
            <View className="w-[48%] bg-[#FFF1F2] rounded-[20px] p-5 shadow-sm border-l-4 border-red-600">
              <Text className="text-3xl text-[#E11D48] font-[Montserrat-ExtraBold]">
                {Math.round(stats?.pronunciation.accuracy || 0)}
              </Text>
              <Text className="text-gray-500 text-xs font-[Montserrat-SemiBold] mt-1">
                Pronunciation
              </Text>
            </View>
          </View>
        </View>

        {/* --- SECTION 3: FORGOTTEN WORDS --- */}
        {stats?.most_forgotten_words &&
          stats.most_forgotten_words.length > 0 && (
            <View className="px-4 mt-8">
              <Text className="text-center font-[Montserrat-Bold] text-xl mb-4 text-[#1F2937]">
                Needs Review
              </Text>
              <View className="w-full bg-white rounded-[20px] p-4 shadow-sm border border-gray-100">
                {stats.most_forgotten_words.map((item, index) => (
                  <View
                    key={index}
                    className={`flex-row justify-between py-3 ${index < stats.most_forgotten_words.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <Text className="font-[Montserrat-Bold] text-[#1F2937] text-base">
                      {item.word}
                    </Text>
                    <View className="bg-red-50 px-2 py-1 rounded-md">
                      <Text className="text-red-500 text-xs font-[Montserrat-Medium] italic">
                        {item.partOfSpeech}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* --- SECTION 4: PRONUNCIATION TREND --- */}
        <View className="px-4 mt-8 mb-6">
          <Text className="text-center font-[Montserrat-Bold] text-xl mb-4 text-[#1F2937]">
            Pronunciation Trend
          </Text>
          {isLoading ? (
            <ActivityIndicator color="#E11D48" />
          ) : (
            <StatisticChart
              data={stats?.pronunciation.improvement_trend || []}
              color="#E11D48"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
