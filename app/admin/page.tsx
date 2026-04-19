"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, ShoppingBag, Eye, ShoppingCart, PieChart as PieChartIcon, Box, AlertTriangle } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { getOrders, type Order } from "@/lib/orders"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
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

  const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]



  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* GMV */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">GMV (Receita Bruta)</h3>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{formatPrice(stats?.total_revenue || 0)}</p>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-500">
            <TrendingUp className="h-3 w-3" />
            <span>Confirmados</span>
          </div>
        </div>

        {/* Pedidos Hoje */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pedidos Hoje</h3>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{stats?.orders_today || 0}</p>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Apenas pagamentos confirmados
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ticket Médio</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{formatPrice(stats?.average_ticket || 0)}</p>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Média por pedido confirmado
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Products Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Produtos mais vendidos
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.top_products || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.top_products || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Categorias mais vendidas
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.top_categories || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.top_categories || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart - Sales Performance */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Desempenho de Vendas (Timeline)</h3>
          <div className="flex items-center gap-2 text-sm font-semibold">
            {stats?.growth_percentage >= 0 ? (
              <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                +{stats?.growth_percentage}% vs mês anterior
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 rotate-180" />
                {stats?.growth_percentage}% vs mês anterior
              </span>
            )}
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.sales_history || []}>
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
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px", color: "#fff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                formatter={(value: any) => [formatPrice(value), "Vendas"]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ec4899" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorSales)" 
                activeDot={{ r: 8, strokeWidth: 0, fill: "#ec4899" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Análise de Crescimento</p>
            <p className="text-foreground text-sm leading-relaxed">
              As vendas deste mês totalizam <span className="font-bold text-primary">{formatPrice(stats?.sales_history?.slice(-1)[0]?.value || 0)}</span>, 
              o que representa uma {stats?.growth_percentage >= 0 ? "alta" : "baixa"} de <span className={`font-bold ${stats?.growth_percentage >= 0 ? "text-green-500" : "text-red-500"}`}>{Math.abs(stats?.growth_percentage || 0)}%</span> em comparação ao mês de {stats?.sales_history?.slice(-2)[0]?.name || "anterior"}.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Status da Meta</p>
            <p className="text-foreground text-sm leading-relaxed">
              Baseado na tendência atual, o Ticket Médio de <span className="font-bold">{formatPrice(stats?.average_ticket || 0)}</span> está 
              {stats?.average_ticket >= 250 ? " acima" : " abaixo"} da meta estabelecida de <span className="font-bold">R$ 250,00</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stock by Size Grade */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            Estoque por Grade (Tamanhos)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.inventory?.by_size || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis 
                  dataKey="size" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                <Tooltip 
                  cursor={{ fill: "rgba(236, 72, 153, 0.1)" }}
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                />
                <Bar dataKey="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total em estoque: <span className="font-bold text-foreground">{stats?.inventory?.total || 0} unidades</span>
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas de Estoque
          </h3>
          <div className="flex flex-col gap-4">
            {stats?.inventory?.low_stock?.length > 0 ? (
              stats.inventory.low_stock.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{item.product__name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tamanho: {item.size}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-orange-500">{item.quantity} un</span>
                    <p className="text-[10px] text-muted-foreground">Estoque Baixo</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground text-sm">
                Nenhum alerta de estoque baixo.
              </div>
            )}
            <button className="mt-2 w-full rounded-lg border border-border py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition-colors">
              Ver relatório completo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
