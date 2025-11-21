export interface HomeStatistics {
  total_words: number;
  total_collections: number;
  today_words: number;
  learning_streak: number;
}

export interface Collection {
  id: number;
  name: string;
  wordCount: number;
  lastStudied: string;
}

export interface Friend {
  userId: number;
  username: string;
  avatarUrl: string | null;
}

export interface SharedNotification {
  postId: number;
  content: string;
  author: {
    userId: number;
    username: string;
    avatarUrl: string | null;
  };
  collectionInfo: {
    collectionId: number;
    name: string;
    wordCount: number;
  };
  createdAt: string;
}
