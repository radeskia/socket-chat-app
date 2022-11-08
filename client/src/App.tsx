import { useQuery } from "react-query";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import { useAuth } from "./providers/auth-context";
import { handleTokenRefresh } from "./utils/handleTokenRefresh";

const App = () => {
    const { currentUser, updateUser } = useAuth();

    useQuery(
        ["tokenStatus"],
        () => {
            // Skip refresh token handling on login
            if (!currentUser) return;
            handleTokenRefresh(updateUser);
        },
        {
            refetchInterval: 240000,
        }
    );

    return (
        <div className="bg-gray-900 h-full w-screen">
            <div className="mx-2 sm:mx-10 xl:mx-96 min-h-screen h-full">
                {currentUser ? <Authenticated /> : <Unauthenticated />}
                <div className="w-full text-white"></div>
            </div>
        </div>
    );
};

export default App;
