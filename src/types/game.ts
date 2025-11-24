export interface GameQuestionDefinition {
  word: string;
  definition?: string;
  options: (string | null)[];
}

export interface GameQuestionFillBlank {
  sentence: string;
  options: string[];
  answer: string;
}

export interface GameQuestionWordShooter {
  en: string;
  vi: string;
}

export interface GameData<T> {
  time: number;
  questions: T[];
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatarUrl: string | null;
  score: number;
  accuracy: number;
  time: string;
  badgeColor: string | null;
}

export interface LeaderboardData {
  gameMode: string;
  currentUser: LeaderboardUser;
  top3Players: LeaderboardUser[];
  fullLeaderboard: LeaderboardUser[];
  chartData: {
    labels: string[];
    scores: number[];
  };
}

export interface ChallengeRoom {
  roomId: string;
  inviteCode: string;
  hostId: number;
  gameMode: string;
  status: "WAITING" | "PLAYING" | "FINISHED";
}

export interface RoomParticipant {
  userId: number;
  username: string;
  avatarUrl: string | null;
  score: number;
}
