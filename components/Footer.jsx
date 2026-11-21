"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Scissors,
    MapPin,
    Phone,
    Mail,
    Clock,
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
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X"
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

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