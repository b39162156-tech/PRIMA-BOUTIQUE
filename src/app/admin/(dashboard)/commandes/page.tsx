"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fcfa } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  en_attente: "#999999",
  confirmee: "#378ADD",
  en_preparation: "#D4AF37",
  expediee: "#7a6bd6",
  livree: "#3b9922",
};

export default function AdminCommandesPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from("orders").update({ status }).eq("id", id);
  }

  return (
    <div>
      <h1 className="font-display text-xl mb-4">Commandes</h1>
      <div className="bg-white rounded-2xl overflow-hidden">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center gap-3 px-4.5 px-4 py-3.5 border-b border-gray-50 text-sm flex-wrap">
            <span className="font-semibold w-24">{o.order_number}</span>
            <span className="flex-1 text-gray-600 min-w-[120px]">{o.customer_name}</span>
            <span className="text-gray-400 w-28">{new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
            <span className="font-bold text-pink w-28">{fcfa(o.total)}</span>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
              className="text-xs font-semibold rounded-full px-2.5 py-1 border-none"
              style={{ color: STATUS_COLORS[o.status], background: `${STATUS_COLORS[o.status]}18` }}
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
        {orders.length === 0 && <p className="p-4 text-gray-400 text-sm">Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}
