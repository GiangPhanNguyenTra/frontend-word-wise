import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddCollectionPage() {
  const [collectionName, setCollectionName] = useState("");
  const [wordList, setWordList] = useState("");

  const handleWordChange = (text: string) => {
    const lines = text.split("\n");
    if (lines.length > 50) {
      Alert.alert("Limit reached", "You can only enter up to 50 words.");
      return;
    }
    setWordList(text);
  };

  const handlePreview = () => {
    router.push({
      pathname: "/(tabs)/learn/collection/preview",
      params: {
        collectionName,
        words: wordList,
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Create New Collection" />

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Collection Name */}
        <View className="mb-6">
          <Text className="text-lg mb-1 font-[Montserrat-Bold]">
            Collection Name
          </Text>
          <TextInput
            placeholder="Enter collection name"
            placeholderTextColor="#939393"
            value={collectionName}
            onChangeText={setCollectionName}
            className="w-full h-16 bg-white border border-[#CCCCCC] rounded-[10px] px-4 font-[Montserrat-Regular]"
          />
        </View>

        {/* Word List */}
        <Text className="text-lg mb-1 font-[Montserrat-Bold]">Word List</Text>
        <View className="mb-4 ml-4">
          <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
            • Just type your words, the system will automatically generate meanings, contexts, and examples for you.
          </Text>
          <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
            • Use line breaks to separate words.
          </Text>
          <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
            • Maximum 50 words.
          </Text>
        </View>

        <TextInput
          placeholder={`Example:\nhello\nlove`}
          placeholderTextColor="#939393"
          value={wordList}
          onChangeText={handleWordChange}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="w-full h-[120px] bg-white border border-[#CCCCCC] rounded-[10px] px-4 py-3 font-[Montserrat-Regular]"
        />

        <TouchableOpacity
          disabled={!collectionName || !wordList}
          className={`w-full h-16 rounded-full items-center justify-center mt-8 ${
            !collectionName || !wordList ? "opacity-40 bg-[#2563EB]" : "bg-[#2563EB]"
          }`}
          onPress={handlePreview}
        >
          <Text className="text-white font-[Montserrat-Bold]">Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}