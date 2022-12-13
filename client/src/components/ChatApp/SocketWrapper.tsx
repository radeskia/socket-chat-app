import * as io from "socket.io-client";
import ChatApp from "./ChatApp";
import { URL } from "../../../../env";

const SocketWrapper = () => {
    const socket = io.connect(`${URL}:3001/`, {
        // autoConnect: false,
        reconnection: false,
    });
    return <>{socket && <ChatApp socket={socket} />}</>;
};

export default SocketWrapper;
