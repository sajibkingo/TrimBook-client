"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, signOut } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handlePostLogin = async () => {
        try {
            const me = await apiRequest("/api/auth/me");

            if (me.isBlocked) {
                await signOut();
                toast.error(
                    "Your account has been blocked. Please contact the salon administrator."
                );
                return;
            }

            toast.success(`Welcome back, ${me.name || "Member"}!`);
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.success("Signed in successfully!");
            router.push("/");
            router.refresh();
        }
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Please enter both your email and password.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                return;
            }

            await handlePostLogin();
        } catch (err) {
            toast.error("Unable to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Google sign-in failed.");
                setGoogleLoading(false);
            }
        } catch (err) {
            toast.error("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-luxury-mesh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-amber-200/70 shadow-xl shadow-amber-500/5 space-y-6">
                <div className="text-center space-y-2.5">
                    <div className="flex justify-center">
                        <BrandLogo />
                    </div>
                    <h1 className="text-2xl font-extrabold text-zinc-900 pt-1">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Sign in to your TrimBook account to manage your salon appointments.
                    </p>
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full h-11 rounded-xl btn-luxury-gradient text-white font-semibold shadow-sm border-0 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="relative flex items-center py-1">
                    <div className="grow border-t border-zinc-200" />
                    <span className="mx-3 text-xs font-medium uppercase text-zinc-400">
                        Or continue with
                    </span>
                    <div className="grow border-t border-zinc-200" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    disabled={loading || googleLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full h-11 rounded-xl border-zinc-300 hover:bg-amber-50/50 font-medium cursor-pointer"
                >
                    {googleLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting to Google...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                                />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-amber-800 hover:text-rose-700 underline underline-offset-4"
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}