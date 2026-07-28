import { createClient } from "@/lib/supabase/server";

export default async function AdminClientsPage() {
  const supabase = createClient();

  // Historique de commandes par client (regroupé par téléphone, car les invités n'ont pas de compte)
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_name, customer_phone, customer_address, created_at, total")
    .order("created_at", { ascending: false });

  const byPhone = new Map<string, { name: string; phone: string; address: string | null; count: number; total: number }>();
  (orders || []).forEach((o) => {
    const key = o.customer_phone;
    const existing = byPhone.get(key);
    if (existing) {
      existing.count += 1;
      existing.total += Number(o.total);
    } else {
      byPhone.set(key, { name: o.customer_name, phone: o.customer_phone, address: o.customer_address, count: 1, total: Number(o.total) });
    }
  });
  const clients = Array.from(byPhone.values());

  return (
    <div>
      <h1 className="font-display text-xl mb-4">Clients</h1>
      <div className="bg-white rounded-2xl overflow-hidden">
        {clients.map((c) => (
          <div key={c.phone} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-sm flex-wrap">
            <span className="font-semibold w-36">{c.name}</span>
            <span className="text-gray-600 w-36">{c.phone}</span>
            <span className="text-gray-600 flex-1 min-w-[140px]">{c.address || "—"}</span>
            <span className="text-gray-400">{c.count} commande{c.count > 1 ? "s" : ""}</span>
          </div>
        ))}
        {clients.length === 0 && <p className="p-4 text-gray-400 text-sm">Aucun client pour le moment.</p>}
      </div>
    </div>
  );
}
