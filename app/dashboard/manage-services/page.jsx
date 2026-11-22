"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import {
    Plus,
    Pencil,
    Trash2,
    Power,
    Clock,
    Sparkles,
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";

export default function ManageServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadServices() {
            try {
                const data = await apiRequest("/api/services/admin/all");
                if (isMounted) {
                    setServices(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load salon services.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadServices();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleToggleAvailability = async (service) => {
        const nextState = service.isAvailable === false;
        setActionLoadingId(service._id);
        try {
            await apiRequest(`/api/services/${service._id}`, {
                method: "PATCH",
                body: JSON.stringify({ isAvailable: nextState }),
            });

            setServices((prev) =>
                prev.map((item) =>
                    item._id === service._id ? { ...item, isAvailable: nextState } : item
                )
            );

            toast.success(
                `Service marked as ${nextState ? "Active" : "Inactive"}.`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update service status.");
        } finally {
            setActionLoadingId("");
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await apiRequest(`/api/services/${deleteTarget._id}`, {
                method: "DELETE",
            });

            setServices((prev) =>
                prev.filter((item) => item._id !== deleteTarget._id)
            );
            toast.success(`"${deleteTarget.serviceName}" deleted successfully.`);
            setDeleteTarget(null);
        } catch (error) {
            toast.error(error.message || "Failed to delete service.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading salon services..." />;
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 border border-amber-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Service Catalog Control
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Manage <span className="text-gold-gradient">Salon Services</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-300">
                        Update treatment pricing, toggle booking availability, or remove outdated services.
                    </p>
                </div>

                <Link
                    href="/dashboard/add-service"
                    className="h-11 px-6 rounded-full btn-luxury-gradient text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                </Link>
            </div>

            {services.length === 0 ? (
                <div className="bg-white/95 rounded-3xl border border-amber-200/80 p-12 text-center space-y-3">
                    <p className="text-base font-bold text-zinc-900">
                        No salon services found
                    </p>
                    <p className="text-sm text-zinc-500">
                        Start by adding your first luxury treatment to the catalog.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {services.map((service) => {
                        const isActive = service.isAvailable !== false;
                        const isBusy = actionLoadingId === service._id;

                        return (
                            <div
                                key={service._id}
                                className="bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:shadow-amber-500/10 transition flex flex-col justify-between gap-5"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={
                                            service.image ||
                                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={service.serviceName}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-amber-200/70"
                                    />

                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold uppercase tracking-wider truncate">
                                                {service.category}
                                            </span>

                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${isActive
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-zinc-200 text-zinc-600"
                                                    }`}
                                            >
                                                {isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 truncate">
                                            {service.serviceName}
                                        </h2>

                                        <p className="text-xs text-zinc-500 line-clamp-2">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center gap-4 pt-1 text-xs font-bold">
                                            <span className="text-zinc-900">
                                                ${Number(service.price || 0).toFixed(2)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-zinc-500 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                                {service.duration} mins
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-amber-100 flex items-center justify-center sm:justify-end gap-2.5 flex-wrap">
                                    <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleToggleAvailability(service)}
                                        className="h-9 px-4 rounded-full border border-amber-200 bg-white hover:bg-amber-50 text-zinc-800 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Power className="w-3.5 h-3.5 text-amber-700" />
                                        <span>{isActive ? "Deactivate" : "Activate"}</span>
                                    </button>

                                    <Link
                                        href={`/dashboard/edit-service/${service._id}`}
                                        className="h-9 px-4 rounded-full border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </Link>

                                    <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => setDeleteTarget(service)}
                                        className="h-9 px-4 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => !deleting && setDeleteTarget(null)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-3xl border border-amber-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold tracking-tight">
                                        Delete Salon Service?
                                    </h3>
                                    <p className="text-xs text-zinc-300">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteTarget(null)}
                                aria-label="Close modal"
                                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <p className="text-sm text-zinc-600 leading-relaxed">
                                Are you sure you want to permanently delete{" "}
                                <span className="font-bold text-zinc-900">
                                    &ldquo;{deleteTarget.serviceName}&rdquo;
                                </span>{" "}
                                from the TrimBook catalog?
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={() => setDeleteTarget(null)}
                                    className="h-10 px-5 rounded-full border border-amber-200 bg-white hover:bg-amber-50 text-zinc-800 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleConfirmDelete}
                                    className="h-10 px-5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-rose-500/25 transition cursor-pointer disabled:opacity-50"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Yes, Delete Service</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}