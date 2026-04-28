"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowRight, Package, SlidersHorizontal, ChevronDown, Check } from "lucide-react"
import { getProducts, getCategories, formatPrice, getProductImageUrl, getProductStoreHref, type Product, type Category } from "@/lib/products"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProductsSection() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    setIsLoading(true)
    Promise.all([getProducts(), getCategories()])
      .then(([productsData, categoriesData]) => {
        setAllProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData)
      })
      .catch(err => console.error("Error fetching homepage data:", err))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    let result = [...allProducts]

    // Search filter
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowSearch) || 
        (p.category && typeof p.category === "object" && p.category.name.toLowerCase().includes(lowSearch))
      )
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => {
        if (typeof p.category === "object" && p.category !== null) {
          return p.category.id === selectedCategory
        }
        return p.category === selectedCategory
      })
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === "newest") {
      // Default newest (assumes higher ID or just keep order)
      result.reverse()
    }

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, sortBy, allProducts])

  return (
    <section className="px-4 py-8 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <h2 className="font-sans text-2xl font-black uppercase tracking-tighter text-foreground md:text-4xl">
            Nossa <span className="text-[#E91E7B]">Coleção</span>
          </h2>
          <div className="mt-2 h-1.5 w-20 rounded-full bg-[#E91E7B]" />
        </div>

        {/* Filtros Premium */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Busca */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-2xl border-2 border-border bg-card pl-12 pr-4 text-sm font-medium transition-all focus:border-[#E91E7B] focus:outline-none focus:ring-4 focus:ring-[#E91E7B]/10"
              />
            </div>

            {/* Ordenação */}
            <div className="flex w-full md:w-auto items-center gap-2">
              <span className="hidden md:inline text-xs font-bold uppercase tracking-widest text-muted-foreground">Ordenar:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 w-full md:w-48 items-center justify-between rounded-2xl border-2 border-border bg-card px-4 text-sm font-bold transition-all hover:bg-secondary focus:outline-none">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#E91E7B]" />
                      {sortBy === "newest" ? "Lançamentos" : sortBy === "price-asc" ? "Menor Preço" : "Maior Preço"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                  <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-lg cursor-pointer flex items-center justify-between">
                    Lançamentos {sortBy === "newest" && <Check className="h-4 w-4 text-[#E91E7B]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-asc")} className="rounded-lg cursor-pointer flex items-center justify-between">
                    Menor Preço {sortBy === "price-asc" && <Check className="h-4 w-4 text-[#E91E7B]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-desc")} className="rounded-lg cursor-pointer flex items-center justify-between">
                    Maior Preço {sortBy === "price-desc" && <Check className="h-4 w-4 text-[#E91E7B]" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Categorias Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "whitespace-nowrap rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all",
                selectedCategory === null
                  ? "bg-[#E91E7B] text-white shadow-[0_4px_15px_rgba(233,30,123,0.3)]"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all",
                  selectedCategory === cat.id
                    ? "bg-[#E91E7B] text-white shadow-[0_4px_15px_rgba(233,30,123,0.3)]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[4/5] w-full rounded-3xl bg-secondary/20" />
                <div className="h-4 w-3/4 rounded bg-secondary/20" />
                <div className="h-3 w-1/2 rounded bg-secondary/20" />
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={getProductStoreHref(product)}
            className="group flex w-[280px] shrink-0 snap-center flex-col gap-3 md:w-[350px]"
          >
            {/* Imagem do Produto com Efeitos */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/5 bg-gray-50 transition-all duration-500 group-hover:border-[#E91E7B] group-hover:shadow-[0_15px_50px_rgba(233,30,123,0.4)] group-hover:-translate-y-1 md:group-hover:-translate-y-2 flex items-center justify-center">
              {getProductImageUrl(product) ? (
                <Image
                  src={getProductImageUrl(product) as string}
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
                {(product.stock_total || 0) > 0 ? `${product.stock_total} em estoque` : "Sem estoque"}
              </span>
            </div>
          </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <Package className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="text-xl font-bold text-foreground">Nenhum produto encontrado</h3>
            <p className="mt-2 text-muted-foreground">Tente ajustar seus filtros ou pesquisar por outro termo.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
              className="mt-6 font-bold text-[#E91E7B] underline underline-offset-4 hover:opacity-80"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
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
    </div>
  </section>
  )
}
