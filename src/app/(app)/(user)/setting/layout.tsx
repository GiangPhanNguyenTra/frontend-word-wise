"use client";

import { Settings, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "setting", label: "Settings", icon: Settings, href: "/setting" },
  { id: "reminder", label: "Reminder", icon: Bell, href: "/setting/reminder" },
];

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isChatDetail =
    pathname?.startsWith("settings/") && pathname !== "settings";

  if (isChatDetail) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white p-4 border-r">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=phangiang"
              alt="PhanGiang293"
            />
            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              PhanGiang293
            </h3>
            <p className="text-sm text-gray-500">phan.giang@gmail.com</p>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-4" />

        {/* Tabs */}
        <h2 className="text-sm font-medium text-gray-500 mb-3">Menu</h2>
        <nav className="flex flex-col gap-1 mb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/setting" && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.id}
                href={tab.href}
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

        {/* Logout ngay dưới Reminder */}
        <Button
          variant="ghost"
          className="h-10 w-full text-[#C30000] text-[16px] hover:bg-red-50 flex items-center justify-start gap-4 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      {/* Top bar for mobile */}
      <div className="lg:hidden fixed left-0 right-0 z-20 bg-white border-b flex justify-around items-center py-4 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/setting" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.id}
              href={tab.href}
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
      <main className="flex-1 p-4 pt-[80px] lg:pt-8 w-full">{children}</main>
    </div>
  );
}
