import socketIOClient from "socket.io-client";
import { URL } from "./constants";

let socket;

// Lazily create a single shared socket connection (client-side only).
// Reusing one connection avoids opening a new socket per effect/handler.
export const getSocket = () => {
    if (!socket) {
        socket = socketIOClient(URL);
    }
    return socket;
};
