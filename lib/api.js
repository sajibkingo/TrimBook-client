import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
    let token = "";

    try {
        const tokenRes = await authClient.token();
        token = tokenRes?.data?.token || "";
    } catch (err) {
        token = "";
    }

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError) {
        throw new Error(
            "Unable to reach the server. Please check your connection and try again."
        );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(data.message || "Session expired. Please sign in again.");
        }
        if (response.status === 403) {
            throw new Error(
                data.message || "Access denied. You do not have permission for this action."
            );
        }
        if (response.status === 409) {
            throw new Error(
                data.message ||
                "This time slot was just booked. Please select another slot."
            );
        }
        throw new Error(data.message || "Request failed. Please try again.");
    }

    return data;
}