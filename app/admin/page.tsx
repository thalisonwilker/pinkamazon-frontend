"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, ShoppingBag, Eye, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { getOrders, type Order } from "@/lib/orders"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(err => console.error("Error fetching admin dashboard data:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_amount), 0)
  const ordersToday = orders.filter(order => {
    const today = new Date().toISOString().split("T")[0]
    return order.created_at.startsWith(today)
  }).length
  
  const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0
  const pendingOrders = orders.filter(order => order.order_status === "PENDING").length

  // Simplified sales chart data (last 6 months - mock for now but could be calculated)
  const monthlySalesChart = [
    { name: "Out", vendas: 4200 },
    { name: "Nov", vendas: 3800 },
    { name: "Dez", vendas: 6200 },
    { name: "Jan", vendas: 4100 },
    { name: "Fev", vendas: 5400 },
    { name: "Mar", vendas: totalRevenue || 0 }, // Current month total as simplified mock
  ]

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* GMV */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">GMV (Receita Bruta)</h3>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-500">
            <TrendingUp className="h-3 w-3" />
            <span>Automático vs histórico</span>
          </div>
        </div>

        {/* Pedidos Hoje */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pedidos Hoje</h3>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{ordersToday}</p>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Aguardando aprovação: <span className="font-bold text-orange-500">{pendingOrders}</span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ticket Médio</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{formatPrice(averageTicket)}</p>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Meta: <span className="font-semibold text-foreground">R$ 250,00</span>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status Ativo</h3>
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{(orders.length > 0 ? (orders.filter(o => o.order_status === "PAID").length / orders.length * 100).toFixed(1) : 0)}%</p>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-500">
            <TrendingUp className="h-3 w-3" />
            <span>Taxa de Aprovação</span>
          </div>
        </div>
      </div>

      {/* Basic Chart Area */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">Vendas Mensais (Últimos 6 Meses)</h3>
        <div className="flex h-64 items-end gap-2">
          {monthlySalesChart.map((data, i) => {
            const height = (data.vendas / 7000) * 100 // 7000 is a relative max
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="group relative w-full bg-primary/20 transition-colors hover:bg-primary/40 rounded-t-sm" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block">
                    {formatPrice(data.vendas)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{data.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
