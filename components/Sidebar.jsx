"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Scissors,
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
        <div className="flex flex-col h-full bg-[#18181B] text-zinc-100 w-64 select-none">
            {/* Brand Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800/90">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
                >
                    <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400">
                        <Scissors className="w-5 h-5" />
                    </span>
                    <span>TrimBook</span>
                </Link>

                <button
                    type="button"
                    onClick={onCloseMobile}
                    className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    aria-label="Close Sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* User Summary Card */}
            <div className="p-4">
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-amber-500/40">
                        <AvatarImage src={user?.image || ""} alt={user?.name} />
                        <AvatarFallback className="bg-zinc-800 text-amber-400 text-xs font-bold">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.name || "Member"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                            {isAdmin ? "Admin Panel" : "Customer"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Role-Based Navigation Links */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-amber-500 text-zinc-950 font-semibold shadow-xs"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                                }`}
                        >
                            <Icon
                                className={`w-4 h-4 shrink-0 ${isActive ? "text-zinc-950" : "text-zinc-400"
                                    }`}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-zinc-800/90 space-y-1">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition"
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
    const router = useRouter();
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
            await signOut();
            toast.success("Logged out successfully");
            setMobileOpen(false);
            router.push("/sign-in");
            router.refresh();
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    return (
        <>
            {/* Mobile Top Header Bar */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[#18181B] text-white border-b border-zinc-800">
                <Link href="/" className="flex items-center gap-2 font-bold text-base">
                    <Scissors className="w-4 h-4 text-amber-400" />
                    <span>TrimBook</span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg text-zinc-300 hover:bg-zinc-800"
                    aria-label="Open Dashboard Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Desktop Fixed Sidebar */}
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

            {/* Mobile Slide-Over Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
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