"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function ComptePage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("products(*, brands(name), product_images(storage_path, sort_order))")
      .eq("user_id", user.id)
      .then(({ data }) => setFavorites((data || []).map((f: any) => f.products).filter(Boolean)));
  }, [user, supabase]);

  async function handleSubmit() {
    setError("");
    const action = mode === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await action({ email, password });
    if (error) setError(error.message);
  }

  if (!user) {
    return (
      <div className="mt-14 max-w-sm mx-auto">
        <div className="bg-white rounded-2xl p-7 text-center">
          <div className="w-12 h-12 rounded-full bg-pink-light flex items-center justify-center mx-auto mb-3">
            <User size={22} className="text-pink" />
          </div>
          <h3 className="font-semibold text-lg mb-1">{mode === "login" ? "Connexion" : "Créer un compte"}</h3>
          <p className="text-xs text-gray-400 mb-4">Accédez à vos commandes et vos favoris</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse e-mail" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm mb-2.5" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm mb-3.5" />
          {error && <p className="text-red-500 text-xs mb-2.5">{error}</p>}
          <button onClick={handleSubmit} className="w-full bg-pink text-white rounded-xl py-2.5 font-semibold">
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs text-gray-400 mt-3"
          >
            {mode === "login" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h1 className="font-display text-2xl mb-4">Mon compte</h1>
      <div className="bg-white rounded-2xl p-5 mb-6 flex items-center gap-3.5">
        <div className="w-13 h-13 w-14 h-14 rounded-full bg-pink-light flex items-center justify-center">
          <User size={24} className="text-pink" />
        </div>
        <div>
          <div className="font-semibold">{user.email}</div>
          <button onClick={() => supabase.auth.signOut()} className="text-xs text-gray-400 mt-0.5">
            Se déconnecter
          </button>
        </div>
      </div>

      <h4 className="text-base font-semibold mb-3">Mes favoris</h4>
      {favorites.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun favori pour le moment.</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
