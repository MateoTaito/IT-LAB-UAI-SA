// API configuration for handling both local and remote access

// Global variable to store the current selected instance port
let selectedInstancePort: number | null = null;

/**
 * Updates the selected instance port
 * @param port The port number of the selected instance
 */
export const updateSelectedInstancePort = (port: number | null): void => {
    selectedInstancePort = port;
    console.log("Selected instance port updated:", selectedInstancePort);
};

/**
 * Gets the currently selected instance port
 * @returns The current selected instance port or null if none selected
 */
export const getSelectedInstancePort = (): number | null => {
    return selectedInstancePort;
};

/**
 * Determines the correct API base URL based on the current environment and selected instance
 * @returns The appropriate base URL for API calls
 */
export const getApiBaseUrl = (): string => {
    // Use the selected instance port if available, otherwise fallback to default
    const serverPort = selectedInstancePort?.toString() || "3002";

    // If we're running on localhost or 127.0.0.1, use localhost
    if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    ) {
        return `http://localhost:${serverPort}/api`;
    }

    // If we're on an external device, use the server's network IP
    // Extract the IP from the current URL and assume the server is on the same network
    const currentHost = window.location.hostname;

    // Handle cases where the current URL might have a port
    const baseHost = currentHost.replace(/:\d+$/, "");

    return `http://${baseHost}:${serverPort}/api`;
};

/**
 * Gets the API base URL for the selected instance
 * This function will use the updated port when called
 * @returns The current API base URL
 */
export const getSelectedInstanceApiUrl = (): string => {
    return getApiBaseUrl();
};

// Export the base URL for use in API configurations
export const API_INSTANCE_URL = getApiBaseUrl();

// For debugging purposes, log the API URL being used
console.log("API Base URL:", API_INSTANCE_URL);
