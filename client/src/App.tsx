import { useEffect, useState } from "react";
import ChatUsers from "./components/ChatApp/ChatUsers";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import { useAuth } from "./providers/auth-context";

const App = () => {
    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-900 min-h-screen w-screen">
            <div className="mx-2 sm:mx-10 xl:mx-96 h-screen">
                {currentUser ? <Authenticated /> : <Unauthenticated />}
                <div className="w-full text-white"></div>
            </div>
        </div>
    );
};

export default App;
