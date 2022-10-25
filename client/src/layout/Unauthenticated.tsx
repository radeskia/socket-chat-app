import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ChatApp from "../components/ChatApp";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Unauthenticated = () => {
    const [user, setUser] = useState<string>("");

    useEffect(() => {
        setUser(localStorage.getItem("username") ?? "");
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login setUser={setUser} />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="*" element={<Login setUser={setUser} />}></Route>
        </Routes>
    );
};

export default Unauthenticated;
