import ProductListPage from "@/components/ProductListPage";

export const metadata = { title: "Cosmétiques" };

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  return <ProductListPage title="Cosmétiques" categoryId="cosmetiques" searchParams={searchParams} />;
}
