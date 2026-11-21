"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Clock,
    Star,
    Scissors,
    Palette,
    Droplets,
    Smile,
    Brush,
    Hand,
    Flower2,
    CalendarCheck,
    CreditCard,
} from "lucide-react";

const CATEGORIES = [
    { name: "Haircut & Styling", icon: Scissors, desc: "Precision cuts, blowouts & modern styling" },
    { name: "Hair Coloring", icon: Palette, desc: "Balayage, highlights & rich gloss tones" },
    { name: "Hair Treatment", icon: Droplets, desc: "Keratin smoothing, scalp therapy & repair" },
    { name: "Facial & Skincare", icon: Smile, desc: "Hydrating facials, peels & glow rituals" },
    { name: "Makeup", icon: Brush, desc: "Bridal, editorial & evening glam artistry" },
    { name: "Manicure & Pedicure", icon: Hand, desc: "Gel polish, nail care & luxury hand spa" },
    { name: "Spa & Massage", icon: Flower2, desc: "Aromatherapy, deep tissue & hot stone" },
];

export default function HomePage() {
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeaturedServices() {
            try {
                const data = await apiRequest("/api/services");
                setFeaturedServices(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch featured services:", error);
            } finally {
                setLoading(false);
            }
        }
        loadFeaturedServices();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Banner Section */}
            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-45 scale-105"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Premier Salon & Wellness Studio</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                            Elevate Your Look,{" "}
                            <span className="text-amber-400">Book on Your Schedule.</span>
                        </h1>

                        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                            Discover tailored haircuts, luxury coloring, rejuvenating facials, and relaxing spa treatments crafted by master stylists. Instant online booking with transparent pricing.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-full px-8 h-12 text-base shadow-lg shadow-amber-500/20"
                            >
                                <Link href="/services" className="flex items-center gap-2">
                                    <span>Explore Salon Services</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-full px-7 h-12 border-zinc-700 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href="/sign-up">Create Free Account</Link>
                            </Button>
                        </div>

                        <div className="pt-8 grid grid-cols-3 gap-4 sm:gap-8 border-t border-zinc-800/90 max-w-lg">
                            <div className="flex items-center gap-2.5">
                                <Star className="w-5 h-5 text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">4.9 / 5</p>
                                    <p className="text-xs text-zinc-400">Client Rating</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Instant Slots</p>
                                    <p className="text-xs text-zinc-400">Zero Wait Time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Verified Care</p>
                                    <p className="text-xs text-zinc-400">Expert Stylists</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Section 2: Salon Service Categories */}
            <section className="py-20 bg-white border-b border-zinc-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                                Curated Treatments
                            </span>
                            <h2 className="text-3xl font-bold text-zinc-900 mt-1">
                                Explore by Category
                            </h2>
                        </div>
                        <Link
                            href="/services"
                            className="text-sm font-semibold text-zinc-900 hover:text-amber-700 inline-flex items-center gap-1.5 transition"
                        >
                            <span>View All Categories</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <Link
                                    key={cat.name}
                                    href={`/services?category=${encodeURIComponent(cat.name)}`}
                                    className="group p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 hover:bg-zinc-950 hover:border-zinc-950 transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-700 group-hover:bg-amber-500 group-hover:text-zinc-950 flex items-center justify-center transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-zinc-900 group-hover:text-white transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-zinc-500 group-hover:text-zinc-400 leading-relaxed transition-colors">
                                        {cat.desc}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Dynamic Section 1: Featured Salon Services */}
            <section className="py-20 bg-[#FAF9F6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                                Signature Menu
                            </span>
                            <h2 className="text-3xl font-bold text-zinc-900 mt-1">
                                Featured Salon Services
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Handpicked active treatments loved by our regular guests.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="rounded-full border-zinc-300">
                            <Link href="/services" className="flex items-center gap-2">
                                <span>Browse Full Menu</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-96 rounded-2xl bg-white border border-zinc-200/70 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : featuredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredServices.map((service) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80">
                            <p className="text-zinc-600 font-medium">No active services found yet.</p>
                            <p className="text-sm text-zinc-400 mt-1">
                                Log in as Admin to add your first salon service!
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Additional Section: Seamless 3-Step Booking Experience */}
            <section className="py-20 bg-zinc-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                            Effortless Self-Care
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-2">
                            How TrimBook Works
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-400 mt-3">
                            Designed for modern beauty & grooming—reserve your chair in under a minute with zero phone calls.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">1. Choose Your Treatment</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Browse transparent menus with exact durations, clear pricing, and detailed treatment descriptions.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">2. Pick Date & Time Slot</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Select your preferred date and available studio time slot, and track live confirmation from your dashboard.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">3. Secure Checkout & Relax</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Once confirmed by our studio team, complete secure payment via Stripe and arrive ready to unwind.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}