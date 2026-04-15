"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getProducts, getProductImageUrl, getProductStoreHref, type Product } from "@/lib/products"

export function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts()
      .then(p => setProducts(p.slice(0, 2)))
      .catch(err => console.error("Error fetching featured products:", err))
  }, [])

  if (products.length === 0) return null

  return (
    <section className="px-4 py-12 md:px-8">
      <h2 className="mb-6 font-sans text-xl font-bold uppercase tracking-widest text-[#E91E7B] md:text-2xl italic">
        Tendências da Temporada
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {products.map((item) => (
          <Link
            key={item.id}
            href={getProductStoreHref(item)}
            className="group relative h-[500px] w-full overflow-hidden transition-all md:h-[600px] lg:h-[700px] rounded-2xl"
          >
            {getProductImageUrl(item) && (
              <Image
                src={getProductImageUrl(item) as string}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            {/* Gradiente leve para garantir leitura na base */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="absolute bottom-10 left-8 z-10 flex flex-col items-start gap-4">
              <h3 className="font-sans text-3xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                {item.name}
              </h3>
              <span className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-[14px] font-bold tracking-widest uppercase text-white transition-all group-hover:bg-primary/90 group-hover:scale-105 shadow-xl shadow-primary/20">
                Comprar Agora
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
