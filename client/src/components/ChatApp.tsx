import * as io from "socket.io-client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { handleFetch } from "../utils/handleFetch";
import { useQuery } from "react-query";

const socket = io.connect("http://192.168.100.181:3001");

const ChatApp = () => {
    /*
    =============================================================
    TODO: Implement message "Draft" functionality that is hooked 
    with a debounce hook & saves the currently typed message into
    local storage (e.g every 10 seconds after the latest onChange)
    =============================================================*/
    // Current message
    const [message, setMessage] = useState<any>("");

    /*
    =============================================================
    State that keeps all the messages
    Messages get fetched from db, and are stored in this state,
    also when sending a new message it gets added into this state
    while being sent to the backend, this is so we dont wait for
    a new fetch to display the latest message we send
    =============================================================*/
    const [messages, setMessages] = useState<any[]>([]);

    const { isLoading: messagesLoading, data: messagesData } = useQuery(
        [`messages`, messages],
        () => handleFetch(`http://192.168.100.181:3001/messages`, "GET"),
        {
            enabled: messages && !messages.length,
        }
    );
    useEffect(() => {
        if (messagesLoading) return;
        setMessages(messagesData);
    }, [messagesLoading]);

    /*
    =============================================================
    Send message handler & socket event listener
    The send message handler emits a "send_message" event that gets
    picked up by the backend & all connected clients, also we update
    the local copy of the messages with the newly sent message so we 
    dont have to wait & update that one from server.

    In the socket event listener when the "receive_message" event is 
    picked up, we update the local state with the received messages
    thus keeping the chat up to date.
    =============================================================*/
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

    /*
    =============================================================
    We make a copy of the array and we reverse the order, so we 
    can show the latest messages at the bottom.
    =============================================================*/
    const copyArr = [...messages];
    const reversed = copyArr.reverse();

    return (
        <>
            {messages?.length ? (
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
                                        <p className="flex text-gray-500 p-1 my-2 max-w-max px-2 items-end">
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
