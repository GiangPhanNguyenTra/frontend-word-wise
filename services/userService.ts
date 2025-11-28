import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_CORE_SERVICE_API;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function updateUserInfo(data: {
  username?: string;
  avatar?: string;
}) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/user/update-info`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user info");
  }

  return await response.json();
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
}

export async function changePassword(data: ChangePasswordRequest) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/user/change-password`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to change password");
  }

  return result;
}
