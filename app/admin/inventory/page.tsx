"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Package, Search, AlertCircle } from "lucide-react"
import { getProducts, getProductCategoryName, getProductImageUrl, type Product } from "@/lib/products"

const sizes = ["34", "35", "36", "37", "38", "39", "40"]

export default function InventoryAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProducts({ requiresAuth: true })
      .then(setProducts)
      .catch(err => console.error("Error fetching inventory products:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = products.filter(p => 
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
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-bold text-foreground">Alerta de Ruptura</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Monitoramento automático de grade em tempo real.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar sapato/grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filtered.map((product) => {
          const sizeStockMap = new Map(
            (product.size_stocks || []).map((item) => [String(item.size), item])
          )
          const totalStock = product.stock_total ?? (product.size_stocks || []).reduce((acc, curr) => acc + curr.quantity, 0)
          const lowStockCount = (product.size_stocks || []).filter((item) => item.quantity <= 3).length
          
          return (
            <div key={product.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Product Header Row */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                    {getProductImageUrl(product) ? (
                      <Image src={getProductImageUrl(product) as string} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground/20 m-auto" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{getProductCategoryName(product)}</p>
                    <p className="text-xs text-muted-foreground">SKU base: {product.sku || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Estoque Total: {totalStock}</span>
                  </div>
                  <div className={`text-xs font-semibold ${lowStockCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {lowStockCount > 0 ? `${lowStockCount} grade(s) em alerta` : "Sem alerta de ruptura"}
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto p-2 sm:p-4">
                <table className="w-full min-w-[600px] text-center text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Tamanho</th>
                      {sizes.map(size => (
                        <th key={size} className="px-4 py-2 font-bold text-foreground">{size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {/* Linha de Quantidade FÍSICA */}
                    <tr>
                      <td className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Unidades Físicas</td>
                      {sizes.map((size) => {
                        const item = sizeStockMap.get(size)
                        const quantity = item?.quantity ?? 0

                        return (
                        <td key={size} className="px-4 py-3">
                          <input 
                            type="number" 
                            value={quantity}
                            readOnly
                            className={`w-16 rounded border py-1 text-center font-bold outline-none focus:ring-1 focus:ring-primary ${
                              quantity <= 3 ? 'border-red-300 bg-red-50 text-red-600' : 'border-border bg-background text-foreground'
                            }`}
                          />
                        </td>
                      )})}
                    </tr>
                    {/* Linha de Variantes (SKU) */}
                    <tr>
                      <td className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">SKUs</td>
                      {sizes.map((size) => {
                        const item = sizeStockMap.get(size)

                        return (
                        <td key={size} className="px-4 py-2 font-mono text-[10px] text-muted-foreground">
                          {item?.sku_size || "—"}
                        </td>
                      )})}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
            Nenhum produto encontrado para o filtro informado.
          </div>
        )}
      </div>
    </div>
  )
}
