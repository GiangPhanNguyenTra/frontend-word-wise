import { ChatTopic, ConversationDetail, ChatMessage } from "@/types/chat";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getChatTopics(): Promise<ChatTopic[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/chat/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch chat topics");
  const data = await response.json();
  return data.data;
}

export async function getConversationDetail(
  conversationId: number
): Promise<ConversationDetail> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/chat/conversations/${conversationId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Failed to fetch conversation detail");
  const data = await response.json();
  return data.data;
}

export async function sendMessageApi(
  receiverId: number,
  content: string
): Promise<ChatMessage> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/chat/send/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ receiverId, content }),
  });

  if (!response.ok) throw new Error("Failed to send message");
  const data = await response.json();
  return data.data;
}
