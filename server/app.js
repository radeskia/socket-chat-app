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
app.use(morgan("dev"));

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

// INITIATE SOCKET.IO CONNECTION
io.on("connection", (socket) => {
    // On new connection, log connection ID to console
    console.log(`${socket.id} connected`);

    // On receiving a message, broadcast it to listeners & write to db
    socket.on("send_message", async (data) => {
        socket.broadcast.emit("receive_message", data);

        // Save new message
        try {
            const newMessage = new Message({
                message: data.message,
                sender: data.sender,
                time: Date.now(),
            });
            await newMessage.save();
            console.log("Message received & saved!");
        } catch (error) {
            console.log(error);
        }
    });
});

app.use("/", mainRouter);

// Initial server.listen
server.listen(3001, () => {
    console.log(`Running on 3001...`);
});
