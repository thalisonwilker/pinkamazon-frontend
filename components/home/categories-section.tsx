"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/products"

export function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    getCategories().then((data) => setCategories(data.slice(0, 10)))
  }, [])

  return (
    <section className="px-4 py-8 md:px-8 md:py-12">
      <h2 className="mb-6 font-serif text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
        Compre Por Categoria
      </h2>

      <div className="flex snap-x snap-mandatory overflow-x-auto pb-4 scrollbar-hide gap-4 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/#${cat.slug}`}
            className="group relative flex h-[350px] w-[280px] shrink-0 snap-start flex-col overflow-hidden bg-secondary md:h-[450px] md:w-[350px]"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 280px, 350px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
            <div className="absolute bottom-6 left-6 z-10 w-full pr-12">
              <span className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold uppercase text-black transition-transform group-hover:scale-105">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
