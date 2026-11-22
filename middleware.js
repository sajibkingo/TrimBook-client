import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const sessionCookie =
        getSessionCookie(request) ||
        request.cookies.get("__Secure-better-auth.session_token")?.value ||
        request.cookies.get("better-auth.session_token")?.value;

    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isProtectedServiceDetails =
        pathname.startsWith("/services/") && pathname !== "/services";

    if ((isDashboardRoute || isProtectedServiceDetails) && !sessionCookie) {
        const signInUrl = new URL("/sign-in", request.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/services/:path+"],
};