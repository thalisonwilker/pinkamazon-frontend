"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Package } from "lucide-react"
import { getProducts, formatPrice, type Product } from "@/lib/products"

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.slice(0, 8)))
      .catch(err => console.error("Error fetching homepage products:", err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="px-4 py-8 md:px-8 md:py-16">
      <div className="mb-8 flex w-full flex-col items-center justify-center text-center">
        <h2 className="font-sans text-xl font-bold uppercase tracking-widest text-foreground md:text-2xl">
          Novidades em Alta
        </h2>
      </div>

      <div className="flex snap-x snap-mandatory overflow-x-auto pb-6 scrollbar-hide gap-4 md:gap-6 md:justify-center">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[280px] shrink-0 snap-center md:w-[350px] animate-pulse">
              <div className="aspect-[4/5] w-full rounded-2xl bg-secondary/20" />
              <div className="mt-4 h-4 w-3/4 rounded bg-secondary/20" />
              <div className="mt-2 h-3 w-1/2 rounded bg-secondary/20" />
            </div>
          ))
        ) : products.map((product) => (
          <Link
            key={product.id}
            href={`/produto/${product.id}`}
            className="group flex w-[280px] shrink-0 snap-center flex-col gap-3 md:w-[350px]"
          >
            {/* Imagem do Produto com Efeitos */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/5 bg-gray-50 transition-all duration-500 group-hover:border-[#E91E7B] group-hover:shadow-[0_15px_50px_rgba(233,30,123,0.4)] group-hover:-translate-y-1 md:group-hover:-translate-y-2 flex items-center justify-center">
              {product.images?.[0]?.image ? (
                <Image
                  src={product.images[0].image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 280px, 350px"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground/20" />
              )}
              
              {/* Overlay suave inferior para dar contraste ao botão */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Botão overlay arrojado */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <span className="whitespace-nowrap rounded-full bg-[#E91E7B] px-8 py-3.5 text-[13px] font-black uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(233,30,123,0.4)] transition-all hover:bg-white hover:text-[#E91E7B] hover:shadow-[0_0_30px_rgba(233,30,123,0.6)]">
                  Comprar
                </span>
              </div>
            </div>
            
            {/* Info Minimalista */}
            <div className="flex flex-col gap-0.5 px-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold tracking-tight text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-[12px] text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              <h3 className="line-clamp-1 text-[13px] text-foreground transition-colors group-hover:underline mt-1">
                {product.name}
              </h3>
              <span className="text-[12px] text-muted-foreground mt-0.5">
                {product.is_active ? "Novo" : "Esgotado"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link 
          href="/#produtos" 
          className="group inline-flex items-center gap-2 border-b-2 border-transparent pb-1 text-sm font-bold uppercase tracking-wider text-black transition-all hover:border-black hover:opacity-80"
        >
          Ver tudo
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  )
}
