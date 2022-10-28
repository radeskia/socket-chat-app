import { useQuery } from "react-query";
import { handleFetch } from "../utils/handleFetch";

const ChatUsers = () => {
    const { isLoading: chatsLoading, data: chatsData } = useQuery(
        [`avatars`],
        () => handleFetch(`http://192.168.100.181:3001/chats`, "GET")
    );

    return (
        <div className="flex flex-col sm:p-2 text-center  sm:m-2 shadow-2xl">
            {!chatsLoading && chatsData
                ? chatsData.data.map((x: any) => {
                      return (
                          <div className="flex p-2 mx-2 border border-gray-600 items-center border-r-0 border-l-0 min-w-max">
                              <img
                                  src={x.avatar}
                                  alt="User Avatar"
                                  className="mr-2 w-8 h-8 rounded-full object-cover"
                              />
                              <p className="text-gray-400">{x.email}</p>
                          </div>
                      );
                  })
                : "loading..."}
        </div>
    );
};

export default ChatUsers;
