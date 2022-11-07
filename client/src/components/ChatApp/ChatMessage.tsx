import { format } from "date-fns";
import { useAuth } from "../../providers/auth-context";
import { MessageProps } from "../../interfaces/Messages";
import { QueryCache, useQueryClient } from "react-query";

const ChatMessage = ({ message, avatar, setModal }: MessageProps) => {
    const { currentUser } = useAuth();

    const queryData = useQueryClient();
    const userData: any = queryData.getQueryData(["chatUsers"]);

    return (
        <div className="flex justify-between" key={message._id ?? message.time}>
            <p
                className={`flex text-gray-500 p-1 my-2 px-2 items-end ${
                    currentUser === message.sender ? "order-1" : "order-2"
                }`}
            >
                {format(new Date(+message.time), "HH:mm")}
            </p>
            <div
                className={`flex ${
                    currentUser === message.sender ? "order-2" : "order-1"
                }`}
            >
                <div
                    className={`relative text-white bg-gray-800 my-1 rounded-xl px-3 py-3 break-all text-justify flex items-center ${
                        currentUser === message.sender
                            ? "order-1 pl-5 rounded-br-none"
                            : "order-2 pr-5 rounded-bl-none bg-gray-700"
                    }`}
                >
                    <p>{message.message}</p>
                    <div
                        className={`absolute h-2 w-2 border-2 border-gray-500 rounded-full bottom-2 ${
                            currentUser === message.sender
                                ? "left-2"
                                : "right-2"
                        } ${message.seen ? "bg-gray-500" : ""}`}
                    ></div>
                </div>
                <div
                    className={`block my-auto mx-2 w-8 h-8 shrink-0 cursor-pointer ${
                        currentUser === message.sender ? "order-2" : "order-1"
                    }`}
                    onClick={() =>
                        setModal({
                            show: true,
                            email: message.sender,
                            first_name: userData.data.find((user: any) => {
                                return user.email === message.sender;
                            }).first_name,
                            last_name: userData.data.find((user: any) => {
                                return user.email === message.sender;
                            }).last_name,
                            avatar: avatar,
                        })
                    }
                >
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
