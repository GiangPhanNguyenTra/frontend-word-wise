import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { toast } from "sonner";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_API?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

let stompClient: any = null;

const getGameUrl = (gameMode: string, code: string) => {
  switch (gameMode) {
    case "definition-match":
      return `/community/challenge/definition?code=${code}`;
    case "word-shooter":
      return `/community/challenge/word-shooter?code=${code}`;
    case "fill-the-blank":
      return `/community/challenge/fill-blank?code=${code}`;
    default:
      return `/community/challenge?code=${code}`;
  }
};

export const connectGlobalSocket = () => {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  if (stompClient && stompClient.connected) return;

  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);
  stompClient.debug = () => {};

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    () => {
      stompClient.subscribe("/user/queue/notifications", (message: any) => {
        const payload = JSON.parse(message.body);

        if (payload.type === "GAME_INVITE") {
          toast.info(`Invitation from ${payload.hostName}`, {
            description: `Invited you to play ${payload.gameMode}`,
            duration: 10000,
            action: {
              label: "Join Now",
              onClick: () => {
                const url = getGameUrl(payload.gameMode, payload.inviteCode);
                window.location.href = url;
              },
            },
          });
        }
      });
    },
    (error: any) => {
      console.error("Global Socket Error", error);
    }
  );
};

export const disconnectGlobalSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }
};
