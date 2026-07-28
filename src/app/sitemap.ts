import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://primaboutique.sn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    "", "cosmetiques", "alimentaire", "maison", "promotions", "marques", "contact", "apropos",
  ].map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
  }));

  const { data: brands } = await supabase.from("brands").select("name");
  const brandRoutes: MetadataRoute.Sitemap = (brands || []).map((b) => ({
    url: `${SITE_URL}/marques/${encodeURIComponent(b.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...brandRoutes];
}
