"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    Sparkles,
    ArrowLeft,
    Upload,
    Link as LinkIcon,
    Loader2,
    PlusCircle,
    DollarSign,
    Clock,
    Tag,
    ChevronDown,
    X,
} from "lucide-react";

const CATEGORIES = [
    "Haircut & Styling",
    "Hair Coloring",
    "Facial & Skincare",
    "Manicure & Pedicure",
    "Spa & Massage",
    "Bridal & Makeup",
];

export default function AddServicePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("60");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);

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

    const handleCreateService = async (e) => {
        e.preventDefault();

        if (!serviceName.trim()) {
            toast.error("Service name is required.");
            return;
        }

        const numericPrice = Number(price);
        if (!numericPrice || numericPrice <= 0) {
            toast.error("Please enter a valid price greater than 0.");
            return;
        }

        const numericDuration = Number(duration);
        if (!numericDuration || numericDuration <= 0) {
            toast.error("Please enter a valid duration in minutes.");
            return;
        }

        if (!description.trim()) {
            toast.error("Please provide a description for this treatment.");
            return;
        }

        setSubmitting(true);
        try {
            let finalImage = imageUrl.trim();
            if (imageFile) {
                finalImage = await uploadImageToImgBB(imageFile);
            }

            if (!finalImage) {
                toast.error("Please upload a service image or paste an image URL.");
                setSubmitting(false);
                return;
            }

            const response = await apiRequest("/api/services", {
                method: "POST",
                body: JSON.stringify({
                    serviceName: serviceName.trim(),
                    category,
                    price: numericPrice,
                    duration: numericDuration,
                    description: description.trim(),
                    image: finalImage,
                    isAvailable,
                }),
            });

            toast.success(response.message || "Salon service created successfully!");
            router.push("/dashboard/manage-services");
        } catch (error) {
            toast.error(error.message || "Failed to create salon service");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Luxury Gradient Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Catalog Expansion
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Add New <span className="text-gold-gradient">Salon Service</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Create a new treatment listing with pricing, duration, and cover photo.
                    </p>
                </div>

                <Link
                    href="/dashboard/manage-services"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "relative rounded-full px-5 h-10 border-amber-300/40 bg-zinc-900/80 hover:bg-amber-500/20 text-amber-100 hover:text-white backdrop-blur-md w-fit shrink-0"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to Services
                </Link>
            </div>

            {/* Single Clean Form Card */}
            <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-amber-200/70 shadow-xs">
                <form onSubmit={handleCreateService} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="serviceName">Service Name</Label>
                            <Input
                                id="serviceName"
                                type="text"
                                placeholder="e.g., Signature Balayage & Gloss"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                required
                                className="h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="category">Category</Label>
                            <div className="relative">
                                <Tag className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-11 pl-10 pr-10 appearance-none rounded-xl border border-amber-200/80 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="price">Price (USD)</Label>
                            <div className="relative">
                                <DollarSign className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    placeholder="85.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="duration">Duration (Minutes)</Label>
                            <div className="relative">
                                <Clock className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                    id="duration"
                                    type="number"
                                    min="10"
                                    step="5"
                                    placeholder="60"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                    className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Service Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            placeholder="Describe the treatment steps, botanical products used, and expected results..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="rounded-xl border-amber-200/80 resize-none focus-visible:ring-amber-500/40"
                        />
                    </div>

                    <div className="space-y-3 pt-1">
                        <Label>Treatment Cover Image (Upload File or Paste URL)</Label>

                        {previewUrl && (
                            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-amber-200 bg-zinc-900">
                                <img
                                    src={previewUrl}
                                    alt="Selected treatment cover"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleClearImage}
                                    aria-label="Remove selected image"
                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/75 text-white hover:bg-rose-600 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <label className="flex items-center justify-center gap-2.5 border-2 border-dashed border-amber-300/80 bg-gradient-to-r from-amber-50/50 to-rose-50/40 rounded-2xl p-4 text-sm font-medium text-zinc-700 hover:from-amber-100/50 hover:to-rose-100/40 cursor-pointer transition">
                            <Upload className="w-4 h-4 text-amber-700" />
                            <span>
                                {imageFile
                                    ? `Selected: ${imageFile.name}`
                                    : "Click to upload treatment photo (JPG, PNG, WebP)"}
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
                                placeholder="https://images.unsplash.com/..."
                                value={imageUrl}
                                onChange={handleUrlChange}
                                className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-rose-50/50 border border-amber-200/70">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="isAvailable"
                                className="font-bold text-zinc-900 cursor-pointer"
                            >
                                Active Status
                            </Label>
                            <p className="text-xs text-zinc-500">
                                Make this service immediately visible and bookable by customers.
                            </p>
                        </div>
                        <input
                            id="isAvailable"
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="h-4 w-4 shrink-0 accent-amber-600 rounded cursor-pointer"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Link
                            href="/dashboard/manage-services"
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "h-11 px-6 rounded-full border-amber-200 text-zinc-700 hover:bg-amber-50"
                            )}
                        >
                            Cancel
                        </Link>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-11 px-7 rounded-full btn-luxury-gradient text-white font-semibold shadow-md shadow-amber-500/20 border-0 cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Service...
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Service
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}