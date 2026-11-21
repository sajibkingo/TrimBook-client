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
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900">
      {/* ==========================================
          1. HERO BANNER SECTION
      ========================================== */}
      <section className="relative bg-[#18181B] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-[#18181B]/90 to-[#18181B]/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premier Salon & Wellness Studio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Elevate Your Look,{" "}
              <span className="text-amber-400">Book on Your Schedule.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Discover tailored haircuts, luxury coloring, rejuvenating facials,
              and relaxing spa treatments crafted by master stylists. Instant
              online booking with transparent pricing.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm inline-flex items-center gap-2 shadow-sm"
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
                    "h-12 px-7 rounded-full border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-white font-medium text-sm"
                  )}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-7 rounded-full border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-white font-medium text-sm"
                  )}
                >
                  Create Free Account
                </Link>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 max-w-md border-t border-zinc-800">
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

      {/* ==========================================
          2. DYNAMIC SECTION 1: FEATURED SALON SERVICES
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Curated Menu
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
              Signature Salon Treatments
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 mt-1 max-w-xl">
              Explore our most requested haircuts, color transformations, and
              rejuvenating spa rituals.
            </p>
          </div>

          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6 h-10 border-zinc-300 text-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors inline-flex items-center gap-2 w-fit"
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
                className="h-96 rounded-2xl bg-white border border-zinc-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center space-y-3">
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
          3. DYNAMIC SECTION 2: BROWSE BY CATEGORY
      ========================================== */}
      {categories.length > 0 && (
        <section className="bg-white border-y border-zinc-200/80 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Tailored Specialties
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Explore by Treatment Category
              </h2>
              <p className="text-sm sm:text-base text-zinc-500">
                Select a specialty department to filter live treatments and
                pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden bg-[#18181B] border border-zinc-200/80 h-52 flex flex-col justify-end p-5 shadow-xs hover:shadow-md transition-all"
                >
                  <img
                    src={
                      cat.sampleImage ||
                      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

                  <div className="relative z-10 space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold">
                      <Layers className="w-3 h-3" />
                      {cat.count} {cat.count === 1 ? "Service" : "Services"}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-300">
                      Starting from ${cat.minPrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          4. HOW IT WORKS (3-STEP BOOKING GUIDE)
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Effortless Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            How TrimBook Works
          </h2>
          <p className="text-sm sm:text-base text-zinc-500">
            Reserve your studio session in three transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
              <Scissors className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
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

          <div className="bg-white p-7 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
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

          <div className="bg-white p-7 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
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
          5. STUDIO PROMISE & CTA BANNER
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#18181B] text-white rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>The TrimBook Standard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              Ready for Your Next Salon Transformation?
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
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                No hidden salon fees
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Instant Stripe receipts
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-8 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm inline-flex items-center gap-2"
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