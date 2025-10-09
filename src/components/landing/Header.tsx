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
    <header className="fixed top-0 left-0 right-0 w-full py-4 z-10 bg-[#f3f7fc] border-b border-gray-200 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 md:px-8">
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
        <Button
          size="lg"
          variant="default"
          className="px-4 py-2 text-sm md:px-6 md:py-3 md:text-base"
        >
          <Link href="/login">Let&#39;s start</Link>
        </Button>
      </div>
    </header>
  );
};
