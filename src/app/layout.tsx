import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart-context";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const SITE_URL = "https://primaboutique.sn"; // à remplacer par le domaine réel

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PRIMA BOUTIQUE — Cosmétiques, alimentaire et maison",
    template: "%s | PRIMA BOUTIQUE",
  },
  description:
    "PRIMA BOUTIQUE, votre boutique en ligne à Dakar : cosmétiques, produits alimentaires et articles pour la maison, livrés partout au Sénégal.",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: "PRIMA BOUTIQUE",
    title: "PRIMA BOUTIQUE — Cosmétiques, alimentaire et maison",
    description: "Votre boutique en ligne à Dakar : cosmétiques, alimentaire et maison, livrés partout au Sénégal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRIMA BOUTIQUE",
    description: "Votre boutique en ligne à Dakar : cosmétiques, alimentaire et maison.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${poppins.variable} font-sans bg-graylight text-gray-800`}>
        <CartProvider>
          <Header />
          <main className="max-w-6xl mx-auto px-4 pb-16">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
