import { io } from "socket.io-client";

const socketURL = "https://bookleaf-2t1p.onrender.com";
const socket = io(socketURL);

export default socket; 