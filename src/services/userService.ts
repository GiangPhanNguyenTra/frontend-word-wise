import { Friend } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getUserFriends(): Promise<Friend[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }

  const data = await response.json();
  return data.data;
}
