"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Scissors,
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Facebook,
    Twitter,
} from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <footer className="bg-[#18181B] text-zinc-300 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white"
                        >
                            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                                <Scissors className="w-5 h-5" />
                            </span>
                            <span>TrimBook</span>
                        </Link>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Modern salon and wellness booking platform crafted for effortless
                            appointments, transparent pricing, and personalized studio care.
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter"
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Browse Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Member Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-in"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-up"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Create Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Treatments */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Popular Services
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/services?category=Haircut%20%26%20Styling"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Haircut & Styling
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services?category=Hair%20Coloring"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Hair Coloring & Balayage
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services?category=Facial%20%26%20Skincare"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Facial & Skincare
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services?category=Manicure%20%26%20Pedicure"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Manicure & Pedicure
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services?category=Spa%20%26%20Massage"
                                    className="text-zinc-400 hover:text-amber-400 transition"
                                >
                                    Spa & Massage Rituals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Studio Hours */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Studio Info
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>240 Mercer Studio Avenue, Suite 3B, New York, NY</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>+1 (212) 555-0194</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>concierge@trimbook.com</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>Tue – Sun: 10:00 AM – 8:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-zinc-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <p>© {new Date().getFullYear()} TrimBook Salon & Wellness. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/services" className="hover:text-zinc-300 transition">
                            Service Menu
                        </Link>
                        <Link href="/dashboard" className="hover:text-zinc-300 transition">
                            Bookings
                        </Link>
                        <Link href="/sign-up" className="hover:text-zinc-300 transition">
                            Membership
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}