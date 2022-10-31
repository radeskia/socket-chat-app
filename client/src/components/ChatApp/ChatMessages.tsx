import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useAuth } from "../../providers/auth-context";

const ChatMessages = ({
    messages,
    setModal,
    avatarsData,
    message,
    setMessage,
    handleSendMessage,
}: any) => {
    const { currentUser } = useAuth();

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

    return (
        <div className="flex flex-col mx-2 w-full">
            {messages.length ? (
                <div>
                    <h1 className="text-lg text-blue-800 mb-4">Messages:</h1>

                    <div className="flex flex-col-reverse overflow-hidden h-96 overflow-y-auto scrollbar">
                        {reversed.length &&
                            reversed.map((message: any) => {
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={message._id ?? message.time}
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
                                                        avatar: avatarsData.data.find(
                                                            (user: any) => {
                                                                return (
                                                                    user.email ===
                                                                    message.sender
                                                                );
                                                            }
                                                        ).avatar,
                                                        messageCount:
                                                            messages.filter(
                                                                (msg: any) => {
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
                                                        ).avatar ??
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
                    <input
                        placeholder="Message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="h-14 w-full px-4 mt-2 bg-gray-800 text-blue-50 outline-none rounded shadow-lg"
                    />
                    <button
                        className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg"
                        onClick={() => handleSendMessage(message)}
                    >
                        Send message
                    </button>
                </div>
            ) : (
                "Select chat"
            )}
        </div>
    );
};

export default ChatMessages;