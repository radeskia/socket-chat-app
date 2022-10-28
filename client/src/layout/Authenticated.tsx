import { Route, Routes } from "react-router-dom";
import ChatApp from "../components/ChatApp/ChatApp";

const Authenticated = () => {
    return (
        <Routes>
            <Route path="/chat" element={<ChatApp />}></Route>
            <Route path="*" element={<ChatApp />}></Route>
        </Routes>
    );
};

export default Authenticated;
