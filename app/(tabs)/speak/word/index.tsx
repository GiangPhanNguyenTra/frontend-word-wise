"use client";

import Heading from "@/components/Heading";
import LearnSelectionModal from "@/components/LearnSelectionModal";
import { router, useLocalSearchParams } from "expo-router";
import { Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PracticeWordScreen() {
  const words = [
    {
      id: 1,
      label: "Random 5 Words",
      bg: "white",
      color: "#EBAD25",
      route: "/(tabs)/learn/collection/learn/quiz?limit=5",
    },
    {
      id: 2,
      label: "Random 10 Words",
      bg: "white",
      color: "#EBAD25",
      route: "/(tabs)/learn/collection/learn/quiz?limit=10",
    },
    {
      id: 3,
      label: "Random 15 Words",
      bg: "white",
      color: "#EBAD25",
      route: "/(tabs)/learn/collection/learn/quiz?limit=15",
    },
    {
      id: 4,
      label: "Random 20 Words",
      bg: "white",
      color: "#EBAD25",
      route: "/(tabs)/learn/collection/learn/quiz?limit=20",
    },
  ];

  const collections = [
    { id: 1, title: "Collections Toeic" },
    { id: 2, title: "Collections Ielts" },
    { id: 3, title: "Collections Toefl" },
  ];

  const { tab: initialTab } = useLocalSearchParams<{ tab?: "random" | "collection" }>();
  const [tab, setTab] = useState<"random" | "collection">("random");
  const [learnModalVisible, setLearnModalVisible] = useState(false);

  useEffect(() => {
    if (initialTab === "random" || initialTab === "collection") {
      setTab(initialTab);
    }
  }, [initialTab]);

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Practice Words" />

      <ScrollView>
        <View className="mt-4 px-6 items-center justify-center">
          <Text className="font-[Montserrat-Bold] text-xl mb-6 text-center">
            Choose how you want {"\n"} to practice today.
          </Text>

          {/* Tab Switch */}
          <View className="flex-row mb-4 rounded-full border border-[#2563EB] overflow-hidden bg-white">
            {["random", "collection"].map((t) => {
              const isActive = tab === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTab(t as any)}
                  className={`flex-1 py-2 ${isActive ? "bg-[#2563EB]" : "bg-white"}`}
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
                  onPress={() => setLearnModalVisible(true)}
                  className="w-full flex-row items-center justify-between rounded-[20px] p-4 mb-4 shadow-sm bg-white"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text className="text-base font-[Montserrat-Bold]">{item.label}</Text>
                  <View className="rounded-full p-2">
                    <Play size={24} color="#EBAD25" fill="#EBAD25" />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              {collections.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setLearnModalVisible(true)}
                  className="w-full flex-row items-center justify-between rounded-[20px] p-4 mb-4 shadow-sm bg-white"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View>
                    <Text className="text-base font-[Montserrat-Bold]">{item.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          <LearnSelectionModal
            visible={learnModalVisible}
            onClose={() => setLearnModalVisible(false)}
            onConfirm={(selected) => {
              console.log("Selected to learn:", selected);
              setLearnModalVisible(false);
              router.push({
                pathname: "/(tabs)/speak/word/practice",
                params: {
                  selected: JSON.stringify(selected),
                },
              });
            }}
            options={[
              { id: "All", label: "All" },
              { id: "today", label: "Today's Words" },
              { id: "new", label: "New words" },
              { id: "tolearn", label: "To learn" },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}