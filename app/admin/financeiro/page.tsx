"use client"

import { useState, useEffect } from "react"
import { DollarSign, ArrowDownRight, TrendingUp, Wallet, Receipt, CreditCard } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { apiFetch } from "@/lib/api"

export default function FinanceiroDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch<any>("/api/v1/settings/dashboard/stats/", { requiresAuth: true })
        setStats(data)
      } catch (err) {
        console.error("Error fetching financeiro data:", err)
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
        <h1 className="text-2xl font-black text-foreground tracking-tight">Painel Financeiro</h1>
        <p className="text-sm text-muted-foreground">Performance financeira, cancelamentos e estornos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Receita Líquida Est." 
          value={formatPrice(stats?.financial?.net_revenue || 0)} 
          icon={<Wallet className="h-4 w-4" />}
          subtext="GMV - Descontos"
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
          title="Estornos (Refunds)" 
          value={stats?.financial?.refunds?.count || 0} 
          icon={<RotateCcwIcon className="h-4 w-4" />}
          subtext={formatPrice(stats?.financial?.refunds?.value || 0)}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Detalhes de Faturamento
          </h3>
          <div className="space-y-4">
            <FinanceRow label="Receita Bruta (GMV)" value={formatPrice(stats?.financial?.gmv || 0)} />
            <FinanceRow label="Total de Descontos" value={`- ${formatPrice(stats?.financial?.total_discounts || 0)}`} color="text-red-500" />
            <div className="border-t border-border pt-4">
              <FinanceRow label="Receita Líquida" value={formatPrice(stats?.financial?.net_revenue || 0)} bold />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Saúde da Operação
          </h3>
          <div className="space-y-4">
            <FinanceRow 
              label="Taxa de Cancelamento" 
              value={`${stats?.financial?.gmv > 0 ? ((stats.financial.cancellations.value / stats.financial.gmv) * 100).toFixed(1) : 0}%`} 
            />
            <FinanceRow 
              label="Taxa de Estorno" 
              value={`${stats?.financial?.gmv > 0 ? ((stats.financial.refunds.value / stats.financial.gmv) * 100).toFixed(1) : 0}%`} 
            />
            <FinanceRow 
              label="Ticket Médio Geral" 
              value={formatPrice(stats?.financial?.average_ticket || 0)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function RotateCcwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function StatCard({ title, value, icon, subtext, variant = "default" }: any) {
  const variantStyles: any = {
    default: "text-primary bg-primary/10",
    success: "text-green-500 bg-green-500/10",
    danger: "text-red-500 bg-red-500/10",
    warning: "text-orange-500 bg-orange-500/10",
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{subtext}</p>
    </div>
  )
}

function FinanceRow({ label, value, color = "text-foreground", bold = false }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${bold ? "font-black" : "font-bold"} ${color}`}>{value}</span>
    </div>
  )
}
