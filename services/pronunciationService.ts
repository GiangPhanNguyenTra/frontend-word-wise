import {
  PronunciationExample,
  PronunciationResult,
  SavePronunciationRequest,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AI_URL =
  process.env.EXPO_PUBLIC_PRONUNCIATION_API_URL ||
  "https://nontransferential-sideways-josette.ngrok-free.dev";
const BASE_URL =
  process.env.EXPO_PUBLIC_CORE_SERVICE_API || "http://10.45.86.87:8080/api/v1";

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getExampleWords(
  count: number = 5
): Promise<PronunciationExample[]> {
  const response = await fetch(`${AI_URL}/getExampleWords/${count}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get example words");
  return await response.json();
}

export async function getExampleSentences(
  count: number = 3
): Promise<PronunciationExample[]> {
  const response = await fetch(`${AI_URL}/getExampleSentences/${count}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get example sentences");
  return await response.json();
}

export async function checkPronunciation(
  text: string,
  base64Audio: string
): Promise<PronunciationResult> {
  const cleanBase64 = base64Audio.replace(/^data:audio\/\w+;base64,/, "");

  const response = await fetch(`${AI_URL}/GetAccuracyFromRecordedAudio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: text,
      base64Audio: cleanBase64,
      language: "en",
    }),
  });

  if (!response.ok) throw new Error("Failed to analyze pronunciation");
  return await response.json();
}

export async function savePronunciationResult(data: SavePronunciationRequest) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/pronunciation/save-result`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to save results");
  return await response.json();
}
