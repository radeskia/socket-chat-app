import * as io from "socket.io-client";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { handleFetch } from "../utils/handleFetch";
import { useQueries, useQuery } from "react-query";
import { useAuth } from "../providers/auth-context";
import UserProfileModal from "./Modals/UserProfileModal";

const socket = io.connect("http://192.168.100.181:3001");

const ChatApp = () => {
    const { currentUser } = useAuth();

    // User Profile Modal
    const [modal, setModal] = useState<any>({
        show: false,
        email: "User Email",
        Avatar: "User Avatar",
        MessageCount: "0",
    });

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

    const uniqueFinal: any[] = [];

    messages &&
        messages.length &&
        messages.reduce((unique: any, o: any) => {
            if (!unique.some((obj: any) => obj.sender === o.sender)) {
                unique.push(o);
                uniqueFinal.push(o.sender);
            }
            return unique;
        }, []);

    const toUrl = uniqueFinal.toString().replaceAll(",", "/");
    const { isLoading: avatarsLoading, data: avatarsData } = useQuery(
        [`avatars`],
        () =>
            handleFetch(`http://192.168.100.181:3001/avatars/${toUrl}`, "GET"),
        {
            enabled: !!uniqueFinal.length && !!toUrl.length,
        }
    );

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
        socket.emit("send_message", {
            sender: currentUser,
            message: `${message}`,
        });

        const copy = [...messages];
        copy.push({
            _id: message + Date.now(),
            sender: currentUser,
            message: message,
            time: Date.now(),
        });
        setMessages(copy);
    };

    socket.on("receive_message", (data) => {
        const copy = [...messages];
        copy.push({
            _id: data.id,
            sender: currentUser,
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
    const [reversed, setReversed] = useState<any[]>([]);

    useEffect(() => {
        if (!messages || !messages.length) {
            return;
        }
        const copyArr = [...messages];
        setReversed(copyArr.reverse());
    }, [messages]);

    console.log(modal);

    return (
        <>
            <UserProfileModal
                showModal={modal.show}
                setShowModal={setModal}
                avatar={modal.Avatar}
                email={modal.email}
                messageCount={modal.MessageCount}
            />
            {reversed.length && avatarsData ? (
                <div className="flex flex-col max-w-full sm:p-2 text-center border justify-between border-gray-700 sm:m-2 shadow-2xl">
                    <div className="flex flex-col mx-2">
                        <h1 className="text-lg text-blue-800 mb-4">
                            Messages:
                        </h1>
                        <div className="flex flex-col-reverse overflow-hidden max-h-96 overflow-y-auto scrollbar">
                            {reversed.map((message: any) => {
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={message._id}
                                    >
                                        <p
                                            className={`flex text-gray-500 p-1 my-2 px-2 items-end ${
                                                currentUser === message.sender
                                                    ? "order-1"
                                                    : "order-2"
                                            }`}
                                        >
                                            {format(
                                                new Date(+message.time),
                                                "HH:mm"
                                            )}
                                        </p>
                                        <div
                                            className={`flex ${
                                                currentUser === message.sender
                                                    ? "order-2"
                                                    : "order-1"
                                            }`}
                                        >
                                            <p
                                                className={`text-blue-500 p-1 bg-gray-800 my-1 rounded-md px-2 break-all text-justify flex items-center ${
                                                    currentUser ===
                                                    message.sender
                                                        ? "order-1"
                                                        : "order-2"
                                                }`}
                                            >
                                                {message.message}
                                            </p>
                                            <div
                                                className={`block my-auto mx-2 w-8 h-8 shrink-0 cursor-pointer ${
                                                    currentUser ===
                                                    message.sender
                                                        ? "order-2"
                                                        : "order-1"
                                                }`}
                                                onClick={() =>
                                                    setModal({
                                                        show: true,
                                                        email: message.sender,
                                                        Avatar: avatarsData.data.find(
                                                            (user: any) => {
                                                                return (
                                                                    user.email ===
                                                                    message.sender
                                                                );
                                                            }
                                                        ).avatar,
                                                        MessageCount:
                                                            messages.filter(
                                                                (msg) => {
                                                                    return (
                                                                        msg.sender ===
                                                                        message.sender
                                                                    );
                                                                }
                                                            ).length,
                                                    })
                                                }
                                            >
                                                <img
                                                    src={`${
                                                        avatarsData.data.find(
                                                            (user: any) => {
                                                                return (
                                                                    user.email ===
                                                                    message.sender
                                                                );
                                                            }
                                                        ).avatar ||
                                                        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                                                    }`}
                                                    alt=""
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <input
                            placeholder="Message..."
                            onChange={(e) => setMessage(e.target.value)}
                            className="h-9 w-full px-4 mt-2 bg-gray-800 text-blue-50 outline-none rounded shadow-lg"
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
                <p className="text-white mx-auto">loading...</p>
            )}
        </>
    );
};

export default ChatApp;
