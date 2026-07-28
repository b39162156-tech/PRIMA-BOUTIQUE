"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tag, Images, ClipboardList, Users, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ITEMS: [string, string, any][] = [
  ["/admin", "Tableau de bord", LayoutDashboard],
  ["/admin/produits", "Produits", Package],
  ["/admin/categories-marques", "Catégories & marques", Tag],
  ["/admin/slider", "Slider", Images],
  ["/admin/commandes", "Commandes", ClipboardList],
  ["/admin/clients", "Clients", Users],
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  return (
    <aside className="bg-white rounded-xl2 p-3">
      {ITEMS.map(([href, label, Icon]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] mb-1 ${
              active ? "bg-pink-light text-pink-dark font-semibold" : "text-gray-600"
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
      <div className="border-t border-gray-100 my-2.5" />
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/admin/login");
          router.refresh();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] text-red-500"
      >
        <LogOut size={16} /> Déconnexion
      </button>
    </aside>
  );
}
