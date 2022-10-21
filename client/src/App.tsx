import * as io from "socket.io-client";
import { useState, useEffect } from "react";
import data from "./data.json";
const socket = io.connect("http://192.168.100.181:3001");

const App = () => {
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

    console.log(messages);

    socket.on("receive_message", (data) => {
        const timeNow = Date.now();
        const copy = [...messages];
        copy.push({
            id: copy.length ?? 1,
            message: data.message,
            time: Date.now(),
        });
        setMessages(copy);
    });

    const copyArr = [...messages];
    const reversed = copyArr.reverse();

    return (
        <div className="App">
            <div className="bg-gray-900 min-h-screen flex items-center">
                <div className="flex flex-col mx-auto p-2 text-center border justify-between border-gray-700 my-auto h-80">
                    <div className="flex flex-col">
                        <h1 className="text-lg text-blue-800">Messages:</h1>
                        <div className="flex flex-col-reverse overflow-hidden max-h-48 ">
                            {reversed.map((message: any) => {
                                return (
                                    <p
                                        className="text-blue-500"
                                        key={message.id}
                                    >
                                        {message.message}
                                    </p>
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
        </div>
    );
};

export default App;
