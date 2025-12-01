"use client";

import { AppFooter } from "@/components/app/AppFooter";

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow w-full">{children}</main>
      {/* <AppFooter /> */}
    </div>
  );
}
