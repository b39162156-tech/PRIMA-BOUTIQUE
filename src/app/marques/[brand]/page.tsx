import ProductListPage from "@/components/ProductListPage";

export function generateMetadata({ params }: { params: { brand: string } }) {
  return { title: decodeURIComponent(params.brand) };
}

export default function BrandPage({
  params,
  searchParams,
}: {
  params: { brand: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const brandName = decodeURIComponent(params.brand);
  return <ProductListPage title={brandName} brandName={brandName} searchParams={searchParams} />;
}
