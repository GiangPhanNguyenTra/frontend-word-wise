import { ApiWord, CollectionDetail } from "@/types/collection";
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

export async function getCollectionDetail(
  id: string
): Promise<CollectionDetail> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collection details");
  }

  const data = await response.json();
  return data.data;
}

export async function updateWord(
  wordId: number,
  updateData: any
): Promise<ApiWord> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update word");
  }

  const data = await response.json();
  return data.data;
}

export async function deleteWord(
  collectionId: number,
  wordId: number
): Promise<void> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/collections/${collectionId}/words/${wordId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete word");
  }
}
