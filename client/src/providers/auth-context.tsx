import React, { createContext, useContext, useState } from "react";

interface AuthContextStateProps {
    currentUser: string;
    updateUser: (email: string) => void;
}

const initialState: any = {};
const AuthContext = createContext(initialState);
const { Provider } = AuthContext;

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string>(() => {
        return localStorage.getItem("email")
            ? localStorage.getItem("email") || ""
            : "";
    });
    const handleUserChange = (user: string) => {
        setUserToken(user);
    };

    const contextValue: AuthContextStateProps = {
        currentUser: userToken,
        updateUser: handleUserChange,
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

const useAuth = () => useContext(AuthContext);
export { AuthContextProvider, useAuth, AuthContext };
