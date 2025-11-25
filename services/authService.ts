import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.45.86.87:8080/api/v1";

interface AuthResponseData {
  userId: number;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  token: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function loginUser(values: { email: string; password: string }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Login failed: ${response.status}`);
  }

  const data: ApiResponse<AuthResponseData> = await response.json();

  if (data.success && data.data?.token) {
    await AsyncStorage.setItem("accessToken", data.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.data));
  }

  return data;
}

export async function registerUser(values: any) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Registration failed: ${response.status}`
    );
  }

  return await response.json();
}

export async function requestForgotPasswordCode(email: string) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to request code");
  }

  return await response.json();
}

export async function resetPassword(values: any) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Password reset failed");
  }

  return await response.json();
}
