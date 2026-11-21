"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
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

    const user = session?.user;
    const role = user?.role || "customer";

    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.replace("/sign-in");
            return;
        }

        if (user.isBlocked) {
            signOut().then(() => {
                toast.error("Your account is blocked. Contact support.");
                router.replace("/sign-in");
            });
            return;
        }

        const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname?.startsWith(route));
        const isCustomerRoute = CUSTOMER_ONLY_ROUTES.some((route) => pathname?.startsWith(route));

        if (role !== "admin" && isAdminRoute) {
            toast.error("Unauthorized: Admin access only.");
            router.replace("/dashboard");
            return;
        }

        if (role === "admin" && isCustomerRoute) {
            toast.error("Admins cannot access customer booking pages.");
            router.replace("/dashboard");
        }
    }, [user, isPending, pathname, role, router]);

    if (isPending || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <Loader text="Verifying your dashboard access..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF9F6]">
            <Sidebar user={user} />
            <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">{children}</div>
            </div>
        </div>
    );
}