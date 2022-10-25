import { useState } from "react";
import { Link } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";

const Register = () => {
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

    const handleUserRegister = async (username: string) => {
        if (!handleMockValidation()) {
            setModal({
                show: true,
                title: "Missing fields",
                content: "Please fill all the fields to continue registration",
            });
        } else {
            await handleFetch("http://192.168.100.181:3001/register", "POST", {
                username: username,
                password: password,
            });
        }
    };

    return (
        <>
            <div>
                {modal.show && (
                    <div className="text-white absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
                        <div className="w-80 bg-slate-900 h-36 p-2 flex flex-col justify-between text-center">
                            <p className="text-lg">{modal.title}</p>
                            <p className="text-sm text-slate-400">
                                {modal.content}
                            </p>
                            <button
                                className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                                onClick={() =>
                                    setModal({
                                        show: false,
                                        title: "Modal title",
                                        content:
                                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis non veniam ullam?",
                                    })
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col mx-auto p-6 text-center border justify-between border-gray-700 my-auto shadow-2xl">
                <div className="flex flex-col text-left">
                    <h1 className="text-2xl mb-4 text-center text-cyan-500">
                        Register
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
                        onClick={() => handleUserRegister(username)}
                    >
                        Register
                    </button>
                    <Link
                        to="/login"
                        className="text-sm text-center text-blue-500"
                    >
                        Login?
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Register;
