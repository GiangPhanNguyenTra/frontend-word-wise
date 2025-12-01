const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export interface UserSettings {
  study_sessions_per_day: number;
  words_per_session: number;
}

export async function getUserSettings(): Promise<UserSettings> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/settings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { study_sessions_per_day: 1, words_per_session: 5 };
    }
    throw new Error("Failed to fetch settings");
  }

  const data = await response.json();
  return data.data.settings;
}

export async function updateUserSettings(settings: UserSettings) {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error("Failed to update settings");
  }

  const data = await response.json();
  return data.data;
}

export async function getTokenForExtension() {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/auth/extension-token`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get extension token");
  }

  const data = await response.json();
  return data.data.token;
}
