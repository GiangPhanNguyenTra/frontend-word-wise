import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { name, status, avatar } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! How are you?", sender: "other" },
    { id: 2, text: "I'm good, thanks! How about you?", sender: "me" },
  ]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // 🔹 Auto scroll khi thêm tin nhắn mới
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 🔹 Auto scroll khi bàn phím mở
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 🔹 Gửi tin nhắn
  const handleSend = () => {
    if (!text.trim()) return;
    const newMessage: Message = { id: Date.now(), text, sender: "me" };
    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // Giả lập phản hồi bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Got it! 😊", sender: "other" },
      ]);
    }, 800);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-2 ${
        item.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`px-4 py-3 rounded-2xl ${
          item.sender === "me"
            ? "bg-blue-500 rounded-tr-none"
            : "bg-gray-200 rounded-tl-none"
        }`}
      >
        <Text className={item.sender === "me" ? "text-white" : "text-black"}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 mt-8 border-b border-gray-200 bg-white">
          <View className="flex-1 flex-row ml-8">
            <Image
              source={{
                uri:
                  typeof avatar === "string" && avatar.trim() !== ""
                    ? avatar
                    : "https://i.pravatar.cc/100?u=default",
              }}
              className="w-10 h-10 rounded-full mr-3"
            />

            <View className="flex-col">
              <Text className="font-[Montserrat-Bold] text-[16px] text-[#111]">
                {name}
              </Text>
              <Text
                className={`text-sm font-[Montserrat-Medium] ${
                  status === "online" ? "text-[#10B981]" : "text-[#9CA3AF]"
                }`}
              >
                {status}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-[#E9EFFD] rounded-full items-center justify-center mr-3"
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tin nhắn */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input */}
        <View className="border-t border-gray-200 bg-white flex-row items-end px-3 py-3 pb-5">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Nhập tin nhắn..."
            multiline
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base"
            style={{ maxHeight: 120 }}
            onFocus={() =>
              setTimeout(
                () => flatListRef.current?.scrollToEnd({ animated: true }),
                150
              )
            }
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            onPress={() => {
              handleSend();
              Keyboard.dismiss();
            }}
            className="ml-2 bg-blue-500 rounded-full p-3"
            style={{ opacity: text.trim() ? 1 : 0.4 }}
            disabled={!text.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}