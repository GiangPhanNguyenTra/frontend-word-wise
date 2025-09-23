import Image from "next/image";
import Link from "next/link";
import React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side */}
      <div className="relative flex items-center justify-center bg-primary p-8 lg:p-12">
        {/* Curved shape */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/2 top-1/2 h-[120%] w-[120%] -translate-y-1/2 transform rounded-full bg-blue-600/30" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <Image
              src="/logo-white.svg"
              alt="Word Wise Logo"
              width={50}
              height={50}
            />
            <span className="text-3xl font-bold text-white">Word Wise</span>
          </Link>
          <Image
            src="/images/landing/hero-illustration.png"
            alt="Auth Illustration"
            width={500}
            height={500}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-card">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
