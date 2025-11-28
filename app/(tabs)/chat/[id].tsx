import { getConversationDetail, sendMessageApi } from "@/services/chatService";
import { ChatMessage } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import "text-encoding";

const WS_URL = process.env.EXPO_PUBLIC_CORE_SERVICE_API
  ? process.env.EXPO_PUBLIC_CORE_SERVICE_API.replace("http", "ws").replace(
      "/api/v1",
      "/ws"
    )
  : "ws://10.45.86.87:8080/ws";

export default function ChatDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id, name, avatar, otherUserId, type } = useLocalSearchParams<{
    id: string;
    name: string;
    avatar: string;
    otherUserId: string;
    type: "new" | "existing";
  }>();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5E5",
          height: 120,
          paddingTop: 10,
          paddingBottom: 20,
          borderRadius: 30,
        },
      });
    };
  }, [navigation]);

  const isNewChat = type === "new";
  const conversationId = isNewChat ? null : Number(id);
  const recipientId = Number(otherUserId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const stompClient = useRef<Client | null>(null);

  // Load Messages
  useEffect(() => {
    const loadMessages = async () => {
      if (isNewChat) {
        setIsLoading(false);
        return;
      }
      try {
        const detail = await getConversationDetail(conversationId!);
        setMessages(detail.messages);
      } catch (error) {
        console.error("Load Chat Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [conversationId]);

  // WebSocket
  useEffect(() => {
    if (isNewChat) return;
    const connectWebSocket = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const client = new Client({
        brokerURL: WS_URL,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
      });

      client.onConnect = () => {
        client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const body = JSON.parse(message.body);
          const newMessage: ChatMessage = {
            messageId: body.messageId || Date.now(),
            senderId: body.senderId,
            content: body.content,
            timestamp: body.timestamp || new Date().toISOString(),
            sender: body.senderId !== recipientId,
          };
          setMessages((prev) => {
            if (prev.some((m) => m.messageId === newMessage.messageId))
              return prev;
            return [...prev, newMessage];
          });
        });
      };
      client.activate();
      stompClient.current = client;
    };
    connectWebSocket();
    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [conversationId]);

  // Auto Scroll
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages, isLoading]);

  // Send Message
  const handleSend = async () => {
    if (!text.trim()) return;
    const contentToSend = text.trim();
    setText("");

    try {
      const sentMsg = await sendMessageApi(recipientId, contentToSend);
      if (isNewChat) {
        router.replace("/(tabs)/chat");
      } else {
        setMessages((prev) => [...prev, sentMsg]);
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed", text2: "Message not sent" });
      setText(contentToSend);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      className={`flex-row mb-3 ${item.sender ? "justify-end" : "justify-start"}`}
    >
      {!item.sender && (
        <Image
          source={{ uri: avatar || "https://i.pravatar.cc/150" }}
          className="w-8 h-8 rounded-full mr-2 self-end mb-1"
        />
      )}
      <View
        className={`px-4 py-3 rounded-2xl max-w-[75%] ${item.sender ? "bg-[#2563EB] rounded-br-sm" : "bg-white border border-gray-100 rounded-bl-sm shadow-sm"}`}
      >
        <Text
          className={`text-[15px] font-[Montserrat-Medium] ${item.sender ? "text-white" : "text-gray-800"}`}
        >
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F6F6F6]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 mt-8 border-b border-gray-200 bg-white shadow-sm z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center">
          <Image
            source={{
              uri:
                avatar && avatar.trim() !== ""
                  ? avatar
                  : "https://i.pravatar.cc/150?img=12",
            }}
            className="w-10 h-10 rounded-full mr-3 bg-gray-200"
          />
          <View className="flex-col">
            <Text className="font-[Montserrat-Bold] text-[16px] text-[#111]">
              {name}
            </Text>
            <Text className="text-xs font-[Montserrat-Medium] text-green-600">
              Online
            </Text>
          </View>
        </View>
      </View>

      {/* Thay KeyboardAwareScrollView bằng KeyboardAvoidingView chuẩn */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.messageId.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: false })
              }
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: false })
              }
            />
          )}
        </View>

        {/* Input Bar */}
        <View className="border-t border-gray-200 bg-white flex-row items-center px-4 py-3 pb-4">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            multiline
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-base font-[Montserrat-Medium] max-h-[100px]"
            returnKeyType="default"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            className={`ml-3 w-12 h-12 rounded-full items-center justify-center ${text.trim() ? "bg-[#2563EB]" : "bg-gray-300"}`}
          >
            <Send size={20} color="white" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
