import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const socket = io(socketURL);

export default socket;