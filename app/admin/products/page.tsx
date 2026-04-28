"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Edit2, Trash2, Package, RotateCcw, Loader2, MoreVertical, Eye, EyeOff, Layers, Filter, Check, ChevronDown } from "lucide-react"
import { getProducts, getCategories, formatPrice, getProductAdminEditHref, getProductImageUrl, updateProduct, type Product, type Category } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getCategoryName(product: Product): string {
  if (!product.category) {
    return "Sem categoria"
  }

  if (typeof product.category === "object") {
    return product.category.name
  }

  return product.category_name || "Sem categoria"
}

export default function ProductsAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [isLoading, setIsLoading] = useState(true)
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ requiresAuth: true }),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error("Error fetching admin data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleToggleProductStatus = async (product: Product) => {
    setPendingProductId(product.id)

    try {
      await updateProduct(product.id, {
        is_active: product.is_active === false,
      })

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? { ...currentProduct, is_active: currentProduct.is_active === false }
            : currentProduct
        )
      )

      toast({
        title: product.is_active === false ? "Produto reativado" : "Produto desativado",
        description: `${product.name} foi ${product.is_active === false ? "reativado" : "desativado"} com sucesso.`,
      })
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: err?.message || "Não foi possível alterar o status do produto.",
        variant: "destructive",
      })
    } finally {
      setPendingProductId(null)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = 
      selectedCategory === "all" || 
      (typeof p.category === "object" ? p.category?.id === selectedCategory : p.category === selectedCategory)
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" ? p.is_active !== false : p.is_active === false)

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm transition-all"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary shadow-sm transition-colors min-w-[160px]">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  {selectedCategory === "all" ? "Todas Categorias" : categories.find(c => c.id === selectedCategory)?.name}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={() => setSelectedCategory("all")} className="flex items-center justify-between cursor-pointer">
                Todas Categorias {selectedCategory === "all" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="flex items-center justify-between cursor-pointer">
                  {cat.name} {selectedCategory === cat.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary shadow-sm transition-colors min-w-[140px]">
                <span className="flex items-center gap-2 text-primary">
                  {statusFilter === "all" ? <Package className="h-4 w-4" /> : statusFilter === "active" ? <Check className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {statusFilter === "all" ? "Todos" : statusFilter === "active" ? "Ativos" : "Inativos"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="flex items-center justify-between cursor-pointer">
                Todos {statusFilter === "all" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")} className="flex items-center justify-between cursor-pointer">
                Ativos {statusFilter === "active" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")} className="flex items-center justify-between cursor-pointer">
                Inativos {statusFilter === "inactive" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link 
          href="/admin/products/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#E91E7B] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#D81B60] active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Produto</th>
                <th className="px-6 py-4 font-semibold">Preço</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Status</th>
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
                        {getProductImageUrl(product) ? (
                          <Image src={getProductImageUrl(product) as string} alt={product.name} fill className="object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground/20 m-auto" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {product.sku || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {getCategoryName(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      product.is_active === false 
                        ? "bg-muted text-muted-foreground" 
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {product.is_active === false ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Inativo
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3" />
                          Ativo
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${(product.stock_total || 0) > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                      {product.stock_total || 0} unid.
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                        href={getProductAdminEditHref(product)}
                        className="rounded p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary inline-flex items-center"
                        title="Editar produto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="rounded p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem asChild>
                            <Link href={getProductAdminEditHref(product)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar Detalhes
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => router.push(getProductAdminEditHref(product) + "#stock")}
                          >
                            <Layers className="mr-2 h-4 w-4" />
                            Atualizar Estoque
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            className={`cursor-pointer ${product.is_active === false ? "text-green-600 focus:text-green-600" : "text-destructive focus:text-destructive"}`}
                            onClick={() => handleToggleProductStatus(product)}
                            disabled={pendingProductId === product.id}
                          >
                            {pendingProductId === product.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : product.is_active === false ? (
                              <Eye className="mr-2 h-4 w-4" />
                            ) : (
                              <EyeOff className="mr-2 h-4 w-4" />
                            )}
                            {product.is_active === false ? "Ativar Produto" : "Desativar Produto"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
