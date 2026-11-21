"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Calendar,
    Clock,
    CreditCard,
    Eye,
    XCircle,
    Sparkles,
    CheckCircle2,
    Loader2,
    Receipt,
} from "lucide-react";

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [payingId, setPayingId] = useState(null);

    const fetchMyAppointments = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/api/appointments/my");
            setAppointments(data);
        } catch (error) {
            toast.error(error.message || "Failed to load your appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAppointments();
    }, []);

    const handleCancelAppointment = async (appointmentId) => {
        setCancellingId(appointmentId);
        try {
            await apiRequest(`/api/appointments/${appointmentId}/cancel`, {
                method: "PATCH",
            });
            toast.success("Appointment request cancelled.");
            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === appointmentId ? { ...item, status: "cancelled" } : item
                )
            );
            if (selectedAppointment?._id === appointmentId) {
                setSelectedAppointment((prev) => ({ ...prev, status: "cancelled" }));
            }
        } catch (error) {
            toast.error(error.message || "Unable to cancel appointment");
        } finally {
            setCancellingId(null);
        }
    };

    const handlePayNow = async (appointmentId) => {
        setPayingId(appointmentId);
        try {
            const data = await apiRequest("/api/payments/create-checkout-session", {
                method: "POST",
                body: JSON.stringify({ appointmentId }),
            });

            if (data?.url) {
                window.location.href = data.url;
            } else {
                toast.error("Could not initialize payment session");
            }
        } catch (error) {
            toast.error(error.message || "Payment initialization failed");
        } finally {
            setPayingId(null);
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

    if (loading) {
        return <Loader text="Loading your appointments..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Booking History
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 mt-1">My Appointments</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Manage your appointment requests, view details, and complete payments for confirmed bookings.
                    </p>
                </div>

                <Link
                    href="/services"
                    className={cn(
                        buttonVariants(),
                        "bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-5 h-10 text-sm font-medium shrink-0"
                    )}
                >
                    Book Another Service
                </Link>
            </div>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-14 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900">No Appointments Yet</h2>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto">
                        You haven&apos;t submitted any salon appointment requests yet. Explore our services to book your first session!
                    </p>
                    <Link
                        href="/services"
                        className={cn(
                            buttonVariants(),
                            "mt-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6"
                        )}
                    >
                        Explore Services
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appt) => {
                        const service = appt.serviceInfo || {};
                        const canCancel = appt.status === "pending";
                        const canPay = appt.status === "confirmed" && appt.paymentStatus !== "paid";

                        return (
                            <div
                                key={appt._id}
                                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <img
                                        src={
                                            service.image ||
                                            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={service.serviceName || "Salon Service"}
                                        className="w-full sm:w-24 h-36 sm:h-24 rounded-xl object-cover bg-zinc-100 shrink-0"
                                    />

                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                                                {service.category || "Salon Service"}
                                            </span>
                                            <span className="text-zinc-300">•</span>
                                            <span className="text-xs text-zinc-400">
                                                Requested on {formatDate(appt.createdAt)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-zinc-900">
                                            {service.serviceName || "Salon Treatment"}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600 pt-0.5">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-zinc-400" />
                                                {appt.appointmentDate}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-zinc-400" />
                                                {appt.timeSlot}
                                            </span>
                                            <span className="font-bold text-zinc-900">
                                                ${Number(appt.servicePrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center justify-between lg:items-end xl:items-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
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
                                            className="rounded-xl border-zinc-300 h-9 px-3.5 cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4 mr-1.5" />
                                            Details
                                        </Button>

                                        {canCancel && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                disabled={cancellingId === appt._id}
                                                onClick={() => handleCancelAppointment(appt._id)}
                                                className="rounded-xl h-9 px-3.5 cursor-pointer"
                                            >
                                                {cancellingId === appt._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 mr-1.5" />
                                                        Cancel
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {canPay && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={payingId === appt._id}
                                                onClick={() => handlePayNow(appt._id)}
                                                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold h-9 px-4 cursor-pointer"
                                            >
                                                {payingId === appt._id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                                        Redirecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-4 h-4 mr-1.5" />
                                                        Pay Now
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

            {/* View Appointment Details Modal */}
            <Dialog
                open={!!selectedAppointment}
                onOpenChange={(open) => !open && setSelectedAppointment(null)}
            >
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    {selectedAppointment && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-900">
                                    Appointment Details
                                </DialogTitle>
                                <DialogDescription>
                                    Booking Reference: #{selectedAppointment._id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80">
                                    <img
                                        src={
                                            selectedAppointment.serviceInfo?.image ||
                                            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80"
                                        }
                                        alt={selectedAppointment.serviceInfo?.serviceName || "Service"}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-amber-700 uppercase">
                                            {selectedAppointment.serviceInfo?.category}
                                        </p>
                                        <h4 className="font-bold text-zinc-900">
                                            {selectedAppointment.serviceInfo?.serviceName}
                                        </h4>
                                        <p className="text-sm font-semibold text-zinc-700">
                                            ${Number(selectedAppointment.servicePrice).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Appointment Date</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {selectedAppointment.appointmentDate}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Time Slot</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {selectedAppointment.timeSlot}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Booking Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Payment Status</p>
                                        <div className="mt-1">
                                            {getPaymentBadge(selectedAppointment.paymentStatus)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-zinc-200/80 text-sm">
                                    <p className="text-xs text-zinc-400 mb-1">Request Submitted On</p>
                                    <p className="font-medium text-zinc-800">
                                        {formatDate(selectedAppointment.createdAt)}
                                    </p>
                                    {selectedAppointment.message && (
                                        <div className="mt-3 pt-3 border-t border-zinc-100">
                                            <p className="text-xs text-zinc-400 mb-1">Your Note to Salon</p>
                                            <p className="text-zinc-700">{selectedAppointment.message}</p>
                                        </div>
                                    )}
                                </div>

                                {selectedAppointment.paymentStatus === "paid" &&
                                    selectedAppointment.transactionInfo && (
                                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm space-y-1">
                                            <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                                                <Receipt className="w-4 h-4 text-emerald-700" />
                                                <span>Payment Receipt Verified</span>
                                            </div>
                                            <p className="text-xs text-emerald-800 break-all">
                                                Transaction ID: {selectedAppointment.transactionInfo.transactionId}
                                            </p>
                                            <p className="text-xs text-emerald-800">
                                                Paid On: {formatDate(selectedAppointment.transactionInfo.paidAt)}
                                            </p>
                                        </div>
                                    )}

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    {selectedAppointment.status === "pending" && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={cancellingId === selectedAppointment._id}
                                            onClick={() => handleCancelAppointment(selectedAppointment._id)}
                                            className="rounded-xl cursor-pointer"
                                        >
                                            Cancel Request
                                        </Button>
                                    )}

                                    {selectedAppointment.status === "confirmed" &&
                                        selectedAppointment.paymentStatus !== "paid" && (
                                            <Button
                                                type="button"
                                                disabled={payingId === selectedAppointment._id}
                                                onClick={() => handlePayNow(selectedAppointment._id)}
                                                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold cursor-pointer"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                Proceed to Payment
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