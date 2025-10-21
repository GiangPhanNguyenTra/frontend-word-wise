"use client";

import Heading from "@/components/Heading";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "phanGiang293",
      status: "online",
      avatar: "https://i.pravatar.cc/100",
      unread: true,
    },
    {
      id: 2,
      name: "user2",
      status: "offline",
      avatar: "https://i.pravatar.cc/101",
      unread: false,
    },
    {
      id: 3,
      name: "user3",
      status: "online",
      avatar: "https://i.pravatar.cc/100",
      unread: true,
    },
    {
      id: 4,
      name: "user4",
      status: "online",
      avatar: "https://i.pravatar.cc/101",
      unread: false,
    },
  ];

  const filteredCollections = users.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      router.push({ pathname: "/chat/[id]", params: { id: String(user.id), name: user.name, status: user.status, avatar: user.avatar } });
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Chat" />

      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
          <Search color="#696674" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
            placeholder="Search by name"
            placeholderTextColor="#696674"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Danh sách user */}
        <View>
          {filteredCollections.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelectUser(item.id)}
              className={`flex-row items-center justify-between p-3 mb-4 rounded-[16px] ${
                item.unread ? "bg-white" : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: item.avatar }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-col flex-1">
                  <Text className="font-[Montserrat-Bold] text-[16px] text-[#111]">
                    {item.name}
                  </Text>
                  <Text
                    className={`text-sm font-[Montserrat-Medium] ${
                      item.status === "online" ? "text-[#10B981]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {item.unread && (
                <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}