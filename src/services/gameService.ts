import { GameData, LeaderboardData, ChallengeRoom } from "@/types/game";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;

export async function getGameQuestions<T>(
  gameMode: string
): Promise<GameData<T>> {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(`${BASE_URL}/game/${gameMode}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch questions");
  const json = await response.json();
  return json.data;
}

export async function getLeaderboard(
  gameMode: string
): Promise<LeaderboardData> {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(
    `${BASE_URL}/game/leaderboard?gameMode=${gameMode}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch leaderboard");
  const json = await response.json();
  return json.data;
}

export async function createChallengeRoom(
  gameMode: string
): Promise<ChallengeRoom> {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(`${BASE_URL}/challenge-rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ gameMode }),
  });
  if (!response.ok) throw new Error("Failed to create room");
  const json = await response.json();
  return json.data;
}

export async function joinChallengeRoom(
  inviteCode: string
): Promise<ChallengeRoom> {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(`${BASE_URL}/challenge-rooms/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ inviteCode }),
  });
  if (!response.ok) throw new Error("Failed to join room");
  const json = await response.json();
  return json.data;
}

export async function inviteFriendToRoom(roomId: string, friendId: number) {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(`${BASE_URL}/challenge-rooms/${roomId}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ friendIds: [friendId] }),
  });
  if (!response.ok) throw new Error("Failed to invite friend");
  return await response.json();
}

export async function startRoomGame(roomId: string) {
  if (!BASE_URL) throw new Error("API URL is not defined");
  const response = await fetch(
    `${BASE_URL}/game/challenge-room/${roomId}/start`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to start game");
  return await response.json();
}
