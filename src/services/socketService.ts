import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { toast } from "sonner";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_API?.replace("/api/v1", "/ws") ||
  "http://localhost:8080/ws";

let stompClient: any = null;

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
          toast.message(`Game Invite from ${payload.hostName}`, {
            description: `Invited to play in room ${payload.inviteCode}`,
            action: {
              label: "Join",
              onClick: () =>
                (window.location.href = `/community/challenge/join?code=${payload.inviteCode}`),
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
