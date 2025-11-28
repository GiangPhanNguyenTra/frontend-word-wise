import { getConversationDetail, sendMessageApi } from "@/services/chatService";
import { ChatMessage } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

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

  const isNewChat = type === "new";
  const conversationId = isNewChat ? null : Number(id);
  const recipientId = Number(otherUserId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  const flatListRef = useRef<FlatList>(null);
  const stompClient = useRef<Client | null>(null);

  // Hide Tab Bar
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
  }, []);

  // Load old messages
  useEffect(() => {
    const loadMessages = async () => {
      if (isNewChat) return;

      try {
        const detail = await getConversationDetail(conversationId!);
        setMessages(detail.messages);
      } catch (err) {
        console.log(err);
      }
    };
    loadMessages();
  }, [conversationId]);

  // Websocket
  useEffect(() => {
    if (isNewChat) return;

    const connectWS = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      const client = new Client({
        brokerURL: WS_URL,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
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

          setMessages((prev) => [...prev, newMessage]);
        });
      };

      client.activate();
      stompClient.current = client;
    };

    connectWS();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [conversationId]);

  // Auto scroll on message update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setText("");

    Keyboard.dismiss(); // 👉 FIX: đóng keyboard sau khi gửi

    try {
      const sent = await sendMessageApi(recipientId, messageText);

      if (isNewChat) {
        router.replace("/(tabs)/chat");
      } else {
        setMessages((prev) => [...prev, sent]);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error.message || "Failed to send",
      });
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 14,
        justifyContent: item.sender ? "flex-end" : "flex-start",
      }}
    >
      {!item.sender && (
        <Image
          source={{ uri: avatar || "https://i.pravatar.cc/150" }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            marginRight: 8,
            alignSelf: "flex-end",
          }}
        />
      )}

      <View
        style={{
          maxWidth: "75%",
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: item.sender ? "#2563EB" : "#fff",
          borderRadius: 18,
          borderBottomLeftRadius: item.sender ? 18 : 6,
          borderBottomRightRadius: item.sender ? 6 : 18,
          borderWidth: item.sender ? 0 : 1,
          borderColor: "#e5e5e5",
        }}
      >
        <Text style={{ color: item.sender ? "#fff" : "#000", fontSize: 15 }}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginTop: 20,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#f3f4f6",
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>

        <Image
          source={{
            uri: avatar || "https://i.pravatar.cc/150?img=12",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            marginRight: 10,
            backgroundColor: "#eee",
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
          {name}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.messageId.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40, // space for scroll below last message
        }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Sticky Input Bar */}
      <KeyboardStickyView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "#ddd",
            backgroundColor: "white",
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            multiline
            style={{
              flex: 1,
              backgroundColor: "#f3f4f6",
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 16,
              maxHeight: 120,
            }}
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            style={{
              marginLeft: 12,
              width: 48,
              height: 48,
              borderRadius: 999,
              backgroundColor: text.trim() ? "#2563EB" : "#9ca3af",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Send size={20} color="#fff" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
}
