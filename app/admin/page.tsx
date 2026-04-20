"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, TrendingUp, ShoppingBag, PieChart as PieChartIcon, 
  Box, AlertTriangle, Users, MapPin, Clock, Tag, ArrowUpRight, 
  ArrowDownRight, BarChart3, Filter
} from "lucide-react"
import { formatPrice } from "@/lib/products"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts"
import { apiFetch } from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

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

  const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Pre-process sales history for the chart
  const salesChartData = stats?.sales_history?.map((s: any) => ({
    name: s.month,
    value: s.revenue
  })) || []

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard Executivo</h1>
          <p className="text-sm text-muted-foreground">Monitoramento em tempo real da Pink Amazon</p>
        </div>
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-border self-start">
          {["overview", "comercial", "financeiro", "operacional"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                activeTab === tab 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <>
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
              title="Clientes" 
              value={(stats?.commercial?.customers?.new || 0) + (stats?.commercial?.customers?.recurring || 0)} 
              icon={<Users className="h-4 w-4" />}
              subtext="Base total de compradores"
            />
          </div>

          {/* Main Performance Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground">Performance de Vendas</h3>
                <p className="text-xs text-muted-foreground">Histórico de receita dos últimos 6 meses</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-bold text-primary">Receita Bruta</span>
                </div>
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
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px", color: "#fff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
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
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Geo Distribution */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Vendas por Estado
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.commercial?.geo_distribution || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                    <Tooltip 
                      cursor={{ fill: "rgba(236, 72, 153, 0.05)" }}
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Categories */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Ticket Médio por Categoria
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={stats?.commercial?.category_ticket || []}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10 }} width={80} />
                    <Tooltip 
                      formatter={(val: any) => formatPrice(val)}
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                    />
                    <Bar dataKey="avg" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "comercial" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New vs Recurring */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-foreground">Fidelização de Clientes</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Novos", value: stats?.commercial?.customers?.new || 0 },
                      { name: "Recorrentes", value: stats?.commercial?.customers?.recurring || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#ec4899" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Marketing / Coupons */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Ranking de Cupons
            </h3>
            <div className="flex flex-col gap-4">
              {stats?.commercial?.top_coupons?.length > 0 ? (
                stats.commercial.top_coupons.map((coupon: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <span className="font-mono font-bold text-foreground">{coupon.code}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{coupon.usages} usos</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-muted-foreground text-sm italic">
                  Nenhum cupom utilizado no período.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "financeiro" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Lucro Líquido Est." 
            value={formatPrice(stats?.financial?.net_revenue || 0)} 
            icon={<DollarSign className="h-4 w-4" />}
            subtext="GMV - Descontos aplicados"
            variant="success"
          />
          <StatCard 
            title="Cancelamentos" 
            value={stats?.financial?.cancellations?.count || 0} 
            icon={<ArrowDownRight className="h-4 w-4" />}
            subtext={formatPrice(stats?.financial?.cancellations?.value || 0)}
            variant="danger"
          />
          <StatCard 
            title="Estornos/Refunds" 
            value={stats?.financial?.refunds?.count || 0} 
            icon={<ArrowDownRight className="h-4 w-4" />}
            subtext={formatPrice(stats?.financial?.refunds?.value || 0)}
            variant="warning"
          />
          
          <div className="md:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">Análise Financeira</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/20 border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Descontos</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(stats?.financial?.total_discounts || 0)}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/20 border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Taxa de Estorno</p>
                <p className="text-lg font-bold text-foreground">
                  {stats?.financial?.gmv > 0 
                    ? ((stats.financial.refunds.value / stats.financial.gmv) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "operacional" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Time */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">{stats?.operational?.avg_processing_hours}h</h3>
            <p className="text-sm font-bold text-muted-foreground uppercase">Tempo Médio de Envio</p>
            <p className="mt-4 text-xs text-muted-foreground max-w-[200px]">
              Média de tempo entre a confirmação do pagamento e o despacho da mercadoria.
            </p>
          </div>

          {/* Inventory */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas de Reposição
              </h3>
              <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase">
                Estoque < 10 un
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {stats?.operational?.low_stock?.length > 0 ? (
                stats.operational.low_stock.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <span className="text-sm font-bold text-foreground">{item.product}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500 text-white">{item.qty} un</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-muted-foreground text-sm italic">
                  Nenhum produto com estoque crítico.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, subtext, trend, variant = "default" }: any) {
  const variantStyles: any = {
    default: "text-primary bg-primary/10",
    success: "text-green-500 bg-green-500/10",
    danger: "text-red-500 bg-red-500/10",
    warning: "text-orange-500 bg-orange-500/10",
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
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
