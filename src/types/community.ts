export interface Author {
  userId: number;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  role: string | null;
}

export interface CollectionInfo {
  collectionId: number;
  name: string;
  wordCount: number;
  savedByCurrentUser: boolean;
}

export interface Post {
  postId: number;
  content: string;
  author: Author;
  collectionInfo?: CollectionInfo;
  likesCount: number;
  createdAt: string;
  likedByCurrentUser: boolean;
}

export interface Friend {
  userId: number;
  username: string;
  avatarUrl: string | null;
}

export interface SharedNotification {
  id: number;
  message: string;
  createdAt: string;
}
