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
                    className={`relative text-blue-500 p-1 bg-gray-800 my-1 rounded-md px-2 break-all text-justify flex items-center ${
                        currentUser === message.sender
                            ? "order-1 pl-7"
                            : "order-2 pr-7"
                    }`}
                >
                    <p>{message.message}</p>
                    <div
                        className={`absolute h-3 w-3 border-2 border-gray-600 rounded-full bottom-1 ${
                            currentUser === message.sender
                                ? "left-1"
                                : "right-1"
                        } ${message.seen ? "bg-gray-600" : ""}`}
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
