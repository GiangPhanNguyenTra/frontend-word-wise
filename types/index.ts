export interface Phonetic {
  text: string;
  audio: string;
}

export interface Example {
  en: string;
  vi: string;
}

export interface IdiomCollocation {
  en: string;
  vi: string;
}

export interface PhrasalVerb {
  en: string;
  vi: string;
}

export interface ApiWord {
  wordId: number;
  wordText: string;
  wordVn: string;
  partOfSpeech: string;
  definitionEn: string;
  definitionVi: string;
  sourceUrl: string;
  phonetics: {
    uk: Phonetic;
    us: Phonetic;
  };
  examples: Example[];
  idiomsCollocations: IdiomCollocation[];
  phrasalVerbs: PhrasalVerb[] | null;
  synonyms: string;
}

export interface Collection {
  id: number;
  name: string;
  wordCount: number;
  totalWords?: number;
  lastStudiedAt?: string;
  createdAt?: string;
}

export interface CollectionDetail extends Collection {
  words: ApiWord[];
}

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

export interface PracticeCompletionResponse {
  message: string;
  updated_streak: StreakInfo | null;
  summary: {
    totalWords: number;
    correct: number;
    incorrect: number;
    reviewTomorrow: number;
  };
}
