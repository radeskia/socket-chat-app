import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Unauthenticated = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="*" element={<Login />}></Route>
        </Routes>
    );
};

export default Unauthenticated;
