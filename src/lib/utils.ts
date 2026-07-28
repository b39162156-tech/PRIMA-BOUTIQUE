export function fcfa(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;
}

// Construit l'URL publique d'un fichier stocké dans Supabase Storage.
// bucket: 'product-images' | 'slider-images' | 'brand-logos'
export function storageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${n}`;
}
