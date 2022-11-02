// Server related
const express = require("express");
const http = require("http");
const cors = require("cors");

const bodyParser = require("body-parser");

// Socket.io
const { Server } = require("socket.io");

// MongoDB & Mongoose
const mongoose = require("mongoose");

// Schemas
const Message = require("./models/message");

// Routers
const mainRouter = require("./routes/index");

// Initialize express app
const app = express();

// Morgan Logger
const morgan = require("morgan");

// Initialize logger
// app.use(morgan("dev"));

// Middleware
app.use(cors());

// Body Parser Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Must be http.createServer bin/www not working with io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://192.168.100.181:3000",
        methods: ["GET", "POST"],
    },
});

// INITIATE DATABASE CONNECTION
mongoose.connect(
    `mongodb+srv://admin:OH5IW9FVX7dk4EdH@chat-app.nh0g5kb.mongodb.net/chat-app?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

let onlineUsers = [];

// INITIATE SOCKET.IO CONNECTION
io.on("connection", (socket) => {
    // On new connection, log connection ID to console
    console.log(`${socket.id} connected`);

    // Emit online status, join private room
    socket.on("online", async (data) => {
        // console.log(`User online: ${data.email}`);
        await socket.join(data.email);

        if (onlineUsers.some((entity) => entity.email === data.email)) {
            const index = onlineUsers.findIndex(
                (entity) => entity.email === data.email
            );
            onlineUsers.splice(index, 1, { email: data.email, id: socket.id });
        } else {
            onlineUsers.push({
                email: data.email,
                id: socket.id,
            });
        }
        console.log(`Users online: `, onlineUsers);
        io.emit("online_users", onlineUsers);
    });

    // // Emit offline status, disconnect & remove user from onlineUsers
    socket.on("logout", (data) => {
        //Dev console
        console.log(`Disconnected: ${data.email}`);
        //Emit confirmation
        io.to(socket.id).emit("disconnection", {
            message: "bye bye connection",
        });

        // Remove user from onlineUsers
        onlineUsers = onlineUsers.filter(
            (entity) => entity.email !== data.email
        );

        io.emit("online_users", onlineUsers);
        console.log(onlineUsers);
        socket.disconnect();
    });

    // SEND MESSAGE F
    socket.on("send_message", async (data) => {
        // PRIVATE broadcast to receiver
        io.to(data.receiver).emit("receive_message", data);

        // Save new message to db
        try {
            const newMessage = new Message({
                message: data.message,
                sender: data.sender,
                receiver: data.receiver,
                seen: false,
                time: Date.now(),
            });
            await newMessage.save();
            console.log("Message received & saved!");
        } catch (error) {
            console.log(error);
        }
    });

    // TYPING STATUS
    socket.on("imTyping", (data) => {
        io.to(data.to).emit("isTyping", {
            from: data.from,
            to: data.to,
        });
    });

    socket.on("imNotTyping", (data) => {
        io.to(data.to).emit("isNotTyping", {
            from: data.from,
            to: data.to,
        });
    });

    // SEEN STATUS
    socket.on("mark_seen", async (data) => {
        await Message.updateMany(
            {
                sender: data.from,
                receiver: data.to,
            },
            { $set: { seen: true } }
        );
        console.log(`Marked seen from ${data.from} to ${data.to}`);
    });
});

app.use("/", mainRouter);

// Initial server.listen
server.listen(3001, () => {
    console.log(`Running on 3001...`);
});
