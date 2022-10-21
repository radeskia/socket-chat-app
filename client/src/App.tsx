import * as io from "socket.io-client";
import { useState, useEffect } from "react";
const socket = io.connect("http://192.168.100.181:3001");

const App = () => {
    const [message, setMessage] = useState<any>("");
    const [messages, setMessages] = useState<any>([]);

    const sendMessage = (message: any) => {
        socket.emit("send_message", { message: `${message}` });
        const ID = messages.length ?? 1;
        const timeNow = Date.now();
        setMessages([
            ...messages,
            { id: ID + 1, message: message, time: timeNow },
        ]);
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages([
                ...messages,
                {
                    id: messages.length ?? 1,
                    message: data.message,
                    time: Date.now(),
                },
            ]);
        });
    }, [messages]);
    console.log(messages);

    return (
        <div className="App">
            <div className="bg-gray-900 min-h-screen">
                <div className="flex flex-col mx-auto max-w-sm py-10 align-center justify-center text-center">
                    <input
                        placeholder="Message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="h-9 px-4"
                    />
                    <button
                        className="bg-gray-600 max-w-xs mx-auto px-5 py-1 my-5"
                        onClick={() => sendMessage(message)}
                    >
                        Send message
                    </button>
                    <h1 className="text-lg text-blue-800">Messages:</h1>
                    {messages.map((message: any) => {
                        return (
                            <p className="text-blue-500" key={message.id}>
                                {message.message}
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default App;
