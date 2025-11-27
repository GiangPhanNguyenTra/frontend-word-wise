import TagSelector from "@/components/TagSelector";
import { ApiWord } from "@/types";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditWordModalProps {
  visible: boolean;
  wordData: ApiWord | null;
  onClose: () => void;
  onSave: (updatedWord: ApiWord) => void;
}

export default function EditWordModal({
  visible,
  wordData,
  onClose,
  onSave,
}: EditWordModalProps) {
  // --- 1. KHAI BÁO HOOKS LUÔN ĐƯỢC CHẠY (Không điều kiện) ---

  // Khởi tạo state với giá trị mặc định an toàn (rỗng)
  const [word, setWord] = useState("");
  const [type, setType] = useState("");
  const [meaning, setMeaning] = useState("");

  const [phoneticUK, setPhoneticUK] = useState("");
  const [phoneticUS, setPhoneticUS] = useState("");

  const [defEn, setDefEn] = useState("");
  const [defVi, setDefVi] = useState("");

  const [exampleEn, setExampleEn] = useState("");
  const [exampleVi, setExampleVi] = useState("");

  const [synonyms, setSynonyms] = useState("");

  const [collocations, setCollocations] = useState<
    { en: string; vi: string }[]
  >([]);
  const [phrasalVerbs, setPhrasalVerbs] = useState<
    { en: string; vi: string }[]
  >([]);

  // Input tạm
  const [newColEn, setNewColEn] = useState("");
  const [newColVi, setNewColVi] = useState("");
  const [newPhrasalEn, setNewPhrasalEn] = useState("");
  const [newPhrasalVi, setNewPhrasalVi] = useState("");

  const typeOptions = [
    { id: "noun", name: "Noun" },
    { id: "verb", name: "Verb" },
    { id: "adjective", name: "Adjective" },
    { id: "adverb", name: "Adverb" },
  ];

  // --- 2. USE EFFECT ĐỂ CẬP NHẬT DỮ LIỆU KHI MỞ MODAL ---
  useEffect(() => {
    if (wordData) {
      setWord(wordData.wordText || "");
      setType(wordData.partOfSpeech || "");
      setMeaning(wordData.wordVn || "");
      setPhoneticUK(wordData.phonetics?.uk?.text || "");
      setPhoneticUS(wordData.phonetics?.us?.text || "");
      setDefEn(wordData.definitionEn || "");
      setDefVi(wordData.definitionVi || "");
      setExampleEn(wordData.examples?.[0]?.en || "");
      setExampleVi(wordData.examples?.[0]?.vi || "");
      setSynonyms(wordData.synonyms || "");
      setCollocations(wordData.idiomsCollocations || []);
      setPhrasalVerbs(wordData.phrasalVerbs || []);
    }
  }, [wordData, visible]); // Chạy lại khi wordData thay đổi hoặc khi modal mở

  // --- 3. LOGIC XỬ LÝ ---

  const handleSave = () => {
    if (!wordData) return;

    const updatedWord: ApiWord = {
      ...wordData,
      wordText: word,
      wordVn: meaning,
      partOfSpeech: type,
      definitionEn: defEn,
      definitionVi: defVi,
      phonetics: {
        uk: { ...wordData.phonetics?.uk, text: phoneticUK },
        us: { ...wordData.phonetics?.us, text: phoneticUS },
      },
      examples: [{ en: exampleEn, vi: exampleVi }],
      synonyms: synonyms,
      idiomsCollocations: collocations,
      phrasalVerbs: phrasalVerbs,
    };
    onSave(updatedWord);
    onClose();
  };

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

  // --- 4. RETURN RENDER (Nếu không có data thì không render nội dung bên trong, nhưng Hooks đã chạy xong) ---
  if (!wordData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-[#F6F6F6]"
      >
        {/* Header Modal */}
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-[#2563EB] font-[Montserrat-Medium]">
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="font-[Montserrat-Bold] text-lg">Edit Word</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-[#2563EB] font-[Montserrat-Bold]">Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-3">Basic Info</Text>
            <TextInput
              value={word}
              editable={false}
              className="bg-gray-100 p-3 rounded-lg mb-3 font-[Montserrat-Bold] text-gray-500"
            />

            <Text className="text-xs text-gray-400 mb-1 uppercase font-bold">
              Type
            </Text>
            <TagSelector
              options={typeOptions}
              defaultSelected={typeOptions.find(
                (t) => t.name.toLowerCase() === type.toLowerCase()
              )}
              onChange={(_, sel) =>
                !Array.isArray(sel) && sel && setType(sel.name)
              }
              multiSelect={false}
            />

            <Text className="text-xs text-gray-400 mt-3 mb-1 uppercase font-bold">
              Meaning
            </Text>
            <TextInput
              value={meaning}
              onChangeText={setMeaning}
              className="border border-gray-200 p-3 rounded-lg font-[Montserrat-Medium]"
            />
          </View>

          {/* Phonetics */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-3">Phonetics</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-1">UK</Text>
                <TextInput
                  value={phoneticUK}
                  onChangeText={setPhoneticUK}
                  className="border border-gray-200 p-3 rounded-lg"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-1">US</Text>
                <TextInput
                  value={phoneticUS}
                  onChangeText={setPhoneticUS}
                  className="border border-gray-200 p-3 rounded-lg"
                />
              </View>
            </View>
          </View>

          {/* Details */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-3">Details</Text>

            <Text className="text-xs text-gray-400 mb-1">Definition (EN)</Text>
            <TextInput
              value={defEn}
              onChangeText={setDefEn}
              multiline
              className="border border-gray-200 p-3 rounded-lg mb-3 min-h-[60px]"
            />

            <Text className="text-xs text-gray-400 mb-1">Definition (VI)</Text>
            <TextInput
              value={defVi}
              onChangeText={setDefVi}
              multiline
              className="border border-gray-200 p-3 rounded-lg mb-3 min-h-[60px]"
            />

            <View className="h-[1px] bg-gray-100 my-2" />

            <Text className="text-xs text-gray-400 mb-1">Example (EN)</Text>
            <TextInput
              value={exampleEn}
              onChangeText={setExampleEn}
              multiline
              className="border border-gray-200 p-3 rounded-lg mb-3 min-h-[60px]"
            />

            <Text className="text-xs text-gray-400 mb-1">Example (VI)</Text>
            <TextInput
              value={exampleVi}
              onChangeText={setExampleVi}
              multiline
              className="border border-gray-200 p-3 rounded-lg min-h-[60px]"
            />
          </View>

          {/* Synonyms */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-2">Synonyms</Text>
            <TextInput
              value={synonyms}
              onChangeText={setSynonyms}
              placeholder="e.g. happy, glad"
              className="border border-gray-200 p-3 rounded-lg"
            />
          </View>

          {/* Collocations */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-3">Collocations</Text>
            {collocations.map((col, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center bg-gray-50 p-2 rounded-lg mb-2"
              >
                <View className="flex-1">
                  <Text className="font-bold text-sm">{col.en}</Text>
                  <Text className="text-xs text-gray-500">{col.vi}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setCollocations(collocations.filter((_, i) => i !== idx))
                  }
                >
                  <X size={16} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <View className="flex-row gap-2 mt-2">
              <View className="flex-1 gap-2">
                <TextInput
                  placeholder="Phrase (EN)"
                  value={newColEn}
                  onChangeText={setNewColEn}
                  className="border border-gray-200 p-2 rounded-lg text-sm"
                />
                <TextInput
                  placeholder="Meaning (VI)"
                  value={newColVi}
                  onChangeText={setNewColVi}
                  className="border border-gray-200 p-2 rounded-lg text-sm"
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
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="font-[Montserrat-Bold] mb-3">Phrasal Verbs</Text>
            {phrasalVerbs.map((ph, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center bg-gray-50 p-2 rounded-lg mb-2"
              >
                <View className="flex-1">
                  <Text className="font-bold text-sm">{ph.en}</Text>
                  <Text className="text-xs text-gray-500">{ph.vi}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setPhrasalVerbs(phrasalVerbs.filter((_, i) => i !== idx))
                  }
                >
                  <X size={16} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <View className="flex-row gap-2 mt-2">
              <View className="flex-1 gap-2">
                <TextInput
                  placeholder="Phrase (EN)"
                  value={newPhrasalEn}
                  onChangeText={setNewPhrasalEn}
                  className="border border-gray-200 p-2 rounded-lg text-sm"
                />
                <TextInput
                  placeholder="Meaning (VI)"
                  value={newPhrasalVi}
                  onChangeText={setNewPhrasalVi}
                  className="border border-gray-200 p-2 rounded-lg text-sm"
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
