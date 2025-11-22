import {
  PracticeSessionData,
  PracticeCompletionResponse,
} from "@/types/practice";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;
export async function getPracticeSession(
  collectionName?: string
): Promise<PracticeSessionData> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const url = collectionName
    ? `${BASE_URL}/practice/today?collectionName=${encodeURIComponent(
        collectionName
      )}`
    : `${BASE_URL}/practice/today`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create practice session");
  }

  const data = await response.json();
  return data.data;
}

export async function completePracticeSession(payload: {
  sessionId: string;
  results: { wordId: number; learn_count: number }[];
}): Promise<PracticeCompletionResponse> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/practice/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit practice results");
  }

  const data = await response.json();
  return data.data;
}

export async function completeCustomPracticeSession(
  results: { wordId: number; learn_count: number }[]
): Promise<PracticeCompletionResponse> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/practice/complete-custom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(results),
  });

  if (!response.ok) {
    throw new Error("Failed to submit custom practice results");
  }

  const data = await response.json();
  return data.data;
}
