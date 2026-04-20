"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Users, MapPin, Tag, PieChart as PieChartIcon } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { apiFetch } from "@/lib/api"

export default function ComercialDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch<any>("/api/v1/settings/dashboard/stats/", { requiresAuth: true })
        setStats(data)
      } catch (err) {
        console.error("Error fetching comercial data:", err)
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

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Painel Comercial</h1>
        <p className="text-sm text-muted-foreground">Distribuição geográfica, fidelização e cupons</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Geo Distribution */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Vendas por Estado (UF)
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

        {/* New vs Recurring */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Fidelização de Clientes
          </h3>
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

        {/* Ticket Médio por Categoria */}
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

        {/* Marketing / Coupons */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Uso de Cupons
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
    </div>
  )
}
