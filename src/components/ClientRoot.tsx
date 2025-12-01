"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { useEffect } from "react";
import {
  connectGlobalSocket,
  disconnectGlobalSocket,
} from "@/services/socketService";

function SocketInitializer(): React.ReactNode {
  const { user } = useAuth();

  useEffect(() => {
    if (user) connectGlobalSocket();

    return () => disconnectGlobalSocket();
  }, [user]);

  return null;
}

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketInitializer />
      {children}
      <Toaster position="top-right" richColors closeButton duration={5000} />
    </AuthProvider>
  );
}
