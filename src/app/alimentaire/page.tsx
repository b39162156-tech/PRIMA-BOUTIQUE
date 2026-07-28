import ProductListPage from "@/components/ProductListPage";

export const metadata = { title: "Alimentaire" };

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  return <ProductListPage title="Alimentaire" categoryId="alimentaire" searchParams={searchParams} />;
}
