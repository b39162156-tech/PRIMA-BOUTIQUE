import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-10 py-7 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-6">
        <div>
          <div className="font-display font-bold text-lg mb-1.5">
            PRIMA <span className="text-pink">BOUTIQUE</span>
          </div>
          <p className="text-xs text-gray-400 max-w-[260px]">
            Cosmétiques, alimentaire et maison — livrés à Dakar et dans toutes les régions.
          </p>
        </div>

        <div className="flex gap-10 flex-wrap">
          <FooterCol title="Boutique" links={[["/", "Accueil"], ["/promotions", "Promotions"], ["/marques", "Marques"]]} />
          <FooterCol title="Aide" links={[["/contact", "Contact"], ["/apropos", "À propos"], ["/compte", "Mon compte"]]} />
          <FooterCol title="Administration" links={[["/admin", "Accès admin"]]} />
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">{title}</div>
      {links.map(([href, label]) => (
        <div key={href} className="mb-1.5">
          <Link href={href} className="text-[13px] text-gray-600 hover:text-pink">
            {label}
          </Link>
        </div>
      ))}
    </div>
  );
}
