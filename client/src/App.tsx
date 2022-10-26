import { useEffect, useState } from "react";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import { useAuth } from "./providers/auth-context";

const App = () => {
    const { currentUser } = useAuth();

    return (
        <div className="bg-gray-900 min-h-screen flex items-center w-screen">
            {currentUser ? <Authenticated /> : <Unauthenticated />}
        </div>
    );
};

export default App;
