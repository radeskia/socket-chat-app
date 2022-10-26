import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth-context";
import { handleFetch } from "../utils/handleFetch";

const Login = () => {
    const navigate = useNavigate();

    const { updateUser } = useAuth();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [modal, setModal] = useState<any>({
        show: false,
        title: "Modal title",
        content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis non veniam ullam?",
    });

    const handleMockValidation = () => {
        if (!username || !password) {
            return false;
        } else {
            return true;
        }
    };
    const handleUserLogin = async () => {
        if (!handleMockValidation()) {
            setModal({
                show: true,
                title: "Something went wrong",
                content: "More specific error handling TBD.",
            });
        } else {
            try {
                await handleFetch("http://192.168.100.181:3001/login", "POST", {
                    username: username,
                    password: password,
                });
                updateUser(username);
                localStorage.setItem("username", username);
                navigate("/chat");
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex flex-col mx-auto w-72 p-4 text-center border justify-between border-gray-700 my-auto shadow-2xl">
            <div className="flex flex-col text-left">
                <h1 className="text-2xl mb-4 text-center text-cyan-500">
                    Login
                </h1>
                <h1 className="text-lg text-blue-800">Username:</h1>
                <input
                    placeholder="user@gmail.com"
                    className="h-9 px-4 mt-2 bg-gray-800 mb-6 text-blue-50 outline-none rounded shadow-lg"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <h1 className="text-lg text-blue-800">Password:</h1>
                <input
                    placeholder="**********"
                    type="password"
                    className="h-9 px-4 mt-2 bg-gray-800 text-blue-50 outline-none rounded mb-6 shadow-lg"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                    onClick={() => handleUserLogin()}
                >
                    Login
                </button>
                <Link
                    to="/register"
                    className="text-sm text-center text-blue-500"
                >
                    Register?
                </Link>
            </div>
        </div>
    );
};

export default Login;
