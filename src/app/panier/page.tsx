"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { fcfa } from "@/lib/utils";

export default function PanierPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();
  const livraison = subtotal > 0 ? 1500 : 0;
  const total = subtotal + livraison;

  return (
    <div className="mt-6">
      <h1 className="font-display text-2xl mb-4">Mon panier</h1>

      {items.length === 0 ? (
        <p className="text-gray-400">
          Votre panier est vide.{" "}
          <Link href="/" className="text-pink font-semibold">
            Continuer mes achats
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 items-start" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl p-3.5 p-3 flex items-center gap-3.5 gap-3">
                <div className="w-16 h-16 rounded-xl bg-graylight shrink-0 overflow-hidden">
                  {item.imagePath && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="font-bold text-pink text-sm mt-1">{fcfa(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-6.5 h-6.5 w-7 h-7 rounded-full border border-gray-200 bg-graylight flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[18px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 bg-graylight flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl2 p-5">
            <h4 className="text-sm font-semibold mb-3.5">Résumé</h4>
            <Row label="Sous-total" value={fcfa(subtotal)} />
            <Row label="Livraison" value={fcfa(livraison)} />
            <div className="border-t border-gray-100 my-2.5" />
            <Row label="Total" value={fcfa(total)} bold />
            <button
              onClick={() => router.push("/paiement")}
              className="mt-3.5 w-full bg-pink text-white rounded-xl py-3 font-semibold hover:bg-pink-dark transition-colors"
            >
              Passer au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between mb-1.5 ${bold ? "text-base font-bold" : "text-sm"}`}>
      <span className={bold ? "text-gray-800" : "text-gray-400"}>{label}</span>
      <span className={bold ? "text-pink" : "text-gray-800"}>{value}</span>
    </div>
  );
}
