"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
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
    Loader2,
    CheckCircle2,
} from "lucide-react";

export default function MyProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await apiRequest("/api/auth/me");
                setProfile(data);
                setName(data.name || "");
                setPhone(data.phone || "");
                setImageUrl(data.image || "");
            } catch (error) {
                toast.error(error.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const getInitials = (fullName) => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Full name cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            let finalImage = imageUrl.trim();

            if (imageFile) {
                finalImage = await uploadImageToImgBB(imageFile);
            }

            const result = await apiRequest("/api/users/profile", {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    image: finalImage,
                }),
            });

            await authClient.updateUser({
                name: name.trim(),
                image: finalImage || undefined,
            });

            setProfile(result.user);
            setImageUrl(result.user.image || "");
            setImageFile(null);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader text="Loading your profile..." />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Account Settings
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1">My Profile</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    View and update your personal details and profile photo.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Profile Summary Card */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24 border-2 border-amber-500/40 shadow-xs">
                        <AvatarImage src={imageUrl || profile?.image || ""} alt={profile?.name} />
                        <AvatarFallback className="bg-zinc-900 text-amber-400 text-xl font-bold">
                            {getInitials(profile?.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-zinc-900">{profile?.name}</h2>
                        <p className="text-sm text-zinc-500">{profile?.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className="bg-zinc-900 text-amber-400 hover:bg-zinc-900 uppercase text-[11px] tracking-wider px-3 py-1">
                            {profile?.role || "customer"}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-[11px] px-3 py-1">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                        </Badge>
                    </div>

                    <div className="w-full pt-4 border-t border-zinc-100 space-y-2.5 text-left text-xs text-zinc-600">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Phone</span>
                            <span className="font-medium text-zinc-800">
                                {profile?.phone || "Not added yet"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Account Security</span>
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Edit Profile Form */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
                    <h3 className="text-lg font-bold text-zinc-900 mb-5">
                        Personal Information
                    </h3>

                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-sm font-semibold text-zinc-800">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="pl-10 h-11 rounded-xl border-zinc-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-sm font-semibold text-zinc-800">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-zinc-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-zinc-800">
                                Email Address <span className="text-xs font-normal text-zinc-400">(Cannot be changed)</span>
                            </Label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                    className="pl-10 h-11 rounded-xl bg-zinc-100/80 text-zinc-500 border-zinc-200 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-zinc-800">
                                Profile Photo (Upload New Image or Paste URL)
                            </Label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-zinc-300 rounded-xl py-2.5 px-4 text-sm text-zinc-600 hover:bg-zinc-50 cursor-pointer transition">
                                    <Upload className="w-4 h-4 text-zinc-500" />
                                    <span className="truncate">
                                        {imageFile ? imageFile.name : "Choose Image File"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                                {imageFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setImageFile(null)}
                                        className="text-xs text-rose-600 cursor-pointer"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <Input
                                type="url"
                                placeholder="Or paste image URL (https://...)"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                disabled={!!imageFile}
                                className="h-11 rounded-xl border-zinc-300 mt-2"
                            />
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
                                    "Save Profile Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}