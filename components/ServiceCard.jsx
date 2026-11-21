import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all duration-300 flex flex-col">
      <div className="relative h-52 w-full overflow-hidden bg-zinc-100">
        <img
          src={service.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"}
          alt={service.serviceName}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-zinc-950/85 text-amber-300 hover:bg-zinc-950 backdrop-blur-xs border-0 px-3 py-1 text-xs font-medium">
            {service.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-zinc-800 flex items-center gap-1.5 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{service.duration} min</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
              {service.serviceName}
            </h3>
            <span className="text-lg font-bold text-zinc-950 shrink-0">
              ${Number(service.price).toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white rounded-xl h-10 font-medium transition-colors"
        >
          <Link href={`/services/${service._id}`} className="flex items-center justify-center gap-1.5">
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}