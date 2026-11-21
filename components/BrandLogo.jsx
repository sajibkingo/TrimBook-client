import Link from "next/link";
import { Scissors } from "lucide-react";

export default function BrandLogo({
    href = "/",
    variant = "light",
    onClick,
    size = "md",
}) {
    const isDarkSurface = variant === "dark";

    const iconBoxSize =
        size === "sm" ? "p-1.5 rounded-xl" : "p-2 rounded-xl";
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    const textSize = size === "sm" ? "text-base" : "text-xl";

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`inline-flex items-center gap-2.5 font-bold tracking-tight group ${textSize}`}
        >
            <span
                className={`${iconBoxSize} bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950 text-amber-400 shadow-sm ring-1 ring-amber-400/35 group-hover:scale-105 transition-transform`}
            >
                <Scissors className={iconSize} />
            </span>
            <span
                className={
                    isDarkSurface
                        ? "bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-zinc-950 via-zinc-800 to-amber-800 bg-clip-text text-transparent"
                }
            >
                TrimBook
            </span>
        </Link>
    );
}