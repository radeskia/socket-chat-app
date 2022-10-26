/**
 * Custom fetch utility function
 * it takes the fetch url, fetch method and possibly a data object as parameters
 * it grabs the access_token from localStorage later used in the request body options
 * tries to fetch data in a try/catch block with error handling
 * returns the promise which is the data or possibly an error
 *
 * @param {string} url - The endpoint of the API we're sending to or receiving from data
 * @param {string} method - The type of method of the request ("POST", "GET", etc...)
 * @param {object | null} body - The object (if any,example - post request) containing the data that we're sending
 * @returns {Promise} - Function returns a promise if successful or error object
 */
export const handleFetch = async (
    url: string,
    method: string,
    body?: object
): Promise<any> => {
    // Get token (if any) before fetching the data
    const token = localStorage.getItem("access_token");

    // Reusable fetch options object with conditional keys depending on request type
    const fetchOptions = {
        method: `${method}`,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    };
    // Try fetching data, on successful fetching return data, else notify error status
    try {
        const res = await fetch(url, { ...fetchOptions });
        // Check response status && return data or throw error

        const json = await res.json();

        return json;
    } catch (error: any) {
        throw Error(error);
    }
};
