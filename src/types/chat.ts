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
  sender: boolean; // true if current user is sender
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
