"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { useState } from "react"
import { formatPrice, type Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="group relative flex flex-col gap-3">
      {/* Image container - Sem fundo explícito e sem padding para dar amplitude à imagem da foto */}
      <div className="relative aspect-square w-full overflow-hidden transition-colors">
        <Link href={`/produto/${product.id}`}>
          <Image
            src={product.images?.[0]?.image || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {/* Favorite */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 p-1 transition-transform active:scale-90"
          aria-label={liked ? "Remover dos favoritos" : "Salvar como favorito"}
        >
          <Heart className={`h-5 w-5 transition-colors ${liked ? "fill-black text-black" : "text-black/70 hover:text-black"}`} strokeWidth={1} />
        </button>
      </div>

      {/* Info - Flow vertical minimalista */}
      <div className="flex flex-col gap-0.5">
        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-bold tracking-tight text-red-600">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-[12px] text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/produto/${product.id}`} className="group/link mt-1">
          <h3 className="line-clamp-1 text-[13px] text-foreground transition-colors group-hover/link:underline">
            {product.name}
          </h3>
        </Link>

        {/* Variation Info */}
        <span className="text-[12px] text-muted-foreground mt-0.5">
          {product.is_new ? "Novo" : "Ativo"}
        </span>
      </div>
    </div>
  )
}
