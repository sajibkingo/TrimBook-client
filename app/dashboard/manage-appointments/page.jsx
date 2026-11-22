"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    Clock,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    Sparkles,
    User,
} from "lucide-react";

export default function ManageAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchAllAppointments() {
            try {
                const data = await apiRequest("/api/appointments/admin/all");
                if (isMounted && Array.isArray(data)) {
                    setAppointments(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load customer appointments");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchAllAppointments();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleStatusChange = async (appointmentId, newStatus) => {
        setUpdatingId(appointmentId);
        try {
            const res = await apiRequest(
                `/api/appointments/admin/${appointmentId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === appointmentId ? { ...item, status: newStatus } : item
                )
            );

            toast.success(res.message || `Appointment marked as ${newStatus}`);
        } catch (error) {
            toast.error(error.message || "Failed to update appointment status");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 capitalize">
                        Confirmed
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 capitalize">
                        Cancelled
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 capitalize">
                        Pending
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (paymentStatus) => {
        if (paymentStatus === "paid") {
            return (
                <Badge className="bg-gradient-to-r from-zinc-900 to-amber-950 text-amber-300 border border-amber-400/30 capitalize">
                    Paid
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-zinc-600 border-zinc-300 capitalize">
                Unpaid
            </Badge>
        );
    };

    const filteredAppointments = appointments.filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
    );

    if (loading) {
        return <Loader text="Loading studio appointments..." />;
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Booking Operations
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Manage <span className="text-gold-gradient">Appointments</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Review customer booking requests, confirm time slots, or cancel unavailable bookings.
                    </p>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-amber-200/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    {["all", "pending", "confirmed", "cancelled"].map((tab) => {
                        const active = statusFilter === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${active
                                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xs"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-amber-50 hover:text-amber-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <p className="text-xs font-semibold text-zinc-500">
                    Showing{" "}
                    <span className="font-extrabold text-zinc-950">
                        {filteredAppointments.length}
                    </span>{" "}
                    bookings
                </p>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-amber-200/70 text-center space-y-3 shadow-xs">
                    <CalendarCheck className="w-8 h-8 text-amber-600 mx-auto" />
                    <h2 className="text-lg font-bold text-zinc-900">
                        No Appointments in This Category
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Switch filter tabs above to view other booking statuses.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => {
                        const service = appointment.serviceInfo || {};
                        const customer = appointment.userInfo || {};

                        return (
                            <div
                                key={appointment._id}
                                className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                            >
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                                            {service.category || "Salon Service"}
                                        </span>
                                        {getStatusBadge(appointment.status)}
                                        {getPaymentBadge(appointment.paymentStatus)}
                                    </div>

                                    <h3 className="text-lg font-bold text-zinc-900">
                                        {service.serviceName || "Salon Treatment"}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600">
                                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-800">
                                            <User className="w-4 h-4 text-amber-700" />
                                            <span>
                                                {customer.name || appointment.userName || "Customer"} (
                                                {customer.email || appointment.userEmail})
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-amber-600" />
                                            <span>{appointment.appointmentDate}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                            <span>{appointment.timeSlot}</span>
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 font-extrabold text-amber-900">
                                            ${Number(appointment.servicePrice || service.price || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    {appointment.message && (
                                        <p className="text-xs text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200/70 max-w-2xl">
                                            <span className="font-semibold text-zinc-700">Note:</span>{" "}
                                            {appointment.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100 shrink-0">
                                    {appointment.status !== "confirmed" &&
                                        appointment.paymentStatus !== "paid" && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={updatingId === appointment._id}
                                                onClick={() =>
                                                    handleStatusChange(appointment._id, "confirmed")
                                                }
                                                className="rounded-xl h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                                            >
                                                {updatingId === appointment._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                        Confirm
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                    {appointment.status !== "cancelled" &&
                                        appointment.paymentStatus !== "paid" && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={updatingId === appointment._id}
                                                onClick={() =>
                                                    handleStatusChange(appointment._id, "cancelled")
                                                }
                                                className="rounded-xl h-9 px-4 border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 cursor-pointer"
                                            >
                                                <XCircle className="w-4 h-4 mr-1.5" />
                                                Cancel
                                            </Button>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}