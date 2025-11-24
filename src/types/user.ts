export type FriendshipStatus =
  | "NOT_FRIENDS"
  | "FRIENDS"
  | "REQUEST_SENT"
  | "REQUEST_RECEIVED";

export interface SearchUserResult {
  userId: number;
  username: string;
  avatarUrl: string | null;
  friendshipStatus: FriendshipStatus;
}

export interface FriendRequest {
  friendshipId: number;
  requesterId: number;
  requesterUsername: string;
  requesterAvatarUrl: string | null;
  requestDate: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
}
