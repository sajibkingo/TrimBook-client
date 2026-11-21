"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

const CATEGORIES = [
    "All",
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

function BrowseServicesContent({ initialCategory }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        CATEGORIES.includes(initialCategory) ? initialCategory : "All"
    );
    const [sortOrder, setSortOrder] = useState("default");

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm.trim()) params.set("search", searchTerm.trim());
                if (selectedCategory !== "All") params.set("category", selectedCategory);
                if (sortOrder !== "default") params.set("sort", sortOrder);

                const queryString = params.toString();
                const endpoint = queryString ? `/api/services?${queryString}` : "/api/services";
                const data = await apiRequest(endpoint);
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory, sortOrder]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSortOrder("default");
    };

    const hasActiveFilters =
        searchTerm.trim() !== "" || selectedCategory !== "All" || sortOrder !== "default";

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <section className="bg-zinc-950 text-white py-14 sm:py-16 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Full Treatment Menu</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Browse Salon Services
                        </h1>
                        <p className="text-sm sm:text-base text-zinc-400">
                            Explore our curated hair, beauty, skincare, and spa experiences. Filter by specialty or sort by price to find your ideal treatment.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder="Search services by name (e.g., Balayage, Keratin, Facial)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus:bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="w-full sm:w-56">
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger className="h-11 rounded-xl border-zinc-200 bg-zinc-50/60">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                                            <SelectValue placeholder="Sort by Price" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Newest First</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="h-11 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-100 shrink-0"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1.5" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {CATEGORIES.map((category) => {
                            const active = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${active
                                            ? "bg-zinc-900 text-amber-400 shadow-xs"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-zinc-500">
                        Showing{" "}
                        <span className="font-semibold text-zinc-900">{services.length}</span>{" "}
                        {services.length === 1 ? "service" : "services"}
                        {selectedCategory !== "All" && (
                            <>
                                {" "}
                                in <span className="font-semibold text-amber-700">{selectedCategory}</span>
                            </>
                        )}
                    </p>
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
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80 space-y-3">
                        <p className="text-lg font-semibold text-zinc-800">
                            No matching salon services found
                        </p>
                        <p className="text-sm text-zinc-500 max-w-md mx-auto">
                            Try adjusting your search keywords or clearing the category filter to see all available treatments.
                        </p>
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

function SearchParamsWrapper() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "All";
    return <BrowseServicesContent key={category} initialCategory={category} />;
}

export default function BrowseServicesPage() {
    return (
        <Suspense fallback={<Loader text="Loading salon services..." />}>
            <SearchParamsWrapper />
        </Suspense>
    );
}