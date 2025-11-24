"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

type Word = {
  en: string;
  vi: string;
};

type FallingWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  isTarget: boolean;
};

type Bullet = {
  id: number;
  x: number;
  y: number;
  hit?: boolean;
  hitTime?: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  type: "heart" | "explosion" | "score";
  randX?: number;
};

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 60;
const WORD_SPEED = 1;
const BULLET_SPEED = 8;
const WORD_SPAWN_RATE = 1200;
const GAME_DURATION = 90; // Giả sử default 90s từ API
const TARGET_SPAWN_CHANCE = 0.4;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

export const VocabularyShooterGame = ({
  wordsToReview,
  roomId,
}: {
  wordsToReview: Word[];
  roomId?: string | null;
}) => {
  const router = useRouter();
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameOver">(
    "idle"
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastWordSpawnTime = useRef(0);
  const lastShotTime = useRef(0);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId) return;
    const token = localStorage.getItem("accessToken");
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      stompClientRef.current = client;
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId]);

  const sendScoreUpdate = (newScore: number) => {
    if (stompClientRef.current && roomId && stompClientRef.current.connected) {
      stompClientRef.current.send(
        `/app/challenge-room/${roomId}/score`,
        {},
        JSON.stringify({ score: newScore })
      );
    }
  };

  const currentTargetWord = wordsToReview[currentWordIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTimeTaken(0);
    setCompletedIndices([]);
    setCurrentWordIndex(0);
    setFallingWords([]);
    setBullets([]);
    setParticles([]);
    setWrongWords([]);
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    lastWordSpawnTime.current = Date.now();
    setGameState("playing");
    setShakeScreen(false);
  };

  const advanceToNextWord = useCallback(() => {
    const newCompleted = [...completedIndices, currentWordIndex];
    setCompletedIndices(newCompleted);

    if (newCompleted.length === wordsToReview.length) {
      setTimeTaken(GAME_DURATION - timeLeft);
      setGameState("gameOver");
      if (!roomId) {
        // Solo mode game over -> redirect logic or wait user
      }
      return;
    }

    let nextIndex = 0;
    for (let i = 1; i < wordsToReview.length; i++) {
      const potentialIndex = (currentWordIndex + i) % wordsToReview.length;
      if (!newCompleted.includes(potentialIndex)) {
        nextIndex = potentialIndex;
        break;
      }
    }

    setCurrentWordIndex(nextIndex);
    setFallingWords([]);
    setBullets([]);
    setParticles([]);
    setShakeScreen(false);
  }, [
    completedIndices,
    currentWordIndex,
    wordsToReview.length,
    timeLeft,
    roomId,
  ]);

  const gameLoop = useCallback(() => {
    setBullets((prev) =>
      prev.map((b) => ({ ...b, y: b.y - BULLET_SPEED })).filter((b) => b.y > 0)
    );

    setFallingWords((prev) => {
      const updatedWords = prev.map((w) => ({ ...w, y: w.y + WORD_SPEED }));
      return updatedWords.filter((word) => word.y <= GAME_HEIGHT);
    });

    if (
      !isTransitioning &&
      Date.now() - lastWordSpawnTime.current > WORD_SPAWN_RATE
    ) {
      lastWordSpawnTime.current = Date.now();
      // Check if wordsToReview is empty to avoid crash
      if (wordsToReview.length > 0) {
        const targetWord = wordsToReview[currentWordIndex];
        setFallingWords((prevWords) => {
          const isSpawningTarget = Math.random() < TARGET_SPAWN_CHANCE;
          let wordToSpawn: Word;

          if (isSpawningTarget || wordsToReview.length < 3) {
            wordToSpawn = targetWord;
          } else {
            let distractorIndex = Math.floor(
              Math.random() * wordsToReview.length
            );
            while (distractorIndex === currentWordIndex) {
              distractorIndex = Math.floor(
                Math.random() * wordsToReview.length
              );
            }
            wordToSpawn = wordsToReview[distractorIndex];
          }

          const newWord: FallingWord = {
            id: performance.now(),
            text: wordToSpawn.en,
            x: Math.random() * (GAME_WIDTH - 120),
            y: -30,
            isTarget: wordToSpawn.en === targetWord.en,
          };
          return [...prevWords, newWord];
        });
      }
    }

    setBullets((prevBullets) => {
      if (isTransitioning) return prevBullets;
      const remainingBullets = [...prevBullets];

      setFallingWords((prevWords) => {
        const remainingWords = [...prevWords];
        for (let i = remainingBullets.length - 1; i >= 0; i--) {
          const bullet = remainingBullets[i];
          if (bullet.hit) continue;

          for (let j = remainingWords.length - 1; j >= 0; j--) {
            const word = remainingWords[j];
            const wordWidth = word.text.length * 10 + 20;

            if (
              bullet.x < word.x + wordWidth &&
              bullet.x + 5 > word.x &&
              bullet.y < word.y + 30 &&
              bullet.y + 10 > word.y
            ) {
              remainingBullets[i] = {
                ...bullet,
                hit: true,
                hitTime: Date.now(),
              };

              if (word.isTarget) {
                const newScore = score + 10;
                setScore(newScore);
                sendScoreUpdate(newScore);

                setParticles((prev) => [
                  ...prev,
                  ...Array.from({ length: 6 }, (_, index) => ({
                    id: Date.now() + Math.random() + index,
                    x: word.x + wordWidth / 2,
                    y: word.y,
                    type: "heart" as const,
                    randX: Math.random(),
                  })),
                  {
                    id: Date.now() + Math.random() + 11,
                    x: word.x + wordWidth / 2,
                    y: word.y - 10,
                    type: "score" as const,
                  },
                ]);
              } else {
                const newScore = Math.max(0, score - 5);
                setScore(newScore);
                sendScoreUpdate(newScore);

                setShakeScreen(true);
                setTimeout(() => setShakeScreen(false), 400);
                const correctWord = wordsToReview[currentWordIndex];
                if (correctWord) {
                  setWrongWords((prev) => {
                    if (!prev.some((w) => w.en === correctWord.en)) {
                      return [...prev, correctWord];
                    }
                    return prev;
                  });
                }
                setParticles((prev) => [
                  ...prev,
                  {
                    id: Date.now() + Math.random(),
                    x: word.x + wordWidth / 2,
                    y: word.y,
                    type: "explosion" as const,
                  },
                ]);
              }

              if (!isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setIsTransitioning(false);
                  advanceToNextWord();
                }, 1200);
              }

              remainingWords.splice(j, 1);
              break;
            }
          }
        }
        return remainingWords;
      });

      const now = Date.now();
      return remainingBullets.filter(
        (b) => b.y > 0 && (!b.hit || now - (b.hitTime ?? 0) < 200)
      );
    });

    setParticles((prev) => prev.filter((p) => Date.now() - p.id < 1200));
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [
    wordsToReview,
    currentWordIndex,
    advanceToNextWord,
    isTransitioning,
    score,
  ]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeTaken(GAME_DURATION);
          setGameState("gameOver");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea || gameState !== "playing") return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gameArea.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const newPlayerX = mouseX - PLAYER_WIDTH / 2;
      const clampedX = Math.max(
        0,
        Math.min(GAME_WIDTH - PLAYER_WIDTH, newPlayerX)
      );
      setPlayerX(clampedX);
    };

    const handleMouseClick = () => {
      if (Date.now() - lastShotTime.current > 300) {
        setBullets((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: playerX + PLAYER_WIDTH / 2 - 2.5,
            y: GAME_HEIGHT - 30,
          },
        ]);
        lastShotTime.current = Date.now();
      }
    };

    gameArea.addEventListener("mousemove", handleMouseMove);
    gameArea.addEventListener("click", handleMouseClick);

    return () => {
      gameArea.removeEventListener("mousemove", handleMouseMove);
      gameArea.removeEventListener("click", handleMouseClick);
    };
  }, [gameState, playerX]);

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-xl bg-white">
      <div
        ref={gameAreaRef}
        className={`relative bg-blue-900/90 w-[800px] h-[500px] overflow-hidden rounded-md border-4 border-slate-700 ${
          gameState === "playing" ? "cursor-none" : "cursor-pointer"
        } ${shakeScreen ? "animate-shake-red" : ""}`}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState === "playing" && (
          <>
            <div
              style={{
                position: "absolute",
                left: playerX,
                bottom: 10,
                transition: "left 50ms linear",
                zIndex: 10,
              }}
            >
              <img
                src="/images/minigame/rocket.png"
                alt="Rocket"
                style={{ width: PLAYER_WIDTH, height: "auto" }}
              />
            </div>
            {bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="bg-yellow-400 rounded-full shadow-[0_0_8px_2px_rgba(250,204,21,0.7)]"
                style={{
                  position: "absolute",
                  left: bullet.x,
                  top: bullet.y,
                  width: 6,
                  height: 12,
                  zIndex: 5,
                }}
              />
            ))}
            {fallingWords.map((word) => (
              <div
                key={word.id}
                className="absolute px-3 py-1 rounded-md text-lg font-semibold bg-black/30 backdrop-blur-sm border text-white border-white/50"
                style={{ left: word.x, top: word.y, zIndex: 3 }}
              >
                {word.text}
              </div>
            ))}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`absolute pointer-events-none ${
                  particle.type === "heart"
                    ? "animate-heart text-red-500"
                    : particle.type === "explosion"
                    ? "animate-explosion text-orange-500"
                    : "animate-score font-bold text-green-600"
                }`}
                style={
                  {
                    left: particle.x,
                    top: particle.y,
                    zIndex: 20,
                    ...(particle.type === "heart"
                      ? { "--rand-x": particle.randX }
                      : {}),
                  } as React.CSSProperties
                }
              >
                {particle.type === "heart" && <Heart size={30} fill="red" />}
                {particle.type === "explosion" && (
                  <span className="text-5xl">💥</span>
                )}
                {particle.type === "score" && (
                  <span className="text-xl">+10</span>
                )}
              </div>
            ))}
          </>
        )}
        {gameState === "idle" && (
          <div className="w-full h-full flex flex-col justify-center items-center text-white p-4 text-center">
            <h3 className="text-4xl font-bold mb-4">Vocabulary Shooter</h3>
            <p className="mb-2">
              Bắn từ tiếng Anh tương ứng với nghĩa tiếng Việt được cho.
            </p>
            <p className="mb-8">
              Bạn có {formatTime(GAME_DURATION)} để hoàn thành!
            </p>
            <Button onClick={startGame} size="lg">
              Start Game
            </Button>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="w-full h-full flex flex-col justify-center items-center text-white bg-black/50 p-4 overflow-auto">
            <h3 className="text-5xl font-bold mb-4">
              {completedIndices.length === wordsToReview.length
                ? "Congratulations!"
                : "Time's Up!"}
            </h3>
            <p className="text-2xl mb-2">Final Score: {score}</p>
            <p className="text-xl mb-4">Time Taken: {formatTime(timeTaken)}</p>
            {wrongWords.length > 0 && (
              <div className="mb-4 text-left max-h-40 overflow-auto">
                <h4 className="text-xl font-semibold mb-2">Từ sai:</h4>
                <ul className="list-disc pl-5">
                  {wrongWords.map((word, index) => (
                    <li key={index} className="text-lg">
                      {word.en}: {word.vi}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 mt-6">
              <Button onClick={startGame} size="lg">
                Play Again
              </Button>
              <Button
                onClick={() =>
                  router.push("/community/leaderboard?game=word-shooter")
                }
                size="lg"
                variant="secondary"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        )}
      </div>
      <div
        className="w-full bg-slate-100 p-4 rounded-md flex justify-between items-center"
        style={{ width: GAME_WIDTH }}
      >
        <div className="flex items-center gap-6 text-lg">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="text-yellow-500" /> Score: {score}
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Clock className="text-blue-500" /> Time: {formatTime(timeLeft)}
          </div>
        </div>
        {gameState === "playing" && currentTargetWord && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Shoot the word for:</p>
            <p className="text-xl font-bold text-primary">
              {currentTargetWord.vi}
            </p>
          </div>
        )}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes heart {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(calc(-40px + 80px * var(--rand-x)), -80px) scale(1.5); opacity: 0; }
        }
        .animate-heart { animation: heart 1.2s ease-out forwards; }
        @keyframes explosion {
          0% { transform: scale(0.5); opacity: 1; }
          50% { transform: scale(2); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .animate-explosion { animation: explosion 0.8s ease-out forwards; }
        @keyframes score {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        .animate-score { animation: score 1.2s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
};
