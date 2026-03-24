"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react"
import { getProducts, formatPrice, type Product } from "@/lib/products"

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => console.error("Error fetching admin products:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105">
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Produto</th>
                <th className="px-6 py-4 font-semibold">Preço</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Estoque</th>
                <th className="px-6 py-4 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-secondary/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                        {product.images?.[0]?.image ? (
                          <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground/20 m-auto" />
                        )}
                      </div>
                      <div className="font-medium text-foreground">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {product.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${product.stock_quantity && product.stock_quantity > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                      {product.stock_quantity || 0} unid.
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="rounded p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
