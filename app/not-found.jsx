import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Scissors, Home, Sparkles } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-[75vh] bg-[#FAF9F6] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                    <Scissors className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                        Error 404
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                        Page Not Found
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        The salon page or treatment route you are looking for does not exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants(),
                            "w-full sm:w-auto h-11 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium inline-flex items-center justify-center gap-2"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <Link
                        href="/services"
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full sm:w-auto h-11 px-6 rounded-xl border-zinc-300 font-medium inline-flex items-center justify-center gap-2"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Browse Services</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}