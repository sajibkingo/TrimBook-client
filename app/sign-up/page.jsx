"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signUp, signIn } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImageUrl("");
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        if (url.trim()) {
            setImageFile(null);
            setPreviewUrl(url.trim());
        } else {
            setPreviewUrl("");
        }
    };

    const handleClearImage = () => {
        setImageFile(null);
        setImageUrl("");
        setPreviewUrl("");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your full name.");
            return;
        }

        if (
            password.length < 6 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password)
        ) {
            toast.error(
                "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter."
            );
            return;
        }

        setLoading(true);
        try {
            let finalAvatar = imageUrl.trim();
            if (imageFile) {
                finalAvatar = await uploadImageToImgBB(imageFile);
            }

            const { error } = await signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                image: finalAvatar || undefined,
            });

            if (error) {
                toast.error(error.message || "Failed to create account.");
                return;
            }

            toast.success("Account created successfully! Welcome to TrimBook.");
            router.push("/");
            router.refresh();
        } catch (err) {
            toast.error(err.message || "Something went wrong during registration.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            toast.error(err.message || "Google sign-in failed.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-luxury-mesh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xl shadow-amber-500/10 space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <BrandLogo />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 pt-1">
                        Create your account
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Book your next salon &amp; spa experience in seconds
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Sajib Kumar Saha"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                        />
                    </div>

                    <div className="space-y-2.5 pt-1">
                        <Label>Profile Image (Upload Image or Paste URL)</Label>

                        {previewUrl && (
                            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={previewUrl}
                                        alt="Profile preview"
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/50"
                                    />
                                    <span className="text-xs font-medium text-zinc-700 truncate max-w-[180px]">
                                        {imageFile ? imageFile.name : "Custom photo selected"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClearImage}
                                    aria-label="Remove image"
                                    className="p-1.5 rounded-full text-zinc-500 hover:bg-rose-100 hover:text-rose-700 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-amber-300/80 bg-gradient-to-r from-amber-50/50 to-rose-50/40 rounded-2xl p-3 text-sm font-medium text-zinc-700 hover:from-amber-100/50 hover:to-rose-100/40 cursor-pointer transition">
                            <Upload className="w-4 h-4 text-amber-700" />
                            <span>
                                {imageFile ? `Selected: ${imageFile.name}` : "Upload Image"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <Input
                            type="url"
                            placeholder="Or paste profile image URL (optional)"
                            value={imageUrl}
                            onChange={handleUrlChange}
                            className="h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full h-11 rounded-full btn-luxury-gradient text-white font-semibold shadow-md shadow-amber-500/20 border-0 cursor-pointer mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                <div className="relative flex items-center">
                    <div className="grow border-t border-amber-200/70" />
                    <span className="mx-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        OR CONTINUE WITH
                    </span>
                    <div className="grow border-t border-amber-200/70" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    disabled={loading || googleLoading}
                    onClick={handleGoogleSignUp}
                    className="w-full h-11 rounded-full border-amber-200/90 bg-white hover:bg-amber-50/70 text-zinc-900 font-semibold shadow-xs cursor-pointer"
                >
                    {googleLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-amber-700" />
                    ) : (
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.23 1.18-3.26 0-6.02-2.2-7-5.16H1.01v3.14C3.05 21.2 7.24 24 12 24Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5 14.01c-.25-.74-.39-1.54-.39-2.36 0-.82.14-1.62.39-2.36V6.15H1.01C.37 7.43 0 8.87 0 10.39s.37 2.96 1.01 4.24l3.99-3.12Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.75c1.79 0 3.41.62 4.68 1.82l3.51-3.51C18.07 1.19 15.3 0 12 0 7.24 0 3.05 2.8 1.01 6.85l3.99 3.14c.98-2.96 3.74-5.24 7-5.24Z"
                            />
                        </svg>
                    )}
                    <span>Continue with Google</span>
                </Button>

                <p className="text-center text-xs sm:text-sm text-zinc-600">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-bold text-amber-800 hover:text-rose-600 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}