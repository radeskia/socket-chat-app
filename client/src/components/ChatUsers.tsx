import { useAuth } from "../providers/auth-context";

const ChatUsers = ({
    currentChat,
    setCurrentChat,
    chatsData,
    onlineUsers,
}: any) => {
    const { currentUser } = useAuth();

    return (
        <div className="flex flex-col sm:p-2 text-center  sm:m-2 shadow-2xl">
            {chatsData.data.map((x: any) => {
                if (currentUser === x.email) {
                    return;
                } else {
                    return (
                        <div
                            className="flex p-2 mx-2 border border-gray-600 items-center border-r-0 border-l-0 min-w-max cursor-pointer"
                            key={x.email}
                            onClick={() => setCurrentChat(x.email)}
                        >
                            <div className="relative">
                                <img
                                    src={x.avatar}
                                    alt="User Avatar"
                                    className="mr-2 w-10 h-10 rounded-full object-cover"
                                />
                                <div
                                    className={`${
                                        onlineUsers.find(
                                            (entity: any) =>
                                                entity.email === x.email
                                        )
                                            ? "bg-green-600"
                                            : "bg-slate-700"
                                    } rounded-full  w-4 h-4 absolute right-1 bottom-1 border-black border-2`}
                                ></div>
                            </div>
                            <p
                                className={`${
                                    currentChat === x.email
                                        ? "text-white"
                                        : "text-gray-400"
                                }`}
                            >
                                {x.email}
                            </p>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default ChatUsers;
