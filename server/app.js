const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const fs = require("fs");

// Middleware
app.use(cors());

// Must be http.createServer bin/www not working with io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://192.168.100.181:3000",
        methods: ["GET", "POST"],
    },
});

// Initiate connection listener
io.on("connection", (socket) => {
    // On new connection, log connection ID to console
    console.log(`${socket.id} connected`);

    // On receiving a message, broadcast it to listeners
    socket.on("send_message", async (data) => {
        socket.broadcast.emit("receive_message", data);

        fs.readFile("../client/src/data.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed: ", err);
                return;
            }

            // Convert data into javascript object
            const objectData = JSON.parse(jsonString);

            // Add newly received message to above object
            objectData.push({
                id: objectData.length + 1,
                message: data.message,
                time: Date.now(),
            });

            // Re-stringify before rewriting the file
            const newData = JSON.stringify(objectData);

            // Write new data
            fs.writeFile("../client/src/data.json", newData, (err) => {
                if (err) {
                    console.log("File not written: ", err);
                }
                console.log(`Message written!`);
            });
        });
    });
});

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Initial server.listen
server.listen(3001, () => {
    console.log(`Running on 3001...`);
});
