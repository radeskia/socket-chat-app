export const handleTokenRefresh = async (
    updateUser: (token?: string) => void
) => {
    const refreshToken = localStorage.getItem("refresh_token") ?? "";

    if (!refreshToken)
        throw new Error("Can't refresh access token. No refresh token found.");

    try {
        const response = await fetch(
            "https://movies.codeart.mk/api/auth/refresh-token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            }
        );

        const data = await response.json();

        // Check if response is okay && refresh_token is present in response
        if (!response.ok || !data.refresh_token) {
            throw new Error(
                `Couldn't refresh access token. Reason: ${data.message}`
            );
        }

        // Update localStorage with new tokens
        // handleUserLocalStorage(data);

        // return the data to the place where the useQuery hook will be called
        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        };
    } catch (err: any) {
        // Logout user in case fetching new refresh-token fails
        // handleLogout(`${err.message}`, updateUser);
        throw new Error(err.message);
    }
};
