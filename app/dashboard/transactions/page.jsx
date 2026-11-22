"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    CreditCard,
    Search,
    Copy,
    Check,
    Sparkles,
    DollarSign,
} from "lucide-react";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchTransactions() {
            try {
                const data = await apiRequest("/api/transactions/admin/all");
                if (isMounted && Array.isArray(data)) {
                    setTransactions(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load Stripe transactions");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchTransactions();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCopySession = (sessionId) => {
        if (!sessionId) return;
        navigator.clipboard.writeText(sessionId);
        setCopiedId(sessionId);
        toast.success("Stripe session ID copied");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredTransactions = transactions.filter((tx) => {
        const q = searchTerm.toLowerCase();
        return (
            tx.customerName?.toLowerCase().includes(q) ||
            tx.customerEmail?.toLowerCase().includes(q) ||
            tx.serviceName?.toLowerCase().includes(q) ||
            tx.stripeSessionId?.toLowerCase().includes(q)
        );
    });

    const totalRevenue = filteredTransactions.reduce(
        (sum, tx) => sum + (Number(tx.amount) || 0),
        0
    );

    const formatShortSession = (id) => {
        if (!id) return "N/A";
        if (id.length <= 18) return id;
        return `${id.slice(0, 10)}...${id.slice(-6)}`;
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
        return <Loader text="Loading verified Stripe transactions..." />;
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
                        Verified Stripe Ledger
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Payment <span className="text-gold-gradient">Transactions</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Immutable audit log of verified customer payments processed through Stripe Checkout.
                    </p>
                </div>

                <div className="relative px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/25 flex items-center gap-3 shrink-0">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-zinc-950">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                            Total Ledger Volume
                        </p>
                        <p className="text-xl font-extrabold text-white">
                            ${totalRevenue.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search by customer, service, or session ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                    />
                </div>

                <p className="text-xs font-semibold text-zinc-500">
                    Verified Records:{" "}
                    <span className="font-extrabold text-zinc-950">
                        {filteredTransactions.length}
                    </span>
                </p>
            </div>

            {/* Transactions Table */}
            {filteredTransactions.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-amber-200/70 text-center space-y-3 shadow-xs">
                    <CreditCard className="w-8 h-8 text-amber-600 mx-auto" />
                    <h2 className="text-lg font-bold text-zinc-900">
                        No Payment Transactions Found
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Verified Stripe Checkout payments will appear here automatically.
                    </p>
                </div>
            ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-amber-200/70 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-rose-50/70 border-b border-amber-200/70 text-[11px] font-bold uppercase tracking-wider text-amber-950">
                                    <th className="py-4 px-5">Customer</th>
                                    <th className="py-4 px-4">Related Service</th>
                                    <th className="py-4 px-4">Appointment Date</th>
                                    <th className="py-4 px-4">Amount</th>
                                    <th className="py-4 px-4">Stripe Session</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-5 text-right">Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                {filteredTransactions.map((tx) => (
                                    <tr
                                        key={tx._id}
                                        className="hover:bg-amber-50/30 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <p className="font-bold text-zinc-900">
                                                {tx.customerName || "Member"}
                                            </p>
                                            <p className="text-xs text-zinc-500">{tx.customerEmail}</p>
                                        </td>

                                        <td className="py-4 px-4 font-medium text-zinc-800 max-w-xs">
                                            {tx.serviceName || "Salon Service"}
                                        </td>

                                        <td className="py-4 px-4 text-zinc-600 text-xs font-medium">
                                            {tx.appointmentDate || "N/A"}
                                        </td>

                                        <td className="py-4 px-4">
                                            <p className="font-extrabold text-zinc-950">
                                                ${Number(tx.amount || 0).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] font-semibold uppercase text-zinc-400">
                                                {tx.currency || "USD"}
                                            </p>
                                        </td>

                                        <td className="py-4 px-4">
                                            <button
                                                type="button"
                                                onClick={() => handleCopySession(tx.stripeSessionId)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs font-mono text-zinc-700 hover:bg-amber-100 transition cursor-pointer"
                                                title="Click to copy full Stripe Session ID"
                                            >
                                                <span>{formatShortSession(tx.stripeSessionId)}</span>
                                                {copiedId === tx.stripeSessionId ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-amber-700" />
                                                )}
                                            </button>
                                        </td>

                                        <td className="py-4 px-4">
                                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 capitalize">
                                                {tx.paymentStatus || "Paid"}
                                            </Badge>
                                        </td>

                                        <td className="py-4 px-5 text-right text-xs font-medium text-zinc-600">
                                            {formatDate(tx.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}