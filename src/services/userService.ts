import { Friend } from "@/types/dashboard";

import {
  SearchUserResult,
  FriendRequest,
  ChangePasswordRequest,
} from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getUserFriends(): Promise<Friend[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/friends`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch friends");
  const data = await response.json();
  return data.data;
}

export async function searchUsers(
  username: string
): Promise<SearchUserResult[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/search?username=${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to search users");
  const data = await response.json();
  return data.data;
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/friends/requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch friend requests");
  const data = await response.json();
  return data.data;
}

export async function sendFriendRequest(receiveId: number) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/user/friends/request/${receiveId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to send friend request");
  return await response.json();
}

export async function acceptFriendRequest(requesterId: number) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/user/friends/accept/${requesterId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to accept friend request");
  return await response.json();
}

export async function rejectFriendRequest(requesterId: number) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/user/friends/reject/${requesterId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to reject friend request");
  return await response.json();
}

export async function unfriendUser(friendId: number) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/friends/${friendId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to unfriend");
  return await response.json();
}

export async function updateUserInfo(data: {
  username?: string;
  avatar?: string;
}) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/update-info`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user info");
  }

  return await response.json();
}

export async function changePassword(data: ChangePasswordRequest) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/user/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to change password");
  }

  return result;
}
