"use client";

import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditCollectionPage() {
  const {
    word,
    type,
    phonetic,
    meaning,
    definition,
    example,
    collectionName,
  } = useLocalSearchParams<{
    word: string;
    type: string;
    phonetic: string;
    meaning: string;
    definition: string;
    example: string;
    collectionName: string;
  }>();

  const [editedWord, setEditedWord] = useState(word);
  const [editedType, setEditedType] = useState(type);
  const [editedPhonetic, setEditedPhonetic] = useState(phonetic);
  const [editedMeaning, setEditedMeaning] = useState(meaning);
  const [editedDefinition, setEditedDefinition] = useState(definition);
  const [editedExample, setEditedExample] = useState(example);

  const typeOptions = [
    { id: "noun", name: "Noun" },
    { id: "verb", name: "Verb" },
    { id: "adj", name: "Adjective" },
    { id: "adv", name: "Adverb" },
  ];

  const [selectedType, setSelectedType] = useState<{ id: string; name: string } | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (type) {
      const found = typeOptions.find(
        (opt) => opt.name.toLowerCase() === type.toLowerCase()
      );
      if (found) setSelectedType(found);
    }
  }, [type]);

  const handleSave = () => {
    console.log("Updated:", {
      word: editedWord,
      type: editedType,
      phonetic: editedPhonetic,
      meaning: editedMeaning,
      definition: editedDefinition,
      example: editedExample,
      collectionName,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      className="flex-1 bg-[#F6F6F6]"
    >
      <Heading title="Edit Card" />
      <ScrollView
        ref={scrollViewRef}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Word */}
        <View className="mb-6">
          <Text className="text-lg mb-1 font-[Montserrat-Bold]">Word</Text>
          <TextInput
            value={editedWord}
            onChangeText={setEditedWord}
            placeholder="Enter word"
            placeholderTextColor="#939393"
            className="w-full h-14 bg-white border border-[#CCCCCC] rounded-[10px] px-4 font-[Montserrat-Regular]"
            onFocus={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        </View>

        {/* Type - TagSelector */}
        <View className="mb-6">
          <Text className="text-lg mb-1 font-[Montserrat-Bold]">Type</Text>
          <TagSelector
            options={typeOptions}
            multiSelect={false}
            defaultSelected={selectedType}
            onChange={(id, selected) => {
              if (!selected) {
                setEditedType("");
                setSelectedType(null);
                return;
              }
              const tag = Array.isArray(selected) ? selected[0] : selected;
              setEditedType(tag.name);
              setSelectedType({ id: String(tag.id), name: tag.name });
            }}
          />
        </View>

        {/* Other fields */}
        {[
          { label: "Vietnamese meaning", value: editedMeaning, setter: setEditedMeaning, offset: 100 },
          { label: "Definition", value: editedDefinition, setter: setEditedDefinition, offset: 200 },
          { label: "Example", value: editedExample, setter: setEditedExample, offset: 300 },
        ].map((field, i) => (
          <View key={i} className="mb-6">
            <Text className="text-lg mb-1 font-[Montserrat-Bold]">{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.setter}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#939393"
              className="w-full h-14 bg-white border border-[#CCCCCC] rounded-[10px] px-4 font-[Montserrat-Regular]"
              selection={{ start: 0, end: 0 }}
              onFocus={() => {
                scrollViewRef.current?.scrollTo({ y: field.offset, animated: true });
              }}
            />
          </View>
        ))}

        {/* Save button */}
        <TouchableOpacity
          className="w-full h-16 rounded-full bg-[#2563EB] items-center justify-center mt-6"
          onPress={handleSave}
        >
          <Text className="text-white font-[Montserrat-Bold] text-lg">
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}