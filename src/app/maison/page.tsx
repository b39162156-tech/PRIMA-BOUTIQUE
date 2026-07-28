import ProductListPage from "@/components/ProductListPage";

export const metadata = { title: "Maison" };

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  return <ProductListPage title="Maison" categoryId="maison" searchParams={searchParams} />;
}
