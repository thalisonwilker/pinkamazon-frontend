"use client"

import { useState, useEffect } from "react"
import { getProducts, Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function MoreProductsSection() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts().then((data) => setProducts(data.slice(4)))
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            Mais Para Você
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Confira outros modelos que combinam com seu estilo
          </p>
        </div>
        <Link
          href="/#produtos"
          className="group hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 md:flex"
        >
          Ver todos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
