"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, Sparkles } from "lucide-react";

export default function ServiceCard({ service }) {
    return (
        <div className="group relative bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300/80 transition-all duration-300 flex flex-col">
            <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                <img
                    src={
                        service.image ||
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={service.serviceName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/15 to-transparent" />

                <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-950/75 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-semibold tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    {service.category}
                </span>

                <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-zinc-950 font-extrabold text-sm shadow-md">
                    ${Number(service.price).toFixed(2)}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration} mins session</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {service.serviceName}
                    </h3>

                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>

                <Link
                    href={`/services/${service._id}`}
                    className={cn(
                        buttonVariants(),
                        "group/btn w-full h-11 rounded-2xl bg-zinc-900 hover:bg-gradient-to-r hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-xs"
                    )}
                >
                    <span>View & Book Session</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}