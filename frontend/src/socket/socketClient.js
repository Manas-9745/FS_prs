// Real-Time Socket.IO Client Factory
// Creates a single socket instance per component lifecycle.
// Caller must disconnect() when done (useEffect cleanup).

import { io } from "socket.io-client";
import { BACKEND_URL } from "../config/api";

/**
 * Creates and returns a Socket.IO client connected to the backend.
 * @param {string} token  JWT from AuthContext
 * @returns {import("socket.io-client").Socket}
 */
export function createSocket(token) {
  return io(BACKEND_URL, {
    auth: { token },          // Passed to server-side JWT middleware
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
}
