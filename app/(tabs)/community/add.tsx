import { useState, useRef } from "react";
import { router } from "expo-router";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";

export default function AddScreen() {
  const textInputRef = useRef<TextInput>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postContent, setPostContent] = useState("");

  const handleCancel = () => setShowConfirm(true);

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(tabs)/community");
  };

  const handlePost = () => {
    router.push("/(tabs)/community");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAF9FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="w-full px-4 py-4 mt-4 flex-row items-center justify-between border-b border-gray-200 bg-[#FAF9FF]">
        <TouchableOpacity onPress={handleCancel}>
          <X width={24} height={24} color="black" />
        </TouchableOpacity>

        <Text className="text-lg font-[Poppins-Bold] text-black">
          Write a post
        </Text>

        <TouchableOpacity
          disabled={!postContent}
          className={`${!postContent ? "opacity-40" : ""}`}
          onPress={handlePost}
        >
          <Text className="text-base font-[Poppins-Bold] text-black">Post</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung có thể scroll */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          ref={textInputRef}
          value={postContent}
          onChangeText={setPostContent}
          style={{
            flexGrow: 1,
            minHeight: 300,
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: "black",
            textAlignVertical: "top",
          }}
          placeholder="Share on community...."
          placeholderTextColor="#A2A2A2"
          multiline
        />
      </ScrollView>

      {/* Confirm Modal */}
      <Modal transparent animationType="fade" visible={showConfirm}>
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to discard this post?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-white">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}