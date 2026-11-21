"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
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
    LogOut,
    ChevronDown,
} from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    const user = session?.user;

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully");
                        setMobileMenuOpen(false);
                        router.push("/");
                        router.refresh();
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const navLinkClass = (path) =>
        `text-sm font-medium transition-colors ${pathname === path
            ? "text-zinc-950 font-semibold underline underline-offset-8 decoration-amber-600 decoration-2"
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
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-zinc-900"
                    >
                        <span className="p-2 rounded-xl bg-zinc-900 text-amber-400 shadow-xs">
                            <Scissors className="w-5 h-5" />
                        </span>
                        <span>TrimBook</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className={navLinkClass("/")}>
                            Home
                        </Link>
                        <Link href="/services" className={navLinkClass("/services")}>
                            Browse Services
                        </Link>
                        {user && (
                            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <div className="h-9 w-28 rounded-full bg-zinc-100 animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition cursor-pointer focus:outline-none">
                                        <Avatar className="h-8 w-8 border border-zinc-200">
                                            <AvatarImage src={user.image || ""} alt={user.name} />
                                            <AvatarFallback className="bg-zinc-900 text-amber-400 text-xs font-semibold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-zinc-800 max-w-[130px] truncate">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold text-zinc-900 leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {user.email}
                                            </p>
                                            <span className="inline-block w-fit mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-800">
                                                {user.role || "customer"}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                                        <Link href="/dashboard" className="flex items-center gap-2">
                                            <LayoutDashboard className="w-4 h-4 text-zinc-600" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="text-zinc-700 hover:text-zinc-950 font-medium">
                                    <Link href="/sign-in">Sign In</Link>
                                </Button>
                                <Button asChild className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 font-medium">
                                    <Link href="/sign-up">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-5 space-y-3">
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                        >
                            Home
                        </Link>
                        <Link
                            href="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                        >
                            Browse Services
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="pt-3 border-t border-zinc-100">
                        {isPending ? (
                            <div className="h-10 w-full rounded-lg bg-zinc-100 animate-pulse" />
                        ) : user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-3">
                                    <Avatar className="h-9 w-9 border border-zinc-200">
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
                                    className="w-full rounded-xl"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2.5">
                                <Button variant="outline" asChild className="w-full rounded-xl">
                                    <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                                        Sign In
                                    </Link>
                                </Button>
                                <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl">
                                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}