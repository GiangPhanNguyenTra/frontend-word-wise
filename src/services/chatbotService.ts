import { ChatResponse } from "@/types/chatbot";

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || "";
}

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  if (!CHATBOT_API_URL) throw new Error("CHATBOT_API_URL is not defined");

  const jwt = getToken();

  const body = {
    user_id: "1",
    session_id: sessionId,
    message: message,
    jwt: jwt,
  };

  const response = await fetch(`${CHATBOT_API_URL}/api/v1/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json();
}
