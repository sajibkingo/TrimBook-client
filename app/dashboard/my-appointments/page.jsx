"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Clock,
    Eye,
    XCircle,
    CreditCard,
    Loader2,
    Sparkles,
    Receipt,
    FileText,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [payingId, setPayingId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        if (params.get("payment") === "cancelled") {
            toast.info(
                "Stripe checkout was cancelled. You can complete payment anytime."
            );
            window.history.replaceState({}, "", "/dashboard/my-appointments");
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function fetchMyAppointments() {
            try {
                const data = await apiRequest("/api/appointments/my");
                if (isMounted && Array.isArray(data)) {
                    setAppointments(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load your appointments");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchMyAppointments();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCancelAppointment = async (appointmentId) => {
        setCancellingId(appointmentId);
        try {
            const data = await apiRequest(`/api/appointments/${appointmentId}/cancel`, {
                method: "PATCH",
            });

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === appointmentId ? { ...item, status: "cancelled" } : item
                )
            );

            if (selectedAppointment?._id === appointmentId) {
                setSelectedAppointment((prev) =>
                    prev ? { ...prev, status: "cancelled" } : null
                );
            }

            toast.success(data.message || "Appointment cancelled successfully");
        } catch (error) {
            toast.error(error.message || "Failed to cancel appointment");
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
                throw new Error("Unable to retrieve Stripe checkout URL");
            }
        } catch (error) {
            toast.error(error.message || "Failed to initiate payment");
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

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        return new Date(dateValue).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return <Loader text="Loading your appointments..." />;
    }

    return (
        <div className="space-y-6">
            {/* Luxury Gradient Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Booking History
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        My <span className="text-gold-gradient">Appointments</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Manage your appointment requests, view details, and complete payments for confirmed bookings.
                    </p>
                </div>

                <Link
                    href="/services"
                    className={cn(
                        buttonVariants(),
                        "relative btn-luxury-gradient text-white rounded-full px-6 h-11 font-semibold inline-flex items-center gap-2 w-fit shrink-0 shadow-md shadow-amber-500/20 border-0"
                    )}
                >
                    <span>Book Another Service</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Appointments List */}
            {appointments.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-amber-200/70 shadow-xs text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-sm">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">
                        No Appointments Booked Yet
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto">
                        You haven&apos;t requested any salon treatments yet. Explore our services menu to schedule your first session.
                    </p>
                    <div className="pt-1">
                        <Link
                            href="/services"
                            className={cn(
                                buttonVariants(),
                                "btn-luxury-gradient text-white rounded-full px-6 h-11 font-semibold border-0"
                            )}
                        >
                            Explore Salon Services
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => {
                        const service = appointment.serviceInfo || {};
                        const isPending = appointment.status === "pending";
                        const canPay =
                            appointment.status === "confirmed" &&
                            appointment.paymentStatus !== "paid";

                        return (
                            <div
                                key={appointment._id}
                                className="group bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={
                                            service.image ||
                                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={service.serviceName || "Salon Service"}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 ring-1 ring-amber-200"
                                    />

                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                                                {service.category || "Salon Treatment"}
                                            </span>
                                            <span className="text-zinc-300">•</span>
                                            <span className="text-zinc-400">
                                                Requested on {formatDate(appointment.createdAt)}
                                            </span>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                                            {service.serviceName || "Salon Service"}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600 pt-0.5">
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
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(appointment.status)}
                                        {getPaymentBadge(appointment.paymentStatus)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedAppointment(appointment)}
                                            className="rounded-xl h-9 px-3.5 border-amber-200 text-zinc-800 hover:bg-amber-50 cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4 mr-1.5 text-amber-700" />
                                            <span>Details</span>
                                        </Button>

                                        {isPending && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={cancellingId === appointment._id}
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                className="rounded-xl h-9 px-3.5 border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 hover:text-rose-800 cursor-pointer"
                                            >
                                                {cancellingId === appointment._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 mr-1.5" />
                                                        <span>Cancel</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {canPay && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={payingId === appointment._id}
                                                onClick={() => handlePayNow(appointment._id)}
                                                className="rounded-xl h-9 px-4 btn-luxury-gradient text-white font-semibold shadow-sm border-0 cursor-pointer"
                                            >
                                                {payingId === appointment._id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                                        <span>Redirecting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-4 h-4 mr-1.5" />
                                                        <span>Pay Now</span>
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
                open={Boolean(selectedAppointment)}
                onOpenChange={(open) => {
                    if (!open) setSelectedAppointment(null);
                }}
            >
                <DialogContent className="sm:max-w-lg rounded-3xl p-6 border-amber-200/80">
                    {selectedAppointment && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-900">
                                    Appointment Details
                                </DialogTitle>
                                <DialogDescription>
                                    Booking summary and payment status for your salon session.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 pt-2 text-sm">
                                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-rose-50/60 border border-amber-200/80">
                                    <img
                                        src={
                                            selectedAppointment.serviceInfo?.image ||
                                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
                                        }
                                        alt={
                                            selectedAppointment.serviceInfo?.serviceName ||
                                            "Salon Service"
                                        }
                                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                                    />
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                            {selectedAppointment.serviceInfo?.category ||
                                                "Salon Treatment"}
                                        </span>
                                        <h4 className="font-bold text-zinc-900 text-base">
                                            {selectedAppointment.serviceInfo?.serviceName ||
                                                "Salon Service"}
                                        </h4>
                                        <p className="text-xs text-zinc-600">
                                            Duration:{" "}
                                            {selectedAppointment.serviceInfo?.duration || 60} mins
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-zinc-200/80">
                                    <div>
                                        <span className="text-xs text-zinc-400 block">Date</span>
                                        <span className="font-semibold text-zinc-900">
                                            {selectedAppointment.appointmentDate}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-zinc-400 block">
                                            Time Slot
                                        </span>
                                        <span className="font-semibold text-zinc-900">
                                            {selectedAppointment.timeSlot}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-zinc-400 block">
                                            Booking Status
                                        </span>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedAppointment.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-zinc-400 block">
                                            Payment Status
                                        </span>
                                        <div className="mt-1">
                                            {getPaymentBadge(selectedAppointment.paymentStatus)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Customer Notes</span>
                                    </div>
                                    <p className="text-zinc-600 text-xs leading-relaxed">
                                        {selectedAppointment.message ||
                                            "No special instructions provided."}
                                    </p>
                                </div>

                                {selectedAppointment.paymentStatus === "paid" &&
                                    selectedAppointment.transactionInfo && (
                                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Verified Payment Receipt</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-emerald-900">
                                                <span>Amount Paid:</span>
                                                <span className="font-bold">
                                                    $
                                                    {Number(
                                                        selectedAppointment.transactionInfo.amount
                                                    ).toFixed(2)}{" "}
                                                    {selectedAppointment.transactionInfo.currency || "USD"}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-emerald-800 font-mono break-all flex items-start gap-1.5">
                                                <Receipt className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                <span>
                                                    {selectedAppointment.transactionInfo.transactionId ||
                                                        selectedAppointment.transactionInfo.stripeSessionId}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                                    <div>
                                        <span className="text-xs text-zinc-400 block">
                                            Total Service Fee
                                        </span>
                                        <span className="text-lg font-extrabold text-zinc-950">
                                            $
                                            {Number(
                                                selectedAppointment.servicePrice ||
                                                selectedAppointment.serviceInfo?.price ||
                                                0
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {selectedAppointment.status === "pending" && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                disabled={cancellingId === selectedAppointment._id}
                                                onClick={() =>
                                                    handleCancelAppointment(selectedAppointment._id)
                                                }
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
                                                    className="rounded-xl btn-luxury-gradient text-white font-semibold border-0 cursor-pointer"
                                                >
                                                    <CreditCard className="w-4 h-4 mr-1.5" />
                                                    Proceed to Pay
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}