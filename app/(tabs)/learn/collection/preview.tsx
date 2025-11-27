import EditWordModal from "@/components/EditWordModal";
import Heading from "@/components/Heading";
import WordCard from "@/components/WordCard";
import {
  addWordsToCollection,
  createCollectionWithWords,
} from "@/services/collectionService";
import { ApiWord } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function PreviewPage() {
  const router = useRouter();
  const { collectionName, wordsData, mode, from } = useLocalSearchParams<{
    collectionName: string;
    wordsData: string; // JSON string
    mode?: string;
    from?: string;
  }>();

  const isAddWordMode = mode === "addWord";
  const [wordList, setWordList] = useState<ApiWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // States cho Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<ApiWord | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    if (wordsData) {
      try {
        const parsed = JSON.parse(wordsData);
        setWordList(parsed);
      } catch (e) {
        console.error("Parse error", e);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load words",
        });
      }
    }
  }, [wordsData]);

  const handleDeleteLocal = (index: number) => {
    Alert.alert("Remove Word", "Remove this word from the list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const newList = [...wordList];
          newList.splice(index, 1);
          setWordList(newList);
        },
      },
    ]);
  };

  const handleEditLocal = (word: ApiWord, index: number) => {
    setEditingWord(word);
    setEditingIndex(index);
    setEditModalVisible(true);
  };

  const handleSaveEditedWord = (updatedWord: ApiWord) => {
    if (editingIndex >= 0) {
      const newList = [...wordList];
      newList[editingIndex] = updatedWord;
      setWordList(newList);
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Word updated locally",
      });
    }
  };

  const handleSave = async () => {
    if (wordList.length === 0) {
      Toast.show({ type: "error", text1: "Empty", text2: "No words to save" });
      return;
    }

    setIsLoading(true);
    try {
      if (isAddWordMode) {
        await addWordsToCollection(collectionName, wordList);
      } else {
        await createCollectionWithWords(collectionName, wordList);
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Collection saved successfully",
      });

      if (from === "learn") {
        router.replace("/(tabs)/learn");
      } else if (isAddWordMode) {
        router.dismissTo("/(tabs)/learn/collection/view");
        router.replace({
          pathname: "/(tabs)/learn/collection/view",
          params: { collectionName },
        });
      } else {
        router.replace("/(tabs)/learn/collection");
      }
    } catch (e) {
      console.error(e);
      Toast.show({ type: "error", text1: "Error", text2: "Failed to save" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title={
          isAddWordMode ? `Add to: ${collectionName}` : "Review New Collection"
        }
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {wordList.length > 0 ? (
          <Text className="text-gray-500 font-[Montserrat-Medium] mb-4 mt-2">
            Review {wordList.length} enriched words before saving.
          </Text>
        ) : (
          <Text className="text-gray-500 font-[Montserrat-Medium] text-center mt-10">
            No words in list.
          </Text>
        )}

        {wordList.map((item, index) => (
          <WordCard
            key={`${item.wordText}-${index}`}
            wordData={item}
            onEdit={() => handleEditLocal(item, index)}
            onDelete={() => handleDeleteLocal(index)}
          />
        ))}
      </ScrollView>

      <View className="absolute bottom-6 left-4 right-4 bg-[#F6F6F6] pt-2">
        <TouchableOpacity
          className={`w-full h-14 rounded-full items-center justify-center shadow-lg ${
            wordList.length === 0 || isLoading ? "bg-gray-400" : "bg-[#2563EB]"
          }`}
          onPress={handleSave}
          disabled={isLoading || wordList.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-[Montserrat-Bold] text-lg">
              {isAddWordMode ? "Save to Collection" : "Create Collection"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <EditWordModal
        visible={editModalVisible}
        wordData={editingWord}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEditedWord}
      />
    </View>
  );
}
