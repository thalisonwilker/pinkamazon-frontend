"use client"

import { useState, useEffect } from "react"
import { getOrders, type Order } from "@/lib/orders"
import { formatPrice } from "@/lib/products"
import { ArrowDownRight, ArrowUpRight, DollarSign, Package } from "lucide-react"

export default function PaymentsAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      getOrders()
        .then(data => setOrders(data.results))
        .catch(err => console.error("Error fetching payments data:", err))
        .finally(() => setIsLoading(false))
  }, [])

  // Flatten all payments from all orders
  const allPayments = orders.flatMap(order => 
    (order.payments || []).map(p => ({
      ...p,
      customer: order.customer_name || 'Desconhecido',
      date: new Date(order.created_at).toLocaleString('pt-BR')
    }))
  )

  const totalVolume = allPayments.reduce((acc, p) => acc + Number(p.amount), 0)
  const totalFees = allPayments.reduce((acc, p) => acc + (Number(p.amount) * 0.035), 0) // Mock 3.5% fee if not provided

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      {/* Payments KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Volume Transacionado</h3>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {formatPrice(totalVolume)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Líquido Estimado</h3>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {formatPrice(totalVolume - totalFees)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Taxas Estimadas</h3>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-500">
            {formatPrice(totalFees)}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-secondary/30 px-6 py-4">
          <h2 className="font-bold text-foreground">Todas as Transações</h2>
        </div>
        <div className="overflow-x-auto">
          {allPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 opacity-20" />
              <p className="mt-4">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Gateway ID</th>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Data / Hora</th>
                  <th className="px-6 py-4 font-semibold">Método</th>
                  <th className="px-6 py-4 font-semibold">Valor</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allPayments.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-muted-foreground">{payment.payment_id || payment.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{payment.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{payment.date}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{payment.provider}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">{formatPrice(payment.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700`}>
                        Pago
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
