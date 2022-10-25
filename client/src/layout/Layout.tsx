import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Layout = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
        </Routes>
    );
};

export default Layout;
