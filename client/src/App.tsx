import { useEffect, useState } from "react";
import ChatApp from "./components/ChatApp";
import Authenticated from "./layout/Authenticated";
import Unauthenticated from "./layout/Unauthenticated";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const [user, setUser] = useState<string>("");

    useEffect(() => {
        setUser(localStorage.getItem("username") ?? "");
    }, []);

    console.log(user);

    return (
        <div className="bg-gray-900 min-h-screen flex items-center w-screen">
            {user ? <Authenticated /> : <Unauthenticated />}
        </div>
    );
};

export default App;
