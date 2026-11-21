"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Upload,
    Link as LinkIcon,
    Loader2,
    Save,
} from "lucide-react";

export default function MyProfilePage() {
    const { data: session, isPending, refetch } = useSession();
    const sessionUser = session?.user;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("customer");
    const [phone, setPhone] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const loadedRef = useRef(false);

    useEffect(() => {
        if (isPending || !sessionUser || loadedRef.current) return;
        loadedRef.current = true;

        async function loadProfile() {
            try {
                const me = await apiRequest("/api/auth/me");
                setName(me.name || "");
                setEmail(me.email || "");
                setRole(me.role || "customer");
                setPhone(me.phone || "");
                setImageUrl(me.image || "");
                setPreviewUrl(me.image || "");
            } catch (error) {
                setName(sessionUser.name || "");
                setEmail(sessionUser.email || "");
                setRole(sessionUser.role || "customer");
                setPhone(sessionUser.phone || "");
                setImageUrl(sessionUser.image || "");
                setPreviewUrl(sessionUser.image || "");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [isPending, sessionUser]);

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

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Full name is required.");
            return;
        }

        setSaving(true);
        try {
            let finalImage = imageUrl.trim();
            if (imageFile) {
                finalImage = await uploadImageToImgBB(imageFile);
            }

            const response = await apiRequest("/api/users/profile", {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    image: finalImage,
                }),
            });

            if (typeof refetch === "function") {
                await refetch();
            }

            setImageFile(null);
            setName(response.user.name || "");
            setPhone(response.user.phone || "");
            setImageUrl(response.user.image || "");
            setPreviewUrl(response.user.image || "");
            toast.success(response.message || "Profile updated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (fullName) => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (isPending || loading) {
        return <Loader text="Loading your profile..." />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Account Settings
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1">My Profile</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    Update your personal contact details and profile avatar.
                </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5">
                <Avatar className="h-20 w-20 border-2 border-amber-500/40 shadow-xs">
                    <AvatarImage src={previewUrl || ""} alt={name} />
                    <AvatarFallback className="bg-zinc-900 text-amber-400 text-xl font-bold">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h2 className="text-xl font-bold text-zinc-900">{name}</h2>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 uppercase text-[11px]">
                            {role}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-[11px]">
                            Active
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-4 h-4 text-zinc-400" />
                        <span>{email}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
                <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 h-11 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 234-5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10 h-11 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address (Read-Only)</Label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="pl-10 h-11 rounded-xl bg-zinc-50 text-zinc-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="role">Account Role (Protected)</Label>
                            <div className="relative">
                                <ShieldCheck className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="role"
                                    type="text"
                                    value={role.toUpperCase()}
                                    disabled
                                    className="pl-10 h-11 rounded-xl bg-zinc-50 text-zinc-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-1">
                        <Label>Profile Image (Upload Photo or Paste URL)</Label>

                        <label className="flex items-center justify-center gap-2.5 border-2 border-dashed border-zinc-300 rounded-xl p-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer transition">
                            <Upload className="w-4 h-4 text-amber-700" />
                            <span>
                                {imageFile
                                    ? `Selected: ${imageFile.name}`
                                    : "Click to upload a new profile photo (JPG, PNG, WebP)"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <div className="relative flex items-center py-0.5">
                            <div className="grow border-t border-zinc-200" />
                            <span className="mx-3 text-xs font-medium uppercase text-zinc-400">
                                Or paste image URL
                            </span>
                            <div className="grow border-t border-zinc-200" />
                        </div>

                        <div className="relative">
                            <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={imageUrl}
                                onChange={handleUrlChange}
                                className="pl-10 h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-11 px-7 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white font-semibold transition-colors cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Profile Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}