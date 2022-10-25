import * as io from "socket.io-client";
import { useState, useEffect } from "react";
import data from "./data.json";
import { format } from "date-fns";

const socket = io.connect("http://192.168.100.181:3001");

const ChatApp = () => {
    const [message, setMessage] = useState<any>("");
    const [messages, setMessages] = useState<any>(data);

    const sendMessage = (message: any) => {
        socket.emit("send_message", { message: `${message}` });
        const ID = messages.length ?? 1;
        const timeNow = Date.now();

        const copy = [...messages];
        copy.push({ id: ID + 1, message: message, time: timeNow });
        setMessages(copy);
    };

    socket.on("receive_message", (data) => {
        const copy = [...messages];
        copy.push({
            id: copy.length + 1 ?? 1,
            message: data.message,
            time: Date.now(),
        });
        setMessages(copy);
    });

    const copyArr = [...messages];
    const reversed = copyArr.reverse();

    return (
        <div
            className="bg-gray-900 min-h-screen flex items-center w-screen;
"
        >
            <div className="flex flex-col mx-auto p-2 text-center border justify-between border-gray-700 my-auto h-80">
                <div className="flex flex-col">
                    <h1 className="text-lg text-blue-800">Messages:</h1>
                    <div className="flex flex-col-reverse overflow-hidden max-h-48">
                        {reversed.map((message: any) => {
                            return (
                                <div
                                    className="flex justify-between"
                                    key={message.id}
                                >
                                    <p className="text-gray-500 p-1 my-2 max-w-max px-2">
                                        {format(
                                            new Date(message.time),
                                            "hh:mm"
                                        )}
                                    </p>
                                    <p className="text-blue-500 p-1 bg-gray-800 my-2 max-w-max px-2">
                                        {message.message}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <input
                        placeholder="Message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="h-9 w-80 px-4 mt-2 bg-gray-800 text-blue-50 outline-none"
                    />
                    <button
                        className="bg-gray-600 max-w-xs mx-auto px-5 py-1 mt-2"
                        onClick={() => sendMessage(message)}
                    >
                        Send message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
