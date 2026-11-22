"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    CalendarCheck,
    Sparkles,
    PlusCircle,
    Users,
    CreditCard,
    User,
    Home,
    LogOut,
    Menu,
    X,
} from "lucide-react";

function getInitials(name) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function SidebarContent({
    user,
    isAdmin,
    navLinks,
    pathname,
    onNavigate,
    onCloseMobile,
    onLogout,
}) {
    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#09090B] via-[#18181B] to-[#1E1416] text-zinc-100 w-64 select-none border-r border-zinc-800/80">
            <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800/80">
                <BrandLogo variant="dark" size="sm" onClick={onNavigate} />

                <button
                    type="button"
                    onClick={onCloseMobile}
                    className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    aria-label="Close Sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/80 to-amber-950/30 border border-amber-500/20 flex items-center gap-3.5 shadow-xs">
                    <Avatar className="h-10 w-10 ring-2 ring-amber-400/40 shrink-0">
                        <AvatarImage src={user?.image || ""} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-amber-950 text-amber-300 text-xs font-bold">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex flex-col items-center text-center">
                        <p className="text-sm font-semibold text-white truncate max-w-[130px]">
                            {user?.name || "Member"}
                        </p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/25 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                            {isAdmin ? "Admin Panel" : "Customer"}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold shadow-md shadow-amber-500/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon
                                className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-400"
                                    }`}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-zinc-800/80 space-y-1">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>

                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const user = session?.user;
    const isAdmin = user?.role === "admin";

    const customerLinks = [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Appointments",
            href: "/dashboard/my-appointments",
            icon: CalendarCheck,
        },
        {
            label: "My Profile",
            href: "/dashboard/profile",
            icon: User,
        },
    ];

    const adminLinks = [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Manage Services",
            href: "/dashboard/manage-services",
            icon: Sparkles,
        },
        {
            label: "Add Service",
            href: "/dashboard/add-service",
            icon: PlusCircle,
        },
        {
            label: "Manage Appointments",
            href: "/dashboard/manage-appointments",
            icon: CalendarCheck,
        },
        {
            label: "Manage Users",
            href: "/dashboard/manage-users",
            icon: Users,
        },
        {
            label: "Transactions",
            href: "/dashboard/transactions",
            icon: CreditCard,
        },
        {
            label: "My Profile",
            href: "/dashboard/profile",
            icon: User,
        },
    ];

    const navLinks = isAdmin ? adminLinks : customerLinks;

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully");
                        setMobileOpen(false);
                        window.location.href = "/sign-in";
                    },
                },
            });
        } catch (error) {
            window.location.href = "/sign-in";
        }
    };

    return (
        <>
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-gradient-to-r from-[#09090B] via-[#18181B] to-[#1E1416] text-white border-b border-zinc-800">
                <BrandLogo variant="dark" size="sm" />

                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg text-zinc-300 hover:bg-zinc-800"
                    aria-label="Open Dashboard Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
                <SidebarContent
                    user={user}
                    isAdmin={isAdmin}
                    navLinks={navLinks}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                    onCloseMobile={() => setMobileOpen(false)}
                    onLogout={handleLogout}
                />
            </aside>

            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10">
                        <SidebarContent
                            user={user}
                            isAdmin={isAdmin}
                            navLinks={navLinks}
                            pathname={pathname}
                            onNavigate={() => setMobileOpen(false)}
                            onCloseMobile={() => setMobileOpen(false)}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            )}
        </>
    );
}