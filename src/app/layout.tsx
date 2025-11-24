"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { useEffect } from "react";
import {
  connectGlobalSocket,
  disconnectGlobalSocket,
} from "@/services/socketService";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function SocketInitializer() {
  useEffect(() => {
    connectGlobalSocket();
    return () => {
      disconnectGlobalSocket();
    };
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <AuthProvider>
          <SocketInitializer />
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton duration={5000} />
      </body>
    </html>
  );
}
