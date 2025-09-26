import Link from "next/link";
import Image from "next/image";
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
  PlusCircle,
  TrendingUp,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/collections", label: "Collections", icon: BookOpen },
  { href: "/add-word", label: "Add Word", icon: PlusCircle },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/trending", label: "Trending", icon: TrendingUp },
];

export const UserHeader = () => {
  return (
    <header className="sticky top-0 py-2 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={32} height={32} />
          <span className="text-xl font-bold text-primary hidden md:block">
            Word Wise
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-black transition-colors hover:text-primary"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
