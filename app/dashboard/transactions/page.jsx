"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CreditCard, Copy, Check } from "lucide-react";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadTransactions() {
            try {
                const data = await apiRequest("/api/transactions");
                if (isMounted) setTransactions(data);
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load transactions");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadTransactions();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCopySession = (sessionId) => {
        if (!sessionId) return;
        navigator.clipboard.writeText(sessionId);
        setCopiedId(sessionId);
        toast.success("Stripe Session ID copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const shortenSessionId = (id) => {
        if (!id) return "N/A";
        if (id.length <= 18) return id;
        return `${id.slice(0, 10)}...${id.slice(-6)}`;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        return new Date(dateValue).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredTransactions = transactions.filter((tx) => {
        const query = searchTerm.trim().toLowerCase();
        return (
            !query ||
            tx.customerInfo?.name?.toLowerCase().includes(query) ||
            tx.customerInfo?.email?.toLowerCase().includes(query) ||
            tx.serviceInfo?.serviceName?.toLowerCase().includes(query) ||
            tx.stripeSessionId?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return <Loader text="Loading Stripe transactions..." />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Verified Stripe Ledger
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1">Transactions</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    Immutable audit log of verified customer payments processed through Stripe Checkout.
                </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search by customer, service, or session ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-zinc-200"
                    />
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-14 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900">
                        No Transactions Recorded Yet
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Verified Stripe payments will appear here automatically once customers complete checkout.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200/80 bg-[#FAF9F6] text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    <th className="py-3.5 px-5">Customer</th>
                                    <th className="py-3.5 px-5">Related Service</th>
                                    <th className="py-3.5 px-5">Appointment Date</th>
                                    <th className="py-3.5 px-5">Amount</th>
                                    <th className="py-3.5 px-5">Stripe Session</th>
                                    <th className="py-3.5 px-5">Status</th>
                                    <th className="py-3.5 px-5">Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-zinc-50/70">
                                        <td className="py-4 px-5">
                                            <p className="font-semibold text-zinc-900">
                                                {tx.customerInfo?.name || "Customer"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {tx.customerInfo?.email || "N/A"}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5 font-medium text-zinc-800">
                                            {tx.serviceInfo?.serviceName || "Salon Treatment"}
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            {tx.appointmentInfo?.appointmentDate || "N/A"}
                                        </td>
                                        <td className="py-4 px-5 font-bold text-zinc-950">
                                            ${Number(tx.amount).toFixed(2)}{" "}
                                            <span className="text-xs font-semibold uppercase text-zinc-400">
                                                {tx.currency || "USD"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <button
                                                type="button"
                                                onClick={() => handleCopySession(tx.stripeSessionId)}
                                                title={tx.stripeSessionId}
                                                className="inline-flex items-center gap-1.5 font-mono text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                            >
                                                <span>{shortenSessionId(tx.stripeSessionId)}</span>
                                                {copiedId === tx.stripeSessionId ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-4 px-5">
                                            {tx.paymentStatus === "paid" ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 capitalize">
                                                    Paid
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-rose-100 text-rose-800 capitalize">
                                                    {tx.paymentStatus || "Failed"}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            {formatDate(tx.paidAt || tx.createdAt)}
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