"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Power,
    Clock,
    Loader2,
    Sparkles,
} from "lucide-react";

export default function ManageServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [togglingId, setTogglingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadAllServices() {
            try {
                const data = await apiRequest("/api/services?all=true");
                if (isMounted) setServices(data);
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load salon services");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAllServices();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleToggleStatus = async (service) => {
        const nextStatus = service.status === "active" ? "inactive" : "active";
        setTogglingId(service._id);

        try {
            await apiRequest(`/api/services/${service._id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
            });

            setServices((prev) =>
                prev.map((item) =>
                    item._id === service._id ? { ...item, status: nextStatus } : item
                )
            );
            toast.success(
                `Service "${service.serviceName}" is now ${nextStatus}.`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDeleteService = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            await apiRequest(`/api/services/${deleteTarget._id}`, {
                method: "DELETE",
            });
            setServices((prev) =>
                prev.filter((item) => item._id !== deleteTarget._id)
            );
            toast.success("Service deleted successfully.");
            setDeleteTarget(null);
        } catch (error) {
            toast.error(error.message || "Failed to delete service");
        } finally {
            setDeleting(false);
        }
    };

    const filteredServices = services.filter((service) => {
        const matchesSearch = service.serviceName
            ?.toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesStatus =
            statusFilter === "all" || service.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <Loader text="Loading salon services..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Service Catalog
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 mt-1">
                        Manage Services
                    </h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Create, edit, delete, or activate/deactivate treatments shown to customers.
                    </p>
                </div>

                <Link
                    href="/dashboard/add-service"
                    className={cn(
                        buttonVariants(),
                        "bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white rounded-xl px-5 h-11 text-sm font-semibold inline-flex items-center gap-2 transition-colors shrink-0"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                </Link>
            </div>

            {/* Search & Status Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search by service name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-zinc-200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {["all", "active", "inactive"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setStatusFilter(tab)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition cursor-pointer ${statusFilter === tab
                                    ? "bg-zinc-900 text-amber-400"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {filteredServices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-14 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900">No Services Found</h2>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto">
                        No salon services match your current filter. Add a new service to get started!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredServices.map((service) => {
                        const isActive = service.status === "active";

                        return (
                            <div
                                key={service._id}
                                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between gap-4"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={
                                            service.image ||
                                            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={service.serviceName}
                                        className="w-24 h-24 rounded-xl object-cover bg-zinc-100 shrink-0"
                                    />

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-amber-700 uppercase truncate">
                                                {service.category}
                                            </span>
                                            {isActive ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-zinc-200 text-zinc-700 hover:bg-zinc-200">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-zinc-900 truncate">
                                            {service.serviceName}
                                        </h3>

                                        <p className="text-xs text-zinc-500 line-clamp-2">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-zinc-800">
                                            <span>${Number(service.price).toFixed(2)}</span>
                                            <span className="inline-flex items-center gap-1 text-zinc-500 font-normal">
                                                <Clock className="w-3.5 h-3.5" />
                                                {service.duration} mins
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={togglingId === service._id}
                                        onClick={() => handleToggleStatus(service)}
                                        className="rounded-xl h-9 px-3 border-zinc-300 cursor-pointer"
                                    >
                                        {togglingId === service._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Power
                                                    className={`w-4 h-4 mr-1.5 ${isActive ? "text-amber-600" : "text-emerald-600"
                                                        }`}
                                                />
                                                {isActive ? "Deactivate" : "Activate"}
                                            </>
                                        )}
                                    </Button>

                                    <Link
                                        href={`/dashboard/edit-service/${service._id}`}
                                        className={cn(
                                            buttonVariants({ variant: "outline", size: "sm" }),
                                            "rounded-xl h-9 px-3 border-zinc-300 inline-flex items-center gap-1.5"
                                        )}
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </Link>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteTarget(service)}
                                        className="rounded-xl h-9 px-3 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Confirm Delete Modal */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Salon Service?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold text-zinc-900">
                                {deleteTarget?.serviceName}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleting}
                            onClick={handleDeleteService}
                            className="rounded-xl cursor-pointer"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Yes, Delete Service"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}