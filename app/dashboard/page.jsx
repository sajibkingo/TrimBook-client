"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
    CalendarCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Users,
    Sparkles,
    CreditCard,
    ArrowRight,
} from "lucide-react";

export default function DashboardOverviewPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";

    const customerStats = [
        { label: "Total Appointment Requests", value: "0", icon: CalendarCheck, color: "bg-zinc-900 text-amber-400" },
        { label: "Pending Appointments", value: "0", icon: Clock, color: "bg-amber-100 text-amber-700" },
        { label: "Confirmed Appointments", value: "0", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
        { label: "Cancelled Appointments", value: "0", icon: XCircle, color: "bg-rose-100 text-rose-700" },
    ];

    const adminStats = [
        { label: "Total Registered Customers", value: "0", icon: Users, color: "bg-zinc-900 text-amber-400" },
        { label: "Total Active Services", value: "0", icon: Sparkles, color: "bg-amber-100 text-amber-700" },
        { label: "Total Appointment Requests", value: "0", icon: CalendarCheck, color: "bg-blue-100 text-blue-700" },
        { label: "Pending Appointments", value: "0", icon: Clock, color: "bg-orange-100 text-orange-700" },
        { label: "Confirmed Appointments", value: "0", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
        { label: "Total Successful Payments", value: "$0", icon: CreditCard, color: "bg-purple-100 text-purple-700" },
    ];

    const stats = isAdmin ? adminStats : customerStats;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        {isAdmin ? "Administrator Workspace" : "Client Dashboard"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {isAdmin
                            ? "Monitor salon services, customer bookings, and verified Stripe revenue."
                            : "Track your salon appointment requests, confirmations, and payment history."}
                    </p>
                </div>

                <Link
                    href={isAdmin ? "/dashboard/manage-services" : "/services"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium transition shrink-0"
                >
                    <span>{isAdmin ? "Manage Services" : "Book New Service"}</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-zinc-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}