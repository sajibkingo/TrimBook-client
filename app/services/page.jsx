"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    RotateCcw,
    Scissors,
    Sparkles,
} from "lucide-react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function BrowseServicesContent({ initialCategory }) {
    const [services, setServices] = useState([]);
    const [allCategories, setAllCategories] = useState(["All"]);
    const [loadedQueryKey, setLoadedQueryKey] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortOrder, setSortOrder] = useState("default");

    const currentQueryKey = `${searchTerm.trim()}|${selectedCategory}|${sortOrder}`;
    const isLoading = loadedQueryKey !== currentQueryKey;

    useEffect(() => {
        let isMounted = true;

        async function fetchCategories() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/services`);
                if (!res.ok) return;
                const data = await res.json();
                if (isMounted && Array.isArray(data)) {
                    const uniqueCats = Array.from(
                        new Set(data.map((item) => item.category).filter(Boolean))
                    );
                    setAllCategories(["All", ...uniqueCats]);
                }
            } catch (err) {
                // Ignore category fetch error
            }
        }

        fetchCategories();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const timer = setTimeout(async () => {
            try {
                const params = new URLSearchParams();
                if (searchTerm.trim()) params.set("search", searchTerm.trim());
                if (selectedCategory && selectedCategory !== "All") {
                    params.set("category", selectedCategory);
                }
                if (sortOrder && sortOrder !== "default") {
                    params.set("sort", sortOrder);
                }

                const queryString = params.toString();
                const url = `${API_BASE_URL}/api/services${queryString ? `?${queryString}` : ""
                    }`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch services");
                const data = await res.json();

                if (isMounted && Array.isArray(data)) {
                    setServices(data);
                }
            } catch (error) {
                if (isMounted) setServices([]);
            } finally {
                if (isMounted) {
                    setLoadedQueryKey(
                        `${searchTerm.trim()}|${selectedCategory}|${sortOrder}`
                    );
                }
            }
        }, 250);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchTerm, selectedCategory, sortOrder]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSortOrder("default");
    };

    return (
        <div className="min-h-screen bg-luxury-mesh text-zinc-900">
            <section className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white py-14 sm:py-16 border-b border-amber-500/20">
                <div className="absolute -top-20 right-10 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Treatment Menu</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Explore Our{" "}
                        <span className="text-gold-gradient">Salon Services</span>
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-300 max-w-2xl">
                        Search treatments by name, filter by salon specialty, or sort by
                        price to find the ideal session for your schedule.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-6 relative">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder="Search salon service by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus:bg-white"
                            />
                        </div>

                        <div className="md:col-span-3 relative">
                            <SlidersHorizontal className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                aria-label="Filter by Category"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            >
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat === "All" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3 relative">
                            <ArrowUpDown className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                aria-label="Sort by Price"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            >
                                <option value="default">Sort: Latest Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                        <div className="flex flex-wrap items-center gap-2">
                            {allCategories.map((cat) => {
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${active
                                                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold shadow-xs"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-amber-50 hover:text-amber-900"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>

                        {(searchTerm ||
                            selectedCategory !== "All" ||
                            sortOrder !== "default") && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                    Reset Filters
                                </Button>
                            )}
                    </div>
                </div>

                {isLoading ? (
                    <Loader text="Fetching salon services..." />
                ) : services.length === 0 ? (
                    <div className="bg-white/95 rounded-3xl border border-amber-200/70 p-14 text-center space-y-3">
                        <Scissors className="w-8 h-8 text-amber-600 mx-auto" />
                        <h2 className="text-xl font-bold text-zinc-900">
                            No Matching Services Found
                        </h2>
                        <p className="text-sm text-zinc-500 max-w-md mx-auto">
                            Try adjusting your search keywords, category filter, or price sort
                            options.
                        </p>
                        <div className="pt-2">
                            <Button
                                type="button"
                                onClick={handleResetFilters}
                                className="rounded-full btn-luxury-gradient text-white px-6 border-0 cursor-pointer"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-xs font-medium text-zinc-500">
                            Showing{" "}
                            <span className="font-bold text-zinc-900">{services.length}</span>{" "}
                            {services.length === 1 ? "service" : "services"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

function ServicesWithParams() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category") || "All";

    return (
        <BrowseServicesContent
            key={categoryFromUrl}
            initialCategory={categoryFromUrl}
        />
    );
}

export default function BrowseServicesPage() {
    return (
        <Suspense fallback={<Loader text="Loading salon services..." />}>
            <ServicesWithParams />
        </Suspense>
    );
}