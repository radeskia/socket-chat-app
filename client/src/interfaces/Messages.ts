// Message object
export interface MessageObject {
    message: string;
    receiver: string;
    sender: string;
    time: string;
    seen: boolean;
    __v: number;
    _id: string;
}

// Single chat message props interface
export interface MessageProps {
    message: MessageObject;
    avatar: string;
    setModal: (props: any) => void;
}
