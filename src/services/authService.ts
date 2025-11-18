import { LoginSchema } from "@/lib/validators/auth";
import { RegisterSchema } from "@/lib/validators/auth";
import * as z from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

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

export async function loginUser(values: z.infer<typeof LoginSchema>) {
  if (!BASE_URL)
    throw new Error(
      "CORE_SERVICE_API is not defined in environment variables."
    );

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Login failed with status ${response.status}`
    );
  }

  const data: ApiResponse<AuthResponseData> = await response.json();
  return data;
}

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  if (!BASE_URL)
    throw new Error(
      "CORE_SERVICE_API is not defined in environment variables."
    );

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
      errorData.message || `Registration failed with status ${response.status}`
    );
  }

  const data: ApiResponse<AuthResponseData> = await response.json();
  return data;
}

export async function requestForgotPasswordCode(email: string) {
  if (!BASE_URL)
    throw new Error(
      "CORE_SERVICE_API is not defined in environment variables."
    );

  const response = await fetch(`${BASE_URL}/auth/forgot-password/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to request code with status ${response.status}`
    );
  }

  const data: ApiResponse<string> = await response.json();
  return data;
}

export async function resetPassword(values: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}) {
  if (!BASE_URL)
    throw new Error(
      "CORE_SERVICE_API is not defined in environment variables."
    );

  const response = await fetch(`${BASE_URL}/auth/forgot-password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Password reset failed with status ${response.status}`
    );
  }

  const data: ApiResponse<null> = await response.json();
  return data;
}
