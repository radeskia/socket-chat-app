import * as io from "socket.io-client";
import ChatApp from "./ChatApp";

const SocketWrapper = () => {
    const socket = io.connect("http://192.168.100.181:3001", {
        // autoConnect: false,
        reconnection: false,
    });
    return <>{socket && <ChatApp socket={socket} />}</>;
};

export default SocketWrapper;
