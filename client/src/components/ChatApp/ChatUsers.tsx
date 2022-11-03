import { useAuth } from "../../providers/auth-context";

const ChatUsers = ({
    currentChat,
    setCurrentChat,
    chatsData,
    onlineUsers,
    showUsers,
    setShowUsers,
}: any) => {
    const { currentUser } = useAuth();

    return (
        <div
            className={`${
                showUsers
                    ? "w-screen h-screen z-50 absolute bg-gray-900 top-0 right-0 left-0 bottom-0"
                    : "hidden sm:flex flex-col sm:px-2 text-center sm:mx-2 shadow-2xl h-full"
            } `}
        >
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
