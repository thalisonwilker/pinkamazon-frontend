"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ClientLayout } from "@/components/client-layout"
import { ProductDetail } from "@/components/product/product-detail"
import { getProductById, getProducts, getProductCategoryName, type Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getProductById(id)
      .then(p => {
        setProduct(p)
        // Fetch related products (same category)
        getProducts(p.category && typeof p.category === "object" ? p.category.slug : undefined)
          .then(all => setRelated(all.filter(item => item.id !== p.id).slice(0, 4)))
          .catch(() => setRelated([]))
      })
      .catch(err => console.error("Error fetching product:", err))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </ClientLayout>
    )
  }

  if (!product) {
    return (
      <ClientLayout>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-lg text-muted-foreground">Produto não encontrado.</p>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">Inicio</Link>
          <span>/</span>
          <Link
            href={product.category && typeof product.category === "object" ? `/categoria/${product.category.slug}` : "/produtos"}
            className="transition-colors hover:text-primary"
          >
            {getProductCategoryName(product)}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <ProductDetail product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </ClientLayout>
  )
}
