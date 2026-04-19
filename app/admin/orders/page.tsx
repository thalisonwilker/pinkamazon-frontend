"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Eye, Filter, Download } from "lucide-react"
import { getOrders, type Order } from "@/lib/orders"
import { formatPrice } from "@/lib/products"

const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  canceled: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-gray-100 text-gray-700 border-gray-200",
}

export default function OrdersAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(err => console.error("Error fetching admin orders:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pedido</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 bg-secondary/10 h-12"></td>
                  </tr>
                ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-secondary/20">
                  <td className="px-6 py-4 font-mono font-medium text-primary text-xs">
                    {order.id.split("-")[0].toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{order.customer_name || "N/A"}</span>
                      <span className="text-[10px] text-muted-foreground">{order.customer_email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusColors[order.status] || "bg-secondary"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="inline-block rounded p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredOrders.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
