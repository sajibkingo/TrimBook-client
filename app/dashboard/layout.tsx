"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

const ADMIN_ONLY_ROUTES = [
    "/dashboard/manage-services",
    "/dashboard/add-service",
    "/dashboard/edit-service",
    "/dashboard/manage-appointments",
    "/dashboard/manage-users",
    "/dashboard/transactions",
];

const CUSTOMER_ONLY_ROUTES = [
    "/dashboard/my-appointments",
    "/dashboard/payment-success",
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [checkingFallback, setCheckingFallback] = useState(false);

    const user = session?.user || verifiedUser;
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (isPending) return;

        if (session?.user) {
            setVerifiedUser(session.user);
            return;
        }

        let isMounted = true;
        setCheckingFallback(true);

        authClient
            .getSession({ query: { disableCookieCache: true } })
            .then(({ data }) => {
                if (!isMounted) return;
                if (data?.user) {
                    setVerifiedUser(data.user);
                } else {
                    router.replace("/sign-in");
                }
            })
            .catch(() => {
                if (isMounted) router.replace("/sign-in");
            })
            .finally(() => {
                if (isMounted) setCheckingFallback(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isPending, session, router]);

    useEffect(() => {
        if (!user) return;

        if (user.isBlocked) {
            router.replace("/sign-in");
            return;
        }

        if (!isAdmin && ADMIN_ONLY_ROUTES.some((route) => pathname?.startsWith(route))) {
            router.replace("/dashboard");
            return;
        }

        if (isAdmin && CUSTOMER_ONLY_ROUTES.some((route) => pathname?.startsWith(route))) {
            router.replace("/dashboard");
        }
    }, [user, isAdmin, pathname, router]);

    if (isPending || checkingFallback || !user) {
        return (
            <div className="min-h-screen bg-luxury-mesh flex items-center justify-center">
                <Loader text="Loading workspace..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-mesh">
            <Sidebar />
            <div className="lg:pl-64">
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}