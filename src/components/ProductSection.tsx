import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function ProductSection({
  title,
  products,
  seeAllHref,
}: {
  title: string;
  products: Product[];
  seeAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="font-display text-xl">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-pink text-sm font-semibold">
            Voir tout →
          </Link>
        )}
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
