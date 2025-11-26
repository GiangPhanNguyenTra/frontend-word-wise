import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.45.86.87:8080/api/v1";

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
