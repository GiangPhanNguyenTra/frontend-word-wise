"use client";

import { useEffect, useRef, useState } from "react";
import { Award, RefreshCw, Share, Home, User } from "lucide-react";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Fill the Blank");
  const confettiContainer = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const game = searchParams.get("game");
    if (game === "definition-match") {
      setActiveTab("Definition Match");
    } else if (game === "fill-the-blank") {
      setActiveTab("Fill the Blank");
    }
  }, [searchParams]);

  useEffect(() => {
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
    const interval = setInterval(createConfetti, 2500);
    createConfetti();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["WordMaster42", "LexiLover", "VocabViking"],
        datasets: [
          {
            label: "Score",
            data: [950, 890, 840],
            backgroundColor: ["#2563EB", "#3B82F6", "#60A5FA"],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.15)" } },
          x: { grid: { color: "rgba(255,255,255,0.1)" } },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => chart.destroy();
  }, []);

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
            {["Fill the Blank", "Definition Match", "Word Shooter"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-all text-[12px] sm:text-base ${
                    activeTab === tab
                      ? "bg-[#2563EB] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-md p-6 mb-8 overflow-hidden">
          <div
            ref={confettiContainer}
            className="absolute inset-0 overflow-hidden"
          />
          <div className="flex flex-col items-center justify-center relative z-10">
            <Award className="w-14 h-14 text-[#EBAD25] mb-3 animate-bounce" />
            <h2 className="text-2xl font-bold text-[#2563EB] mb-2">
              Congratulations WordMaster42!
            </h2>
            <p className="text-slate-600 mb-3">
              You reached the top of the leaderboard with 950 points!
            </p>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-[#EBAD25] text-white rounded-full text-sm font-medium">
                Accuracy: 92%
              </span>
              <span className="px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm font-medium">
                Time: 01:45
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              place: 2,
              name: "LexiLover",
              color: "bg-blue-100 text-blue-600",
              score: 890,
              acc: "88%",
              time: "02:10",
              offset: "translate-y-6",
            },
            {
              place: 1,
              name: "WordMaster42",
              color: "bg-[#EBAD25]/20 text-[#EBAD25]",
              score: 950,
              acc: "92%",
              time: "01:45",
              offset: "",
            },
            {
              place: 3,
              name: "VocabViking",
              color: "bg-sky-100 text-sky-600",
              score: 840,
              acc: "85%",
              time: "02:25",
              offset: "translate-y-10",
            },
          ].map((p) => (
            <div
              key={p.place}
              className={`bg-white rounded-2xl shadow-sm p-6 text-center transform ${p.offset} transition-all hover:-translate-y-2`}
            >
              <div
                className={`text-3xl font-bold mb-2 ${
                  p.place === 1 ? "text-[#EBAD25]" : "text-[#2563EB]"
                }`}
              >
                #{p.place}
              </div>
              <div
                className={`${
                  p.place === 1 ? "w-24 h-24" : "w-20 h-20"
                } mx-auto mb-4 rounded-full ${
                  p.color
                } flex items-center justify-center`}
              >
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {p.name}
              </h3>
              <p className="text-base font-bold text-[#2563EB] mb-2">
                {p.score} points
              </p>
              <div className="text-sm text-slate-500">
                <p>Accuracy: {p.acc}</p>
                <p>Time: {p.time}</p>
              </div>
            </div>
          ))}
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
                {[
                  {
                    rank: 4,
                    name: "GrammarGuru",
                    score: 820,
                    acc: "83%",
                    time: "02:30",
                  },
                  {
                    rank: 5,
                    name: "SyntaxSavant",
                    score: 800,
                    acc: "81%",
                    time: "02:45",
                  },
                  {
                    rank: 6,
                    name: "LinguisticsLover",
                    score: 780,
                    acc: "79%",
                    time: "02:50",
                  },
                  {
                    rank: 7,
                    name: "PhraseFinder",
                    score: 760,
                    acc: "77%",
                    time: "03:05",
                  },
                  {
                    rank: 8,
                    name: "YourUsername",
                    score: 740,
                    acc: "75%",
                    time: "03:15",
                  },
                ].map((row) => (
                  <tr
                    key={row.rank}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <td className="py-3 font-semibold text-[#2563EB]">
                      {row.rank}
                    </td>
                    <td className="py-3">{row.name}</td>
                    <td className="py-3 text-right">{row.score}</td>
                    <td className="py-3 text-right">{row.acc}</td>
                    <td className="py-3 text-right">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="cursor-pointer px-8 py-3 bg-[#2563EB] hover:bg-[#1E4FCC] text-white rounded-full font-semibold transition-all flex items-center justify-center">
            <RefreshCw className="mr-2 w-5 h-5" /> Play Again
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
