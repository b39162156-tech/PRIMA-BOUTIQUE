"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setError("Identifiants incorrects.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).single();
    if (!profile?.is_admin) {
      setError("Ce compte n'a pas les droits administrateur.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mt-16 max-w-sm mx-auto">
      <div className="bg-white rounded-2xl p-7 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink to-gold mx-auto mb-3.5 flex items-center justify-center text-white font-bold">
          P
        </div>
        <h3 className="font-semibold text-lg mb-1">Espace administration</h3>
        <p className="text-xs text-gray-400 mb-4.5 mb-4">Connexion sécurisée par e-mail et mot de passe</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm mb-2.5"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Mot de passe"
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm mb-3.5"
        />
        {error && <p className="text-red-500 text-xs mb-2.5">{error}</p>}
        <button onClick={handleLogin} disabled={loading} className="w-full bg-pink text-white rounded-xl py-2.5 font-semibold disabled:opacity-60">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}
