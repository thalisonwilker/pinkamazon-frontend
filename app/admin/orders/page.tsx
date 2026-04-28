"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Filter, Download, ChevronLeft, ChevronRight, X } from "lucide-react"
import { getOrders, type Order, statusLabel, statusColor } from "@/lib/orders"
import { formatPrice } from "@/lib/products"

const PAGE_SIZE = 20

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters & Pagination State
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page,
        page_size: PAGE_SIZE,
      }
      if (search) params.search = search
      if (status) params.status = status

      const data = await getOrders(params)
      setOrders(data.results)
      setTotalCount(data.count)
    } catch (err) {
      console.error("Error fetching admin orders:", err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1) // Reset to first page on search
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setPage(1)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por ID, e-mail ou nome..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                isFilterOpen || status 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              <Filter className="h-4 w-4" />
              {status ? `Status: ${statusLabel[status]}` : "Filtros"}
              {status && (
                <X 
                  className="h-3 w-3 ml-1 hover:text-red-500" 
                  onClick={(e) => { e.stopPropagation(); setStatus("") }} 
                />
              )}
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filter Bar Expansion */}
        {isFilterOpen && (
          <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 animate-in slide-in-from-top-2 duration-300">
            <p className="w-full text-[10px] font-black uppercase tracking-widest text-primary mb-1">Filtrar por Status:</p>
            {Object.entries(statusLabel).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key === status ? "" : key)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all border ${
                  status === key 
                    ? "bg-primary text-white border-primary" 
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-16">
                      <div className="h-4 bg-secondary/50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : orders.map((order) => (
                <tr key={order.id} className="group transition-colors hover:bg-secondary/20">
                  <td className="px-6 py-4 font-mono font-bold text-primary text-xs">
                    #{order.id.split("-")[0].toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                       day: '2-digit',
                       month: 'short',
                       year: 'numeric',
                       hour: '2-digit',
                       minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{order.customer_name || "Cliente S/N"}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{order.customer_email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-foreground">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-sm border ${statusColor[order.status] || "bg-secondary"}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`} 
                      className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-secondary/10">
            <Search className="h-12 w-12 mb-4 opacity-10" />
            <p className="font-medium">Nenhum pedido encontrado com estes filtros.</p>
            {(search || status) && (
              <button 
                onClick={() => { setSearch(""); setStatus(""); setPage(1); }}
                className="mt-4 text-xs font-bold text-primary uppercase underline underline-offset-4"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Mostrando <span className="text-foreground">{(page - 1) * PAGE_SIZE + 1}</span> a <span className="text-foreground">{Math.min(page * PAGE_SIZE, totalCount)}</span> de <span className="text-foreground">{totalCount}</span> pedidos
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-all hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = page
                  if (totalPages <= 5) pageNum = i + 1
                  else if (page <= 3) pageNum = i + 1
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = page - 2 + i

                  if (pageNum > totalPages || pageNum < 1) return null

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all border ${
                        page === pageNum 
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-all hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
