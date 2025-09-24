import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={32} height={32} />
          <span className="text-lg font-bold text-primary">Word Wise</span>
        </Link>

        {/* Navigation & User */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="font-medium text-primary" // Active link
            >
              Home
            </Link>
            <Link
              href="/trending"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Trending
            </Link>
            <Link
              href="/my-vocabulary"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              My Vocabulary
            </Link>
            <Link
              href="/settings"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Settings
            </Link>
          </nav>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
