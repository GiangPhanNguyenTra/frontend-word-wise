import { useEffect, useRef, useState } from "react";
import Heading from "@/components/Heading";
import { useLocalSearchParams } from "expo-router";
import { ArrowUp, Heart, MessageCircle } from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

export default function CommentScreen() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(44);
  const MAX_INPUT_HEIGHT = 100;

  const presetRepliesMap: Record<string, string[]> = {
    vui: ["That's awesome!", "Happy for you!", "Keep smiling!"],
    buồn: ["You're not alone", "Stay strong", "Better days will come"],
    default: ["Thank you for sharing", "I understand", "Sending love ❤️"],
  };

  const getPresetReplies = (content: string) => {
    if (content.includes("vui")) return presetRepliesMap["vui"];
    if (content.includes("buồn")) return presetRepliesMap["buồn"];
    return presetRepliesMap["default"];
  };

  const [presetReplies, setPresetReplies] = useState<string[]>([]);
  useEffect(() => {
    setPresetReplies(getPresetReplies("Tôi vui lắm"));
  }, []);

  const presetAreaHeight = presetReplies.length > 0 ? 48 : 8;
  const safeInputHeight = Math.min(inputHeight, MAX_INPUT_HEIGHT);
  const FOOTER_BASE = presetAreaHeight + safeInputHeight + 20;

  const { focusInput } = useLocalSearchParams<{ focusInput?: string }>();
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (focusInput === "true" && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus(); // auto focus khi vào màn
      }, 300);
    }
  }, [focusInput]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-[#FAF9FF]">
        <Heading title="Comments" />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            // paddingBottom: FOOTER_BASE + 8,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Post */}
          <View className="mt-2">
            <View className="p-4 mb-2">
              <View>
                <Text className="font-[Poppins-SemiBold] text-base">
                  user01234567
                </Text>
                <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-sm mt-1">
                  12:20:20 26/4/2025
                </Text>
              </View>

              <Text className="mt-3 font-[Poppins-Regular] text-base">
                Tôi vui lắm
              </Text>

              <View className="flex-row mt-3 gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Heart width={18} height={18} color="black" />
                  <Text className="font-[Poppins-Regular] text-sm">
                    10
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <MessageCircle width={18} height={18} color="black" />
                  <Text className="font-[Poppins-Regular] text-sm">
                    10
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comments list */}
          <View className="mt-4 mb-4">
            <Text className="font-[Poppins-Bold] text-lg mb-2">
              All comments
            </Text>

            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                className="mt-3 ml-2 p-3 rounded-xl border border-[#EEEEEE] bg-[#FFFFFF]"
              >
                <Text className="font-[Poppins-SemiBold] text-base">
                  user01234567
                </Text>
                <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-sm mt-1">
                  12:20:20 26/4/2025
                </Text>
                <Text className="mt-2.5 font-[Poppins-Regular] text-base">
                  Tôi vui lắm
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="bg-[#FAF9FF] border-t border-[#EEEEEE]">
          {/* Preset replies */}
          {presetReplies.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pb-2 pl-2"
              contentContainerStyle={{ alignItems: "center" }}
            >
              {presetReplies.map((reply, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setComment(reply)}
                  className="bg-[#FFFFFF] h-10 px-4 rounded-full justify-center mr-2"
                >
                  <Text className="font-[Poppins-Regular] text-base">
                    {reply}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Input row */}
          <View className="flex-row items-end px-4 mb-2">
            <TextInput
              ref={inputRef}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment"
              placeholderTextColor="#7B7B7B"
              multiline
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                setInputHeight(Math.max(40, Math.min(h, MAX_INPUT_HEIGHT)));
              }}
              style={{
                height: Math.max(44, safeInputHeight),
                fontFamily: "Poppins-Regular",
              }}
              className="flex-1 bg-[#FFFFFF] rounded-2xl px-3 py-2 text-base"
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
              }}
            />
            <TouchableOpacity
              disabled={!comment.trim()}
              onPress={() => {
                console.log("Send:", comment);
                setComment("");
                Keyboard.dismiss();
              }}
              className="ml-2"
              style={{ opacity: comment.trim() ? 1 : 0.4 }}
            >
              <View className="w-10 h-10 items-center justify-center bg-[#7f56d9] rounded-full">
                <ArrowUp size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}