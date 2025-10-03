"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#contact", label: "Contact us" },
  { href: "#about", label: "About us" },
];

export const Header = () => {
  const [active, setActive] = useState("#home");

  return (
    <header className="fixed top-0 left-0 w-full py-4 z-10 px-28 bg-[#f3f7fc] border-b-1">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={40} height={40} />
          <span className="text-xl font-bold text-primary">Word Wise</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                active === link.href
                  ? "text-primary font-bold"
                  : "text-shape2 hover:text-primary"
              }`}
              onClick={() => setActive(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <Button size="lg" variant={"default"}>
          <Link href="/login">Let&#39;s start</Link>
        </Button>
      </div>
    </header>
  );
};
