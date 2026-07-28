import { createClient } from "@/lib/supabase/server";
import { fcfa } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ count: productsCount }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
  ]);

  const allOrders = orders || [];
  const today = new Date().toDateString();
  const salesToday = allOrders
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((s, o) => s + Number(o.total), 0);
  const revenue = allOrders.reduce((s, o) => s + Number(o.total), 0);

  const { data: bestSellers } = await supabase
    .from("products")
    .select("name, reviews_count")
    .order("reviews_count", { ascending: false })
    .limit(5);

  const stats: [string, string][] = [
    ["Produits", String(productsCount || 0)],
    ["Commandes", String(allOrders.length)],
    ["Ventes du jour", fcfa(salesToday)],
    ["Chiffre d'affaires", fcfa(revenue)],
  ];

  const maxReviews = Math.max(1, ...(bestSellers || []).map((p) => p.reviews_count));

  return (
    <div>
      <h1 className="font-display text-xl mb-4">Tableau de bord</h1>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))" }}>
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white rounded-2xl p-4">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-xl font-bold text-pink mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4.5 p-4">
        <h4 className="text-sm font-semibold mb-3">Produits les plus vendus</h4>
        {(bestSellers || []).map((p) => (
          <div key={p.name} className="flex items-center gap-2.5 mb-2.5">
            <div className="flex-1">
              <div className="text-[13px] font-medium">{p.name}</div>
              <div className="h-1.5 bg-graylight rounded mt-1">
                <div
                  className="h-1.5 rounded bg-gradient-to-r from-pink to-gold"
                  style={{ width: `${(p.reviews_count / maxReviews) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-400 min-w-[60px] text-right">{p.reviews_count} avis</span>
          </div>
        ))}
      </div>
    </div>
  );
}
