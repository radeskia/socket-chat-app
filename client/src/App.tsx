import { useEffect, useState } from "react";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import { useAuth } from "./providers/auth-context";

const App = () => {
    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-900 min-h-screen w-screen">
            <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 lg:gap-5">
                <div className="w-full text-white"></div>
                {currentUser ? <Authenticated /> : <Unauthenticated />}
                <div className="w-full text-white"></div>
            </div>
        </div>
    );
};

export default App;
