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

export interface ChatTopic {
  conversationId: number;
  otherUserId: number;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
}

export interface ChatMessage {
  messageId: number;
  senderId: number;
  content: string;
  timestamp: string;
  sender: boolean;
}

export interface ConversationDetail {
  conversationId: number;
  participants: {
    userId: number;
    username: string;
    avatarUrl: string | null;
  }[];
  messages: ChatMessage[];
}

export interface Friend {
  userId: number;
  username: string;
  avatarUrl: string | null;
}

export interface PronunciationExample {
  real_transcript: string[];
  ipa_transcript: string;
  transcript_translation?: string;
}

export interface PronunciationResult {
  real_transcript: string;
  ipa_transcript: string;
  pronunciation_accuracy: string; // "91"
  real_transcripts: string;
  matched_transcripts: string;
  real_transcripts_ipa: string;
  matched_transcripts_ipa: string;
  pair_accuracy_category: string; // "0 0 2 0" (0: good, 1: ok, 2: bad)
  start_time: string;
  end_time: string;
  is_letter_correct_all_words: string; // "11111 00 11"
}

export interface SavePronunciationRequest {
  session_summary: {
    totalSentences: number;
    completed: number;
    avgScore: number;
  };
  results: {
    sentenceId: string;
    userAudioUrl: string;
    score: number;
    feedback: {
      overall: string;
      problemSounds: string[];
      missedWords: string[];
    };
  }[];
}
