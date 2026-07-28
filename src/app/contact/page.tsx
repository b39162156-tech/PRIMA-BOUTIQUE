"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mt-6 max-w-lg">
      <h1 className="font-display text-2xl mb-4">Contact</h1>
      <div className="bg-white rounded-xl2 p-5 flex flex-col gap-3">
        <input placeholder="Votre nom" className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm" />
        <input placeholder="Votre téléphone" className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm" />
        <textarea placeholder="Votre message" rows={4} className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none" />
        <button
          onClick={() => setSent(true)}
          className="bg-pink text-white rounded-xl py-2.5 font-semibold"
        >
          Envoyer
        </button>
        {sent && <p className="text-sm text-pink">Message envoyé — nous vous répondrons rapidement.</p>}
      </div>
      <p className="text-sm text-gray-400 mt-4">
        Ou contactez-nous directement sur WhatsApp au +221 77 802 80 25.
      </p>
    </div>
  );
}
