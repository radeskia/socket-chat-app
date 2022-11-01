// Utilities & externals
import * as io from "socket.io-client";

// Hooks
import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../providers/auth-context";
import { handleFetch } from "../../utils/handleFetch";

// Components
import UserProfileModal from "../Modals/UserProfileModal";
import ChatUsers from "./ChatUsers";
import ChatMessages from "./ChatMessages";

const ChatApp = ({ socket }: any) => {
    const { currentUser, updateUser } = useAuth();

    // const socket = io.connect("http://192.168.100.181:3001", {
    //     // autoConnect: false,
    //     reconnection: false,
    // });

    useMemo(() => {
        socket.emit("online", {
            email: currentUser,
        });
        // .emit("fetch_online");
    }, []);

    /*
    =============================================================
    Track & update currently online users
    =============================================================*/
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    socket.on("online_users", (data: any) => {
        setOnlineUsers(data);
    });

    /*
    =============================================================
    Track & update currently active (open) chat
    =============================================================*/
    const [currentChat, setCurrentChat] = useState<any>("");

    const currentChatRef = useRef(currentChat);

    useEffect(() => {
        currentChatRef.current = currentChat;
    }, [currentChat]);

    /*
    =============================================================
    Track & update current modal state and content
    =============================================================*/
    const [modal, setModal] = useState<any>({
        show: false,
        email: "User Email",
        avatar: "User Avatar",
        messageCount: "0",
    });

    /*
    =============================================================
    Current message
    TODO: Implement message "Draft" functionality that is hooked 
    with a debounce hook & saves the currently typed message into
    local storage (e.g every 10 seconds after the latest onChange)
    =============================================================*/

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
        [`messages`, currentChat, messages],
        () =>
            handleFetch(
                `http://192.168.100.181:3001/chats/${currentUser}/${currentChat}`,
                "GET"
            ),
        {
            enabled: !!currentUser && !!currentChat,
        }
    );

    useEffect(() => {
        if (!messagesData) return;
        setMessages(messagesData.data);
    }, [messagesData]);

    /*
    =============================================================
    In the socket event listener when the "receive_message" event is 
    picked up, we update the local state with the received messages
    thus keeping the chat up to date.
    =============================================================*/

    socket.on("receive_message", async (data: any) => {
        if (data.sender !== currentChat) return;
        const copy = [...messages];
        copy.push({
            _id: data.id,
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            time: data.time,
        });
        setMessages(copy);
    });

    // ACTION HANDLERS
    /*
    =============================================================
    Send message handler & socket event listener
    The send message handler emits a "send_message" event that gets
    picked up by the backend & all connected clients, also we update
    the local copy of the messages with the newly sent message so we 
    dont have to wait & update that one from server.
    =============================================================*/
    const handleSendMessage = (messageContent: any) => {
        socket.emit("send_message", {
            sender: currentUser,
            receiver: currentChat,
            message: `${messageContent}`,
            time: Date.now(),
        });

        const copy = [...messages];
        copy.push({
            _id: message + Date.now(),
            sender: currentUser,
            receiver: currentChat,
            message: message,
            time: Date.now(),
        });
        setMessages(copy);
        setMessage("");
    };

    const handleLogout = () => {
        socket.emit("logout", {
            email: currentUser,
        });
        localStorage.removeItem("email");
        updateUser("");
    };

    socket.on("disconnection", (data: any) => {
        console.log(data.message);
    });

    const { isLoading: chatUsersLoading, data: chatUsersData } = useQuery(
        [`chatUsers`],
        () => handleFetch(`http://192.168.100.181:3001/users`, "GET")
    );

    // TYPING STATUS
    useEffect(() => {
        if (message.length) {
            socket.emit("imTyping", {
                from: currentUser,
                to: currentChat,
            });
        } else {
            socket.emit("imNotTyping", {
                from: currentUser,
                to: currentChat,
            });
        }
    }, [message]);

    // State that keeps the typing status
    const [isTyping, setIsTyping] = useState(false);

    // State that resets the typing to false when chat is changed
    useEffect(() => {
        setIsTyping(false);
    }, [currentChat]);

    // Socket listeners to update above state upon registering an event
    socket.on("isTyping", (data: any) => {
        if (data.to === currentUser && data.from === currentChatRef.current) {
            setIsTyping(true);
        }
    });

    socket.on("isNotTyping", (data: any) => {
        if (data.to === currentUser && data.from === currentChatRef.current) {
            setIsTyping(false);
        }
    });

    return (
        <>
            <UserProfileModal
                showModal={modal.show}
                setShowModal={setModal}
                avatar={modal.avatar}
                email={modal.email}
                messageCount={modal.messageCount}
            />

            <div className="flex text-center border justify-between border-gray-700 shadow-2xl max-h-screen">
                {!chatUsersLoading && onlineUsers && onlineUsers.length ? (
                    <ChatUsers
                        currentChat={currentChat}
                        setCurrentChat={setCurrentChat}
                        chatsData={chatUsersData}
                        onlineUsers={onlineUsers}
                    />
                ) : (
                    <p className="text-white mx-auto h-96">Loading...</p>
                )}

                {messages && messages.length && chatUsersData ? (
                    <>
                        <ChatMessages
                            messages={messages}
                            setModal={setModal}
                            avatarsData={chatUsersData}
                            message={message}
                            setMessage={setMessage}
                            handleSendMessage={handleSendMessage}
                            isTyping={isTyping}
                        />
                    </>
                ) : currentChat ? (
                    <p className="text-white mx-auto h-96">Loading...</p>
                ) : (
                    <p className="text-white mx-auto h-96">Select chat!</p>
                )}
                <button
                    className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg hidden sm:block"
                    onClick={() => handleLogout()}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default ChatApp;
