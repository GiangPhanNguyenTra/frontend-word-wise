import { collections } from "@/app/(tabs)/learn/data/collection";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CollectionListPage() {
  const [search, setSearch] = useState("");

  const filteredCollections = collections.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = collections.reduce((s, c) => s + c.count, 0);

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading 
        title="Collections" 
        onBack={() => {
          router.replace("/(tabs)/learn")
        }} 
      />

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search input */}
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
          <Search color="#696674" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
            placeholder="Search"
            placeholderTextColor="#696674"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Grid */}
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity
            key="all"
            className="w-[48%] bg-white rounded-[16px] p-6 mb-4 justify-between"
            onPress={() => router.push("/(tabs)/learn/collection/view")}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View>
              <Text className="font-[Montserrat-Bold] text-lg text-[#2563EB]">
                All
              </Text>
              <Text className="text-[#696674] mt-2 font-[Montserrat-Medium] text-base">
                {totalCount} flashcards
              </Text>
            </View>
          </TouchableOpacity>

          {filteredCollections.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-[48%] bg-white rounded-[16px] p-6 mb-4 justify-between"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/learn/collection/view",
                  params: { id: item.id, collectionName: item.name },
                })
              }
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View>
                <Text className="font-[Montserrat-Bold] text-lg text-[#373346]">
                  {item.name}
                </Text>
                <Text className="text-[#696674] mt-2 font-[Montserrat-Medium] text-base">
                  {item.count} flashcards
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

      <TouchableOpacity
        className="absolute bg-[#2563EB] bottom-6 right-6 w-16 h-16 shadow-lg p-4 items-center rounded-full overflow-hidden"
        onPress={() => router.push("/(tabs)/learn/collection/add")}
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}