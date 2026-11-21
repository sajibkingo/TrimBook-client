import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    try {
        const { data } = await authClient.token();
        if (data?.token) {
            headers.Authorization = `Bearer ${data.token}`;
        }
    } catch (error) {
        // Public request without session token
    }

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError) {
        throw new Error(
            "Cannot connect to server. Make sure trimbook-server is running on port 5000."
        );
    }

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
}