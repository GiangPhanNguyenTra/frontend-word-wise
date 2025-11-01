import { collections } from "@/app/(tabs)/learn/data/collection";
import Learn1 from "@/assets/images/learn1.svg";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LearnPage() {
  const topCollections = collections.slice(0, 5);

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Review Library" onBack={() => router.replace("/(tabs)/home")} />

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Review Today Card */}
        <View className="flex-row justify-between items-center bg-[#2563EB] rounded-2xl mb-6">
          <View className="flex-1 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-[Montserrat-Bold] text-xl">
                  Review today
                </Text>
                <Text className="text-white mt-2 font-[Montserrat-Medium] text-base">
                  20 words
                </Text>
              </View>
              <TouchableOpacity className="w-8 h-8 bg-white rounded-full items-center justify-center">
                <ChevronRight size={20} color="#55BA5D" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-full mt-4 bg-white rounded-full px-4 py-4"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/learn/collection/learn/match",
                  params: { from: "learn" },
                })
              }
            >
              <Text className="text-[#2563EB] text-center font-[Montserrat-Bold]">
                Take Random Quiz
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Collections */}
        <View>
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="font-[Montserrat-Bold] text-xl">Collections</Text>
              <Text className="text-[#2563EB] mt-2 font-[Montserrat-Medium] text-base">
                {collections.length} collections
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row"
              onPress={() => router.push({
                pathname: "/(tabs)/learn/collection",
                params: { from: "learn"},
              })}
            >
              <Text className="text-[#373346] font-[Montserrat-Medium]">
                View All
              </Text>
              <ChevronRight size={20} color="#373346" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {topCollections.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-[250px] bg-white rounded-[16px] p-6 justify-between"
                onPress={() => router.push({
                    pathname: "/(tabs)/learn/collection/view",
                    params: {collectionName: item.name}
                })}
              >
                <View>
                  <Text className="font-[Montserrat-Bold] text-xl">
                    {item.name}
                  </Text>
                  <Text className="text-[#696674] mt-2 font-[Montserrat-Medium] text-base">
                    {item.count} flashcards
                  </Text>
                </View>
                <View className="items-end mt-4">
                  <Learn1 width={80} height={60} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}