import * as io from "socket.io-client";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { handleFetch } from "../../utils/handleFetch";
import { useQueries, useQuery } from "react-query";
import { useAuth } from "../../providers/auth-context";
import UserProfileModal from "../Modals/UserProfileModal";
import ChatUsers from "../ChatUsers";
import ChatMessages from "./ChatMessages";

const socket = io.connect("http://192.168.100.181:3001");

const ChatApp = () => {
    const { currentUser } = useAuth();

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
                avatar={modal.avatar}
                email={modal.email}
                messageCount={modal.messageCount}
            />

            {messages && messages.length && avatarsData ? (
                <div className="flex sm:p-2 text-center border justify-between border-gray-700 sm:m-2 shadow-2xl">
                    <ChatUsers />
                    <ChatMessages />
                </div>
            ) : (
                <p className="text-white mx-auto">loading...</p>
            )}
        </>
    );
};

export default ChatApp;
