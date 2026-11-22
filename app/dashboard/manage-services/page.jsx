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
    Sparkles,
    Plus,
    Search,
    Clock,
    Power,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react";

export default function ManageServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchAdminServices() {
            try {
                const data = await apiRequest("/api/services/admin/all");
                if (isMounted && Array.isArray(data)) {
                    setServices(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load salon services");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchAdminServices();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleToggleAvailability = async (service) => {
        setActionId(service._id);
        try {
            const updatedStatus = service.isAvailable === false ? true : false;
            const res = await apiRequest(`/api/services/${service._id}`, {
                method: "PATCH",
                body: JSON.stringify({ isAvailable: updatedStatus }),
            });

            setServices((prev) =>
                prev.map((item) =>
                    item._id === service._id
                        ? { ...item, isAvailable: updatedStatus }
                        : item
                )
            );

            toast.success(
                res.message ||
                `Service ${updatedStatus ? "activated" : "deactivated"} successfully`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update service status");
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteService = async (serviceId, serviceName) => {
        setActionId(serviceId);
        try {
            const res = await apiRequest(`/api/services/${serviceId}`, {
                method: "DELETE",
            });

            setServices((prev) => prev.filter((item) => item._id !== serviceId));
            toast.success(res.message || `"${serviceName}" deleted successfully`);
        } catch (error) {
            toast.error(error.message || "Failed to delete service");
        } finally {
            setActionId(null);
        }
    };

    const filteredServices = services.filter((item) => {
        const matchesSearch =
            item.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const isActive = item.isAvailable !== false;
        const matchesStatus =
            statusFilter === "all"
                ? true
                : statusFilter === "active"
                    ? isActive
                    : !isActive;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <Loader text="Loading service catalog..." />;
    }

    return (
        <div className="space-y-6">
            {/* Luxury Gradient Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Service Catalog
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Manage <span className="text-gold-gradient">Services</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Create, edit, delete, or activate/deactivate treatments shown to customers.
                    </p>
                </div>

                <Link
                    href="/dashboard/add-service"
                    className={cn(
                        buttonVariants(),
                        "relative btn-luxury-gradient text-white rounded-full px-6 h-11 font-semibold inline-flex items-center gap-2 w-fit shrink-0 shadow-md shadow-amber-500/20 border-0"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                </Link>
            </div>

            {/* Search Bar & All / Active / Inactive Filter Pills */}
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search by service name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-amber-200/80 bg-zinc-50/50 focus:bg-white focus-visible:ring-amber-500/40"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {[
                        { id: "all", label: "All" },
                        { id: "active", label: "Active" },
                        { id: "inactive", label: "Inactive" },
                    ].map((tab) => {
                        const active = statusFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${active
                                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xs"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-amber-50 hover:text-amber-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2-Column Service Cards Grid (Matching Original Layout with Updated Gradient Theme) */}
            {filteredServices.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-amber-200/70 text-center space-y-3 shadow-xs">
                    <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
                    <h2 className="text-lg font-bold text-zinc-900">
                        No Salon Services Found
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Try adjusting your search or filter, or add a new treatment to your menu.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filteredServices.map((service) => {
                        const isActive = service.isAvailable !== false;

                        return (
                            <div
                                key={service._id}
                                className="group bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-300 transition-all flex flex-col justify-between gap-5"
                            >
                                {/* Top Section: Square Thumbnail + Details */}
                                <div className="flex items-start gap-4">
                                    <img
                                        src={
                                            service.image ||
                                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={service.serviceName}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 ring-1 ring-amber-200/80"
                                    />

                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 truncate">
                                                {service.category}
                                            </span>

                                            {isActive ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-[11px] font-semibold">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-zinc-200 text-zinc-700 hover:bg-zinc-200 text-[11px] font-semibold">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                                            {service.serviceName}
                                        </h3>

                                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center gap-3 pt-1 text-xs">
                                            <span className="font-extrabold text-zinc-950">
                                                ${Number(service.price).toFixed(2)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-zinc-500">
                                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                                {service.duration} mins
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Bar: Deactivate / Edit / Delete */}
                                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3.5 border-t border-amber-100/80">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={actionId === service._id}
                                        onClick={() => handleToggleAvailability(service)}
                                        className="rounded-xl h-9 px-3.5 border-amber-200/90 text-zinc-800 hover:bg-amber-50 hover:text-amber-950 cursor-pointer"
                                    >
                                        {actionId === service._id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <>
                                                <Power className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                                                <span>{isActive ? "Deactivate" : "Activate"}</span>
                                            </>
                                        )}
                                    </Button>

                                    <Link
                                        href={`/dashboard/edit-service/${service._id}`}
                                        className={cn(
                                            buttonVariants({ variant: "outline", size: "sm" }),
                                            "rounded-xl h-9 px-3.5 border-amber-200/90 text-zinc-800 hover:bg-amber-50 hover:text-amber-950"
                                        )}
                                    >
                                        <Pencil className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                                        <span>Edit</span>
                                    </Link>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={actionId === service._id}
                                        onClick={() =>
                                            handleDeleteService(service._id, service.serviceName)
                                        }
                                        className="rounded-xl h-9 px-3.5 border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 hover:text-rose-800 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        <span>Delete</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}