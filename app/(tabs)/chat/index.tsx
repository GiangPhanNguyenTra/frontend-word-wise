import Heading from "@/components/Heading";
import { getChatTopics, getUserFriends } from "@/services/chatService";
import { ChatTopic } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useFocusEffect, useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [displayList, setDisplayList] = useState<ChatTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [topicsData, friendsData] = await Promise.all([
            getChatTopics(),
            getUserFriends(),
          ]);

          const friendIdsInTopics = new Set(
            topicsData.map((t) => t.otherUserId)
          );

          const friendsAsTopics: ChatTopic[] = friendsData
            .filter((f) => !friendIdsInTopics.has(f.userId))
            .map((f) => ({
              conversationId: 0,
              otherUserId: f.userId,
              name: f.username,
              avatar: f.avatarUrl,
              lastMessage: "Start a conversation",
              time: "",
              unreadCount: 0,
              online: false,
            }));

          setDisplayList([...topicsData, ...friendsAsTopics]);
        } catch (error) {
          console.error("Chat List Error:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const filteredList = displayList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = (item: ChatTopic) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: item.conversationId ? item.conversationId.toString() : "new",
        name: item.name,
        avatar: item.avatar || "",
        otherUserId: item.otherUserId.toString(),
        type: item.conversationId ? "existing" : "new",
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Chat" showBack={false} />

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Search Bar */}
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm border border-gray-100">
          <Search color="#9CA3AF" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
            placeholder="Search by name"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <View>
            {filteredList.map((item) => (
              <TouchableOpacity
                key={`${item.otherUserId}-${item.conversationId}`}
                onPress={() => handleSelectUser(item)}
                className={`flex-row items-center justify-between p-4 mb-3 rounded-[20px] ${
                  item.unreadCount > 0
                    ? "bg-white shadow-sm border border-blue-100"
                    : "bg-white border border-transparent"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri: item.avatar || "https://i.pravatar.cc/150?img=12",
                    }}
                    className="w-12 h-12 rounded-full mr-4 bg-gray-200"
                  />
                  <View className="flex-col flex-1 mr-2">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text
                        className="font-[Montserrat-Bold] text-[16px] text-[#1F2937]"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      {item.time && (
                        <Text className="text-xs text-gray-400 font-[Montserrat-Regular]">
                          {formatDistanceToNow(new Date(item.time), {
                            addSuffix: false,
                          }).replace("about ", "")}
                        </Text>
                      )}
                    </View>

                    <Text
                      numberOfLines={1}
                      className={`text-sm font-[Montserrat-Medium] ${
                        item.unreadCount > 0
                          ? "text-[#111] font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {item.lastMessage}
                    </Text>
                  </View>
                </View>

                {item.unreadCount > 0 && (
                  <View className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center ml-2">
                    <Text className="text-white text-[10px] font-bold">
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
