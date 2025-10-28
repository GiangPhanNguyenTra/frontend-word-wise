"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  Home,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/collections", label: "Collections", icon: BookOpen },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/trending", label: "Trending", icon: TrendingUp },
];

export const UserHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 py-2 z-50 w-full border-b border-[#BDBDBD] bg-white">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6 md:px-10 lg:px-20">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={32} height={32} />
          <span className="text-xl font-bold text-primary hidden md:block">
            Word Wise
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-black"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Button variant="icon" size="icon" className="group">
            <Bell className="h-4 w- text-black group-hover:w-6 group-hover:h-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="!text-primary !border-[#ababab] hover:!border-primary !rounded-4xl shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    alt="PhanGiang293"
                  />
                  <AvatarFallback>PG</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline">PhanGiang293</span>
                <ChevronDown className="h-4 w-4 hidden lg:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/setting">
                <DropdownMenuItem>Setting</DropdownMenuItem>
              </Link>
              <Link href="/setting/reminder">
                <DropdownMenuItem>Reminder</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
