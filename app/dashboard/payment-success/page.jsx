"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    XCircle,
    Receipt,
    CalendarCheck,
    Sparkles,
} from "lucide-react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [verifying, setVerifying] = useState(true);
    const [transaction, setTransaction] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (!sessionId) {
            setErrorMessage("Missing Stripe checkout session ID.");
            setVerifying(false);
            return;
        }

        if (verifiedRef.current) return;
        verifiedRef.current = true;

        async function verifyPayment() {
            try {
                const data = await apiRequest("/api/payments/verify-session", {
                    method: "POST",
                    body: JSON.stringify({ sessionId }),
                });

                setTransaction(data.transaction);
                toast.success("Payment verified and confirmed!");
            } catch (error) {
                setErrorMessage(
                    error.message || "Unable to verify your Stripe payment session."
                );
            } finally {
                setVerifying(false);
            }
        }

        verifyPayment();
    }, [sessionId]);

    if (verifying) {
        return <Loader text="Verifying your Stripe payment..." />;
    }

    if (errorMessage || !transaction) {
        return (
            <div className="max-w-lg mx-auto py-10">
                <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-xs text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Payment Verification Failed
                    </h1>
                    <p className="text-sm text-zinc-500">
                        {errorMessage || "We could not verify this payment session."}
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/dashboard/my-appointments"
                            className={cn(
                                buttonVariants(),
                                "bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-6 h-11"
                            )}
                        >
                            Return to My Appointments
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formattedPaidDate = transaction.paidAt
        ? new Date(transaction.paidAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Just now";

    return (
        <div className="max-w-xl mx-auto py-6">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs space-y-6">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                        Payment Verified
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                        Payment Successful!
                    </h1>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto">
                        Thank you! Your salon appointment payment has been confirmed and recorded in your account.
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 space-y-3 text-sm">
                    <div className="flex items-center gap-2 font-bold text-zinc-900 pb-2 border-b border-zinc-200/80">
                        <Receipt className="w-4 h-4 text-amber-600" />
                        <span>Verified Transaction Receipt</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Amount Paid</span>
                        <span className="text-lg font-bold text-zinc-950">
                            ${Number(transaction.amount).toFixed(2)}{" "}
                            <span className="text-xs font-semibold text-zinc-500">
                                {transaction.currency || "USD"}
                            </span>
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Payment Status</span>
                        <Badge className="bg-zinc-900 text-amber-400 hover:bg-zinc-900 uppercase text-[11px]">
                            {transaction.paymentStatus}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Transaction Date</span>
                        <span className="font-medium text-zinc-800">{formattedPaidDate}</span>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/80 space-y-1">
                        <span className="text-xs text-zinc-400 block">
                            Stripe Reference / Transaction ID
                        </span>
                        <p className="font-mono text-xs text-zinc-700 break-all bg-white p-2.5 rounded-xl border border-zinc-200/80">
                            {transaction.transactionId || transaction.stripeSessionId}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <Link
                        href="/dashboard/my-appointments"
                        className={cn(
                            buttonVariants(),
                            "w-full sm:flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white font-semibold transition-colors inline-flex items-center justify-center gap-2"
                        )}
                    >
                        <CalendarCheck className="w-4 h-4" />
                        <span>View My Appointments</span>
                    </Link>

                    <Link
                        href="/services"
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full sm:flex-1 h-11 rounded-xl border-zinc-300 font-medium inline-flex items-center justify-center gap-2"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Browse More Services</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<Loader text="Loading payment confirmation..." />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}