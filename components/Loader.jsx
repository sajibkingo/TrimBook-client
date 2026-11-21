import { Scissors } from "lucide-react";

export default function Loader({ text = "Loading TrimBook..." }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-zinc-600">
            <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-2 border-zinc-200 border-t-amber-600 animate-spin" />
                <Scissors className="w-5 h-5 text-zinc-900 absolute" />
            </div>
            <p className="text-sm font-medium tracking-wide text-zinc-500">{text}</p>
        </div>
    );
} 