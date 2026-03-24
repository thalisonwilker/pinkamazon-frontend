"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Package, Search, AlertCircle } from "lucide-react"
import { getProducts, type Product } from "@/lib/products"

// Gerando dados matriciais falsos para a UI (normalmente viria do DB)
const sizes = [34, 35, 36, 37, 38, 39, 40]
const generateInventoryData = (productId: string) => {
  return sizes.map(size => ({
    size,
    amount: size === 35 || size === 39 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 25), // Force some low stocks
    sku: `${productId.substring(0, 3).toUpperCase()}-${size}`,
  }))
}

export default function InventoryAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProducts()
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
    <div className="flex flex-col gap-6">
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
          const matrix = generateInventoryData(product.id)
          const totalStock = matrix.reduce((acc, curr) => acc + curr.amount, 0)
          
          return (
            <div key={product.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Product Header Row */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                    {product.images?.[0]?.image ? (
                      <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground/20 m-auto" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Estoque Total: {totalStock}</span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-center text-sm">
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
                      {matrix.map((item) => (
                        <td key={item.size} className="px-4 py-3">
                          <input 
                            type="number" 
                            defaultValue={item.amount}
                            className={`w-16 rounded border py-1 text-center font-bold outline-none focus:ring-1 focus:ring-primary ${
                              item.amount <= 3 ? 'border-red-300 bg-red-50 text-red-600' : 'border-border bg-background text-foreground'
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                    {/* Linha de Variantes (SKU) */}
                    <tr>
                      <td className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">SKUs</td>
                      {matrix.map((item) => (
                        <td key={item.size} className="px-4 py-2 font-mono text-[10px] text-muted-foreground">
                          {item.sku}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
