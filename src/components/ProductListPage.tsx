import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import FiltersSidebar from "@/components/FiltersSidebar";
import type { Product } from "@/lib/types";

type Props = {
  title: string;
  categoryId?: string;
  brandName?: string;
  promoOnly?: boolean;
  searchParams: { [key: string]: string | undefined };
};

export default async function ProductListPage({ title, categoryId, brandName, promoOnly, searchParams }: Props) {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, brands(name), product_images(storage_path, sort_order)")
    .eq("is_active", true);

  if (categoryId) query = query.eq("category_id", categoryId);
  if (promoOnly) query = query.not("old_price", "is", null);

  const maxPrice = Number(searchParams.maxPrice || 20000);
  query = query.lte("price", maxPrice);

  if (searchParams.promo === "1") query = query.not("old_price", "is", null);
  if (searchParams.dispo === "1") query = query.gt("stock", 0);

  const { data } = await query;
  let products = (data as Product[]) || [];

  const selectedBrand = brandName || searchParams.brand;
  if (selectedBrand) {
    products = products.filter((p) => p.brands?.name === selectedBrand);
  }

  const { data: brandsData } = await supabase.from("brands").select("name");
  const brandNames = (brandsData || []).map((b) => b.name);

  return (
    <div className="mt-6 grid gap-6" style={{ gridTemplateColumns: "220px 1fr" }}>
      <FiltersSidebar brands={brandNames} />

      <div>
        <h1 className="font-display text-2xl mb-4">{title}</h1>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && <p className="text-gray-400">Aucun produit ne correspond à ces filtres.</p>}
      </div>
    </div>
  );
}
