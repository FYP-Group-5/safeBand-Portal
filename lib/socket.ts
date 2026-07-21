import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export function connectSocket(explicitToken?: string): Socket {
  if (socket?.connected) return socket;

  let token = explicitToken || "";
  const g = globalThis as any;
  if (!token && typeof g !== "undefined" && g.document && g.document.cookie) {
    const match =
      g.document.cookie.match(/(?:^|; )client_token=([^;]*)/) ||
      g.document.cookie.match(/(?:^|; )session_token=([^;]*)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket!.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinRoom(room: string): void {
  if (socket?.connected) {
    socket.emit("join-room", room);
  }
}
