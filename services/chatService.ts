import { ChatMessage, ChatTopic, ConversationDetail, Friend } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_CORE_SERVICE_API;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getChatTopics(): Promise<ChatTopic[]> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/chat/topics`, {
    method: "GET",
    headers,
  });

  if (!response.ok) throw new Error("Failed to fetch chat topics");
  const data = await response.json();
  return data.data;
}

export async function getConversationDetail(
  conversationId: number
): Promise<ConversationDetail> {
  const headers = await getHeaders();
  const response = await fetch(
    `${BASE_URL}/chat/conversations/${conversationId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch conversation detail");
  const data = await response.json();
  return data.data;
}

export async function sendMessageApi(
  recipientId: number,
  content: string
): Promise<ChatMessage> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/chat/send`, {
    method: "POST",
    headers,
    body: JSON.stringify({ recipientId, content }),
  });

  if (!response.ok) throw new Error("Failed to send message");
  const data = await response.json();
  return data.data;
}

export async function getUserFriends(): Promise<Friend[]> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/user/friends`, {
    method: "GET",
    headers,
  });

  if (!response.ok) throw new Error("Failed to fetch friends");
  const data = await response.json();
  return data.data;
}
