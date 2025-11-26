import Heading from "@/components/Heading";
import { getUserCollections } from "@/services/collectionService";
import { Collection } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CollectionListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchCols = async () => {
        try {
          const data = await getUserCollections();
          if (isActive) setCollections(data);
        } catch (error) {
          console.error(error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
      fetchCols();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const filteredCollections = collections.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title="Collections"
        onBack={() => {
          router.replace("/(tabs)/learn");
        }}
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView
          className="p-4"
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Search input */}
          <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
            <Search color="#696674" size={20} />
            <TextInput
              className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
              placeholder="Search collections"
              placeholderTextColor="#696674"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Grid */}
          <View className="flex-row flex-wrap justify-between">
            {filteredCollections.map((item) => (
              <TouchableOpacity
                key={item.name}
                className="w-[48%] bg-white rounded-[16px] p-6 mb-4 justify-between shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/learn/collection/view",
                    params: {
                      id: item.id,
                      collectionName: item.name,
                      from: "list",
                    },
                  })
                }
              >
                <View>
                  <Text
                    className="font-[Montserrat-Bold] text-lg text-[#373346]"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-[#696674] mt-2 font-[Montserrat-Medium] text-base">
                    {item.wordCount} words
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredCollections.length === 0 && (
            <Text className="text-center text-[#696674] mt-4 font-[Montserrat-Medium]">
              No collections found
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        className="absolute bg-[#2563EB] bottom-6 right-6 w-16 h-16 shadow-lg items-center justify-center rounded-full"
        onPress={() => router.push("/(tabs)/learn/collection/add")}
      >
        <Plus width={28} height={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
