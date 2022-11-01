import { Route, Routes } from "react-router-dom";
import SocketWrapper from "../components/ChatApp/SocketWrapper";

const Authenticated = () => {
    return (
        <Routes>
            <Route path="/chat" element={<SocketWrapper />}></Route>
            <Route path="*" element={<SocketWrapper />}></Route>
        </Routes>
    );
};

export default Authenticated;
