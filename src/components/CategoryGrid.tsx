import Link from "next/link";
import { Sparkle, UtensilsCrossed, Home as HomeIcon, LucideIcon } from "lucide-react";
import type { Category } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  sparkle: Sparkle,
  "utensils-crossed": UtensilsCrossed,
  home: HomeIcon,
};
const COLORS: Record<string, string> = {
  cosmetiques: "#ff4fa3",
  alimentaire: "#D4AF37",
  maison: "#7a6bd6",
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      {categories.map((c) => {
        const Icon = ICONS[c.icon || "sparkle"] || Sparkle;
        const color = COLORS[c.id] || "#ff4fa3";
        return (
          <Link
            key={c.id}
            href={`/${c.id}`}
            className="bg-white rounded-xl2 p-6 flex items-center gap-3.5 shadow-card hover:shadow-cardHover transition-shadow"
          >
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center" style={{ background: `${color}1a`, width: 52, height: 52 }}>
              <Icon size={26} color={color} />
            </div>
            <div>
              <div className="font-semibold text-base">{c.label}</div>
              <div className="text-xs text-gray-400">Voir les produits</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
