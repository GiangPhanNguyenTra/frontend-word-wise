import Heading from "@/components/Heading";
import { enrichWordsBulk } from "@/services/collectionService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AddCollectionPage() {
  const { mode, collectionName, from } = useLocalSearchParams<{
    mode?: string;
    collectionName?: string;
    from?: string;
  }>();

  const isAddWordMode = mode === "addWord";
  const [name, setName] = useState(collectionName || "");
  const [wordList, setWordList] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWordChange = (text: string) => {
    const lines = text.split("\n");
    if (lines.length > 50) {
      Alert.alert("Limit reached", "You can only enter up to 50 words.");
      return;
    }
    setWordList(text);
  };

  const handleContinue = async () => {
    if (!wordList.trim()) return;
    if (!isAddWordMode && !name.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please enter collection name",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Tách từ từ input
      const rawWords = wordList
        .split("\n")
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      // Gọi API enrich
      const enrichedWords = await enrichWordsBulk(rawWords);

      // Chuyển sang màn Preview kèm data đã enrich
      router.push({
        pathname: "/(tabs)/learn/collection/preview",
        params: {
          collectionName: isAddWordMode ? collectionName : name,
          wordsData: JSON.stringify(enrichedWords), // Truyền data object thay vì string thô
          mode: isAddWordMode ? "addWord" : "create",
          from,
        },
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to enrich words. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title={
          isAddWordMode ? `Add to: ${collectionName}` : "Create New Collection"
        }
      />

      <ScrollView
        className="p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {!isAddWordMode && (
          <View className="mb-6">
            <Text className="text-lg mb-1 font-[Montserrat-Bold] text-[#1F2937]">
              Collection Name
            </Text>
            <TextInput
              placeholder="Enter collection name"
              placeholderTextColor="#939393"
              value={name}
              onChangeText={setName}
              className="w-full h-16 bg-white border border-[#CCCCCC] rounded-[16px] px-4 font-[Montserrat-Regular]"
            />
          </View>
        )}

        <Text className="text-lg mb-1 font-[Montserrat-Bold] text-[#1F2937]">
          Word List
        </Text>
        <View className="mb-4">
          <Text className="text-[#6B7280] font-[Montserrat-Regular] mb-1 text-sm">
            • Just type your words, AI will generate meanings & examples.
          </Text>
          <Text className="text-[#6B7280] font-[Montserrat-Regular] mb-1 text-sm">
            • Use line breaks to separate words.
          </Text>
        </View>

        <TextInput
          placeholder={`Example:\nhello\nlove\nbeautiful`}
          placeholderTextColor="#939393"
          value={wordList}
          onChangeText={handleWordChange}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          className="w-full h-[200px] bg-white border border-[#CCCCCC] rounded-[16px] px-4 py-4 font-[Montserrat-Regular] text-base"
        />

        <TouchableOpacity
          disabled={isLoading || (!isAddWordMode && !name) || !wordList}
          className={`w-full h-16 rounded-full items-center justify-center mt-8 ${
            isLoading || (!isAddWordMode && !name) || !wordList
              ? "bg-gray-300"
              : "bg-[#2563EB]"
          }`}
          onPress={handleContinue}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-[Montserrat-Bold] text-lg">
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
