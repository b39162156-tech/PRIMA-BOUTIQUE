import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "221778028025";
  const message = encodeURIComponent(
    "Bonjour PRIMA BOUTIQUE, je souhaite avoir des informations sur un produit."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter PRIMA BOUTIQUE sur WhatsApp"
      className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg z-50"
    >
      <MessageCircle size={26} color="#fff" fill="#fff" />
    </a>
  );
}
