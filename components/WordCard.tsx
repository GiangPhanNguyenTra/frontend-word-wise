import { ApiWord } from "@/types";
import { Audio } from "expo-av";
import { PenLine, Trash2, Volume2 } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WordCardProps {
  wordData: ApiWord;
  onEdit: (word: ApiWord) => void;
  onDelete: (wordId: number) => void;
}

export default function WordCard({
  wordData,
  onEdit,
  onDelete,
}: WordCardProps) {
  const playAudio = async (url: string) => {
    if (url) {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
    }
  };

  const synonymsList = wordData.synonyms
    ? wordData.synonyms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <View className="bg-white rounded-[20px] p-5 mb-4 shadow-sm border border-gray-100">
      {/* Header: Word & Type & Actions */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <View className="flex-row items-baseline gap-2 flex-wrap">
            <Text className="text-2xl font-[Montserrat-Bold] text-[#1F2937]">
              {wordData.wordText}
            </Text>
            <Text className="text-sm font-[Montserrat-Italic] text-gray-500">
              ({wordData.partOfSpeech})
            </Text>
          </View>

          {/* Phonetics */}
          <View className="flex-row flex-wrap gap-3 mt-2">
            {wordData.phonetics?.uk?.text && (
              <TouchableOpacity
                onPress={() => playAudio(wordData.phonetics.uk.audio)}
                className="flex-row items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"
              >
                <Volume2 size={14} color="#4B5563" />
                <Text className="text-xs font-[Montserrat-Medium] text-gray-600">
                  UK {wordData.phonetics.uk.text}
                </Text>
              </TouchableOpacity>
            )}
            {wordData.phonetics?.us?.text && (
              <TouchableOpacity
                onPress={() => playAudio(wordData.phonetics.us.audio)}
                className="flex-row items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"
              >
                <Volume2 size={14} color="#4B5563" />
                <Text className="text-xs font-[Montserrat-Medium] text-gray-600">
                  US {wordData.phonetics.us.text}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-1">
          <TouchableOpacity onPress={() => onEdit(wordData)} className="p-2">
            <PenLine size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(wordData.wordId)}
            className="p-2"
          >
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[1px] bg-gray-100 my-2" />

      {/* Content */}
      <View className="gap-3">
        {/* Vietnamese Meaning */}
        <View>
          <Text className="text-xs font-[Montserrat-Bold] text-gray-400 uppercase mb-1">
            Meaning
          </Text>
          <Text className="text-lg font-[Montserrat-SemiBold] text-[#1F2937]">
            {wordData.wordVn}
          </Text>
        </View>

        {/* Definition */}
        {(wordData.definitionEn || wordData.definitionVi) && (
          <View>
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 uppercase mb-1">
              Definition
            </Text>
            {wordData.definitionEn ? (
              <Text className="text-sm font-[Montserrat-Medium] text-gray-700 mb-1">
                {wordData.definitionEn}
              </Text>
            ) : null}
            {wordData.definitionVi ? (
              <Text className="text-sm font-[Montserrat-Italic] text-gray-500">
                {wordData.definitionVi}
              </Text>
            ) : null}
          </View>
        )}

        {/* Example */}
        {wordData.examples && wordData.examples.length > 0 && (
          <View className="bg-gray-50 p-3 rounded-lg">
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 uppercase mb-1">
              Example
            </Text>
            <Text className="text-sm font-[Montserrat-Medium] text-gray-700 italic">
              &quot;{wordData.examples[0].en}&quot;
            </Text>
            <Text className="text-xs font-[Montserrat-Regular] text-gray-500 mt-1">
              {wordData.examples[0].vi}
            </Text>
          </View>
        )}

        {/* Synonyms */}
        {synonymsList.length > 0 && (
          <View>
            <Text className="text-xs font-[Montserrat-Bold] text-gray-400 uppercase mb-2">
              Synonyms
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {synonymsList.map((syn, idx) => (
                <View key={idx} className="bg-[#EAB308] px-3 py-1 rounded-full">
                  <Text className="text-xs font-[Montserrat-Bold] text-black">
                    {syn}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Collocations */}
        {wordData.idiomsCollocations &&
          wordData.idiomsCollocations.length > 0 && (
            <View>
              <Text className="text-xs font-[Montserrat-Bold] text-gray-400 uppercase mb-1">
                Collocations
              </Text>
              {wordData.idiomsCollocations.map((item, idx) => (
                <Text key={idx} className="text-sm text-gray-700 mb-1">
                  • <Text className="font-bold">{item.en}</Text>{" "}
                  <Text className="italic text-gray-500 text-xs">
                    - {item.vi}
                  </Text>
                </Text>
              ))}
            </View>
          )}
      </View>
    </View>
  );
}
