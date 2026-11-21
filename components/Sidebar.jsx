"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Scissors,
    LayoutDashboard,
    CalendarCheck,
    UserCog,
    Sparkles,
    PlusCircle,
    ClipboardList,
    Users,
    CreditCard,
    Home,
    LogOut,
    Menu,
    X,
} from "lucide-react";

function getInitials(name) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function SidebarContent({ user, isAdmin, links, pathname, setMobileOpen, handleLogout }) {
    return (
        <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 w-64 select-none">
            <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-800/80">
                <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
                    <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Scissors className="w-5 h-5" />
                    </span>
                    <span>TrimBook</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden text-zinc-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="px-4 py-5 border-b border-zinc-800/80">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <Avatar className="h-10 w-10 border border-amber-500/30">
                        <AvatarImage src={user?.image || ""} alt={user?.name} />
                        <AvatarFallback className="bg-amber-500/20 text-amber-400 font-semibold text-xs">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-400">
                            {isAdmin ? "Admin Panel" : "Customer"}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href === "/dashboard/manage-services" && pathname?.startsWith("/dashboard/edit-service"));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-amber-500 text-zinc-950 font-semibold shadow-xs"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-zinc-800/80 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin = user?.role === "admin";

    const customerLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Appointments", href: "/dashboard/my-appointments", icon: CalendarCheck },
        { name: "My Profile", href: "/dashboard/profile", icon: UserCog },
    ];

    const adminLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Manage Services", href: "/dashboard/manage-services", icon: Sparkles },
        { name: "Add Service", href: "/dashboard/add-service", icon: PlusCircle },
        { name: "Manage Appointments", href: "/dashboard/manage-appointments", icon: ClipboardList },
        { name: "Manage Users", href: "/dashboard/manage-users", icon: Users },
        { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
        { name: "My Profile", href: "/dashboard/profile", icon: UserCog },
    ];

    const links = isAdmin ? adminLinks : customerLinks;

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully");
                        router.push("/");
                        router.refresh();
                    },
                },
            });
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <>
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-zinc-950 text-white border-b border-zinc-800">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                    <Scissors className="w-5 h-5 text-amber-400" />
                    <span>TrimBook</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    aria-label="Open Dashboard Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <aside className="hidden lg:block shrink-0">
                <div className="sticky top-0 h-screen">
                    <SidebarContent
                        user={user}
                        isAdmin={isAdmin}
                        links={links}
                        pathname={pathname}
                        setMobileOpen={setMobileOpen}
                        handleLogout={handleLogout}
                    />
                </div>
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10">
                        <SidebarContent
                            user={user}
                            isAdmin={isAdmin}
                            links={links}
                            pathname={pathname}
                            setMobileOpen={setMobileOpen}
                            handleLogout={handleLogout}
                        />
                    </div>
                </div>
            )}
        </>
    );
}