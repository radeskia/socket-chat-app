import { useEffect, useState } from "react";
import ChatApp from "./components/ChatApp";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const [user, setUser] = useState<string>("");

    useEffect(() => {
        setUser(localStorage.getItem("username") ?? "");
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen flex items-center w-screen">
            <Layout />
        </div>
    );
};

export default App;
