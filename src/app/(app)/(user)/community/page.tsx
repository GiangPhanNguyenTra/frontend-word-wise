"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Heart,
  SquareCheck,
  Brush,
  BowArrow,
  Loader2,
  Paperclip,
  Send,
  X,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNewsFeed,
  createPost,
  toggleLikePost,
  saveSharedCollection,
} from "@/services/communityService";
import { getUserFriends } from "@/services/userService";
import { getUserCollections } from "@/services/collectionService";
import { Post, Friend } from "@/types/community";
import { Collection } from "@/types/dashboard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savingPostIds, setSavingPostIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, friendsData, collectionsData] = await Promise.all([
          getNewsFeed(),
          getUserFriends(),
          getUserCollections(),
        ]);
        setPosts(postsData);
        setFriends(friendsData);
        setUserCollections(collectionsData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load community data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsPosting(true);
    try {
      const newPost = await createPost(
        newPostContent,
        selectedCollection || undefined
      );
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setSelectedCollection(null);
      toast.success("Post created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (postId: number) => {
    try {
      const updatedPost = await toggleLikePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.postId === postId ? updatedPost : p))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle like");
    }
  };

  const handleSelectCollection = (name: string) => {
    setSelectedCollection(name);
    setIsDialogOpen(false);
  };

  const handleSaveCollection = async (postId: number) => {
    setSavingPostIds((prev) => [...prev, postId]);
    try {
      await saveSharedCollection(postId);
      toast.success("Collection saved successfully");

      setPosts((prev) =>
        prev.map((p) => {
          if (p.postId === postId && p.collectionInfo) {
            return {
              ...p,
              collectionInfo: {
                ...p.collectionInfo,
                savedByCurrentUser: true,
              },
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to save collection");
    } finally {
      setSavingPostIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 sm:px-6 lg:px-4 py-4">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <Card className="p-4 mb-6 border-none bg-white shadow-sm">
          <div className="flex items-start gap-3">
            <img
              src={
                user?.avatar ||
                "https://api.dicebear.com/6.x/bottts/png?seed=John"
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <Input
                placeholder="Share your collection or your new word..."
                className="w-full !border-none shadow-none rounded-full bg-[#F9FAFB] text-sm mb-2 focus-visible:ring-0"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreatePost();
                  }
                }}
              />
              {selectedCollection && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs w-fit mb-2">
                  <span className="font-medium">
                    Attached: {selectedCollection}
                  </span>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center px-1">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a collection to share</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto mt-2">
                      {userCollections.map((col) => (
                        <Button
                          key={col.id}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleSelectCollection(col.name)}
                        >
                          {col.name} ({col.wordCount} words)
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  onClick={handleCreatePost}
                  disabled={isPosting || !newPostContent.trim()}
                  className="bg-[#3675FF] hover:bg-[#2563EB] text-white rounded-full px-4"
                >
                  {isPosting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1">
                      Post <Send className="h-3 w-3" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {posts.map((post) => {
          const isAuthor = user?.userId === post.author.userId;
          const isSaving = savingPostIds.includes(post.postId);

          return (
            <Card key={post.postId} className="p-4 mb-4 border-none shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.author.avatarUrl || "/ava.svg"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.collectionInfo && (
                <div className="w-full flex justify-between mt-2 items-center bg-[#EEF2FF] rounded-[16px] p-4 mb-3">
                  <div>
                    <h1 className="font-bold text-black text-[18px]">
                      {post.collectionInfo.name}
                    </h1>
                    <p className="text-[14px] text-[#939393]">
                      Words: {post.collectionInfo.wordCount}
                    </p>
                  </div>
                  <div>
                    {!isAuthor && (
                      <Button
                        disabled={
                          post.collectionInfo.savedByCurrentUser || isSaving
                        }
                        onClick={() => handleSaveCollection(post.postId)}
                        className={`${
                          post.collectionInfo.savedByCurrentUser
                            ? "bg-green-600 text-white opacity-90 cursor-not-allowed hover:bg-green-600"
                            : "bg-[#3675FF] hover:bg-[#2563EB] text-white"
                        }`}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : post.collectionInfo.savedByCurrentUser ? (
                          <div className="flex items-center gap-1">
                            Saved <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleToggleLike(post.postId)}
                  className="flex items-center gap-1 transition-colors hover:opacity-80"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      post.likedByCurrentUser
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      post.likedByCurrentUser ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {post.likesCount}
                  </span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="hidden lg:flex flex-col w-80 space-y-6">
        <Card className="p-4 border-none shadow-sm">
          <h3 className="font-bold text-[20px] text-black mb-3">Friends</h3>
          <div className="space-y-4">
            {friends.slice(0, 5).map((friend) => (
              <div key={friend.userId} className="flex items-center gap-3">
                <img
                  src={friend.avatarUrl || "/ava.svg"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-[16px] text-black">
                    {friend.username}
                  </p>
                  {/* <p className="text-[14px] text-[#939393]">Online</p> */}
                </div>
              </div>
            ))}
            {friends.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No friends yet.
              </p>
            )}
          </div>
          <Link href={"/community/friends"}>
            <p className="text-[14px] text-[#2563EB] mt-4 text-center hover:underline cursor-pointer">
              View all
            </p>
          </Link>
        </Card>

        <Card className="p-4 border-none shadow-sm">
          <h3 className="font-bold text-[20px] text-black mb-3">
            Challenge Room
          </h3>
          <Button
            onClick={() => {
              router.push("/community/challenge/definition");
            }}
            className="w-full h-auto py-3 flex-col bg-[#F9E6E6] hover:bg-[#f4d6d6] hover:shadow-md text-black transition-all duration-200 border border-red-100"
          >
            <SquareCheck color="#C30000" className="mt-1 !w-6 !h-6" />
            <p className="mt-2 mb-1 font-medium text-[14px]">
              Definition Match
            </p>
          </Button>

          <Button
            onClick={() => {
              router.push("/community/challenge/fill-blank");
            }}
            className="w-full h-auto py-3 flex-col bg-[#F6F2FF] hover:bg-[#ebe2ff] hover:shadow-md text-black mt-4 transition-all duration-200 border border-purple-100"
          >
            <Brush color="#6C4DAD" className="mt-1 !w-6 !h-6" />
            <p className="mt-2 mb-1 font-medium text-[14px]">
              Fill in the Blank
            </p>
          </Button>

          <Button
            onClick={() => {
              router.push("/community/challenge/word-shooter");
            }}
            className="w-full h-auto py-3 flex-col bg-[#E6F5F1] hover:bg-[#d6eee6] hover:shadow-md text-black mt-4 transition-all duration-200 border border-green-100"
          >
            <BowArrow color="#00966D" className="mt-1 !w-6 !h-6" />
            <p className="mt-2 mb-1 font-medium text-[14px]">Word Shooter</p>
          </Button>

          <Link href={"/community/challenge"}>
            <p className="text-[14px] text-[#2563EB] mt-4 text-center hover:underline cursor-pointer">
              Explore
            </p>
          </Link>
        </Card>
      </div>
    </div>
  );
}
