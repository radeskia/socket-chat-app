import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useAuth } from "../../providers/auth-context";
import ChatUsers from "./ChatUsers";
import ChatMessage from "./ChatMessage";

const ChatMessages = ({
    messages,
    setModal,
    chatsData,
    message,
    setMessage,
    handleSendMessage,
    isTyping,
    currentChat,
    handleLogout,
    setCurrentChat,
    onlineUsers,
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

    const [showUsers, setShowUsers] = useState(false);

    return (
        <div className="flex flex-col mx-2 w-full justify-between">
            <>
                <div>
                    <div className="text-lg text-white flex justify-between items-center">
                        <div
                            className="sm:hidden cursor-pointer"
                            onClick={() => setShowUsers(!showUsers)}
                        >
                            {showUsers ? (
                                <ChatUsers
                                    showUsers={showUsers}
                                    setShowUsers={setShowUsers}
                                    currentChat={currentChat}
                                    chatsData={chatsData}
                                    setCurrentChat={setCurrentChat}
                                    onlineUsers={onlineUsers}
                                />
                            ) : (
                                "Chats"
                            )}
                        </div>
                        <div>Navbar</div>
                        <button
                            className="bg-gray-600 hover:bg-gray-500 px-5 py-1 my-2 rounded shadow-lg text-sm"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </button>
                    </div>
                    <h1 className="text-lg text-blue-800 mb-4">Messages:</h1>
                </div>
                <div className="flex flex-col overflow-hidden ">
                    {currentChat ? (
                        messages && messages.length ? (
                            <>
                                <div className="flex flex-col-reverse overflow-hidden overflow-y-auto scrollbar">
                                    {reversed.length &&
                                        reversed.map((message: any) => {
                                            return (
                                                <ChatMessage
                                                    message={message}
                                                    avatar={
                                                        chatsData.data.find(
                                                            (user: any) => {
                                                                return (
                                                                    user.email ===
                                                                    message.sender
                                                                );
                                                            }
                                                        ).avatar ??
                                                        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                                                    }
                                                    setModal={setModal}
                                                    key={
                                                        message._id ??
                                                        message.time
                                                    }
                                                />
                                            );
                                        })}
                                </div>
                                {isTyping ? (
                                    <p className="text-blue-200">
                                        is typing...
                                    </p>
                                ) : (
                                    <p className="invisible">.</p>
                                )}
                            </>
                        ) : (
                            <p className="text-white mx-auto h-96">
                                Loading...
                            </p>
                        )
                    ) : (
                        <p className="text-white mx-auto h-96">Select chat!</p>
                    )}
                    <input
                        placeholder="Message..."
                        onChange={(e) => setMessage(e.target.value)}
                        value={message ?? ""}
                        className="py-3 w-full px-4 mt-2 bg-gray-800 text-blue-50 outline-none rounded shadow-lg"
                    />
                    <button
                        className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg"
                        onClick={() => handleSendMessage(message)}
                    >
                        Send message
                    </button>
                </div>
            </>
        </div>
    );
};

export default ChatMessages;
