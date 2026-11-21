"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/uploadImage";
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
import { ArrowLeft, Upload, Loader2, ImagePlus } from "lucide-react";

const CATEGORIES = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

export default function AddServicePage() {
    const router = useRouter();

    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("Haircut & Styling");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("active");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleCreateService = async (e) => {
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
        if (!imageFile) {
            toast.error("Please upload a service image file.");
            return;
        }

        setSubmitting(true);
        try {
            const uploadedImageUrl = await uploadImageToImgBB(imageFile);

            await apiRequest("/api/services", {
                method: "POST",
                body: JSON.stringify({
                    serviceName: serviceName.trim(),
                    category,
                    description: description.trim(),
                    price: numPrice,
                    duration: numDuration,
                    image: uploadedImageUrl,
                    status,
                }),
            });

            toast.success("Salon service added successfully!");
            router.push("/dashboard/manage-services");
        } catch (error) {
            toast.error(error.message || "Failed to add service");
        } finally {
            setSubmitting(false);
        }
    };

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
                        New Treatment
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 mt-1">
                        Add Salon Service
                    </h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Publish a new treatment to the TrimBook salon menu.
                    </p>
                </div>

                <form onSubmit={handleCreateService} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="serviceName">Service Name</Label>
                            <Input
                                id="serviceName"
                                type="text"
                                placeholder="e.g., Signature Keratin Smoothing"
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
                                placeholder="45.00"
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
                                placeholder="60"
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
                            placeholder="Describe what is included in this salon service, products used, and expected results..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="rounded-xl resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Service Image (Upload Image File)</Label>
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:bg-zinc-50 cursor-pointer transition">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Service preview"
                                    className="h-44 w-full max-w-sm object-cover rounded-xl shadow-xs"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                                    <ImagePlus className="w-6 h-6" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                                <Upload className="w-4 h-4" />
                                <span>
                                    {imageFile ? imageFile.name : "Click to upload service photo (JPG, PNG, WebP)"}
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
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
                                    Uploading & Saving...
                                </>
                            ) : (
                                "Create Service"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}