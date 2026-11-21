"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Scissors,
    Menu,
    X,
    LayoutDashboard,
    User,
    LogOut,
    ChevronDown,
} from "lucide-react";

const emptySubscribe = () => () => { };

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    const user = session?.user;
    const showLoading = !mounted || isPending;

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully");
                        setMobileMenuOpen(false);
                        window.location.href = "/sign-in";
                    },
                },
            });
        } catch (error) {
            window.location.href = "/sign-in";
        }
    };

    const navLinkClass = (path) =>
        `relative py-1 text-sm font-medium transition-colors ${pathname === path
            ? "text-zinc-950 font-semibold after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-amber-500 after:to-rose-500"
            : "text-zinc-600 hover:text-zinc-950"
        }`;

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-amber-200/50 shadow-[0_2px_20px_-6px_rgba(245,158,11,0.12)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-zinc-900 group"
                    >
                        <span className="p-2 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950 text-amber-400 shadow-sm ring-1 ring-amber-400/30 group-hover:scale-105 transition-transform">
                            <Scissors className="w-5 h-5" />
                        </span>
                        <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-amber-800 bg-clip-text text-transparent">
                            TrimBook
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className={navLinkClass("/")}>
                            Home
                        </Link>
                        <Link href="/services" className={navLinkClass("/services")}>
                            Browse Services
                        </Link>
                        {mounted && user && (
                            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        {showLoading ? (
                            <div className="h-9 w-28 rounded-full bg-zinc-100 animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50/70 to-rose-50/50 hover:from-amber-100/70 hover:to-rose-100/50 transition cursor-pointer focus:outline-none">
                                    <Avatar className="h-8 w-8 ring-2 ring-amber-400/50">
                                        <AvatarImage src={user.image || ""} alt={user.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-zinc-900 to-amber-900 text-amber-300 text-xs font-semibold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-zinc-800 max-w-[130px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 z-50 border-amber-100 shadow-lg">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-semibold text-zinc-900 leading-none">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-zinc-500 truncate">
                                                    {user.email}
                                                </p>
                                                <span className="inline-block w-fit mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900">
                                                    {user.role || "customer"}
                                                </span>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => router.push("/dashboard")}
                                            className="cursor-pointer rounded-xl flex items-center gap-2"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-amber-700" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => router.push("/dashboard/profile")}
                                            className="cursor-pointer rounded-xl flex items-center gap-2"
                                        >
                                            <User className="w-4 h-4 text-amber-700" />
                                            <span>My Profile</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer rounded-xl text-rose-600 focus:text-rose-700 focus:bg-rose-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        "text-zinc-700 hover:text-zinc-950 font-medium rounded-full"
                                    )}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className={cn(
                                        buttonVariants(),
                                        "btn-luxury-gradient text-white rounded-full px-6 font-semibold shadow-sm border-0"
                                    )}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-zinc-700 hover:bg-amber-50 transition"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-amber-200/60 px-4 pt-3 pb-5 space-y-3">
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-800 hover:bg-amber-50"
                        >
                            Home
                        </Link>
                        <Link
                            href="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-800 hover:bg-amber-50"
                        >
                            Browse Services
                        </Link>
                        {mounted && user && (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-800 hover:bg-amber-50"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-800 hover:bg-amber-50"
                                >
                                    My Profile
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="pt-3 border-t border-zinc-100">
                        {showLoading ? (
                            <div className="h-10 w-full rounded-xl bg-zinc-100 animate-pulse" />
                        ) : user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-3">
                                    <Avatar className="h-9 w-9 ring-2 ring-amber-400/50">
                                        <AvatarImage src={user.image || ""} alt={user.name} />
                                        <AvatarFallback className="bg-zinc-900 text-amber-400 text-xs font-semibold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
                                        <p className="text-xs text-zinc-500 capitalize">{user.role || "customer"}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="w-full rounded-xl cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2.5">
                                <Link
                                    href="/sign-in"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        buttonVariants(),
                                        "w-full btn-luxury-gradient text-white rounded-xl border-0"
                                    )}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}