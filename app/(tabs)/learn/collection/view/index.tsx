"use client";

import Heading from "@/components/Heading";
import LearnSelectionModal from "@/components/LearnSelectionModal";
import ProgressCard from "@/components/ProgressCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { EllipsisVertical, LibraryBig, Play, Plus, Search, Volume2 } from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function CollectionViewPage() {
  const router = useRouter();
  const { collectionName, from } = useLocalSearchParams<{ collectionName: string, from?: string }>();
  const [search, setSearch] = useState("");
  const [learnModalVisible, setLearnModalVisible] = useState(false);

  const words = [
    {
      id: 1,
      word: "love",
      type: "verb",
      phonetic: "/lʌv/",
      meaning: "yêu",
      definition: "to have affection for someone",
      example: "I love coding.",
    },
    {
      id: 2,
      word: "revolutionary",
      type: "noun",
      phonetic: "/ˌrevəˈluːʃəneri/",
      meaning: "cách mạng",
      definition: "involving or causing a complete change",
      example: "This is a revolutionary idea.",
    },
    {
      id: 3,
      word: "beautiful",
      type: "adjective",
      phonetic: "/ˈbjuːtɪfl/",
      meaning: "đẹp",
      definition: "pleasing to the senses",
      example: "What a beautiful day!",
    },
  ];

  const filteredWords = words.filter((item) =>
    item.word.toLowerCase().includes(search.toLowerCase())
  );

  const speak = (text: string) => {
    Speech.speak(text, { language: "en", rate: 0.9 });
  };

  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editedName, setEditedName] = useState(collectionName || "");

  const [confirmVisible, setConfirmVisible] = useState<{
    show: boolean;
    word: string | null;
  }>({ show: false, word: null });

  const handleEdit = (item: any) => {
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
    console.log("Deleting:", confirmVisible.word);
    setConfirmVisible({ show: false, word: null });
  };

  const handleEditCollection = () => {
    setMenuVisible(null);
    setEditedName(collectionName || "");
    setEditVisible(true);
  };

  // progress data
  const totalLessons = 7;
  const lessons = [
    { id: 1, words: 0, color: "#FFC431" },
    { id: 2, words: 4, color: "#2563EB" },
    { id: 3, words: 5, color: "#FF1E00" },
    { id: 4, words: 3, color: "#41E2B2" },
    { id: 5, words: 8, color: "#8A8C03" },
    { id: 6, words: 1, color: "#7D908F" },
    { id: 7, words: 4, color: "#D15743" },
  ];
  const learned = lessons.filter((l) => l.words > 0).length;
  const percent = Math.round((learned / totalLessons) * 100);

  const handleBack = () => {
    if (from === "learn") {
      router.replace("/(tabs)/learn");
    } else if (from === "list") {
      router.replace({
        pathname: "/(tabs)/learn/collection",
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Heading title={collectionName} onBack={handleBack}/>
        </View>
        <TouchableOpacity
          onPress={handleEditCollection}
          className="w-12 h-12 mt-8 mr-6 items-center justify-center bg-white rounded-full"
        >
          <EllipsisVertical size={18} />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mt-3">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-[20px] font-[Montserrat-Bold]">
                {learned}
                <Text className="text-gray-400 text-sm font-[Montserrat-Regular]">
                  /{totalLessons}
                </Text>
              </Text>
              <Text className="font-[Montserrat-Medium] text-base">
                Learned
              </Text>
            </View>
            <ProgressCard color="#2563EB" percent={percent} compact/>
          </View>

          {/* Learn Button */}
          <TouchableOpacity onPress={() => setLearnModalVisible(true)} className="bg-[#EBAD25] py-4 rounded-[16px] items-center flex-row justify-center mb-5 mt-2">
            <Text className="text-white font-[Montserrat-Bold] text-lg mr-2">
              Learn
            </Text>
            <Play size={18} color="white" />
          </TouchableOpacity>

          <LearnSelectionModal
            visible={learnModalVisible}
            onClose={() => setLearnModalVisible(false)}
            onConfirm={(selected) => {
              console.log("Selected to learn:", selected);
              setLearnModalVisible(false);
              const quizRoutes = [
                "/(tabs)/learn/collection/learn/choose",
                "/(tabs)/learn/collection/learn/match",
                "/(tabs)/learn/collection/learn/match/fill",
              ] as const;
              const randomRoute = quizRoutes[Math.floor(Math.random() * quizRoutes.length)];
              router.push({
                pathname: randomRoute,
                params: {
                  from: "collection",
                  collectionName,
                  selected: JSON.stringify(selected),
                },
              });
            }}
            options={[
              { id: "All", label: "All" },
              { id: "today", label: "Today's Words" },
              { id: "new", label: "New words" },
              { id: "tolearn", label: "To learn" },
              ...words.map((w) => ({ id: w.word, label: w.word })),
            ]}
          />

          {/* Bar chart */}
          <View className="flex-row justify-between items-end">
            {lessons.map((lesson, index) => {
              const barHeight = 20 + lesson.words * 10;
              return (
                <View key={lesson.id} className="items-center">
                  <Text className="text-gray-500 text-xs mb-1">
                    {lesson.words} {lesson.words < 2 ? "word" : "words"}
                  </Text>
                  <View
                    style={{
                      height: barHeight,
                      width: 40,
                      backgroundColor: lesson.color,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <Text className="text-gray-600 mt-1 font-[Montserrat-Medium]">
                    {index + 1}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Flashcards Button */}
        <TouchableOpacity 
          className="bg-[#2563EB] py-4 rounded-[16px] items-center flex-row justify-center mb-5 mt-5"
          onPress={() => router.push("/(tabs)/learn/collection/learn/flashcard")}
        >
          <LibraryBig size={18} color="white" />
          <Text className="text-white font-[Montserrat-Bold] text-lg ml-2">
            Flashcards
          </Text>
        </TouchableOpacity>

        {/* Search bar */}
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
          <Search color="#696674" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
            placeholder="Search by word or meaning"
            placeholderTextColor="#696674"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Word list */}
        {filteredWords.map((item, index) => (
          <View key={item.id} className="relative mb-4">
            <TouchableOpacity
              className="w-full bg-white rounded-[16px] p-5 shadow-sm"
              activeOpacity={0.8}
            >
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

              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="mt-2"
                  onPress={() => speak(item.word)}
                >
                  <Volume2 size={20} color="#939393" />
                </TouchableOpacity>
                <Text className="font-[Montserrat-Regular] text-[#939393] mt-2">
                  {item.phonetic}
                </Text>
              </View>
              <Text className="font-[Montserrat-Medium] mt-2 text-base">
                {item.meaning}
              </Text>
            </TouchableOpacity>

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
                      <Text className="text-center font-[Montserrat-Bold]">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-3"
                      onPress={() => handleDelete(item.word)}
                    >
                      <Text className="text-[#C30000] text-center font-[Montserrat-Bold]">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        ))}

        {filteredWords.length === 0 && (
          <Text className="text-center text-[#696674] mt-4 font-[Montserrat-Medium]">No words found</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute bg-[#2563EB] bottom-6 right-6 w-16 h-16 shadow-lg p-4 items-center rounded-full overflow-hidden"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/learn/collection/add",
            params: {
              mode: "addWord",
              collectionName,
              from,
            },
          })
        }
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      {/* Confirm delete modal */}
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
                  <Text className="font-[Montserrat-Bold] text-[#333]">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-12 justify-center items-center rounded-full bg-[#DC2626] ml-2"
                  onPress={confirmDelete}
                >
                  <Text className="font-[Montserrat-Bold] text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Edit Collection Name */}
      <Modal
        transparent
        visible={editVisible}
        animationType="fade"
        onRequestClose={() => setEditVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditVisible(false)}>
          <View className="flex-1 bg-black/40 justify-center items-center px-8">
            <TouchableWithoutFeedback>
              <View className="bg-white w-full rounded-[16px] p-6">
                <Text className="text-lg font-[Montserrat-Bold] text-center mb-3">
                  Edit Collection Name
                </Text>

                <TextInput
                  className="border border-[#ccc] rounded-[8px] px-4 py-3 mb-5 text-base font-[Montserrat-Medium]"
                  placeholder="Enter new name"
                  value={editedName}
                  onChangeText={setEditedName}
                />

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="flex-1 h-12 justify-center items-center rounded-full border border-[#ccc] mr-2"
                    onPress={() => setEditVisible(false)}
                  >
                    <Text className="font-[Montserrat-Bold] text-[#333]">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 h-12 justify-center items-center rounded-full bg-[#2563EB] ml-2"
                    onPress={() => {
                      console.log("Updated name:", editedName);
                      setEditVisible(false);
                    }}
                  >
                    <Text className="font-[Montserrat-Bold] text-white">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}