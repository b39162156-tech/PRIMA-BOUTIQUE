import ProductListPage from "@/components/ProductListPage";

export const metadata = { title: "Promotions" };

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  return <ProductListPage title="Produits en promotion" promoOnly searchParams={searchParams} />;
}
