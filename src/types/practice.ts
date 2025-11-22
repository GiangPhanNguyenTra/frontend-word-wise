import { ApiWord } from "./collection";

export interface StreakInfo {
  currentStreakDays: number;
  longestStreakDays: number;
  lastStudyDate: string;
}

export interface PracticeSessionData {
  sessionId: string;
  userId: number;
  date: string;
  streak_info: StreakInfo;
  list_words: ApiWord[];
  collection: {
    collectionId: number;
    collectionName: string;
    totalWords: number;
  };
}

export interface WordUpdateDTO {
  wordId: number;
  previousScore: number;
  newScore: number;
  nextReviewDate: string;
  needsReview: boolean;
}

export interface SummaryDTO {
  totalWords: number;
  correct: number;
  incorrect: number;
  reviewTomorrow: number;
}

export interface PracticeCompletionResponse {
  message: string;
  updated_streak: StreakInfo | null;
  words_update: WordUpdateDTO[];
  summary: SummaryDTO;
}
