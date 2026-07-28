"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fcfa, storageUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

const CATEGORIES = [
  { id: "cosmetiques", label: "Cosmétiques" },
  { id: "alimentaire", label: "Alimentaire" },
  { id: "maison", label: "Maison" },
];

export default function AdminProduitsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*, brands(name), product_images(storage_path, sort_order)")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    const { data: brandsData } = await supabase.from("brands").select("id, name");
    setBrands(brandsData || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addProduct() {
    await supabase.from("products").insert({
      name: "Nouveau produit",
      category_id: "cosmetiques",
      price: 1000,
      stock: 10,
      is_new: true,
    });
    load();
  }

  async function updateField(id: string, field: string, value: any) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    await supabase.from("products").update({ [field]: value }).eq("id", id);
  }

  async function removeProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  async function handleUpload(productId: string, file: File) {
    const path = `${productId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) {
      alert("Erreur lors de l'import de l'image : " + error.message);
      return;
    }
    await supabase.from("product_images").insert({ product_id: productId, storage_path: path, sort_order: 0 });
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-xl">Produits ({products.length})</h1>
        <button onClick={addProduct} className="bg-pink text-white rounded-xl px-4 py-2.5 text-sm font-semibold">
          + Ajouter un produit
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {products.map((p) => {
          const image = p.product_images?.[0]?.storage_path
            ? storageUrl("product-images", p.product_images[0].storage_path)
            : null;
          return (
            <div key={p.id} className="bg-white rounded-2xl p-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 w-14 h-14 rounded-xl bg-graylight overflow-hidden shrink-0">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400">
                    {p.brands?.name || "—"} · Stock : {p.stock}
                  </div>
                </div>
                <span className="font-bold text-pink">{fcfa(p.price)}</span>
                <button
                  onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                  className="bg-graylight rounded-lg px-3 py-2 text-xs"
                >
                  {editingId === p.id ? "Fermer" : "Modifier"}
                </button>
                <button onClick={() => removeProduct(p.id)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>

              {editingId === p.id && (
                <div className="mt-3.5 pt-3.5 border-t border-gray-100 grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))" }}>
                  <Field label="Nom">
                    <input
                      value={p.name}
                      onChange={(e) => updateField(p.id, "name", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    />
                  </Field>
                  <Field label="Marque">
                    <select
                      value={p.brand_id || ""}
                      onChange={(e) => updateField(p.id, "brand_id", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    >
                      <option value="">—</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Catégorie">
                    <select
                      value={p.category_id || ""}
                      onChange={(e) => updateField(p.id, "category_id", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Prix (FCFA)">
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => updateField(p.id, "price", Number(e.target.value))}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    />
                  </Field>
                  <Field label="Ancien prix (promo)">
                    <input
                      type="number"
                      value={p.old_price || ""}
                      onChange={(e) => updateField(p.id, "old_price", e.target.value ? Number(e.target.value) : null)}
                      placeholder="Aucun"
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    />
                  </Field>
                  <Field label="Stock">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => updateField(p.id, "stock", Number(e.target.value))}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full"
                    />
                  </Field>
                  <Field label="Photo produit">
                    <button
                      onClick={() => fileInputs.current[p.id]?.click()}
                      className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full flex items-center justify-center gap-2"
                    >
                      <Upload size={14} /> Choisir un fichier
                    </button>
                    <input
                      ref={(el) => (fileInputs.current[p.id] = el)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(p.id, e.target.files[0])}
                    />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-gray-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}
