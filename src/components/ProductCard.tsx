"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { fcfa, storageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isFav, setIsFav] = useState(false); // branché à Supabase `favorites` une fois connecté

  const image = product.product_images?.[0]?.storage_path
    ? storageUrl("product-images", product.product_images[0].storage_path)
    : null;

  const discount = product.old_price
    ? Math.round(100 - (product.price / product.old_price) * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl2 overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative h-36 bg-graylight">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-light to-gold-light">
            <Sparkles className="text-pink" size={32} strokeWidth={1.4} />
          </div>
        )}

        {discount !== null && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => setIsFav(!isFav)}
          aria-label="Ajouter aux favoris"
          className="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart size={15} fill={isFav ? "#ff4fa3" : "none"} color={isFav ? "#ff4fa3" : "#999"} />
        </button>

        {product.stock === 0 && (
          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full">
            Rupture
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-[11px] text-gray-400">{product.brands?.name}</span>
        <span className="text-[13.5px] font-semibold leading-tight min-h-[34px]">{product.name}</span>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} fill={i <= Math.round(product.rating) ? "#D4AF37" : "none"} color="#D4AF37" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviews_count})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-bold text-pink text-[15px]">{fcfa(product.price)}</span>
          {product.old_price && (
            <span className="text-[12px] text-gray-400 line-through">{fcfa(product.old_price)}</span>
          )}
        </div>

        <button
          disabled={product.stock === 0}
          onClick={() =>
            addItem({ productId: product.id, name: product.name, price: product.price, imagePath: image })
          }
          className="mt-2 bg-pink disabled:bg-gray-300 text-white rounded-lg py-2 text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-pink-dark transition-colors"
        >
          <ShoppingCart size={14} /> Ajouter
        </button>
      </div>
    </div>
  );
}
