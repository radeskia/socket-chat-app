import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

// Initiate global QueryClient options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
