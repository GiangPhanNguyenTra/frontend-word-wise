"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Users, Loader2, UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { VocabularyShooterGame } from "@/components/games/VocabularyShooterGame";
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
import { GameQuestionWordShooter, RoomParticipant } from "@/types/game";
import { Friend } from "@/types/user";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

export default function WordShooterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinCode = searchParams.get("code");

  const [view, setView] = useState<"MENU" | "LOBBY" | "GAME" | "RESULT">(
    "MENU"
  );

  const [questions, setQuestions] = useState<GameQuestionWordShooter[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState(joinCode || "");
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    if (joinCode) {
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
            setView("GAME");
          }
        } else if (payload.type === "SCOREBOARD_UPDATE") {
          if (payload.scoreboard) setParticipants(payload.scoreboard);
        } else if (payload.type === "GAME_OVER") {
          setView("RESULT");
          if (payload.scoreboard) setParticipants(payload.scoreboard);
        }
      });
    });
    stompClientRef.current = client;
    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, [roomId]);

  const handleCreateRoom = async () => {
    try {
      const room = await createChallengeRoom("word-shooter");
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
    } catch (e) {
      toast.error("Failed to invite");
    }
  };

  const handleStartGame = async () => {
    if (roomId) await startRoomGame(roomId);
  };

  const handlePlaySolo = async () => {
    try {
      const data = await getGameQuestions<GameQuestionWordShooter>(
        "word-shooter"
      );
      setQuestions(data.questions);
      setView("GAME");
    } catch (e) {
      toast.error("Failed to load questions");
    }
  };

  if (view === "MENU") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-4">
        <h1 className="text-3xl font-bold text-[#2563EB] mb-4">Word Shooter</h1>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
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
                            className="w-8 h-8 rounded-full"
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
                  className="w-8 h-8 rounded-full"
                />
                <span>{p.username}</span>
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
            <p className="text-slate-500 animate-pulse">Waiting for host...</p>
          )}
        </Card>
      </div>
    );
  }

  if (view === "RESULT") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
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
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{p.username}</span>
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
              router.push("/community/leaderboard?game=word-shooter")
            }
          >
            View Leaderboard
          </Button>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              href="/community/challenge"
              className="text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Challenge room: </h1>
            <p className="text-xl font-bold text-[#2563EB]">Word Shooter</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <VocabularyShooterGame wordsToReview={questions} roomId={roomId} />
      </main>
    </div>
  );
}
