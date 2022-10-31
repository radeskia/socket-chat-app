// Utilities & externals
import * as io from "socket.io-client";
// Hooks
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../providers/auth-context";
import { handleFetch } from "../../utils/handleFetch";

// Components
import UserProfileModal from "../Modals/UserProfileModal";
import ChatUsers from "../ChatUsers";
import ChatMessages from "./ChatMessages";

const ChatApp = () => {
    const { currentUser } = useAuth();

    const socket = io.connect("http://192.168.100.181:3001", {
        // autoConnect: false,
        reconnection: false,
    });

    // TODO:Finish user online status functionality
    useMemo(() => {
        socket
            .connect()
            .emit("online", {
                email: currentUser,
            })
            .emit("fetch_online");
    }, []);

    const [onlineUsers, setOnlineUsers] = useState();

    socket.on("online_users", (data) => {
        // console.log(data);
        setOnlineUsers(data);
    });
    console.log(onlineUsers);

    const [currentChat, setCurrentChat] = useState<any>("");

    useEffect(() => {
        localStorage.setItem("currentChat", currentChat);
    }, [currentChat]);

    // User Profile Modal
    const [modal, setModal] = useState<any>({
        show: false,
        email: "User Email",
        avatar: "User Avatar",
        messageCount: "0",
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
        if (messagesLoading || !messagesData) return;
        setMessages(messagesData.data);
    }, [messagesData]);

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
    };

    socket.on("receive_message", (data) => {
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

    const { isLoading: chatsLoading, data: chatsData } = useQuery(
        [`avatars`, currentChat],
        () => handleFetch(`http://192.168.100.181:3001/chats`, "GET")
    );

    return (
        <>
            <UserProfileModal
                showModal={modal.show}
                setShowModal={setModal}
                avatar={modal.avatar}
                email={modal.email}
                messageCount={modal.messageCount}
            />

            <div className="flex sm:p-2  text-center border justify-between border-gray-700 sm:m-2 shadow-2xl h-fit">
                {!chatsLoading && (
                    <ChatUsers
                        currentChat={currentChat}
                        setCurrentChat={setCurrentChat}
                        chatsData={chatsData}
                    />
                )}

                {messages && messages.length && chatsData ? (
                    <>
                        <ChatMessages
                            messages={messages}
                            setModal={setModal}
                            avatarsData={chatsData}
                            message={message}
                            setMessage={setMessage}
                            handleSendMessage={handleSendMessage}
                        />
                    </>
                ) : currentChat ? (
                    <p className="text-white mx-auto h-96">Loading...</p>
                ) : (
                    <p className="text-white mx-auto h-96">Select chat!</p>
                )}
            </div>
        </>
    );
};

export default ChatApp;
