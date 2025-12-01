"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Clock, Star, Copy, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  createChallengeRoom,
  joinChallengeRoom,
  startRoomGame,
  getGameQuestions,
  inviteFriendToRoom,
} from "@/services/gameService";
import { getUserFriends } from "@/services/userService";
import { GameQuestionFillBlank, RoomParticipant } from "@/types/game";
import { Friend } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_API?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

export default function FillBlankPage() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const joinCode = searchParams.get("code");

  const [view, setView] = useState<"MENU" | "LOBBY" | "GAME" | "RESULT">(
    "MENU"
  );

  const [questions, setQuestions] = useState<GameQuestionFillBlank[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selected, setSelected] = useState<string | null>(null);
  const [blankWord, setBlankWord] = useState("");

  const [roomId, setRoomId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState(joinCode || "");
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    if (joinCode) {
      setInputCode(joinCode);
      handleJoinRoom(joinCode);
    }
  }, [joinCode]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getUserFriends();
        setFriends(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadFriends();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const token = localStorage.getItem("accessToken");
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      client.subscribe(`/topic/challenge-room/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        if (payload.type === "PLAYER_JOINED") {
          if (payload.participants) setParticipants(payload.participants);
        } else if (payload.type === "GAME_STARTED") {
          if (payload.gameSession) {
            setQuestions(payload.gameSession.questions);
            setTimeLeft(payload.gameSession.time || 90);
            setView("GAME");
          }
        } else if (payload.type === "SCOREBOARD_UPDATE") {
          if (payload.scoreboard) {
            setParticipants((prev) => {
              return payload.scoreboard.map((newItem: any) => {
                const existing = prev.find((p) => p.userId === newItem.userId);
                return {
                  ...newItem,
                  avatarUrl: newItem.avatarUrl || existing?.avatarUrl,
                  username: newItem.username || existing?.username,
                  displayName:
                    (newItem as any).displayName ||
                    (existing as any)?.displayName,
                };
              });
            });
          }
        } else if (payload.type === "GAME_OVER") {
          setView("RESULT");
          if (payload.scoreboard) {
            setParticipants((prev) => {
              return payload.scoreboard.map((newItem: any) => {
                const existing = prev.find((p) => p.userId === newItem.userId);
                return {
                  ...newItem,
                  avatarUrl: newItem.avatarUrl || existing?.avatarUrl,
                  username: newItem.username || existing?.username,
                  displayName:
                    (newItem as any).displayName ||
                    (existing as any)?.displayName,
                };
              });
            });
          }
        }
      });
    });
    stompClientRef.current = client;
    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (view !== "GAME") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view]);

  const sendScoreUpdate = (newScore: number) => {
    if (stompClientRef.current && roomId) {
      stompClientRef.current.send(
        `/app/challenge-room/${roomId}/score`,
        {},
        JSON.stringify({ score: newScore })
      );
    }
  };

  const handleSelect = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const currentQuestion = questions[currentQuestionIndex];

    let newScore = score;
    if (answer === currentQuestion.answer) {
      setBlankWord(answer);
      newScore += 10;
      setScore(newScore);
    } else {
      newScore = Math.max(0, newScore - 5);
      setScore(newScore);
    }
    sendScoreUpdate(newScore);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(null);
      setBlankWord("");
    } else {
      if (!roomId) {
        router.push("/community/leaderboard?game=fill-the-blank");
      }
    }
  };

  const handleCreateRoom = async () => {
    try {
      const room = await createChallengeRoom("fill-the-blank");
      setRoomId(room.roomId);
      setInviteCode(room.inviteCode);
      setIsHost(true);
      setView("LOBBY");
    } catch (e) {
      toast.error("Error creating room");
    }
  };

  const handleJoinRoom = async (codeToJoin?: string) => {
    const code = codeToJoin || inputCode;
    if (!code) return;
    try {
      const room = await joinChallengeRoom(code);
      setRoomId(room.roomId);
      setInviteCode(room.inviteCode);
      setIsHost(false);
      setView("LOBBY");
    } catch (e) {
      toast.error("Error joining room");
    }
  };

  const handleInvite = async (friendId: number) => {
    if (!roomId) return;
    try {
      await inviteFriendToRoom(roomId, friendId);
      toast.success("Invitation sent");
      setIsInviteOpen(false);
    } catch (e) {
      toast.error("Failed to invite");
    }
  };

  const handleStartGame = async () => {
    if (roomId) await startRoomGame(roomId);
  };

  const handlePlaySolo = async () => {
    try {
      const data = await getGameQuestions<GameQuestionFillBlank>(
        "fill-the-blank"
      );
      setQuestions(data.questions);
      setTimeLeft(data.time);
      setView("GAME");
    } catch (e) {
      toast.error("Failed to load questions");
    }
  };

  if (view === "MENU") {
    return (
      <div className="min-h-screen flex flex-col items-center bg-slate-50 gap-4 p-4 pt-20">
        <h1 className="text-3xl font-bold text-[#2563EB] mb-4">
          Fill The Blank
        </h1>
        <div className="grid gap-4 w-full max-w-md">
          <Button size="lg" onClick={handlePlaySolo} className="bg-[#2563EB]">
            Play Solo
          </Button>
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              onClick={handleCreateRoom}
              className="flex-1"
            >
              Create Room
            </Button>
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <Button onClick={() => handleJoinRoom()}>Join</Button>
            </div>
          </div>
          <Link
            href="/community/challenge"
            className="text-center text-slate-500 mt-2"
          >
            Back to Lobby
          </Link>
        </div>
      </div>
    );
  }

  if (view === "LOBBY") {
    return (
      <div className="min-h-screen flex flex-col items-center bg-slate-50 p-4 pt-20">
        <Card className="w-full max-w-lg p-6 text-center space-y-6">
          <h2 className="text-2xl font-bold">Waiting Lobby</h2>
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <span className="font-mono text-xl font-bold tracking-widest">
              {inviteCode}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(inviteCode);
                toast.success("Code copied");
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-left font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> Participants
              </h3>
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" /> Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Friends</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {friends.map((f) => (
                      <div
                        key={f.userId}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={f.avatarUrl || user?.avatar}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{f.username}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleInvite(f.userId)}
                        >
                          Invite
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {participants.map((p, i) => {
              const friend = friends.find((f) => f.userId === p.userId);
              const displayAvatar =
                friend?.avatarUrl || p.avatarUrl || user?.avatar;
              const displayName =
                friend?.username || (p as any).displayName || p.username;

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <img
                    src={displayAvatar}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{displayName}</span>
                </div>
              );
            })}
          </div>
          {isHost ? (
            <Button
              size="lg"
              className="w-full bg-[#2563EB]"
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          ) : (
            <p className="text-slate-500 animate-pulse">
              Waiting for host to start...
            </p>
          )}
        </Card>
      </div>
    );
  }

  if (view === "RESULT") {
    return (
      <div className="min-h-screen flex flex-col items-center bg-slate-50 p-4 pt-20">
        <Card className="w-full max-w-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-[#2563EB]">
            Game Over!
          </h2>
          <div className="space-y-2">
            {participants
              .sort((a, b) => b.score - a.score)
              .map((p, i) => {
                const friend = friends.find((f) => f.userId === p.userId);
                const displayAvatar =
                  friend?.avatarUrl || p.avatarUrl || user?.avatar;
                const displayName =
                  friend?.username || (p as any).displayName || p.username;

                return (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded ${
                      i === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg w-6">#{i + 1}</span>
                      <img
                        src={displayAvatar}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{displayName}</span>
                    </div>
                    <span className="font-bold text-[#2563EB]">
                      {p.score} pts
                    </span>
                  </div>
                );
              })}
          </div>
          <Button
            className="w-full"
            onClick={() =>
              router.push("/community/leaderboard?game=fill-the-blank")
            }
          >
            View Leaderboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const sentenceParts = currentQuestion.sentence.split("___");
  const part1 = sentenceParts[0] || currentQuestion.sentence;
  const part2 = sentenceParts[1] || "";

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              href="/community/challenge"
              className="text-[#2563EB] hover:text-indigo-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[#2563EB]">
              Fill in the Blank
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex gap-8">
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto h-fit">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-xl mb-4">Complete the sentence:</p>
              <p className="text-2xl font-medium text-center leading-relaxed">
                {part1}
                <span
                  className={`border-b-2 border-dashed mx-2 px-2 pb-1 ${
                    blankWord
                      ? "text-green-600 font-semibold border-green-600"
                      : "border-indigo-500"
                  }`}
                >
                  {blankWord || "        "}
                </span>
                {part2}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((opt, index) => {
                const isCorrect = opt === currentQuestion.answer;
                const isSelected = selected === opt;
                let style =
                  "bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-indigo-400 transition-all font-medium disabled:cursor-not-allowed";
                if (selected) {
                  if (isSelected && isCorrect)
                    style += " bg-green-100 border-green-500 text-green-800";
                  else if (isSelected && !isCorrect)
                    style += " bg-red-100 border-red-500 text-red-800";
                  else if (!isSelected && isCorrect)
                    style += " bg-green-50 border-green-400";
                  else style += " opacity-60";
                }
                return (
                  <button
                    key={opt}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={style}
                  >
                    <span className="font-semibold mr-2 text-[#2563EB]">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selected}
                className="bg-[#2563EB] text-white w-full sm:w-auto"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </Button>
            </div>
          </div>
        </div>

        {roomId && participants.length > 0 && (
          <div className="w-64 hidden lg:block">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Live Rankings
              </h3>
              <div className="space-y-2">
                {participants
                  .sort((a, b) => b.score - a.score)
                  .map((p, i) => {
                    const friend = friends.find((f) => f.userId === p.userId);
                    const displayAvatar =
                      friend?.avatarUrl || p.avatarUrl || user?.avatar;
                    const displayName =
                      friend?.username || (p as any).displayName || p.username;

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span
                            className={`font-bold w-4 ${
                              i === 0 ? "text-yellow-500" : "text-gray-500"
                            }`}
                          >
                            #{i + 1}
                          </span>
                          <img
                            src={displayAvatar}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate">{displayName}</span>
                        </div>
                        <span className="font-semibold text-[#2563EB]">
                          {p.score}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
