"use client";

import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { name, status, avatar } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () =>
        navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How are you doing?", sender: "other" },
    { id: 2, text: "I’m great! Just practicing my English 😊", sender: "me" },
    { id: 3, text: "That’s awesome! Keep it up!", sender: "other" },
  ]);

  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Got it! 😊",
        sender: "other",
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 mt-8 border-b border-gray-200 bg-white">
          <View className="flex-1 flex-row ml-8">
            <Image
              source={{
                uri: typeof avatar === "string" && avatar.trim() !== "" 
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

        {/* Chat area */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 flex-row ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "other" && (
                <Image
                  source={{
                    uri: typeof avatar === "string" && avatar.trim() !== "" 
                      ? avatar 
                      : "https://i.pravatar.cc/100?u=default",
                  }}
                  className="w-8 h-8 rounded-full mr-2 mt-auto"
                />
              )}

              <View
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.sender === "me"
                    ? "bg-[#2563EB] rounded-tr-none"
                    : "bg-[#F3F4F6] rounded-tl-none"
                }`}
              >
                <Text
                  className={`font-[Montserrat-Medium] ${
                    msg.sender === "me" ? "text-white" : "text-[#111]"
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input area */}
        <View className="bg-white px-4 py-2 pb-10 flex-row items-end border-t border-gray-200">
          <TextInput
            ref={inputRef}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#7B7B7B"
            multiline
            style={{
              flex: 1,
              backgroundColor: "#F6F6F6",
              borderRadius: 30,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 16,
              maxHeight: 100,
            }}
            textAlignVertical="top"
            onFocus={() =>
              setTimeout(
                () => scrollRef.current?.scrollToEnd({ animated: true }),
                100
              )
            }
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            disabled={!message.trim()}
            onPress={() => {
              handleSend();
              Keyboard.dismiss();
            }}
            className="ml-2"
            style={{ opacity: message.trim() ? 1 : 0.4 }}
          >
            <View className="w-10 h-10 rounded-full bg-[#2563EB] items-center justify-center">
              <Send size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}