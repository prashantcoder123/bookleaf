import app from "./app.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// STORE SOCKET INSTANCE GLOBALLY
app.set("io", io);

// SOCKET CONNECTION
io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

});


// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        server.listen(process.env.PORT, () => {
            console.log(`Server running on ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });