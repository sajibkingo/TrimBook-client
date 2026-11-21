"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
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

const CUSTOMER_ONLY_ROUTES = ["/dashboard/my-appointments"];

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [verifiedUser, setVerifiedUser] = useState(null);
    const [verifyingServer, setVerifyingServer] = useState(true);

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        let isMounted = true;

        async function verifyUserWithServer() {
            try {
                const liveUser = await apiRequest("/api/auth/me");

                if (!isMounted) return;

                if (liveUser.isBlocked) {
                    await signOut();
                    toast.error("Your account has been blocked by the administrator.");
                    router.replace("/sign-in");
                    return;
                }

                const role = liveUser.role || "customer";
                const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
                    pathname?.startsWith(route)
                );
                const isCustomerRoute = CUSTOMER_ONLY_ROUTES.some((route) =>
                    pathname?.startsWith(route)
                );

                if (role !== "admin" && isAdminRoute) {
                    toast.error("Access Denied: Only Admins can access that page.");
                    router.replace("/dashboard");
                    return;
                }

                if (role === "admin" && isCustomerRoute) {
                    toast.error("Access Denied: Customer-only dashboard route.");
                    router.replace("/dashboard");
                    return;
                }

                setVerifiedUser(liveUser);
                setVerifyingServer(false);
            } catch (error) {
                if (!isMounted) return;
                await signOut();
                toast.error(error.message || "Session invalid or blocked. Please sign in again.");
                router.replace("/sign-in");
            }
        }

        verifyUserWithServer();

        return () => {
            isMounted = false;
        };
    }, [session, isPending, pathname, router]);

    if (isPending || verifyingServer || !verifiedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <Loader text="Verifying permissions..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF9F6]">
            <Sidebar user={verifiedUser} />
            <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">{children}</div>
            </div>
        </div>
    );
}