import Link from "next/link";
import { Home, Scissors } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-luxury-mesh flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full text-center bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 p-8 sm:p-10 shadow-xl space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-md">
                    <Scissors className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber-700">
                        404 — Page Not Found
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Lost in the <span className="text-gold-gradient">Lounge?</span>
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full sm:w-auto h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <Link
                        href="/services"
                        className="w-full sm:w-auto h-11 px-6 rounded-full btn-luxury-gradient text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                    >
                        <span>Explore Services</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}