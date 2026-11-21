"use client";

import { Scissors } from "lucide-react";

export default function Loader({ text = "Loading TrimBook..." }) {
    return (
        <div className="min-h-[45vh] w-full flex flex-col items-center justify-center gap-4 py-12">
            <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-zinc-200 border-t-amber-500 animate-spin" />
                <Scissors className="w-5 h-5 text-zinc-900 absolute" />
            </div>
            <p className="text-sm font-medium text-zinc-600 tracking-wide animate-pulse">
                {text}
            </p>
        </div>
    );
}