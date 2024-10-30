"use client";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const socket = io(SOCKET_URL, {
  // reconnectionAttempts: 5,
  transports: ["websocket"],
  // reconnection: false,
  // autoConnect: false,
  // forceNew: true,
});
