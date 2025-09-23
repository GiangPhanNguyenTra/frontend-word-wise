import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#contact", label: "Contact us" },
  { href: "#about", label: "About us" },
];

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full py-6 z-10 px-20 bg-[#f3f7fc]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Word Wise Logo" width={40} height={40} />
          <span className="text-xl font-bold text-primary">Word Wise</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 ">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-shape2 font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <Button className="bg-secondary hover:bg-secondaryShape4 text-white font-bold">
          Let&#39;s start
        </Button>
      </div>
    </header>
  );
};
