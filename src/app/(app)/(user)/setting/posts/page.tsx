"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyPosts,
  toggleLikePost,
  saveSharedCollection,
} from "@/services/communityService";
import { Post } from "@/types/community";

export default function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingPostIds, setSavingPostIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

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
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border">
          You haven&apos;t posted anything yet.
        </div>
      ) : (
        posts.map((post) => {
          const isAuthor = user?.userId === post.author.userId;
          const isSaving = savingPostIds.includes(post.postId);

          return (
            <Card key={post.postId} className="p-4 border-none shadow-sm">
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
                  className="flex items-center gap-1 transition-colors hover:opacity-80 cursor-pointer"
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
        })
      )}
    </div>
  );
}
