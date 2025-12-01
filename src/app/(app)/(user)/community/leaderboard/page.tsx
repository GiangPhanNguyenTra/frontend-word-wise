"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect, useRef, useState } from "react";
import { Award, RefreshCw, Home, User, Loader2 } from "lucide-react";
import Chart from "chart.js/auto";
import { useRouter, useSearchParams } from "next/navigation";
import { getLeaderboard } from "@/services/gameService";
import { LeaderboardData } from "@/types/game";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("fill-the-blank");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const confettiContainer = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const gameModeMap: Record<string, string> = {
    "fill-the-blank": "Fill the Blank",
    "definition-match": "Definition Match",
    "word-shooter": "Word Shooter",
  };

  useEffect(() => {
    const game = searchParams.get("game");
    if (game && Object.keys(gameModeMap).includes(game)) {
      setActiveTab(game);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLeaderboard(activeTab);
        setData(result);
      } catch (error) {
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (!data || !data.currentUser) return;
    // Only show confetti if user is top 1
    if (data.currentUser.rank === 1) {
      const createConfetti = () => {
        if (!confettiContainer.current) return;
        const container = confettiContainer.current;
        const colors = ["#2563EB", "#EBAD25", "#60A5FA", "#FACC15"];

        for (let i = 0; i < 40; i++) {
          const div = document.createElement("div");
          div.className = "absolute opacity-70 rounded-sm";
          div.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          div.style.left = Math.random() * 100 + "%";
          div.style.top = Math.random() * 100 + "%";
          div.style.width = Math.random() * 10 + 5 + "px";
          div.style.height = Math.random() * 10 + 5 + "px";
          container.appendChild(div);

          setTimeout(() => {
            div.style.transition = "all 1.2s ease";
            div.style.opacity = "0";
            div.style.transform = `translate(${Math.random() * 100 - 50}px, ${
              Math.random() * 100 + 100
            }px) rotate(${Math.random() * 360}deg)`;
            setTimeout(() => div.remove(), 1200);
          }, Math.random() * 400);
        }
      };
      createConfetti();
    }
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !data) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.chartData.labels,
        datasets: [
          {
            label: "Score",
            data: data.chartData.scores,
            backgroundColor: ["#2563EB", "#3B82F6", "#60A5FA"],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0]">
      <div className="container mx-auto lg:px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2563EB] mb-2">
            WordWizard Leaderboard
          </h1>
          <p className="text-lg text-slate-600">
            See how you stack up against other word masters!
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white shadow-sm rounded-full p-1">
            {Object.entries(gameModeMap).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`cursor-pointer px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-all text-[12px] sm:text-base ${
                  activeTab === key
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {data?.currentUser && (
          <div className="relative bg-white rounded-2xl shadow-md p-6 mb-8 overflow-hidden">
            <div
              ref={confettiContainer}
              className="absolute inset-0 overflow-hidden"
            />
            <div className="flex flex-col items-center justify-center relative z-10">
              {data.currentUser.rank === 1 && (
                <Award className="w-14 h-14 text-[#EBAD25] mb-3 animate-bounce" />
              )}
              <h2 className="text-2xl font-bold text-[#2563EB] mb-2">
                Hello {data.currentUser.username}!
              </h2>
              <p className="text-slate-600 mb-3">
                Your current rank is #{data.currentUser.rank} with{" "}
                {data.currentUser.score} points.
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-[#EBAD25] text-white rounded-full text-sm font-medium">
                  Accuracy: {data.currentUser.accuracy}%
                </span>
                <span className="px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm font-medium">
                  Time: {data.currentUser.time}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {data?.top3Players.map((p) => {
            let color = "bg-blue-100 text-blue-600";
            let offset = "translate-y-6";
            if (p.rank === 1) {
              color = "bg-[#EBAD25]/20 text-[#EBAD25]";
              offset = "";
            } else if (p.rank === 3) {
              color = "bg-sky-100 text-sky-600";
              offset = "translate-y-10";
            }

            return (
              <div
                key={p.username}
                className={`bg-white rounded-2xl shadow-sm p-6 text-center transform ${offset} transition-all hover:-translate-y-2`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    p.rank === 1 ? "text-[#EBAD25]" : "text-[#2563EB]"
                  }`}
                >
                  #{p.rank}
                </div>
                <div
                  className={`${
                    p.rank === 1 ? "w-24 h-24" : "w-20 h-20"
                  } mx-auto mb-4 rounded-full ${color} flex items-center justify-center overflow-hidden`}
                >
                  {p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={p.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {p.username}
                </h3>
                <p className="text-base font-bold text-[#2563EB] mb-2">
                  {p.score} points
                </p>
                <div className="text-sm text-slate-500">
                  <p>Accuracy: {p.accuracy}%</p>
                  <p>Time: {p.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 mb-8 h-64">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#2563EB] mb-6">
            Full Leaderboard
          </h2>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-slate-700">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left">Rank</th>
                  <th className="pb-3 text-left">Player</th>
                  <th className="pb-3 text-right">Score</th>
                  <th className="pb-3 text-right">Accuracy</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {data?.fullLeaderboard.map((row) => (
                  <tr
                    key={row.username}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <td className="py-3 font-semibold text-[#2563EB]">
                      {row.rank}
                    </td>
                    <td className="py-3">{row.username}</td>
                    <td className="py-3 text-right">{row.score}</td>
                    <td className="py-3 text-right">{row.accuracy}%</td>
                    <td className="py-3 text-right">{row.time}</td>
                  </tr>
                ))}
                {(!data?.fullLeaderboard ||
                  data.fullLeaderboard.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">
                      No records found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push(`/community/challenge/${activeTab}`)}
            className="cursor-pointer px-8 py-3 bg-[#2563EB] hover:bg-[#1E4FCC] text-white rounded-full font-semibold transition-all flex items-center justify-center"
          >
            <RefreshCw className="mr-2 w-5 h-5" /> Play Game
          </button>
          <button
            onClick={() => router.push("/community/challenge")}
            className="cursor-pointer px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full font-semibold transition-all flex items-center justify-center"
          >
            <Home className="mr-2 w-5 h-5" /> Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
