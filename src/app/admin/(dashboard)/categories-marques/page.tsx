"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminCategoriesMarquesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [newBrand, setNewBrand] = useState("");

  async function load() {
    const { data: cats } = await supabase.from("categories").select("id, label").order("sort_order");
    setCategories(cats || []);
    const { data: brandsData } = await supabase.from("brands").select("id, name");
    setBrands(brandsData || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addBrand() {
    if (!newBrand.trim()) return;
    await supabase.from("brands").insert({ name: newBrand.trim() });
    setNewBrand("");
    load();
  }

  async function removeBrand(id: string) {
    await supabase.from("brands").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-xl mb-4">Catégories & marques</h1>

      <div className="bg-white rounded-2xl p-4.5 p-4 mb-4">
        <h4 className="text-sm font-semibold mb-2.5">Catégories</h4>
        {categories.map((c) => (
          <div key={c.id} className="flex justify-between py-2 border-b border-gray-50 text-sm">
            <span>{c.label}</span>
            <span className="text-gray-400 text-xs">Géré via le fichier schema.sql</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4">
        <h4 className="text-sm font-semibold mb-2.5">Marques</h4>
        {brands.map((b) => (
          <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
            <span>{b.name}</span>
            <button onClick={() => removeBrand(b.id)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <input
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Nom de la marque"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1"
          />
          <button onClick={addBrand} className="bg-graylight rounded-lg px-4 py-2 text-sm font-semibold">
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
