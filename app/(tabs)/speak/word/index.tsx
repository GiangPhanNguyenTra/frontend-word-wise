import Heading from "@/components/Heading";
import { getUserCollections } from "@/services/collectionService"; // API lấy danh sách collection
import { Collection } from "@/types";
import { router, useFocusEffect } from "expo-router";
import { Play } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PracticeWordScreen() {
  const words = [
    { id: 1, label: "Random 5 Words", limit: 5 },
    { id: 2, label: "Random 10 Words", limit: 10 },
    { id: 3, label: "Random 15 Words", limit: 15 },
  ];

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"random" | "collection">("random");

  // Modal để chọn bài học trong collection (nếu cần mở rộng sau này)
  // Hiện tại logic collection sẽ chuyển thẳng sang practice với toàn bộ từ trong đó

  useFocusEffect(
    useCallback(() => {
      getUserCollections()
        .then(setCollections)
        .finally(() => setIsLoading(false));
    }, [])
  );

  const handleRandomSelect = (limit: number) => {
    router.push({
      pathname: "/(tabs)/speak/word/practice",
      params: { type: "random", limit: limit.toString() },
    });
  };

  const handleCollectionSelect = (col: Collection) => {
    router.push({
      pathname: "/(tabs)/speak/word/practice",
      params: { type: "collection", collectionName: col.name },
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title="Practice Words"
        onBack={() => router.replace("/(tabs)/speak")}
      />

      <ScrollView>
        <View className="mt-4 px-6 items-center justify-center">
          <Text className="font-[Montserrat-Bold] text-xl mb-6 text-center text-[#1F2937]">
            Choose how you want {"\n"} to practice today.
          </Text>

          {/* Tab Switch */}
          <View className="flex-row mb-6 rounded-full border border-[#2563EB] overflow-hidden bg-white w-full">
            {["random", "collection"].map((t) => {
              const isActive = tab === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTab(t as any)}
                  className={`flex-1 py-3 ${isActive ? "bg-[#2563EB]" : "bg-white"}`}
                >
                  <Text
                    className={`text-center font-[Montserrat-Bold] ${
                      isActive ? "text-white" : "text-[#2563EB]"
                    }`}
                  >
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Content */}
          {tab === "random" ? (
            <>
              {words.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleRandomSelect(item.limit)}
                  className="w-full flex-row items-center justify-between rounded-[20px] p-4 mb-4 shadow-sm bg-white"
                >
                  <Text className="text-base font-[Montserrat-Bold] text-[#1F2937]">
                    {item.label}
                  </Text>
                  <View className="rounded-full p-2">
                    <Play size={24} color="#EBAD25" fill="#EBAD25" />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              {isLoading ? (
                <ActivityIndicator color="#2563EB" />
              ) : collections.length === 0 ? (
                <Text className="text-gray-500 mt-4">
                  No collections found.
                </Text>
              ) : (
                collections.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleCollectionSelect(item)}
                    className="w-full flex-row items-center justify-between rounded-[20px] p-4 mb-4 shadow-sm bg-white"
                  >
                    <View>
                      <Text className="text-base font-[Montserrat-Bold] text-[#1F2937]">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {item.wordCount} words
                      </Text>
                    </View>
                    <View className="rounded-full p-2">
                      <Play size={20} color="#2563EB" fill="#2563EB" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
