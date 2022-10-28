import { useEffect, useState } from "react";
import ChatUsers from "./components/ChatUsers";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import { useAuth } from "./providers/auth-context";

const App = () => {
    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-900 min-h-screen w-screen">
            <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 lg:gap-5">
                {currentUser ? <Authenticated /> : <Unauthenticated />}
                <div className="w-full text-white"></div>
            </div>
        </div>
    );
};

export default App;
