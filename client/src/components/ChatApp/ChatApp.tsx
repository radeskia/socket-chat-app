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

    useMemo(() => {
        socket.emit("online", {
            email: currentUser,
        });
    }, []);

    /*
    =============================================================
    ONLINE USERS FEATURE
    Upon successful connection, the backend emits an event named
    "online_users" which contains an array of currently online users.
    We update the state based on the received data.
    =============================================================*/
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    socket.on("online_users", (data: any) => {
        setOnlineUsers(data);
    });

    /*
    =============================================================
    Track & update currently active (open) chat
    
    NOTE: The useRef hook is used for the "isTyping" feature so the
    emitter has access to the LATEST value of the state (fixes the 
    problem where event listeners dont receive the latest change 
    in state)
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
    a new fetch to display the latest message we send.

    The messages fetched are from an endpoint that receives the 
    currently logged in user and the currently opened chat.
    Main refetch happends when changing the currently opened chat.
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
    picked up AND the sender is the same as the currently opened chat,
    we update the local state with the received messages
    thus keeping the chat up to date.
    =============================================================*/

    socket.on("receive_message", async (data: any) => {
        if (data.sender !== currentChat) {
            return;
        } else {
            const copy = [...messages];
            copy.push({
                _id: data.id,
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                seen: data.seen,
                time: data.time,
            });
            setMessages(copy);
        }
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
            seen: false,
            time: Date.now(),
        });
        setMessages(copy);
        setMessage("");
    };

    //
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

    // Get all users, used to make a chat icon for each
    const { isLoading: chatUsersLoading, data: chatUsersData } = useQuery(
        [`chatUsers`],
        () => handleFetch(`http://192.168.100.181:3001/users`, "GET")
    );

    /*
    =============================================================
    TYPING STATUS FEATURE
    Firstly attach a side effect on the message (currently typed message),
    if there is content in the currently typed message, emit a 
    "imTyping" event and supplying the backend with data as to 
    WHO is typing to WHOM. If the message is empty and isn't changing
    emit a "imNotTyping" event also supplying the same fields as above.
    =============================================================*/
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

    // State that keeps the typing status of the oppened chat
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

    /*
    =============================================================
    SEEN STATUS FEATURE
    Upon opening a chat, or upon manually updating the messages 
    array, emit a "mark_seen" event with the "from" property as
    the opened chat and "to" as the currently logged in user.
    The backend finds all messages sent FROM the currently opened
    chat TO the currently logged user and marks them as seen.
    After marking messages as seen, listen for the "marked_seen"
    event. Upon catching the "marked_seen" event, check whether 
    messages array has length AND if ANY of the messages have false
    status. This last part is so we dont update state if not 
    needed, aka all messages already seen.
    =============================================================*/
    useEffect(() => {
        if (
            !currentChat ||
            !messages ||
            messages.every((entity) => entity.seen === true)
        )
            return;
        socket.emit("mark_seen", {
            from: currentChat,
            to: currentUser,
        });
    }, [currentChat, messages, message]);

    socket.on("marked_seen", () => {
        if (
            messages.length &&
            messages.some((entity) => entity.seen === false)
        ) {
            const updatedMessages = messages.map((entity) => {
                return {
                    message: entity.message,
                    _id: entity._id,
                    receiver: entity.receiver,
                    sender: entity.sender,
                    time: entity.time,
                    __v: entity.__v,
                    seen: true,
                };
            });
            setMessages(updatedMessages);
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
            {/* TODO */}
            <div className="text-center border border-gray-700 shadow-2xl h-screen py-4">
                {/* <div className="block text-white">navbar</div> */}
                <div className="flex h-full">
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

                    <ChatMessages
                        messages={messages}
                        setModal={setModal}
                        avatarsData={chatUsersData}
                        message={message}
                        setMessage={setMessage}
                        handleSendMessage={handleSendMessage}
                        isTyping={isTyping}
                        currentChat={currentChat}
                        handleLogout={handleLogout}
                    />
                </div>
            </div>
        </>
    );
};

export default ChatApp;
