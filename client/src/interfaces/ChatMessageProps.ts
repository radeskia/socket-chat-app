// Single chat message props interface
export interface MessageProps {
    message: {
        message: string;
        receiver: string;
        sender: string;
        time: string;
        seen: boolean;
        __v: number;
        _id: string;
    };
    avatar: string;
    setModal: (props: any) => void;
}
