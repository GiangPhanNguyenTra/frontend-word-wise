import { Checkbox } from "expo-checkbox";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LearnSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedModes: string[]) => void;
}

const LEARNING_MODES = [
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Flip cards to learn meaning & definition.",
  },
  {
    id: "translation",
    label: "Translation",
    description: "Type the English word given Vietnamese meaning.",
  },
  {
    id: "definition",
    label: "Definition Choice",
    description: "Choose word from definition.",
  },
  {
    id: "fill",
    label: "Fill in the Blank",
    description: "Complete sentence with missing word.",
  },
  {
    id: "match",
    label: "Match Words",
    description: "Connect words with their meanings.",
  },
];

export default function LearnSelectionModal({
  visible,
  onClose,
  onConfirm,
}: LearnSelectionModalProps) {
  const [selectedModes, setSelectedModes] = useState<string[]>(["flashcards"]);

  const toggleMode = (id: string) => {
    setSelectedModes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (selectedModes.length > 0) {
      onConfirm(selectedModes);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white w-full max-w-sm rounded-2xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-[Montserrat-Bold] text-[#1F2937]">
              Choose Learning Mode
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 font-[Montserrat-Regular] mb-4">
            Select one or more practice types for this session.
          </Text>

          <View className="gap-4 mb-6">
            {LEARNING_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                className="flex-row items-start gap-3"
                onPress={() => toggleMode(mode.id)}
              >
                <Checkbox
                  value={selectedModes.includes(mode.id)}
                  onValueChange={() => toggleMode(mode.id)}
                  color={
                    selectedModes.includes(mode.id) ? "#2563EB" : undefined
                  }
                />
                <View className="flex-1">
                  <Text className="font-[Montserrat-SemiBold] text-base text-gray-800">
                    {mode.label}
                  </Text>
                  <Text className="text-gray-500 text-xs font-[Montserrat-Regular]">
                    {mode.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleStart}
            disabled={selectedModes.length === 0}
            className={`w-full py-3 rounded-xl items-center ${
              selectedModes.length === 0 ? "bg-gray-300" : "bg-[#2563EB]"
            }`}
          >
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Start Practice
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
