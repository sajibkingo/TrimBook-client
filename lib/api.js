import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
    let token = "";

    try {
        const sessionRes = await authClient.getSession();
        token =
            sessionRes?.data?.session?.token ||
            sessionRes?.data?.token ||
            "";
    } catch (error) {
        token = "";
    }

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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