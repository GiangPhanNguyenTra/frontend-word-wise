"use client";

import { useState } from "react";
import { Home, Users, MessageSquare, Trophy, BarChart3 } from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "feed", label: "New Feed", icon: Home, href: "/community" },
  { id: "friends", label: "Friends", icon: Users, href: "/community/friends" },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/community/messages",
  },
  {
    id: "challenge",
    label: "Challenge Room",
    icon: Trophy,
    href: "/community/challenge",
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: BarChart3,
    href: "/community/leaderboard",
  },
];

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState("feed");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Community</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-[#E9EFFD] text-[#2563EB] font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Top bar for mobile (below header) */}
      <div className="lg:hidden fixed left-0 right-0 z-20 bg-white border-b flex justify-around items-center py-5 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActive(tab.id)}
              className={`flex flex-col items-center justify-center text-xs ${
                isActive ? "text-[#2563EB]" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 pt-[80px] lg:pt-4 w-full">{children}</main>
    </div>
  );
}
