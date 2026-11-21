"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    Calendar,
    Clock,
    Eye,
    CheckCircle2,
    XCircle,
    Loader2,
    MessageSquare,
} from "lucide-react";

export default function ManageAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadAppointments() {
            try {
                const data = await apiRequest("/api/appointments");
                if (isMounted) setAppointments(data);
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load appointments");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAppointments();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleStatusChange = async (appointmentId, nextStatus) => {
        setUpdatingId(appointmentId);
        try {
            await apiRequest(`/api/appointments/${appointmentId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
            });

            toast.success(`Appointment ${nextStatus} successfully.`);
            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === appointmentId ? { ...item, status: nextStatus } : item
                )
            );
            if (selectedAppointment?._id === appointmentId) {
                setSelectedAppointment((prev) => ({ ...prev, status: nextStatus }));
            }
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
                <Badge className="bg-zinc-900 text-amber-400 hover:bg-zinc-900 capitalize">
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

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        return new Date(dateValue).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredAppointments = appointments.filter((appt) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
            !query ||
            appt.customerInfo?.name?.toLowerCase().includes(query) ||
            appt.customerInfo?.email?.toLowerCase().includes(query) ||
            appt.serviceInfo?.serviceName?.toLowerCase().includes(query);
        const matchesStatus =
            statusFilter === "all" || appt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <Loader text="Loading all appointment requests..." />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Schedule Operations
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1">
                    Manage Appointments
                </h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    Review customer booking requests, confirm pending appointments, or cancel bookings.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search by customer name, email, or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-zinc-200"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {["all", "pending", "confirmed", "cancelled"].map((tab) => (
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

            {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-14 text-center space-y-2">
                    <h2 className="text-lg font-bold text-zinc-900">
                        No Appointment Requests Found
                    </h2>
                    <p className="text-sm text-zinc-500">
                        No appointments match your current search or filter criteria.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map((appt) => {
                        const customer = appt.customerInfo || {};
                        const service = appt.serviceInfo || {};
                        const canConfirm = appt.status === "pending";
                        const canCancel =
                            appt.status === "pending" || appt.status === "confirmed";

                        return (
                            <div
                                key={appt._id}
                                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-5"
                            >
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar className="h-9 w-9 border border-zinc-200">
                                                <AvatarImage src={customer.image || ""} alt={customer.name} />
                                                <AvatarFallback className="bg-zinc-900 text-amber-400 text-xs font-semibold">
                                                    {(customer.name || "C").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 leading-none">
                                                    {customer.name || "Customer"}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {customer.email || "No email"}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-zinc-300 hidden sm:inline">•</span>
                                        <span className="text-xs text-zinc-400">
                                            Requested: {formatDate(appt.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                        <span className="font-semibold text-zinc-900">
                                            {service.serviceName || "Salon Service"}
                                        </span>
                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70">
                                            {service.category || "Treatment"}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-zinc-600">
                                            <Calendar className="w-4 h-4 text-zinc-400" />
                                            {appt.appointmentDate}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-zinc-600">
                                            <Clock className="w-4 h-4 text-zinc-400" />
                                            {appt.timeSlot}
                                        </span>
                                        <span className="font-bold text-zinc-950">
                                            ${Number(appt.servicePrice).toFixed(2)}
                                        </span>
                                    </div>

                                    {appt.message && (
                                        <div className="flex items-start gap-2 text-xs text-zinc-600 bg-[#FAF9F6] px-3 py-2 rounded-xl border border-zinc-200/70 max-w-2xl">
                                            <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                            <span className="line-clamp-1">{appt.message}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-3 pt-3 xl:pt-0 border-t xl:border-t-0 border-zinc-100 shrink-0">
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(appt.status)}
                                        {getPaymentBadge(appt.paymentStatus)}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedAppointment(appt)}
                                            className="rounded-xl h-9 px-3 border-zinc-300 cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4 mr-1.5" />
                                            Details
                                        </Button>

                                        {canConfirm && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={updatingId === appt._id}
                                                onClick={() => handleStatusChange(appt._id, "confirmed")}
                                                className="rounded-xl h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                                            >
                                                {updatingId === appt._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                        Confirm
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {canCancel && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                disabled={updatingId === appt._id}
                                                onClick={() => handleStatusChange(appt._id, "cancelled")}
                                                className="rounded-xl h-9 px-3.5 cursor-pointer"
                                            >
                                                {updatingId === appt._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 mr-1.5" />
                                                        Cancel
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Appointment Details Modal */}
            <Dialog
                open={!!selectedAppointment}
                onOpenChange={(open) => !open && setSelectedAppointment(null)}
            >
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    {selectedAppointment && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-900">
                                    Appointment Request Details
                                </DialogTitle>
                                <DialogDescription>
                                    Booking ID: #{selectedAppointment._id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 pt-2 text-sm">
                                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80 space-y-1">
                                    <p className="text-xs font-semibold uppercase text-amber-700">
                                        Customer Information
                                    </p>
                                    <p className="font-bold text-zinc-900">
                                        {selectedAppointment.customerInfo?.name}
                                    </p>
                                    <p className="text-zinc-600">
                                        {selectedAppointment.customerInfo?.email}
                                    </p>
                                    {selectedAppointment.customerInfo?.phone && (
                                        <p className="text-zinc-600">
                                            Phone: {selectedAppointment.customerInfo.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="p-3.5 rounded-xl border border-zinc-200/80 space-y-1">
                                    <p className="text-xs font-semibold uppercase text-amber-700">
                                        Service Information
                                    </p>
                                    <p className="font-bold text-zinc-900">
                                        {selectedAppointment.serviceInfo?.serviceName} (
                                        {selectedAppointment.serviceInfo?.category})
                                    </p>
                                    <p className="text-zinc-700 font-semibold">
                                        Price: ${Number(selectedAppointment.servicePrice).toFixed(2)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Appointment Date & Time</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {selectedAppointment.appointmentDate} at{" "}
                                            {selectedAppointment.timeSlot}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Booking Request Date</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {formatDate(selectedAppointment.createdAt)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Appointment Status</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedAppointment.status)}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Payment Status</p>
                                        <div className="mt-1">
                                            {getPaymentBadge(selectedAppointment.paymentStatus)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-zinc-200/80">
                                    <p className="text-xs text-zinc-400 mb-1">Customer Message</p>
                                    <p className="text-zinc-700">
                                        {selectedAppointment.message || "No message provided."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    {selectedAppointment.status === "pending" && (
                                        <Button
                                            type="button"
                                            disabled={updatingId === selectedAppointment._id}
                                            onClick={() =>
                                                handleStatusChange(selectedAppointment._id, "confirmed")
                                            }
                                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                        >
                                            Confirm Appointment
                                        </Button>
                                    )}

                                    {(selectedAppointment.status === "pending" ||
                                        selectedAppointment.status === "confirmed") && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                disabled={updatingId === selectedAppointment._id}
                                                onClick={() =>
                                                    handleStatusChange(selectedAppointment._id, "cancelled")
                                                }
                                                className="rounded-xl cursor-pointer"
                                            >
                                                Cancel Appointment
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}