"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
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

    const user = session?.user;
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.replace("/sign-in");
            return;
        }

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
    }, [isPending, user, isAdmin, pathname, router]);

    if (isPending || !user) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <Loader text="Loading workspace..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <Sidebar />
            <div className="lg:pl-64">
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}