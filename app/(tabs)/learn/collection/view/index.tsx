import CollectionProgressChart from "@/components/CollectionProgressChart";
import Heading from "@/components/Heading";
import LearnSelectionModal from "@/components/LearnSelectionModal";
import ProgressCard from "@/components/ProgressCard";
import WordCard from "@/components/WordCard";
import {
  deleteWord,
  getCollectionDetail,
  updateCollection,
} from "@/services/collectionService";
import {
  CollectionProgressData,
  getCollectionProgress,
} from "@/services/statisticService";
import { ApiWord, CollectionDetail } from "@/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  EllipsisVertical,
  LibraryBig,
  Play,
  Plus,
  Search,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CollectionViewPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    collectionName: string;
    from?: string;
  }>();

  const collectionId = params.id ? parseInt(params.id, 10) : -1;
  const collectionName = params.collectionName || "";

  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [progressData, setProgressData] =
    useState<CollectionProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [learnModalVisible, setLearnModalVisible] = useState(false);

  const [editColVisible, setEditColVisible] = useState(false);
  const [editedColName, setEditedColName] = useState("");

  const [confirmDeleteWord, setConfirmDeleteWord] = useState<{
    show: boolean;
    wordId: number | null;
    wordText: string;
  }>({ show: false, wordId: null, wordText: "" });

  const fetchData = async () => {
    if (!collectionName) return;

    try {
      setIsLoading(true);

      const detailData = await getCollectionDetail(collectionName);
      setDetail(detailData);
      setEditedColName(detailData.name);

      // Chỉ gọi API progress nếu collection có từ
      if (detailData.words && detailData.words.length > 0) {
        try {
          const statData = await getCollectionProgress(collectionName);
          setProgressData(statData);
        } catch (e) {
          console.log("No progress data or error fetching progress");
          setProgressData(null);
        }
      } else {
        setProgressData(null);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      if (!detail) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load collection data",
        });
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (collectionName) {
        fetchData();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid Collection Name",
        });
        router.back();
      }
    }, [collectionName])
  );

  const filteredWords =
    detail?.words?.filter((item) =>
      item.wordText.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleStartLearn = (modes: string[]) => {
    setLearnModalVisible(false);
    if (detail && detail.words.length > 0) {
      router.push({
        pathname: "/(tabs)/learn/session",
        params: {
          mode: JSON.stringify(modes),
          type: "collection",
          collectionName: detail.name,
        },
      });
    } else {
      Toast.show({
        type: "info",
        text1: "Empty",
        text2: "Add words to start learning",
      });
    }
  };

  const handleUpdateCollection = async () => {
    if (!collectionName) return;
    try {
      await updateCollection(collectionId, editedColName);
      setEditColVisible(false);
      fetchData();
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Collection renamed",
      });
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: "Update failed" });
    }
  };

  const handleDeleteWordItem = async () => {
    if (confirmDeleteWord.wordId && collectionName) {
      try {
        await deleteWord(collectionId, confirmDeleteWord.wordId);
        setConfirmDeleteWord({ show: false, wordId: null, wordText: "" });
        fetchData();
        Toast.show({
          type: "success",
          text1: "Deleted",
          text2: "Word removed",
        });
      } catch (e) {
        Toast.show({ type: "error", text1: "Error", text2: "Delete failed" });
      }
    }
  };

  const handleEditWord = (word: ApiWord) => {
    router.push({
      pathname: "/(tabs)/learn/collection/edit",
      params: {
        wordId: word.wordId.toString(),
        wordText: word.wordText,
        wordVn: word.wordVn,
        partOfSpeech: word.partOfSpeech,
        definitionEn: word.definitionEn || "",
        definitionVi: word.definitionVi || "",
        phonetics: JSON.stringify(word.phonetics || null),
        examples: JSON.stringify(word.examples || []),
        synonyms: word.synonyms || "",
        idiomsCollocations: JSON.stringify(word.idiomsCollocations || []),
        phrasalVerbs: JSON.stringify(word.phrasalVerbs || []),
      },
    });
  };

  const handleBack = () => {
    if (params.from === "learn") router.replace("/(tabs)/learn");
    else router.replace("/(tabs)/learn/collection");
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-[#F6F6F6]">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  if (!detail) return null;

  const hasWords = detail.words && detail.words.length > 0;
  const progressPercent = progressData
    ? Math.round(progressData.averageScore * 100)
    : 0;
  const masteredCount =
    progressData?.progress_chart?.data?.find((d) => d.levelName === "Mastered")
      ?.wordCount || 0;

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Heading title={detail.name} onBack={handleBack} />
        </View>
        <TouchableOpacity
          onPress={() => setEditColVisible(true)}
          className="w-12 h-12 mt-8 mr-6 items-center justify-center bg-white rounded-full shadow-sm"
        >
          <EllipsisVertical size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chỉ hiển thị thống kê và nút học nếu có từ vựng */}
        {hasWords ? (
          <View className="bg-white rounded-[24px] shadow-sm p-5 mt-3 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-4xl font-[Montserrat-Bold] text-[#1F2937] ">
                    {detail.words.length + " "}
                    <Text className="text-gray-800 text-sm font-[Montserrat-SemiBold] ">
                      words
                    </Text>
                  </Text>
                </View>
              </View>

              <ProgressCard color="#2563EB" percent={progressPercent} compact />
            </View>

            {/* Kiểm tra progress_chart trước khi render */}
            {progressData &&
            progressData.progress_chart &&
            progressData.progress_chart.data ? (
              <CollectionProgressChart
                data={progressData.progress_chart.data}
                totalWords={progressData.totalWords}
              />
            ) : null}

            <TouchableOpacity
              onPress={() => setLearnModalVisible(true)}
              className="bg-[#EBAD25] py-4 rounded-[16px] items-center flex-row justify-center mb-2 mt-4 shadow-sm"
            >
              <Text className="text-white font-[Montserrat-Bold] text-lg mr-2">
                Learn
              </Text>
              <Play size={20} color="white" fill="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#2563EB] py-4 rounded-[16px] items-center flex-row justify-center shadow-sm mt-2"
              onPress={() => handleStartLearn(["flashcards"])}
            >
              <LibraryBig size={20} color="white" />
              <Text className="text-white font-[Montserrat-Bold] text-lg ml-2">
                Flashcards
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Hiển thị Empty State nếu chưa có từ
          <View className="bg-white rounded-[24px] p-8 mt-4 items-center justify-center shadow-sm border border-dashed border-gray-300">
            <Text className="text-lg font-[Montserrat-Bold] text-gray-700 text-center mb-2">
              This collection is empty
            </Text>
            <Text className="text-sm text-gray-500 font-[Montserrat-Regular] text-center mb-6">
              Start building your vocabulary by adding new words.
            </Text>
          </View>
        )}

        {/* Search & List chỉ hiện khi có từ */}
        {hasWords && (
          <>
            <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm border border-gray-100">
              <Search color="#9CA3AF" size={20} />
              <TextInput
                className="flex-1 ml-2 text-base font-[Montserrat-Medium] text-[#333]"
                placeholder="Search words..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {filteredWords.map((item) => (
              <WordCard
                key={item.wordId.toString()}
                wordData={item}
                onEdit={handleEditWord}
                onDelete={() =>
                  setConfirmDeleteWord({
                    show: true,
                    wordId: item.wordId,
                    wordText: item.wordText,
                  })
                }
              />
            ))}

            {filteredWords.length === 0 && search.length > 0 && (
              <Text className="text-center text-gray-400 mt-10 font-[Montserrat-Medium]">
                No words found matching &quot;{search}&quot;.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Word Button */}
      <TouchableOpacity
        className="absolute bg-[#2563EB] bottom-6 right-6 w-14 h-14 shadow-lg items-center justify-center rounded-full"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/learn/collection/add",
            params: {
              mode: "addWord",
              collectionName: detail.name,
              from: params.from,
            },
          })
        }
      >
        <Plus width={28} height={28} color="white" />
      </TouchableOpacity>

      {/* Modals */}
      <LearnSelectionModal
        visible={learnModalVisible}
        onClose={() => setLearnModalVisible(false)}
        onConfirm={handleStartLearn}
      />

      <Modal
        transparent
        visible={editColVisible}
        animationType="fade"
        onRequestClose={() => setEditColVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-6">
            <Text className="text-lg font-[Montserrat-Bold] text-center mb-4">
              Rename Collection
            </Text>
            <TextInput
              value={editedColName}
              onChangeText={setEditedColName}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-6 font-[Montserrat-Medium]"
            />
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setEditColVisible(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
              >
                <Text className="font-[Montserrat-Bold] text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateCollection}
                className="flex-1 bg-[#2563EB] py-3 rounded-xl items-center"
              >
                <Text className="font-[Montserrat-Bold] text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={confirmDeleteWord.show}
        animationType="fade"
        onRequestClose={() =>
          setConfirmDeleteWord({ ...confirmDeleteWord, show: false })
        }
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-6">
            <Text className="text-lg font-[Montserrat-Bold] text-center mb-2">
              Delete Word?
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              Are you sure you want to delete &quot;{confirmDeleteWord.wordText}
              &quot;?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() =>
                  setConfirmDeleteWord({ ...confirmDeleteWord, show: false })
                }
                className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
              >
                <Text className="font-[Montserrat-Bold] text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteWordItem}
                className="flex-1 bg-red-600 py-3 rounded-xl items-center"
              >
                <Text className="font-[Montserrat-Bold] text-white">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
