import * as io from "socket.io-client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { handleFetch } from "../utils/handleFetch";
import { useQuery } from "react-query";

const socket = io.connect("http://192.168.100.181:3001");

const ChatApp = () => {
    // Current message (Draft to be sent)
    const [message, setMessage] = useState<any>("");

    /*
    =============================================================
    State that keeps all the messages
    Messages get fetched from db, 
    =============================================================*/
    const [messages, setMessages] = useState<any[]>([]);

    const { isLoading: messagesLoading, data: messagesData } = useQuery(
        [`messages`, messages],
        () => handleFetch(`http://192.168.100.181:3001/messages`, "GET")
    );
    useEffect(() => {
        if (messagesLoading) return;
        setMessages(messagesData);
    }, [messagesData]);

    console.log(messages);

    const handleSendMessage = (message: any) => {
        socket.emit("send_message", { message: `${message}` });

        const copy = [...messages];
        copy.push({
            _id: message + Date.now(),
            message: message,
            time: Date.now(),
        });
        setMessages(copy);
    };

    socket.on("receive_message", (data) => {
        const copy = [...messages];
        copy.push({
            _id: data.id,
            message: data.message,
            time: Date.now(),
        });
        setMessages(copy);
    });

    const copyArr = [...messages];
    const reversed = copyArr.reverse();

    return (
        <>
            {messages.length ? (
                <div className="flex flex-col mx-auto p-2 text-center border justify-between border-gray-700 my-auto shadow-2xl">
                    <div className="flex flex-col">
                        <h1 className="text-lg text-blue-800">Messages:</h1>
                        <div className="flex flex-col-reverse overflow-hidden max-h-96 overflow-y-auto">
                            {reversed.map((message: any) => {
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={message._id}
                                    >
                                        <p className="text-gray-500 p-1 my-2 max-w-max px-2">
                                            {format(
                                                new Date(+message.time),
                                                "HH:mm"
                                            )}
                                        </p>
                                        <p className="text-blue-500 p-1 bg-gray-800 my-2 max-w-fit px-2 break-all">
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
                            className="h-9 w-80 px-4 mt-2 bg-gray-800 text-blue-50 outline-none rounded shadow-lg"
                        />
                        <button
                            className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg"
                            onClick={() => handleSendMessage(message)}
                        >
                            Send message
                        </button>
                    </div>
                </div>
            ) : (
                "loading..."
            )}
        </>
    );
};

export default ChatApp;
