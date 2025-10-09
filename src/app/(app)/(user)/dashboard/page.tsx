import { StatCard } from "@/components/app/dashboard/StatCard";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Book,
  Calendar,
  Flame,
  PenLine,
  Plus,
  Play,
  BookCopy,
  Gamepad2,
  Timer,
  CheckSquare,
  ArrowBigDownDash,
} from "lucide-react";
import Link from "next/link";

// Mock Data
const stats = [
  { title: "Total Words", value: "1,264", icon: Book },
  { title: "Collections", value: "26", icon: BookCopy },
  { title: "Today's Words", value: "29", icon: Calendar },
  { title: "Learning Streak", value: "7 days", icon: Flame },
];

const collections = [
  { name: "Technology", words: 128, lastStudied: "2d ago" },
  { name: "Business English", words: 95, lastStudied: "1d ago" },
  { name: "Travel Vocabulary", words: 210, lastStudied: "5d ago" },
  { name: "Academic Writing", words: 150, lastStudied: "3h ago" },
];

const trendingWords = [
  {
    word: "Revolutionary",
    vietnamese: "cách mạng, đột phá",
    definition: "involving or causing a complete or dramatic change",
    example:
      "This new drug is revolutionary in its approach to treating cancer.",
  },
  {
    word: "Ubiquitous",
    vietnamese: "phổ biến, ở đâu cũng có",
    definition: "present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society.",
  },
  {
    word: "Ephemeral",
    vietnamese: "phù du, chóng tàn",
    definition: "lasting for a very short time",
    example: "The beauty of the cherry blossoms is ephemeral.",
  },
];

const sharedCollections = [
  {
    user: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    collection: "Academic Writing",
    words: 35,
    time: "2 hours ago",
  },
  {
    user: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=michael",
    collection: "Tech Startups",
    words: 28,
    time: "5 hours ago",
  },
];

const friends = [
  {
    user: "Alex Turner",
    avatar: "https://i.pravatar.cc/150?u=alex",
    status: "Learning Business English",
  },
  {
    user: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=emma",
    status: "Advanced Vocabulary",
  },
];

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

// Main Dashboard Page Component
export default function DashboardPage() {
  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <div className="flex flex-col gap-12">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, PhanGiang293!</h1>
            <p className="mt-2 text-blue-100">
              &quot;The limits of my language mean the limits of my world.&quot;
              - Ludwig Wittgenstein
            </p>
          </div>
          <Button
            variant={"default"}
            className="mt-4 md:mt-0 bg-secondary hover:!bg-yellow-400 text-white font-medium py-3 px-6"
          >
            Continue learning <Play className="ml-2 h-5 w-5" />
          </Button>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title as any}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </section>

        {/* My Vocabulary Collections */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-20">
              <h2 className="text-xl lg:text-2xl font-bold">
                My Vocabulary Collections
              </h2>
              <Button
                variant="outline"
                className="hidden sm:flex !text-primary !border-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              >
                <Plus className="h-4 w-4 mr-2 text-primary" />
                New Collection
              </Button>
            </div>

            <Link
              href="/collections"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Card
                key={col.name}
                className="shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{col.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {col.words} words
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="icon" size="icon" className="group">
                        <PenLine className="h-4 w- text-black group-hover:w-6 group-hover:h-6" />
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

        {/* Today's Trending Vocabulary */}
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
            {trendingWords.map((item) => (
              <Card
                key={item.word}
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
                      <span className="font-semibold">Vietnamese meaning:</span>
                      {item.vietnamese}
                    </p>
                    <p>
                      <span className="font-semibold">Definition:</span>
                      <span className="text-muted-foreground">
                        {item.definition}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Example:</span>
                      <i className="text-muted-foreground">
                        &quot;{item.example}&quot;
                      </i>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Activities */}
        <section>
          <h2 className=" text-xllg:text-2xl font-bold mb-4">
            Community Activities
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Shared Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sharedCollections.map((item) => (
                  <div key={item.user} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {item.user} shared &quot;
                        <Link href="#" className="text-primary hover:underline">
                          {item.collection}
                        </Link>
                        &quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.words} words • {item.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto">
                  View all shared collections
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>My Friends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {friends.map((friend) => (
                  <div key={friend.user} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{friend.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.status}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto">
                  View my friends
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Challenge Rooms</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {challenges.map((challenge) => {
                  // xác định route tương ứng theo tên
                  const hrefMap: Record<string, string> = {
                    "Definition Match": "/community/challenge/definition",
                    "Fill in the Blank": "/community/challenge/fill-blank",
                    "Word Shooter": "/community/challenge/word-shooter",
                  };
                  const href = hrefMap[challenge.name] || "#";

                  return (
                    <Link
                      key={challenge.name}
                      href={href}
                      className={`p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:shadow-md transition-opacity ${challenge.color}`}
                    >
                      <challenge.icon className="h-6 w-6" />
                      <p className="text-sm font-semibold">{challenge.name}</p>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
