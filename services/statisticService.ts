import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_CORE_SERVICE_API;

export async function getHomeStatistics() {
  const token = await AsyncStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/statistics/mobile/home`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch statistics");
  }

  return await response.json();
}

export interface CollectionProgressData {
  progress_chart: {
    labels: string[];
    data: { levelName: string; wordCount: number }[];
  };
  last_reviewed_on: string | null;
  totalWords: number;
  averageScore: number;
}

export async function getCollectionProgress(
  collectionName: string
): Promise<CollectionProgressData> {
  const token = await AsyncStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/statistics/mobile/collection-progress?collectionName=${encodeURIComponent(collectionName)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch collection progress");
  }

  const data = await response.json();
  return data.data;
}
