import { HomeStatistics } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getHomeStatistics(): Promise<HomeStatistics> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/statistics/home`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  const data = await response.json();
  return data.data;
}
