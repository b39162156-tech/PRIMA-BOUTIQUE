import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nos marques" };

export default async function MarquesPage() {
  const supabase = createClient();
  const { data: brands } = await supabase.from("brands").select("*");
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });

  return (
    <div className="mt-6">
      <h1 className="font-display text-2xl mb-4">Nos marques</h1>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {(brands || []).map((b) => (
          <Link
            key={b.id}
            href={`/marques/${encodeURIComponent(b.name)}`}
            className="bg-white rounded-xl2 p-5.5 p-5 flex flex-col items-center gap-2.5 gap-2 shadow-card"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink to-gold flex items-center justify-center text-white font-bold text-lg">
              {b.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold">{b.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
