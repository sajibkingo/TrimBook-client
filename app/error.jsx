"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Application runtime error:", error);
    }, [error]);

    return (
        <div className="min-h-[75vh] bg-[#FAF9F6] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                        Something Went Wrong
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Unable to Complete Request
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        {error?.message ||
                            "An unexpected error occurred while loading this page. Please try again."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                        type="button"
                        onClick={() => reset()}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white font-semibold transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        <span>Try Again</span>
                    </Button>

                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full sm:w-auto h-11 px-6 rounded-xl border-zinc-300 font-medium inline-flex items-center justify-center gap-2"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}