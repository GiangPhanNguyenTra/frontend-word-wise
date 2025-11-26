import Learn1 from "@/assets/images/learn1.svg";
import Heading from "@/components/Heading";
import LearnSelectionModal from "@/components/LearnSelectionModal";
import { getUserCollections as fetchCollections } from "@/services/collectionService";
import { Collection } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LearnPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [todayCount, setTodayCount] = useState<number | null>(null); // Số từ review hôm nay
  const [isLoading, setIsLoading] = useState(true);
  const [showModeModal, setShowModeModal] = useState(false);

  // Fetch data mỗi khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const cols = await fetchCollections();
          setCollections(cols);

          // Gọi API practice/today (không truyền collectionName) để lấy số lượng từ cần học
          // Lưu ý: getPracticeSession trả về sessionData chứa list_words
          const session = await import("@/services/practiceService").then((m) =>
            m.getPracticeSession()
          );
          setTodayCount(session.list_words.length);
        } catch (error) {
          // Nếu lỗi (ví dụ 404 do chưa có từ nào), set count = 0
          setTodayCount(0);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const handleStartTodayReview = (modes: string[]) => {
    setShowModeModal(false);
    if (todayCount && todayCount > 0) {
      router.push({
        pathname: "/(tabs)/learn/session",
        params: {
          mode: JSON.stringify(modes),
          type: "today",
          collectionName: "Today's Review",
        },
      });
    } else {
      Toast.show({
        type: "info",
        text1: "No words",
        text2: "You are all caught up!",
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title="Review Library"
        onBack={() => router.replace("/(tabs)/home")}
      />

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Review Today Card */}
        <View className="flex-row justify-between items-center bg-[#2563EB] rounded-2xl mb-6 shadow-md">
          <View className="flex-1 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-[Montserrat-Bold] text-xl">
                  Review today
                </Text>
                <Text className="text-white mt-2 font-[Montserrat-Medium] text-base">
                  {isLoading ? "..." : `${todayCount || 0} words`}
                </Text>
              </View>
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                <ChevronRight size={20} color="white" />
              </View>
            </View>

            <TouchableOpacity
              className="w-full mt-4 bg-white rounded-full px-4 py-4"
              onPress={() => {
                if (todayCount && todayCount > 0) setShowModeModal(true);
                else
                  Toast.show({
                    type: "info",
                    text1: "Great job!",
                    text2: "No words to review right now.",
                  });
              }}
            >
              <Text className="text-[#2563EB] text-center font-[Montserrat-Bold]">
                Review Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Collections */}
        <View>
          <View className="flex-row justify-between mb-4 items-center">
            <View>
              <Text className="font-[Montserrat-Bold] text-xl text-[#1F2937]">
                Collections
              </Text>
              <Text className="text-[#2563EB] mt-1 font-[Montserrat-Medium] text-sm">
                {collections.length} collections
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/learn/collection",
                  params: { from: "learn" },
                })
              }
            >
              <Text className="text-[#373346] font-[Montserrat-Medium] mr-1">
                View All
              </Text>
              <ChevronRight size={18} color="#373346" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2563EB" />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {collections.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-[250px] bg-white rounded-[16px] p-6 justify-between shadow-sm mr-2"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/learn/collection/view",
                      params: {
                        id: item.id,
                        collectionName: item.name,
                        from: "learn",
                      },
                    })
                  }
                >
                  <View>
                    <Text
                      className="font-[Montserrat-Bold] text-xl text-[#1F2937]"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-[#696674] mt-2 font-[Montserrat-Medium] text-base">
                      {item.wordCount} flashcards
                    </Text>
                  </View>
                  <View className="items-end mt-4">
                    <Learn1 width={80} height={60} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <LearnSelectionModal
        visible={showModeModal}
        onClose={() => setShowModeModal(false)}
        onConfirm={handleStartTodayReview}
      />
    </View>
  );
}
