import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

type Option = { id: string; label: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  options: Option[];
};

export default function LearnSelectionModal({
  visible,
  onClose,
  onConfirm,
  options,
}: Props) {
  const [selected, setSelected] = useState<string[]>(["All"]);

  const toggleSelect = (id: string) => {
    console.log("Toggled:", id);
    if (id === "All") {
      setSelected(["All"]);
      return;
    }
    const exists = selected.includes(id);
    const updated = exists
      ? selected.filter((x) => x !== id)
      : [...selected.filter((x) => x !== "All"), id];
    setSelected(updated);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-5">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute top-0 left-0 right-0 bottom-0" />
        </TouchableWithoutFeedback>
        {/* Modal container */}
        <View className="w-full bg-white rounded-2xl p-5">
          <Text className="text-lg font-[Montserrat-Bold] text-left mb-3">
            Select Words to Learn
          </Text>

          {/* Options list */}
          <ScrollView className="max-h-[300px]" showsVerticalScrollIndicator={false}>
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggleSelect(opt.id)}
                  className="flex-row items-center py-1.5"
                >
                  <View
                    className={`w-5 h-5 mr-3 rounded ${
                      isSelected ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                  <Text className="text-base font-[Montserrat-Medium] text-[#333]">
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Footer buttons */}
          <View className="flex-row justify-end mt-4">
            {/* <TouchableOpacity
              onPress={onClose}
              className="flex-1 items-center py-3 mr-2 border border-gray-300 rounded-lg"
            >
              <Text className="font-[Montserrat-Bold] text-[#333]">Cancel</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => onConfirm(selected)}
              className="w-[50px] items-center py-3 ml-2 bg-[#EBAD25] rounded-lg"
            >
              <Text className="text-white">Learn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}