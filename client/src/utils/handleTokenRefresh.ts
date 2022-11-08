export const handleTokenRefresh = async (
    updateUser: (token?: string) => void
) => {
    try {
        const response = await fetch("http://192.168.100.181:3001/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
                email: localStorage.getItem("email"),
                refresh_token: localStorage.getItem("refresh_token"),
            }),
        });

        const json = await response.json();

        // Check if response is okay && refresh_token is present in response
        if (
            !response.ok ||
            !json.data.access_token ||
            !json.data.refresh_token
        ) {
            throw new Error(
                `Couldn't refresh access token. Reason: ${json.message}`
            );
        }

        // Update localStorage with new tokens
        localStorage.setItem("access_token", json.data.access_token);
        localStorage.setItem("refresh_token", json.data.refresh_token);

        console.log({
            message: `Refreshed!`,
            newToken: json.data.access_token,
            newRefresh: json.data.refresh_token,
        });

        // return the data to the place where the useQuery hook will be called - OPTIONAL
        return {
            access_token: json.data.access_token,
            refresh_token: json.data.refresh_token,
        };
    } catch (err: any) {
        // Logout user in case fetching new refresh-token fails
        updateUser("");
        localStorage.removeItem("email");
        throw new Error(err.message);
    }
};
