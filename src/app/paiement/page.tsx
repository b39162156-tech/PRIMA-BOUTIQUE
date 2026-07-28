"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { fcfa } from "@/lib/utils";

export default function PaiementPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [zone, setZone] = useState<"dakar" | "regions">("dakar");
  const [method, setMethod] = useState<"wave" | "orange_money" | "a_la_livraison">("wave");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = zone === "dakar" ? 1500 : 3000;
  const total = subtotal + deliveryFee;

  async function confirmOrder() {
    if (!name.trim() || !phone.trim()) {
      setError("Merci d'indiquer votre nom et votre téléphone.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          deliveryZone: zone,
          deliveryFee,
          paymentMethod: method,
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error();
      clear();
      setDone(true);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !done) {
    return <p className="mt-6 text-gray-400">Votre panier est vide.</p>;
  }

  if (done) {
    return (
      <div className="mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-pink-light flex items-center justify-center mx-auto mb-4">
          <Check size={30} className="text-pink" />
        </div>
        <h2 className="font-display text-xl mb-2">Commande confirmée</h2>
        <p className="text-gray-400 mb-5">Merci pour votre achat, vous recevrez une confirmation par WhatsApp.</p>
        <button onClick={() => router.push("/")} className="bg-pink text-white rounded-xl px-6 py-2.5 font-semibold">
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-lg">
      <h1 className="font-display text-2xl mb-4">Paiement</h1>

      <h4 className="text-sm font-semibold mb-2">Vos coordonnées</h4>
      <div className="flex flex-col gap-2.5 mb-5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse de livraison" className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm" />
      </div>

      <h4 className="text-sm font-semibold mb-2">Livraison</h4>
      <div className="flex gap-2.5 mb-5">
        <Pill active={zone === "dakar"} onClick={() => setZone("dakar")} label="Dakar — 1 500 FCFA" />
        <Pill active={zone === "regions"} onClick={() => setZone("regions")} label="Régions — 3 000 FCFA" />
      </div>

      <h4 className="text-sm font-semibold mb-2">Méthode de paiement</h4>
      <div className="flex flex-col gap-2.5 mb-5">
        {(
          [
            ["wave", "Wave"],
            ["orange_money", "Orange Money"],
            ["a_la_livraison", "Paiement à la livraison"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={`flex justify-between items-center px-4 py-3 rounded-2xl text-sm bg-white ${
              method === id ? "border-2 border-pink" : "border border-gray-100"
            }`}
          >
            {label}
            {method === id && <Check size={16} className="text-pink" />}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4.5 p-4 mb-5">
        <Row label="Sous-total" value={fcfa(subtotal)} />
        <Row label="Livraison" value={fcfa(deliveryFee)} />
        <div className="border-t border-gray-100 my-2" />
        <Row label="Total" value={fcfa(total)} bold />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={confirmOrder}
        disabled={submitting}
        className="w-full bg-pink text-white rounded-xl py-3.5 font-semibold text-[15px] disabled:opacity-60"
      >
        {submitting ? "Envoi en cours..." : "Confirmer la commande"}
      </button>
      <p className="text-[11px] text-gray-300 mt-2.5">
        Architecture prête pour l&apos;ajout futur d&apos;un paiement en ligne par carte.
      </p>
    </div>
  );
}

function Pill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm ${
        active ? "border-2 border-pink bg-pink-light text-pink-dark font-semibold" : "border border-gray-200 text-gray-600"
      }`}
    >
      {label}
    </button>
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
