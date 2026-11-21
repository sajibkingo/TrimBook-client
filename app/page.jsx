"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import ServiceCard from "@/components/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  Scissors,
  CalendarCheck,
  CreditCard,
  Award,
  CheckCircle2,
  Layers,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeServices() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setServices(data);
        }
      } catch (error) {
        if (isMounted) setServices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredServices = services.slice(0, 6);

  const categoryMap = services.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) {
      acc[cat] = {
        name: cat,
        count: 0,
        minPrice: Number(item.price) || 0,
        sampleImage: item.image,
      };
    }
    acc[cat].count += 1;
    const itemPrice = Number(item.price) || 0;
    if (itemPrice > 0 && itemPrice < acc[cat].minPrice) {
      acc[cat].minPrice = itemPrice;
    }
    return acc;
  }, {});

  const categories = Object.values(categoryMap);

  return (
    <div className="min-h-screen bg-luxury-mesh text-zinc-900">
      {/* ==========================================
          1. AMBIENT GRADIENT HERO BANNER
      ========================================== */}
      <section className="relative bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        {/* Decorative Gradient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B]/95 via-[#18181B]/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 border border-amber-400/35 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Premier Salon & Wellness Studio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Elevate Your Look,{" "}
              <span className="text-gold-gradient">Book on Your Schedule.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Discover tailored haircuts, luxury coloring, rejuvenating facials,
              and relaxing spa treatments crafted by master stylists. Instant
              online booking with transparent pricing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 rounded-full btn-luxury-gradient text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-500/25 border-0"
                )}
              >
                <span>Explore Salon Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-7 rounded-full border-amber-400/30 bg-white/5 hover:bg-white/15 text-white backdrop-blur-md font-medium text-sm"
                  )}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-7 rounded-full border-amber-400/30 bg-white/5 hover:bg-white/15 text-white backdrop-blur-md font-medium text-sm"
                  )}
                >
                  Create Free Account
                </Link>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 max-w-md border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">4.9 / 5</p>
                  <p className="text-xs text-zinc-400">Client Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Instant Slots</p>
                  <p className="text-xs text-zinc-400">Zero Wait Time</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Verified Care</p>
                  <p className="text-xs text-zinc-400">Expert Stylists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. FEATURED SALON SERVICES
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
              Curated Menu
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 mt-2">
              Signature Salon Treatments
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-1 max-w-xl">
              Explore our most requested haircuts, color transformations, and
              rejuvenating spa rituals.
            </p>
          </div>

          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6 h-11 border-amber-300 bg-white/80 text-zinc-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all inline-flex items-center gap-2 w-fit font-semibold shadow-xs"
            )}
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-white/80 border border-amber-100 animate-pulse"
              />
            ))}
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="bg-white/90 rounded-3xl border border-amber-200/70 p-12 text-center space-y-3">
            <Scissors className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-900">
              No Active Services Available Yet
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Our stylists are updating the treatment menu. Check back shortly
              or browse our catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          3. BROWSE BY CATEGORY
      ========================================== */}
      {categories.length > 0 && (
        <section className="bg-gradient-to-b from-white/90 via-amber-50/40 to-white/90 border-y border-amber-200/50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
                Tailored Specialties
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900">
                Explore by Treatment Category
              </h2>
              <p className="text-sm sm:text-base text-zinc-600">
                Select a specialty department to filter live treatments and
                pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-amber-300/30 h-56 flex flex-col justify-end p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/15 transition-all"
                >
                  <img
                    src={
                      cat.sampleImage ||
                      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-amber-950/10" />

                  <div className="relative z-10 space-y-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-400/25 backdrop-blur-md border border-amber-300/30 text-amber-200 text-[11px] font-semibold">
                      <Layers className="w-3 h-3" />
                      {cat.count} {cat.count === 1 ? "Service" : "Services"}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-300">
                      Starting from{" "}
                      <span className="font-bold text-amber-300">
                        ${cat.minPrice.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          4. HOW IT WORKS (GRADIENT STEP CARDS)
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
            Effortless Experience
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900">
            How TrimBook Works
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Reserve your studio session in three transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-7 rounded-3xl border border-amber-200/70 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
              <Scissors className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              Step 01
            </span>
            <h3 className="text-lg font-bold text-zinc-900">
              Choose Your Treatment
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Browse haircuts, coloring, skincare, or spa treatments with clear
              duration estimates and upfront pricing.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-7 rounded-3xl border border-orange-200/70 shadow-xs hover:shadow-lg hover:shadow-orange-500/10 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-sm">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700">
              Step 02
            </span>
            <h3 className="text-lg font-bold text-zinc-900">
              Pick Date & Time Slot
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Select an open studio time slot that fits your schedule and add
              any custom styling notes for your specialist.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-7 rounded-3xl border border-rose-200/70 shadow-xs hover:shadow-lg hover:shadow-rose-500/10 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
              Step 03
            </span>
            <h3 className="text-lg font-bold text-zinc-900">
              Confirm & Pay Securely
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Once our studio confirms your appointment slot, complete checkout
              securely via Stripe and arrive ready to relax.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. LUXURY GRADIENT CTA BANNER
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#1C1412] to-[#2E1418] text-white rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-amber-500/20 shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/20 blur-3xl pointer-events-none" />

          <div className="relative space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-400" />
              <span>The TrimBook Standard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Ready for Your Next{" "}
              <span className="text-gold-gradient">Salon Transformation?</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Join hundreds of satisfied clients enjoying punctual appointments,
              certified master stylists, and seamless online booking.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm text-zinc-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Cruelty-free botanical products
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                No hidden salon fees
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                Instant Stripe receipts
              </span>
            </div>
          </div>

          <div className="relative shrink-0">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-8 rounded-full btn-luxury-gradient text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg shadow-rose-500/20 border-0"
              )}
            >
              <span>Book Your Session Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}