import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
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
    </div>
  );
}