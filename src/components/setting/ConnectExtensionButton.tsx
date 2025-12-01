"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Puzzle } from "lucide-react";
import { toast } from "sonner";
import { getTokenForExtension } from "@/services/settingService";

const EXTENSION_ID = "cgegljjfbifhhdndiepjdbjmnjhfkloi";

export default function ConnectExtensionButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const sendMessageToExtension = (
    token: string
  ): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chrome = (window as any).chrome;

      if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { action: "setPermanentAuthToken", token },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (response: any) => {
            if (chrome.runtime.lastError) {
              reject(new Error("not_installed"));
            } else if (response && response.success) {
              resolve(response);
            } else {
              reject(new Error("send_failed"));
            }
          }
        );
      } else {
        reject(new Error("not_installed"));
      }
    });
  };

  const handleClick = async () => {
    setStatus("loading");

    try {
      const token = await getTokenForExtension();

      await sendMessageToExtension(token);

      setStatus("success");
      toast.success("Successfully connected to WordWise Extension!");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      setStatus("idle");
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      if (errorMessage === "not_installed") {
        toast.error("WordWise extension is not installed or enabled.");
      } else if (errorMessage === "send_failed") {
        toast.error("Failed to send token to extension. Please try again.");
      } else {
        toast.error("Failed to connect. Please try again.");
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={status === "loading" || status === "success"}
      className={`w-full sm:w-auto ${
        status === "success"
          ? "bg-green-600 hover:bg-green-700"
          : "bg-[#2563EB] hover:bg-[#1E4FCC]"
      } text-white`}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
        </>
      ) : status === "success" ? (
        "Connected!"
      ) : (
        <>
          <Puzzle className="mr-2 h-4 w-4" /> Connect with Extension
        </>
      )}
    </Button>
  );
}
