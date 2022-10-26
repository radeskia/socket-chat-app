import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./providers/auth-context";

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
    // <React.StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </QueryClientProvider>
    </BrowserRouter>
    // </React.StrictMode>
);
