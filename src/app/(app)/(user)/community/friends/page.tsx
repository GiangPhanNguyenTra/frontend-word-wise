"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Check, X, Search, UserPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getUserFriends,
  getFriendRequests,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
} from "@/services/userService";
import { FriendRequest, SearchUserResult } from "@/types/user";
import { Friend } from "@/types/dashboard";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        getUserFriends(),
        getFriendRequests(),
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      setSearchResults((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, friendshipStatus: "REQUEST_SENT" } : u
        )
      );
      toast.success("Friend request sent");
    } catch (error) {
      toast.error("Failed to send request");
    }
  };

  const handleAcceptRequest = async (requesterId: number) => {
    try {
      await acceptFriendRequest(requesterId);
      toast.success("Friend request accepted");
      fetchData();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requesterId: number) => {
    try {
      await rejectFriendRequest(requesterId);
      setPendingRequests((prev) =>
        prev.filter((req) => req.requesterId !== requesterId)
      );
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const handleUnfriend = async (friendId: number) => {
    try {
      await unfriendUser(friendId);
      setFriends((prev) => prev.filter((f) => f.userId !== friendId));
      toast.success("Unfriended successfully");
    } catch (error) {
      toast.error("Failed to unfriend");
    }
  };

  const renderSearchActionButton = (user: SearchUserResult) => {
    switch (user.friendshipStatus) {
      case "FRIENDS":
        return (
          <Button
            size="sm"
            variant="outline"
            disabled
            className="text-green-600"
          >
            <Check className="w-4 h-4 mr-1" /> Friends
          </Button>
        );
      case "REQUEST_SENT":
        return (
          <Button size="sm" variant="secondary" disabled>
            <Clock className="w-4 h-4 mr-1" /> Sent
          </Button>
        );
      case "REQUEST_RECEIVED":
        return (
          <Button size="sm" variant="secondary" disabled>
            Check Requests
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            className="bg-[#2563EB] text-white"
            onClick={() => handleSendRequest(user.userId)}
          >
            <UserPlus className="w-4 h-4 mr-1" /> Add
          </Button>
        );
    }
  };

  return (
    <div className="lg:p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Friend</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="Enter username to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto mt-4 space-y-4">
              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || "/ava.svg"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.username}</span>
                  </div>
                  {renderSearchActionButton(user)}
                </div>
              ))}
              {searchResults.length === 0 && searchQuery && !isSearching && (
                <p className="text-center text-sm text-gray-500">
                  No users found.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "friends"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          All Friends ({friends.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests ({pendingRequests.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : activeTab === "friends" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <Card
              key={friend.userId}
              className="rounded-2xl shadow-sm border border-gray-200"
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="flex-row inline-flex w-full justify-start gap-4 items-center">
                  <img
                    src={friend.avatarUrl || "/ava.svg"}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full mb-3 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{friend.username}</h3>
                  </div>
                </div>
                <div className="flex gap-2 w-full mt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#2563EB] hover:bg-blue-800 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> Message
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-[#FEF1F1] border-none shadow-none text-[#C30000] hover:bg-[#FBD6D6] hover:text-[#C30000]"
                      >
                        Unfriend
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove{" "}
                          <span className="font-bold text-black">
                            {friend.username}
                          </span>{" "}
                          from your friends list. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleUnfriend(friend.userId)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Unfriend
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
          {friends.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              You have no friends yet. Add some friends to get started!
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingRequests.map((req) => (
            <Card
              key={req.friendshipId}
              className="rounded-2xl shadow-sm border border-gray-200"
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="flex-row inline-flex w-full justify-start gap-4 items-center">
                  <img
                    src={req.requesterAvatarUrl || "/ava.svg"}
                    alt={req.requesterUsername}
                    className="w-12 h-12 rounded-full mb-3 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{req.requesterUsername}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(req.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full mt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#00966D] hover:bg-[#007A58] text-white"
                    onClick={() => handleAcceptRequest(req.requesterId)}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-500 hover:bg-red-50"
                    onClick={() => handleRejectRequest(req.requesterId)}
                  >
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No pending friend requests.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
