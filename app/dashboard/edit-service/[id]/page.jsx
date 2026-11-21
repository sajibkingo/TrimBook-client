"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2, Link as LinkIcon } from "lucide-react";

const CATEGORIES = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

export default function EditServicePage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("Haircut & Styling");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("active");
    const [existingImage, setExistingImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchService() {
            try {
                const data = await apiRequest(`/api/services/${id}`);
                if (!isMounted) return;
                setServiceName(data.serviceName || "");
                setCategory(data.category || "Haircut & Styling");
                setDescription(data.description || "");
                setPrice(String(data.price ?? ""));
                setDuration(String(data.duration ?? ""));
                setStatus(data.status || "active");
                setExistingImage(data.image || "");
                setImageUrl(data.image || "");
                setPreviewUrl(data.image || "");
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load service");
                    router.push("/dashboard/manage-services");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (id) fetchService();
        return () => {
            isMounted = false;
        };
    }, [id, router]);

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
            setPreviewUrl(existingImage);
        }
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();

        const numPrice = Number(price);
        const numDuration = Number(duration);

        if (!serviceName.trim()) {
            toast.error("Service name is required.");
            return;
        }
        if (isNaN(numPrice) || numPrice <= 0) {
            toast.error("Price must be a positive number.");
            return;
        }
        if (isNaN(numDuration) || numDuration <= 0) {
            toast.error("Estimated duration must be a positive number.");
            return;
        }

        setSubmitting(true);
        try {
            let finalImageUrl = imageUrl.trim() || existingImage;
            if (imageFile) {
                finalImageUrl = await uploadImageToImgBB(imageFile);
            }

            if (!finalImageUrl) {
                toast.error("Please provide a service image file or URL.");
                setSubmitting(false);
                return;
            }

            await apiRequest(`/api/services/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    serviceName: serviceName.trim(),
                    category,
                    description: description.trim(),
                    price: numPrice,
                    duration: numDuration,
                    image: finalImageUrl,
                    status,
                }),
            });

            toast.success("Service updated successfully!");
            router.push("/dashboard/manage-services");
        } catch (error) {
            toast.error(error.message || "Failed to update service");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading service details..." />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <Link
                    href="/dashboard/manage-services"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Manage Services</span>
                </Link>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Edit Treatment
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 mt-1">
                        Update Salon Service
                    </h1>
                </div>

                <form onSubmit={handleUpdateService} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="serviceName">Service Name</Label>
                            <Input
                                id="serviceName"
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                required
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Service Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="price">Price ($ USD)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="duration">Duration (Minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Service Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Service Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="rounded-xl resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Service Image (Upload New Image File or Paste URL)</Label>
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:bg-zinc-50 cursor-pointer transition">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Service preview"
                                    className="h-44 w-full max-w-sm object-cover rounded-xl shadow-xs"
                                />
                            )}
                            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                                <Upload className="w-4 h-4" />
                                <span>
                                    {imageFile ? imageFile.name : "Click to upload replacement photo"}
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <div className="relative flex items-center py-1">
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
                                className="pl-10 h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/manage-services")}
                            className="h-11 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-11 px-7 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white font-semibold transition-colors cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                "Update Service"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}