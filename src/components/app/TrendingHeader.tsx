import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TrendingHeader = () => {
  return (
    <header className="sticky top-0 py-2 z-50 -px-20 w-full  border-b-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={32} height={32} />
          <span className="text-xl font-bold text-primary hidden md:block">
            Word Wise
          </span>
        </Link>
        {/* Navigation & User */}
        <div className="flex items-center gap-6">
          <nav>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-black transition-colors hover:text-primary"
            >
              Home
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
