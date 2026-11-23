import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const allCookies = request.cookies.getAll();
    const hasSessionToken =
        Boolean(getSessionCookie(request)) ||
        allCookies.some(
            (cookie) =>
                cookie.name.endsWith("better-auth.session_token") &&
                Boolean(cookie.value)
        );

    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isProtectedServiceDetails =
        pathname.startsWith("/services/") && pathname !== "/services";

    if ((isDashboardRoute || isProtectedServiceDetails) && !hasSessionToken) {
        const signInUrl = new URL("/sign-in", request.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/services/:path+"],
};