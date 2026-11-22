const RAW_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export async function apiRequest(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("bearer_token") ||
            localStorage.getItem("token") ||
            ""
            : "";

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed. Please try again.");
    }

    return data;
}