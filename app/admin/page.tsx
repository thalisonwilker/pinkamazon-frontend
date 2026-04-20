"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, TrendingUp, ShoppingBag, 
  Box, AlertTriangle, Users, ArrowUpRight, 
  Clock
} from "lucide-react"
import { formatPrice } from "@/lib/products"
import { 
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, AreaChart, Area
} from "recharts"
import { apiFetch } from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch<any>("/api/v1/settings/dashboard/stats/", { requiresAuth: true })
        setStats(data)
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const salesChartData = stats?.sales_history?.map((s: any) => ({
    name: s.month,
    value: s.revenue
  })) || []

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Painel Executivo</h1>
        <p className="text-sm text-muted-foreground">Visão geral e desempenho operacional</p>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Receita Bruta (GMV)" 
          value={formatPrice(stats?.financial?.gmv || 0)} 
          icon={<DollarSign className="h-4 w-4" />}
          subtext="Total em vendas confirmadas"
          trend={stats?.financial?.gmv > 1000 ? "+12%" : null}
        />
        <StatCard 
          title="Pedidos Hoje" 
          value={stats?.commercial?.orders_today || 0} 
          icon={<ShoppingBag className="h-4 w-4" />}
          subtext="Pagamentos processados hoje"
        />
        <StatCard 
          title="Ticket Médio" 
          value={formatPrice(stats?.financial?.average_ticket || 0)} 
          icon={<TrendingUp className="h-4 w-4" />}
          subtext="Média por pedido"
        />
        <StatCard 
          title="Tempo de Envio" 
          value={`${stats?.operational?.avg_processing_hours}h`} 
          icon={<Clock className="h-4 w-4" />}
          subtext="Média de processamento"
        />
      </div>

      {/* Main Performance Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground">Performance de Vendas</h3>
            <p className="text-xs text-muted-foreground">Evolução da receita bruta</p>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip 
                cursor={{ stroke: "#ec4899", strokeWidth: 2 }}
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px", color: "#fff" }}
                formatter={(value: any) => [formatPrice(value), "Vendas"]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ec4899" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Box className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-1">{stats?.operational?.inventory_total}</h3>
          <p className="text-sm font-bold text-muted-foreground uppercase">Unidades em Estoque</p>
        </div>

        {/* Repletion Alerts */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas de Reposição
            </h3>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase">
              Estoque &lt; 10 un
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {stats?.operational?.low_stock?.length > 0 ? (
              stats.operational.low_stock.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <span className="text-sm font-bold text-foreground">{item.product}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500 text-white">{item.qty} un</span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground text-sm italic">
                Nenhum alerta de estoque crítico.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, subtext, trend }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</h3>
        <div className="p-2 rounded-lg text-primary bg-primary/10">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-foreground">{value}</p>
        {trend && (
          <span className="text-xs font-bold text-green-500 flex items-center">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{subtext}</p>
    </div>
  )
}
