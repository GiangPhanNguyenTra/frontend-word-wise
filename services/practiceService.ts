import { PracticeCompletionResponse, PracticeSessionData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.45.86.87:8080/api/v1";

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getPracticeSession(
  collectionName?: string
): Promise<PracticeSessionData> {
  const headers = await getHeaders();
  const url = collectionName
    ? `${BASE_URL}/practice/today?collectionName=${encodeURIComponent(collectionName)}`
    : `${BASE_URL}/practice/today`;

  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create practice session");
  }

  const data = await response.json();
  const sessionData = data.data;

  if (sessionData && sessionData.list_words) {
    sessionData.list_words = sessionData.list_words.map((item: any) => ({
      ...item,
      wordText: item.wordText || item.word,
    }));
  }
  return sessionData as PracticeSessionData;
}

export async function completePracticeSession(payload: {
  sessionId: string;
  results: { wordId: number; learn_count: number }[];
}): Promise<PracticeCompletionResponse> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/practice/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to submit results");
  const data = await response.json();
  return data.data;
}

export async function completeCustomPracticeSession(
  results: { wordId: number; learn_count: number }[]
): Promise<PracticeCompletionResponse> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/practice/complete-custom`, {
    method: "POST",
    headers,
    body: JSON.stringify(results),
  });
  if (!response.ok) throw new Error("Failed to submit custom results");
  const data = await response.json();
  return data.data;
}
