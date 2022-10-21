const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://192.168.100.181:3000 ",
        methods: ["GET", "POST"],
    },
});

// Initiate connection listener
io.on("connection", (socket) => {
    // On new connection, log connection ID to console
    console.log(`${socket.id} connected`);

    // On receiving a message, broadcast it to listeners
    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);

        console.log(data.message);
    });
});

// Initial server.listen
server.listen(3001, () => {
    console.log(`Server running...`);
});
