import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  reconnection: true,
  reconnectionAttempts: 1,
  autoConnect: true
});
