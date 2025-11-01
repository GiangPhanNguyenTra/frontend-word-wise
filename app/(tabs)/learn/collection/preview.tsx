import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { EllipsisVertical, Volume2 } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

type WordItem = {
  word: string;
  type: string;
  phonetic: string;
  meaning: string;
  definition: string;
  example: string;
};

export default function PreviewPage() {
  const { collectionName, words, mode } = useLocalSearchParams<{
    collectionName: string;
    words: string;
    mode?: string;
  }>();

  const isAddWordMode = mode === "addWord";

  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [confirmVisible, setConfirmVisible] = useState<{
    show: boolean;
    word: string | null;
  }>({ show: false, word: null });

  let wordList: WordItem[] = [];

  try {
    wordList = JSON.parse(words);
  } catch {
    wordList = words
      ? words.split("\n").filter(Boolean).map(w => ({
          word: w,
          type: "noun",
          phonetic: "/ˈwɜːd/",
          meaning: "N/A",
          definition: "Auto-generated meaning",
          example: "Example usage will be generated later.",
        }))
      : [];
  }

  const speak = (text: string) => {
    Speech.speak(text, { language: "en", rate: 0.9 });
  };

  const handleEdit = (item: WordItem) => {
    setMenuVisible(null);
    router.push({
      pathname: "/(tabs)/learn/collection/edit",
      params: { ...item, collectionName },
    });
  };

  const handleDelete = (word: string) => {
    setMenuVisible(null);
    setConfirmVisible({ show: true, word });
  };

  const confirmDelete = () => {
    if (confirmVisible.word) console.log("Deleting:", confirmVisible.word);
    setConfirmVisible({ show: false, word: null });
  };

  const handleSave = () => {
    if (isAddWordMode) {
      router.push({
        pathname: "/(tabs)/learn/collection/view",
        params: { collectionName },
      });
    } else {
      router.push("/(tabs)/learn/collection");
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading
        title={
          isAddWordMode
            ? `${collectionName}`
            : collectionName.toUpperCase()
        }
      />

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {wordList.map((item, index) => (
          <View key={index} className="relative mb-4">
            <View className="bg-white rounded-[16px] shadow-lg p-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-[Montserrat-Bold]">
                    {item.word}
                  </Text>
                  <Text className="text-[#939393] font-[Montserrat-Medium]">
                    {item.type}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setMenuVisible(index)}>
                  <EllipsisVertical size={18} color="#363539" />
                </TouchableOpacity>
              </View>

              <View className="flex-row mb-1 mt-4 gap-4 items-center">
                <TouchableOpacity onPress={() => speak(item.word)}>
                  <Volume2 size={18} color="#939393" />
                </TouchableOpacity>
                <Text className="font-[Montserrat-Regular] text-[#939393]">
                  {item.phonetic}
                </Text>
              </View>

              <Text className="font-[Montserrat-Medium] mt-1">
                {item.meaning}
              </Text>
            </View>

            {/* Popup menu */}
            <Modal
              transparent
              visible={menuVisible === index}
              animationType="fade"
              onRequestClose={() => setMenuVisible(null)}
            >
              <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
                <View className="flex-1 bg-black/30 justify-center items-center">
                  <View className="bg-white rounded-[12px] w-64 p-4">
                    <TouchableOpacity
                      className="py-3"
                      onPress={() => handleEdit(item)}
                    >
                      <Text className="text-center font-[Montserrat-Bold]">
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="py-3"
                      onPress={() => handleDelete(item.word)}
                    >
                      <Text className="text-[#C30000] text-center font-[Montserrat-Bold]">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        ))}

        <TouchableOpacity
          className="bg-[#2563EB] w-full h-16 justify-center items-center rounded-full mt-4"
          onPress={handleSave}
        >
          <Text className="text-white font-[Montserrat-Bold] text-lg">
            {isAddWordMode ? "Add to Collection" : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm delete */}
      <Modal
        transparent
        visible={confirmVisible.show}
        animationType="fade"
        onRequestClose={() => setConfirmVisible({ show: false, word: null })}
      >
        <TouchableWithoutFeedback
          onPress={() => setConfirmVisible({ show: false, word: null })}
        >
          <View className="flex-1 bg-black/40 justify-center items-center px-8">
            <View className="bg-white w-full rounded-[16px] p-6">
              <Text className="text-lg font-[Montserrat-Bold] text-center mb-3">
                Delete “{confirmVisible.word}”?
              </Text>
              <Text className="text-[#696674] text-center mb-6 font-[Montserrat-Regular]">
                Are you sure you want to delete this word from {collectionName}?
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 h-12 justify-center items-center rounded-full border border-[#ccc] mr-2"
                  onPress={() => setConfirmVisible({ show: false, word: null })}
                >
                  <Text className="font-[Montserrat-Bold] text-[#333]">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-12 justify-center items-center rounded-full bg-[#DC2626] ml-2"
                  onPress={confirmDelete}
                >
                  <Text className="font-[Montserrat-Bold] text-white">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}