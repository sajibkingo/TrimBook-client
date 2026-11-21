"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Clock,
    Sparkles,
    Calendar,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    CalendarCheck,
    FileText,
    Lock,
} from "lucide-react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TIME_SLOTS = [
    "10:00 AM - 11:00 AM",
    "11:30 AM - 12:30 PM",
    "01:00 PM - 02:00 PM",
    "02:30 PM - 03:30 PM",
    "04:00 PM - 05:00 PM",
    "05:30 PM - 06:30 PM",
    "07:00 PM - 08:00 PM",
];

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params?.id;

    const { data: session, isPending: sessionLoading } = useSession();
    const user = session?.user;

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [serviceId]);

    useEffect(() => {
        if (!serviceId) return;
        let isMounted = true;

        async function fetchServiceDetails() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/services/${serviceId}`);
                if (!res.ok) {
                    throw new Error("Service not found");
                }
                const data = await res.json();
                if (isMounted) {
                    setService(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error("Unable to load salon service details");
                    setService(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    window.scrollTo({ top: 0, behavior: "instant" });
                }
            }
        }

        fetchServiceDetails();
        return () => {
            isMounted = false;
        };
    }, [serviceId]);

    const todayStr = new Date().toISOString().split("T")[0];

    const handleBookAppointment = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.info("Please sign in to request a salon appointment.");
            router.push("/sign-in");
            return;
        }

        if (!appointmentDate) {
            toast.error("Please select your preferred appointment date.");
            return;
        }

        if (!timeSlot) {
            toast.error("Please choose an available time slot.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await apiRequest("/api/appointments", {
                method: "POST",
                body: JSON.stringify({
                    serviceId: service._id,
                    appointmentDate,
                    timeSlot,
                    message: message.trim(),
                }),
            });

            toast.success(
                response.message || "Appointment request submitted successfully!"
            );
            router.push("/dashboard/my-appointments");
        } catch (error) {
            toast.error(error.message || "Failed to submit appointment request");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading treatment details..." />;
    }

    if (!service) {
        return (
            <div className="min-h-[70vh] bg-luxury-mesh flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white/95 p-8 rounded-3xl border border-amber-200/70 text-center space-y-4 shadow-sm">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Service Not Found
                    </h1>
                    <p className="text-sm text-zinc-500">
                        This treatment may have been removed or is temporarily unavailable.
                    </p>
                    <Link
                        href="/services"
                        className={cn(
                            buttonVariants(),
                            "btn-luxury-gradient text-white rounded-full px-6 border-0"
                        )}
                    >
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-mesh text-zinc-900 pb-20">
            <div className="relative overflow-hidden bg-gradient-to-r from-[#09090B] via-[#18181B] to-[#271710] border-b border-amber-500/20 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-amber-300 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Services</span>
                    </Link>

                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300/90">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Online Booking</span>
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative h-72 sm:h-[26rem] w-full rounded-3xl overflow-hidden bg-zinc-950 border border-amber-300/40 shadow-lg">
                            <img
                                src={
                                    service.image ||
                                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                                }
                                alt={service.serviceName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/15 to-transparent" />

                            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950/75 backdrop-blur-md border border-amber-400/35 text-amber-300 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                {service.category}
                            </span>

                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/75 backdrop-blur-md border border-white/15 text-zinc-200 text-xs font-medium">
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{service.duration} mins session</span>
                                </div>

                                <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-zinc-950 font-extrabold text-lg shadow-lg">
                                    ${Number(service.price).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-amber-200/70 shadow-xs space-y-5">
                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">
                                    {service.serviceName}
                                </h1>
                                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800">
                                    About This Treatment
                                </h2>
                                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/70">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm font-medium text-zinc-700">
                                        Premium salon-grade botanical products included
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 to-amber-50/50 border border-rose-200/70">
                                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm font-medium text-zinc-700">
                                        Free cancellation anytime while status is Pending
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xl shadow-amber-500/10 space-y-6">
                            <div className="space-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-[11px] font-bold uppercase tracking-widest">
                                    Reserve Your Slot
                                </span>
                                <h2 className="text-xl font-extrabold text-zinc-900 pt-1">
                                    Book This Appointment
                                </h2>
                                <p className="text-xs sm:text-sm text-zinc-500">
                                    Choose your preferred date and studio time slot below.
                                </p>
                            </div>

                            {!sessionLoading && !user ? (
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 to-rose-50/70 border border-amber-200/80 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-900 to-amber-950 text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-zinc-900 text-base">
                                            Sign In Required to Book
                                        </h3>
                                        <p className="text-xs text-zinc-600 leading-relaxed">
                                            Log in to your TrimBook member account to submit an
                                            appointment request and track confirmation status.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                        <Link
                                            href="/sign-in"
                                            className={cn(
                                                buttonVariants(),
                                                "flex-1 h-11 rounded-xl btn-luxury-gradient text-white font-semibold border-0"
                                            )}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className={cn(
                                                buttonVariants({ variant: "outline" }),
                                                "flex-1 h-11 rounded-xl border-amber-300 bg-white font-medium"
                                            )}
                                        >
                                            Create Account
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleBookAppointment} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="appointmentDate">Preferred Date</Label>
                                        <div className="relative">
                                            <Calendar className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            <Input
                                                id="appointmentDate"
                                                type="date"
                                                min={todayStr}
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                                required
                                                className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                                        <div className="relative">
                                            <Clock className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            <select
                                                id="timeSlot"
                                                value={timeSlot}
                                                onChange={(e) => setTimeSlot(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-amber-200/80 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                                            >
                                                {TIME_SLOTS.map((slot) => (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="message">
                                            Special Notes / Stylist Preferences (Optional)
                                        </Label>
                                        <div className="relative">
                                            <FileText className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                            <Textarea
                                                id="message"
                                                rows={3}
                                                placeholder="Any hair type notes, skin sensitivities, or stylist requests..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="pl-10 rounded-xl border-amber-200/80 resize-none focus-visible:ring-amber-500/40"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-rose-50/60 border border-amber-200/80 space-y-2 text-xs">
                                        <div className="flex justify-between text-zinc-600">
                                            <span>Service</span>
                                            <span className="font-semibold text-zinc-900 text-right max-w-[60%]">
                                                {service.serviceName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-zinc-600">
                                            <span>Duration</span>
                                            <span className="font-medium text-zinc-900">
                                                {service.duration} mins
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-amber-200/70">
                                            <span>Total Due After Confirm</span>
                                            <span className="text-amber-800">
                                                ${Number(service.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full h-12 rounded-2xl btn-luxury-gradient text-white font-semibold shadow-md shadow-amber-500/20 border-0 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting Request...
                                            </>
                                        ) : (
                                            <>
                                                <CalendarCheck className="w-4 h-4 mr-2" />
                                                Request Appointment
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}