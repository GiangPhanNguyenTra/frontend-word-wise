import { Collection } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getUserCollections(): Promise<Collection[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  const data = await response.json();
  return data.data;
}
