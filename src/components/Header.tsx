"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_ITEMS: [string, string][] = [
  ["/", "Accueil"],
  ["/cosmetiques", "Cosmétiques"],
  ["/alimentaire", "Alimentaire"],
  ["/maison", "Maison"],
  ["/promotions", "Promotions"],
  ["/marques", "Marques"],
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink to-gold flex items-center justify-center text-white font-bold font-display">
            P
          </div>
          <span className="font-display font-bold text-lg text-gray-800 hidden sm:inline">
            PRIMA <span className="text-pink">BOUTIQUE</span>
          </span>
        </Link>

        <form
          action="/recherche"
          className="flex-1 flex items-center bg-graylight rounded-full px-3.5 py-2 gap-2"
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit, une marque..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </form>

        <div className="flex items-center gap-1 shrink-0">
          <Link href="/compte" aria-label="Favoris" className="p-2 rounded-lg hover:bg-graylight">
            <Heart size={20} />
          </Link>
          <Link href="/panier" aria-label="Panier" className="relative p-2 rounded-lg hover:bg-graylight">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute top-0 right-0 bg-pink text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
          <Link href="/compte" aria-label="Mon compte" className="p-2 rounded-lg hover:bg-graylight">
            <User size={20} />
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-graylight md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className={`max-w-6xl mx-auto px-4 pb-2.5 flex-wrap gap-5 md:flex ${menuOpen ? "flex flex-col" : "hidden"}`}>
        {NAV_ITEMS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700 hover:text-pink py-1 border-b-2 border-transparent hover:border-pink"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
