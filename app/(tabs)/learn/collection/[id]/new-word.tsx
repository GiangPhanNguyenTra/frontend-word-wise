import Heading from "@/components/Heading";
import {
  addWordsToCollection,
  enrichWord,
  getUserCollections,
} from "@/services/collectionService";
import { ApiWord, Collection } from "@/types";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Search, Volume2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function NewWordPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState<ApiWord | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);

  // Selection states
  const [selDef, setSelDef] = useState(true);
  // Đơn giản hóa: Mặc định chọn hết, nếu cần chi tiết phải làm component Checkbox

  useEffect(() => {
    getUserCollections().then(setCollections);
    // Mặc định chọn collection hiện tại
    if (params.id) setSelectedCols([params.id]); // params.id ở đây nên là Name nếu endpoint add word dùng name
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setIsLoading(true);
    try {
      const data = await enrichWord(search.trim());
      setWordData(data);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Not found",
        text2: "Word not found",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!wordData || selectedCols.length === 0) return;
    setIsLoading(true);
    try {
      // Logic lọc data wordData theo checkbox (tạm bỏ qua, lấy full)
      await Promise.all(
        selectedCols.map((colName) => addWordsToCollection(colName, [wordData]))
      );
      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Word added successfully",
      });
      router.back();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to save" });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (url: string) => {
    if (url) {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Add New Word" onBack={() => router.back()} />

      <View className="px-4 mt-4">
        <View className="bg-white rounded-full flex-row items-center px-4 h-12 shadow-sm">
          <TextInput
            className="flex-1 font-[Montserrat-Medium]"
            placeholder="Type a word..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            {isLoading ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              <Search size={20} color="#2563EB" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 mt-6">
        {wordData ? (
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-[Montserrat-Bold] text-[#2563EB]">
                {wordData.wordText}
              </Text>
              <View className="bg-blue-50 px-3 py-1 rounded-md">
                <Text className="text-blue-600 font-[Montserrat-Bold]">
                  {wordData.partOfSpeech}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-4 mb-6">
              {wordData.phonetics.us?.audio && (
                <TouchableOpacity
                  onPress={() => playAudio(wordData.phonetics.us.audio)}
                  className="flex-row items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <Volume2 size={16} color="black" />
                  <Text>US</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-4">
              <Text className="font-[Montserrat-Bold] mb-2">Definition</Text>
              <Text className="text-gray-600">{wordData.definitionEn}</Text>
              <Text className="text-gray-800 font-[Montserrat-Medium] mt-1">
                {wordData.wordVn}
              </Text>
            </View>

            {wordData.examples.length > 0 && (
              <View>
                <Text className="font-[Montserrat-Bold] mb-2">Example</Text>
                <Text className="italic text-gray-600">
                  &quot;{wordData.examples[0].en}&quot;
                </Text>
                <Text className="text-gray-500 mt-1">
                  {wordData.examples[0].vi}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="items-center mt-10 opacity-50">
            <Text>Start typing to search...</Text>
          </View>
        )}
      </ScrollView>

      {wordData && (
        <View className="absolute bottom-6 left-4 right-4">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#2563EB] h-14 rounded-full items-center justify-center shadow-lg"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-[Montserrat-Bold] text-lg">
                Add to Collection
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
