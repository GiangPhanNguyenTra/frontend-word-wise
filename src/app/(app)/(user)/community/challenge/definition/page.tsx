"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Star,
  List,
  Book,
  Users,
  Copy,
  UserPlus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { GameQuestionDefinition, RoomParticipant } from "@/types/game";
import { Friend } from "@/types/user";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_API?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

export default function DefinitionMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinCode = searchParams.get("code");

  const [view, setView] = useState<"MENU" | "LOBBY" | "GAME" | "RESULT">(
    "MENU"
  );

  const [questions, setQuestions] = useState<GameQuestionDefinition[]>([]);
  const [availableWords, setAvailableWords] = useState<{ word: string }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [zoneStatus, setZoneStatus] = useState<
    Record<string, "idle" | "correct" | "incorrect">
  >({});

  const [roomId, setRoomId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState(joinCode || "");
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

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
            const qData = payload.gameSession.questions;
            setQuestions(qData);
            const shuffled = [...qData].sort(() => Math.random() - 0.5);
            setAvailableWords(shuffled.map((q: any) => ({ word: q.word })));
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

  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text/plain", word);
    setDraggedWord(word);
  };
  const handleDragEnd = () => setDraggedWord(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, definitionWord: string) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain") || draggedWord;
    if (!word) return;

    if (word === definitionWord) {
      setMatched((prev) => [...prev, word]);
      setAvailableWords((prev) => prev.filter((w) => w.word !== word));
      setZoneStatus((prev) => ({ ...prev, [definitionWord]: "correct" }));
      const newScore = score + 20;
      setScore(newScore);
      sendScoreUpdate(newScore);
    } else {
      setZoneStatus((prev) => ({ ...prev, [definitionWord]: "incorrect" }));
      setScore((prev) => Math.max(0, prev - 5));
      setTimeout(() => {
        setZoneStatus((prev) => ({ ...prev, [definitionWord]: "idle" }));
      }, 900);
    }
    setDraggedWord(null);
  };

  const handleCreateRoom = async () => {
    try {
      const room = await createChallengeRoom("definition-match");
      setRoomId(room.roomId);
      setInviteCode(room.inviteCode);
      setIsHost(true);
      setView("LOBBY");
    } catch (e) {
      toast.error("Failed to create room");
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
      toast.error("Invalid code or room full");
    }
  };

  const handleInvite = async (friendId: number) => {
    if (!roomId) return;
    try {
      await inviteFriendToRoom(roomId, friendId);
      toast.success("Invitation sent");
    } catch (e) {
      toast.error("Failed to invite");
    }
  };

  const handleStartGame = async () => {
    if (!roomId) return;
    try {
      await startRoomGame(roomId);
    } catch (e) {
      toast.error("Failed to start game");
    }
  };

  const handlePlaySolo = async () => {
    try {
      const data = await getGameQuestions<GameQuestionDefinition>(
        "definition-match"
      );
      setQuestions(data.questions);
      const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled.map((q) => ({ word: q.word })));
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
          Definition Match
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
              <Dialog>
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
                            src={f.avatarUrl || "/ava.svg"}
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
            {participants.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
              >
                <img
                  src={p.avatarUrl || "/ava.svg"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{(p as any).displayName || p.username}</span>
              </div>
            ))}
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
              .map((p, i) => (
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
                      src={p.avatarUrl || "/ava.svg"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{(p as any).displayName || p.username}</span>
                  </div>
                  <span className="font-bold text-[#2563EB]">
                    {p.score} pts
                  </span>
                </div>
              ))}
          </div>
          <Button
            className="w-full"
            onClick={() =>
              router.push("/community/leaderboard?game=definition-match")
            }
          >
            View Global Leaderboard
          </Button>
        </Card>
      </div>
    );
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              href="/community/challenge"
              className="text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[#2563EB]">
              Definition Match
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {minutes}:{seconds}
              </span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>{score}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <List className="w-5 h-5 mr-2" />
              Words
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {availableWords.map((item) => (
                <div
                  key={item.word}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.word)}
                  onDragEnd={handleDragEnd}
                  className={`bg-blue-50 border rounded-lg p-3 transition-all ${
                    matched.includes(item.word)
                      ? "hidden"
                      : "cursor-grab hover:scale-[1.02] border-blue-200"
                  }`}
                >
                  <p className="font-semibold">{item.word}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2" />
              Definitions
            </h2>
            <div className="space-y-4">
              {questions.map((item) => {
                const status =
                  zoneStatus[item.word] ||
                  (matched.includes(item.word) ? "correct" : "idle");
                return (
                  <div
                    key={item.word}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.word)}
                    className={`border-2 border-dashed rounded-lg p-4 bg-gray-50 min-h-[60px] transition-all
                      ${
                        status === "correct"
                          ? "bg-green-50 border-green-500"
                          : status === "incorrect"
                          ? "bg-red-50 border-red-500"
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                  >
                    {matched.includes(item.word) ? (
                      <div>
                        <p className="font-semibold text-green-700">
                          {item.word}
                        </p>
                        <p>{item.definition}</p>
                      </div>
                    ) : (
                      <p>{item.definition}</p>
                    )}
                  </div>
                );
              })}
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
                  .map((p, i) => (
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
                        <span className="truncate">{p.username}</span>
                      </div>
                      <span className="font-semibold text-[#2563EB]">
                        {p.score}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
