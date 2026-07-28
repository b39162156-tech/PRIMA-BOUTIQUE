import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import { storageUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const revalidate = 60; // ISR : rafraîchit le contenu chaque minute

export default async function AccueilPage() {
  const supabase = createClient();

  const [{ data: categories }, { data: brands }, { data: slides }, { data: settings }, { data: products }] =
    await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("brands").select("*"),
      supabase.from("slides").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("site_settings").select("*").eq("key", "slider_duration_ms").single(),
      supabase
        .from("products")
        .select("*, brands(name), product_images(storage_path, sort_order)")
        .eq("is_active", true),
    ]);

  const allProducts = (products as Product[]) || [];
  const promoProducts = allProducts.filter((p) => p.old_price);
  const newProducts = allProducts.filter((p) => p.is_new);
  const bestSellers = allProducts.filter((p) => p.is_best_seller);

  return (
    <div>
      <HeroSlider slides={slides || []} durationMs={Number(settings?.value) || 3700} />

      <h2 className="font-display text-xl mt-9 mb-4">Nos catégories</h2>
      <CategoryGrid categories={categories || []} />

      <h2 className="font-display text-xl mb-4">Top marques</h2>
      <div className="flex gap-5 flex-wrap mb-10">
        {(brands || []).map((b) => (
          <Link
            key={b.id}
            href={`/marques/${encodeURIComponent(b.name)}`}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-card"
          >
            <BrandMark name={b.name} logoUrl={storageUrl("brand-logos", b.logo_url)} />
            <span className="font-semibold text-sm">{b.name}</span>
          </Link>
        ))}
      </div>

      <ProductSection title="Produits en promotion" products={promoProducts} seeAllHref="/promotions" />
      <ProductSection title="Nouveautés" products={newProducts} />
      <ProductSection title="Les plus vendus" products={bestSellers} />
    </div>
  );
}

function BrandMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={name} className="w-14 h-14 rounded-full object-cover" />;
  }
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink to-gold flex items-center justify-center text-white font-bold">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
