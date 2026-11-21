"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Clock,
    DollarSign,
    Calendar,
    Sparkles,
    ShieldAlert,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

const TIME_SLOTS = [
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
];

export default function ServiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = useSession();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [showBookingForm, setShowBookingForm] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const user = session?.user;
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (!sessionLoading && !user) {
            router.replace("/sign-in");
        }
    }, [sessionLoading, user, router]);

    useEffect(() => {
        if (!user || !id) return;

        async function fetchService() {
            setLoading(true);
            setErrorMessage("");
            try {
                const data = await apiRequest(`/api/services/${id}`);
                setService(data);
            } catch (error) {
                setErrorMessage(error.message || "Invalid or unavailable service ID.");
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [id, user]);

    const todayStr = new Date().toISOString().split("T")[0];

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!appointmentDate) {
            toast.error("Please select an appointment date.");
            return;
        }
        if (!timeSlot) {
            toast.error("Please choose an available time slot.");
            return;
        }

        setSubmitting(true);
        try {
            await apiRequest("/api/appointments", {
                method: "POST",
                body: JSON.stringify({
                    serviceId: service._id,
                    appointmentDate,
                    timeSlot,
                    message,
                }),
            });

            toast.success("Appointment request submitted! Track status in My Appointments.");
            router.push("/dashboard/my-appointments");
        } catch (error) {
            toast.error(error.message || "Failed to book appointment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (sessionLoading || (!user && !errorMessage)) {
        return <Loader text="Checking authentication..." />;
    }

    if (loading) {
        return <Loader text="Loading service details..." />;
    }

    if (errorMessage || !service) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F6] px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-zinc-200/80 text-center space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900">Service Not Found</h1>
                    <p className="text-sm text-zinc-500">
                        {errorMessage || "The salon service ID you requested is invalid or no longer exists."}
                    </p>
                    <Button asChild className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6">
                        <Link href="/services">Back to Browse Services</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const isActive = service.status === "active";

    return (
        <div className="min-h-screen bg-[#FAF9F6] py-10 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div>
                    <Link
                        href="/services"
                        className="inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 h-10 text-sm font-medium transition"
                    >
                        Back to Browse Services
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Service Showcase */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-zinc-200 border border-zinc-200/80 shadow-xs">
                            <img
                                src={
                                    service.image ||
                                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
                                }
                                alt={service.serviceName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <Badge className="bg-zinc-950/90 text-amber-300 border-0 px-3.5 py-1 text-xs font-semibold">
                                    {service.category}
                                </Badge>
                                {!isActive && (
                                    <Badge className="bg-rose-600 text-white border-0 px-3 py-1 text-xs font-semibold">
                                        Inactive Service
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs space-y-5">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                                        {service.serviceName}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2.5 text-sm text-zinc-500">
                                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-700">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            {service.duration} mins estimated
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-700">
                                            <Sparkles className="w-4 h-4 text-amber-600" />
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                                        Total Price
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-950 flex items-center">
                                        <DollarSign className="w-6 h-6 text-amber-600 -mr-1" />
                                        {Number(service.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <h2 className="text-base font-bold text-zinc-900">About This Treatment</h2>
                                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed whitespace-pre-line">
                                    {service.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200/70 text-xs sm:text-sm text-zinc-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Premium salon-grade products included</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200/70 text-xs sm:text-sm text-zinc-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Flexible rescheduling before confirmation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Appointment Booking Card */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                                    Reservation
                                </span>
                                <h2 className="text-xl font-bold text-zinc-900 mt-1">
                                    Book Your Appointment
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Reserve your preferred date and studio time slot.
                                </p>
                            </div>

                            {isAdmin ? (
                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
                                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-semibold">Admin Account Detected</p>
                                        <p className="text-amber-800/90 mt-0.5">
                                            Administrators cannot submit customer appointment requests. Sign in with a customer account to book.
                                        </p>
                                    </div>
                                </div>
                            ) : !isActive ? (
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-semibold">Service Currently Unavailable</p>
                                        <p className="text-rose-800/90 mt-0.5">
                                            This service is marked as inactive and cannot accept new bookings right now.
                                        </p>
                                    </div>
                                </div>
                            ) : !showBookingForm ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Service</span>
                                            <span className="font-semibold text-zinc-900">{service.serviceName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Duration</span>
                                            <span className="font-medium text-zinc-800">{service.duration} mins</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-zinc-200/80">
                                            <span className="font-semibold text-zinc-900">Total Due After Confirm</span>
                                            <span className="font-bold text-zinc-950">
                                                ${Number(service.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setShowBookingForm(true)}
                                        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white font-semibold text-base transition-colors cursor-pointer"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Request Appointment
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="appointmentDate" className="text-sm font-semibold text-zinc-800">
                                            Select Date
                                        </Label>
                                        <Input
                                            id="appointmentDate"
                                            type="date"
                                            min={todayStr}
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            required
                                            className="h-11 rounded-xl border-zinc-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-zinc-800">
                                            Available Time Slot
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {TIME_SLOTS.map((slot) => {
                                                const selected = timeSlot === slot;
                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setTimeSlot(slot)}
                                                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${selected
                                                            ? "bg-zinc-900 text-amber-400 border-zinc-900 shadow-xs"
                                                            : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400"
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sm font-semibold text-zinc-800">
                                            Additional Message <span className="text-zinc-400 font-normal">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            rows={3}
                                            placeholder="Any stylist preference, hair length notes, or allergies..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="rounded-xl border-zinc-300 resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2.5 pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowBookingForm(false)}
                                            className="h-11 rounded-xl border-zinc-300"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold cursor-pointer"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Confirm Request"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}