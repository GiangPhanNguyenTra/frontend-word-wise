import { Post } from "@/types/community";
import { SharedNotification } from "@/types/dashboard";
const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getNewsFeed(): Promise<Post[]> {
  if (!BASE_URL) throw new Error("API CORE SERVICE URL is not defined");

  const response = await fetch(`${BASE_URL}/community/news-feed`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news feed");
  }

  const data = await response.json();
  return data.data;
}

export async function getMyPosts(): Promise<Post[]> {
  if (!BASE_URL) throw new Error("API CORE SERVICE URL is not defined");

  const response = await fetch(`${BASE_URL}/posts/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my posts");
  }

  const data = await response.json();
  return data.data;
}

export async function createPost(content: string, collectionName?: string) {
  if (!BASE_URL) throw new Error("API CORE SERVICE URL is not defined");

  const payload: { content: string; collection_name?: string } = {
    content,
  };

  if (collectionName) {
    payload.collection_name = collectionName;
  }

  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  const data = await response.json();
  return data.data;
}

export async function toggleLikePost(postId: number): Promise<Post> {
  if (!BASE_URL) throw new Error("API CORE SERVICE URL is not defined");

  const response = await fetch(`${BASE_URL}/posts/${postId}/toggle-like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }

  const data = await response.json();
  return data.data;
}

export async function getSharedNotifications(): Promise<SharedNotification[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/community/shared-notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shared notifications");
  }

  const data = await response.json();
  return data.data;
}

export async function saveSharedCollection(postId: number) {
  if (!BASE_URL) throw new Error("API CORE SERVICE URL is not defined");

  const response = await fetch(
    `${BASE_URL}/community/save-collection/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save collection");
  }

  const data = await response.json();
  return data;
}
