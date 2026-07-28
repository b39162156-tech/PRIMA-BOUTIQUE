"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { fcfa } from "@/lib/utils";

export default function FiltersSidebar({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const maxPrice = Number(searchParams.get("maxPrice") || 20000);
  const brand = searchParams.get("brand") || "Toutes";
  const promoOnly = searchParams.get("promo") === "1";
  const availableOnly = searchParams.get("dispo") === "1";

  function update(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <aside className="bg-white rounded-xl2 p-4.5 h-fit p-4">
      <h4 className="text-sm font-semibold mb-3.5">Filtres</h4>

      <div className="mb-4.5 mb-4">
        <label className="text-xs text-gray-400">Prix max : {fcfa(maxPrice)}</label>
        <input
          type="range"
          min={500}
          max={20000}
          step={500}
          value={maxPrice}
          onChange={(e) => update({ maxPrice: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="mb-4.5 mb-4">
        <label className="text-xs text-gray-400 block mb-1.5">Marque</label>
        <select
          value={brand}
          onChange={(e) => update({ brand: e.target.value === "Toutes" ? null : e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-200 text-sm"
        >
          <option>Toutes</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm mb-2.5">
        <input type="checkbox" checked={promoOnly} onChange={(e) => update({ promo: e.target.checked ? "1" : null })} />
        Promotions
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={availableOnly} onChange={(e) => update({ dispo: e.target.checked ? "1" : null })} />
        Disponible
      </label>
    </aside>
  );
}
