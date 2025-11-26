import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { updateWord } from "@/services/collectionService";
import { router, useLocalSearchParams } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditCollectionPage() {
  const params = useLocalSearchParams<{
    wordId: string;
    wordText: string;
    wordVn: string;
    partOfSpeech: string;
    definitionEn: string;
    definitionVi: string;
    phonetics: string;
    examples: string;
    synonyms: string;
    idiomsCollocations: string;
    phrasalVerbs: string;
  }>();

  const wordId = Number(params.wordId);

  // --- SAFE PARSE FUNCTION (SỬA LỖI Ở ĐÂY) ---
  const safeParse = (data: string | undefined, fallback: any) => {
    try {
      if (!data || data === "undefined" || data === "null") return fallback;
      const parsed = JSON.parse(data);
      // Nếu parse ra null (do JSON.parse("null")), trả về fallback
      return parsed === null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  };

  const initPhonetics = safeParse(params.phonetics, { uk: {}, us: {} });
  // Đảm bảo luôn là mảng rỗng [] nếu null
  const initExamples = safeParse(params.examples, []) || [];
  const initCollocations = safeParse(params.idiomsCollocations, []) || [];
  const initPhrasalVerbs = safeParse(params.phrasalVerbs, []) || [];

  // --- STATES ---
  const [word, setWord] = useState(params.wordText || "");
  const [type, setType] = useState(params.partOfSpeech || "");
  const [meaning, setMeaning] = useState(params.wordVn || "");

  const [phoneticUK, setPhoneticUK] = useState(initPhonetics.uk?.text || "");
  const [phoneticUS, setPhoneticUS] = useState(initPhonetics.us?.text || "");

  const [defEn, setDefEn] = useState(params.definitionEn || "");
  const [defVi, setDefVi] = useState(params.definitionVi || "");

  // Lấy ví dụ đầu tiên an toàn
  const [exampleEn, setExampleEn] = useState(initExamples[0]?.en || "");
  const [exampleVi, setExampleVi] = useState(initExamples[0]?.vi || "");

  const [synonyms, setSynonyms] = useState(params.synonyms || "");

  // Lists (Collocations & Phrasal Verbs) - Đã an toàn nhờ init ở trên
  const [collocations, setCollocations] =
    useState<{ en: string; vi: string }[]>(initCollocations);
  const [phrasalVerbs, setPhrasalVerbs] =
    useState<{ en: string; vi: string }[]>(initPhrasalVerbs);

  const [newColEn, setNewColEn] = useState("");
  const [newColVi, setNewColVi] = useState("");
  const [newPhrasalEn, setNewPhrasalEn] = useState("");
  const [newPhrasalVi, setNewPhrasalVi] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const typeOptions = [
    { id: "noun", name: "Noun" },
    { id: "verb", name: "Verb" },
    { id: "adjective", name: "Adjective" },
    { id: "adverb", name: "Adverb" },
  ];

  const [selectedType, setSelectedType] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (type) {
      const found = typeOptions.find(
        (opt) => opt.name.toLowerCase() === type.toLowerCase()
      );
      if (found) setSelectedType(found);
    }
  }, [type]);

  // --- Handlers ---

  const handleAddCollocation = () => {
    if (newColEn.trim()) {
      setCollocations([
        ...collocations,
        { en: newColEn.trim(), vi: newColVi.trim() },
      ]);
      setNewColEn("");
      setNewColVi("");
    }
  };

  const handleRemoveCollocation = (index: number) => {
    setCollocations(collocations.filter((_, i) => i !== index));
  };

  const handleAddPhrasalVerb = () => {
    if (newPhrasalEn.trim()) {
      setPhrasalVerbs([
        ...phrasalVerbs,
        { en: newPhrasalEn.trim(), vi: newPhrasalVi.trim() },
      ]);
      setNewPhrasalEn("");
      setNewPhrasalVi("");
    }
  };

  const handleRemovePhrasalVerb = (index: number) => {
    setPhrasalVerbs(phrasalVerbs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatePayload = {
        word: word,
        word_vn: meaning,
        partOfSpeech: type,
        definition_en: defEn,
        definition_vi: defVi,
        phonetics: {
          uk: { text: phoneticUK, audio: initPhonetics.uk?.audio || "" },
          us: { text: phoneticUS, audio: initPhonetics.us?.audio || "" },
        },
        examples: [{ en: exampleEn, vi: exampleVi }],
        synonyms: synonyms
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        idioms_collocations: collocations,
        phrasal_verbs: phrasalVerbs,
      };

      await updateWord(wordId, updatePayload);
      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Word updated successfully",
      });
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update word",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6F6F6]"
    >
      <Heading title="Edit Word" onBack={() => router.back()} />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Info */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-4 text-[#1F2937]">
            Basic Info
          </Text>

          <View className="mb-4">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Word
            </Text>
            <TextInput
              value={word}
              editable={false}
              className="w-full h-12 bg-gray-100 rounded-xl px-4 font-[Montserrat-Bold] text-gray-500"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-2 uppercase">
              Part of Speech
            </Text>
            <TagSelector
              options={typeOptions}
              multiSelect={false}
              defaultSelected={selectedType}
              onChange={(_, selected) => {
                if (selected && !Array.isArray(selected)) {
                  setType(selected.name);
                  setSelectedType({
                    id: String(selected.id),
                    name: selected.name,
                  });
                }
              }}
            />
          </View>

          <View>
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Vietnamese Meaning
            </Text>
            <TextInput
              value={meaning}
              onChangeText={setMeaning}
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-[Montserrat-Medium]"
            />
          </View>
        </View>

        {/* Phonetics */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-4 text-[#1F2937]">
            Phonetics
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1">
                UK
              </Text>
              <TextInput
                value={phoneticUK}
                onChangeText={setPhoneticUK}
                placeholder="/.../"
                className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-[Montserrat-Regular]"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1">
                US
              </Text>
              <TextInput
                value={phoneticUS}
                onChangeText={setPhoneticUS}
                placeholder="/.../"
                className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-[Montserrat-Regular]"
              />
            </View>
          </View>
        </View>

        {/* Definition & Example */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-4 text-[#1F2937]">
            Details
          </Text>

          <View className="mb-4">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Definition (EN)
            </Text>
            <TextInput
              value={defEn}
              onChangeText={setDefEn}
              multiline
              className="w-full min-h-[60px] bg-white border border-gray-200 rounded-xl px-4 py-2 font-[Montserrat-Regular]"
            />
          </View>
          <View className="mb-4">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Definition (VI)
            </Text>
            <TextInput
              value={defVi}
              onChangeText={setDefVi}
              multiline
              className="w-full min-h-[60px] bg-white border border-gray-200 rounded-xl px-4 py-2 font-[Montserrat-Regular]"
            />
          </View>

          <View className="h-[1px] bg-gray-100 my-2" />

          <View className="mb-4">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Example (EN)
            </Text>
            <TextInput
              value={exampleEn}
              onChangeText={setExampleEn}
              multiline
              className="w-full min-h-[60px] bg-white border border-gray-200 rounded-xl px-4 py-2 font-[Montserrat-Regular]"
            />
          </View>
          <View>
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 mb-1 uppercase">
              Example (VI)
            </Text>
            <TextInput
              value={exampleVi}
              onChangeText={setExampleVi}
              multiline
              className="w-full min-h-[60px] bg-white border border-gray-200 rounded-xl px-4 py-2 font-[Montserrat-Regular]"
            />
          </View>
        </View>

        {/* Synonyms */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-2 text-[#1F2937]">
            Synonyms
          </Text>
          <Text className="text-xs text-gray-400 mb-2">
            Separate words with commas
          </Text>
          <TextInput
            value={synonyms}
            onChangeText={setSynonyms}
            placeholder="e.g. happy, joyful, glad"
            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-[Montserrat-Regular]"
          />
        </View>

        {/* Collocations */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-4 text-[#1F2937]">
            Collocations
          </Text>

          {collocations && collocations.length > 0 ? (
            collocations.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2"
              >
                <View className="flex-1">
                  <Text className="font-[Montserrat-SemiBold] text-gray-800">
                    {item.en}
                  </Text>
                  <Text className="text-gray-500 text-xs">{item.vi}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveCollocation(index)}
                  className="p-2"
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-sm italic mb-2 text-center">
              No collocations
            </Text>
          )}

          <View className="flex-row gap-2 mt-2">
            <View className="flex-1 gap-2">
              <TextInput
                placeholder="English phrase"
                value={newColEn}
                onChangeText={setNewColEn}
                className="h-10 border border-gray-200 rounded-lg px-3 text-sm"
              />
              <TextInput
                placeholder="Vietnamese meaning"
                value={newColVi}
                onChangeText={setNewColVi}
                className="h-10 border border-gray-200 rounded-lg px-3 text-sm"
              />
            </View>
            <TouchableOpacity
              onPress={handleAddCollocation}
              className="bg-[#2563EB] w-10 rounded-lg items-center justify-center"
            >
              <Plus color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phrasal Verbs */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="font-[Montserrat-Bold] text-lg mb-4 text-[#1F2937]">
            Phrasal Verbs
          </Text>

          {phrasalVerbs && phrasalVerbs.length > 0 ? (
            phrasalVerbs.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2"
              >
                <View className="flex-1">
                  <Text className="font-[Montserrat-SemiBold] text-gray-800">
                    {item.en}
                  </Text>
                  <Text className="text-gray-500 text-xs">{item.vi}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemovePhrasalVerb(index)}
                  className="p-2"
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-sm italic mb-2 text-center">
              No phrasal verbs
            </Text>
          )}

          <View className="flex-row gap-2 mt-2">
            <View className="flex-1 gap-2">
              <TextInput
                placeholder="English phrase"
                value={newPhrasalEn}
                onChangeText={setNewPhrasalEn}
                className="h-10 border border-gray-200 rounded-lg px-3 text-sm"
              />
              <TextInput
                placeholder="Vietnamese meaning"
                value={newPhrasalVi}
                onChangeText={setNewPhrasalVi}
                className="h-10 border border-gray-200 rounded-lg px-3 text-sm"
              />
            </View>
            <TouchableOpacity
              onPress={handleAddPhrasalVerb}
              className="bg-[#2563EB] w-10 rounded-lg items-center justify-center"
            >
              <Plus color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-[#2563EB] items-center justify-center mt-4 shadow-lg shadow-blue-200"
          onPress={handleSave}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-[Montserrat-Bold] text-lg">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
