"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowRight,
  Book,
  Calendar,
  Flame,
  PenLine,
  BookCopy,
  Gamepad2,
  CheckSquare,
  ArrowBigDownDash,
  Loader2,
  Play,
} from "lucide-react";

import { StatCard } from "@/components/app/dashboard/StatCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ContinueLearningModal } from "@/components/app/dashboard/ContinueLearningModal";

import { getHomeStatistics } from "@/services/statisticService";
import { getUserCollections } from "@/services/collectionService";
import { getUserFriends } from "@/services/userService";
import { getSharedNotifications } from "@/services/communityService";
import { getTrendingArticles } from "@/services/trendingService";

import {
  HomeStatistics,
  Collection,
  Friend,
  SharedNotification,
} from "@/types/dashboard";
import { Vocabulary } from "@/types/trending";

const challenges = [
  {
    name: "Definition Match",
    icon: CheckSquare,
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Fill in the Blank",
    icon: PenLine,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Word Shooter",
    icon: Gamepad2,
    color: "bg-green-100 text-green-600",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<HomeStatistics | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sharedNotifications, setSharedNotifications] = useState<
    SharedNotification[]
  >([]);
  const [trendingWords, setTrendingWords] = useState<Vocabulary[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [
          statsData,
          collectionsData,
          friendsData,
          sharedData,
          trendingData,
        ] = await Promise.all([
          getHomeStatistics(),
          getUserCollections(),
          getUserFriends(),
          getSharedNotifications(),
          getTrendingArticles(format(new Date(), "yyyy-MM-dd")),
        ]);

        setStats(statsData);
        setCollections(collectionsData);
        setFriends(friendsData);
        setSharedNotifications(sharedData);

        if (Array.isArray(trendingData) && trendingData.length > 0) {
          const allWords = trendingData.flatMap(
            (article) => article.list_words
          );
          setTrendingWords(allWords.slice(0, 3));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <div className="flex flex-col gap-12">
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.username || "User"}!
            </h1>
            <p className="mt-2 text-blue-100">
              &quot;The limits of my language mean the limits of my world.&quot;
              - Ludwig Wittgenstein
            </p>
          </div>
          {/* Replace hardcoded button with Modal Trigger (no ID = today) */}
          <ContinueLearningModal />
        </section>

        {/* ... (Rest of the UI remains the same) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Words"
            value={stats?.total_words.toString() || "0"}
            icon={Book}
          />
          <StatCard
            title="Collections"
            value={stats?.total_collections.toString() || "0"}
            icon={BookCopy}
          />
          <StatCard
            title="Today's Words"
            value={stats?.today_words.toString() || "0"}
            icon={Calendar}
          />
          <StatCard
            title="Learning Streak"
            value={`${stats?.learning_streak || 0} days`}
            icon={Flame}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-20">
              <h2 className="text-xl lg:text-2xl font-bold">
                My Vocabulary Collections
              </h2>
            </div>

            <Link
              href="/collections"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((col) => (
              <Card
                key={col.id}
                className="shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow cursor-pointer flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-lg font-semibold line-clamp-1"
                        title={col.name}
                      >
                        {col.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {col.wordCount} words
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="icon" size="icon" className="group">
                        <PenLine className="h-4 w-4 text-black group-hover:w-6 group-hover:h-6" />
                      </Button>
                      <Button variant="icon" size="icon" className="group">
                        <Play className="h-4 w-4 text-primary group-hover:w-6 group-hover:h-6" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Last studied: {col.lastStudied}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className=" text-xl lg:text-2xl font-bold">
              Today&#39;s Trending Vocabulary
            </h2>
            <Link
              href="/trending"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all trending words <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingWords.length > 0 ? (
              trendingWords.map((item, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow"
                >
                  <CardContent className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        {item.word}
                      </h3>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-primary group"
                      >
                        <ArrowBigDownDash className="h-5 w-5 text-primary group-hover:text-white" />
                      </Button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p>
                        <span className="font-semibold">Vietnamese: </span>
                        {item.word_vn}
                      </p>
                      <p>
                        <span className="font-semibold">Definition: </span>
                        <span className="text-muted-foreground">
                          {item.definition_en}
                        </span>
                      </p>
                      {item.examples && item.examples.length > 0 && (
                        <p>
                          <span className="font-semibold">Example: </span>
                          <i className="text-muted-foreground">
                            &quot;{item.examples[0].en}&quot;
                          </i>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No trending words available today.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className=" text-xl lg:text-2xl font-bold mb-4">
            Community Activities
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Shared Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sharedNotifications.length > 0 ? (
                  sharedNotifications.map((item) => (
                    <div key={item.postId} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={item.author.avatarUrl || ""} />
                        <AvatarFallback>
                          {item.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {item.author.username} shared &quot;
                          <Link
                            href="#"
                            className="text-primary hover:underline"
                          >
                            {item.collectionInfo.name}
                          </Link>
                          &quot;
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.collectionInfo.wordCount} words •{" "}
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    No shared collections yet.
                  </p>
                )}
                <Button
                  variant="link"
                  className="p-0 h-auto w-full text-center"
                >
                  View all shared collections
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>My Friends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend.userId}
                      className="flex items-center gap-4"
                    >
                      <Avatar>
                        <AvatarImage src={friend.avatarUrl || ""} />
                        <AvatarFallback>
                          {friend.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{friend.username}</p>
                        {/* <p className="text-xs text-muted-foreground">Active</p> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    You haven&apos;t added any friends yet.
                  </p>
                )}
                <Button
                  variant="link"
                  className="p-0 h-auto w-full text-center"
                >
                  View my friends
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Challenge Rooms</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <Link
                    key={challenge.name}
                    href="#"
                    className={`p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:shadow-md transition-opacity ${challenge.color}`}
                  >
                    <challenge.icon className="h-6 w-6" />
                    <p className="text-sm font-semibold">{challenge.name}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
