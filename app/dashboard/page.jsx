"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    CalendarCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Sparkles,
    Users,
    DollarSign,
    ArrowRight,
} from "lucide-react";

export default function DashboardOverviewPage() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isPending || !user) return;
        let isMounted = true;

        async function loadDashboardStats() {
            try {
                if (isAdmin) {
                    const [services, appointments, users, transactions] =
                        await Promise.all([
                            apiRequest("/api/services/admin/all"),
                            apiRequest("/api/appointments/admin/all"),
                            apiRequest("/api/users/admin/all"),
                            apiRequest("/api/transactions/admin/all"),
                        ]);

                    const totalRevenue = Array.isArray(transactions)
                        ? transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
                        : 0;

                    if (isMounted) {
                        setStats({
                            totalServices: Array.isArray(services) ? services.length : 0,
                            totalAppointments: Array.isArray(appointments)
                                ? appointments.length
                                : 0,
                            pendingAppointments: Array.isArray(appointments)
                                ? appointments.filter((a) => a.status === "pending").length
                                : 0,
                            totalUsers: Array.isArray(users) ? users.length : 0,
                            totalRevenue,
                        });
                    }
                } else {
                    const appointments = await apiRequest("/api/appointments/my");
                    if (isMounted && Array.isArray(appointments)) {
                        setStats({
                            total: appointments.length,
                            pending: appointments.filter((a) => a.status === "pending").length,
                            confirmed: appointments.filter((a) => a.status === "confirmed")
                                .length,
                            cancelled: appointments.filter((a) => a.status === "cancelled")
                                .length,
                        });
                    }
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load dashboard overview");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadDashboardStats();
        return () => {
            isMounted = false;
        };
    }, [isPending, user, isAdmin]);

    if (isPending || loading) {
        return <Loader text="Loading dashboard overview..." />;
    }

    return (
        <div className="space-y-6">
            {/* Luxury Gradient Welcome Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        {isAdmin ? "Admin Control Center" : "Customer Dashboard"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Welcome back,{" "}
                        <span className="text-gold-gradient">
                            {user?.name || "Member"}
                        </span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        {isAdmin
                            ? "Monitor salon services, customer bookings, users, and verified Stripe revenue."
                            : "Track your salon appointment requests, confirmations, and payment status."}
                    </p>
                </div>

                <Link
                    href={isAdmin ? "/dashboard/add-service" : "/services"}
                    className={cn(
                        buttonVariants(),
                        "relative btn-luxury-gradient text-white rounded-full px-6 h-11 font-semibold inline-flex items-center gap-2 w-fit shrink-0 shadow-md shadow-amber-500/20 border-0"
                    )}
                >
                    <span>{isAdmin ? "Add New Service" : "Book New Service"}</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Stat Cards */}
            {isAdmin ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Total Salon Services
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.totalServices ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-orange-200/70 shadow-xs hover:shadow-lg hover:shadow-orange-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Total Bookings
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.totalAppointments ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-sm">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Pending Approvals
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.pendingAppointments ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-rose-200/70 shadow-xs hover:shadow-lg hover:shadow-rose-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Registered Users
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.totalUsers ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-amber-400 flex items-center justify-center shadow-sm">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-emerald-200/80 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-between sm:col-span-2 lg:col-span-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Verified Stripe Revenue
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                ${Number(stats?.totalRevenue || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Total Requests
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.total ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-900 to-amber-950 text-amber-400 flex items-center justify-center shadow-sm">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Pending
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.pending ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-emerald-200/70 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Confirmed
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.confirmed ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl border border-rose-200/70 shadow-xs hover:shadow-lg hover:shadow-rose-500/10 transition-all flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Cancelled
                            </p>
                            <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                                {stats?.cancelled ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-sm">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}