"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
} from "lucide-react"
import { getOrderById, type Order } from "@/lib/orders"
import { formatPrice } from "@/lib/products"

// Timeline components for status
const TimelineItem = ({ title, date, done, current }: { title: string, date: string, done: boolean, current?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
        done ? "border-green-500 bg-green-500" : current ? "border-primary bg-primary/20" : "border-border"
      }`}>
        {done && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <div className={`h-full w-0.5 border-l-2 border-dashed ${done ? "border-green-500" : "border-border"}`} />
    </div>
    <div className="pb-6">
      <p className={`text-sm font-bold ${done ? "text-foreground" : current ? "text-primary" : "text-muted-foreground"}`}>{title}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
    </div>
  </div>
)

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(err => console.error("Error fetching admin order detail:", err))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Pedido não encontrado.</p>
        <Link href="/admin/orders" className="text-primary hover:underline font-bold">
          Voltar para lista
        </Link>
      </div>
    )
  }

  const handleStatusChange = async (newStatus: string) => {
    // In a real app, update DB here
    console.log("Status change requested:", newStatus)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="rounded-lg border border-border p-2 transition-colors hover:bg-secondary">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Pedido #{order.id.split("-")[0].toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("pt-BR")} às {new Date(order.created_at).toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {order.order_status === "PENDING" && (
            <button 
              onClick={() => handleStatusChange("PAID")}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              Aprovar Pagamento
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Order Items & Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Items Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6 font-bold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Itens do Pedido
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.product_name_snapshot}</p>
                        <p className="text-xs text-muted-foreground font-semibold">Qtd: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.unit_price)}</p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-foreground">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-border pt-6 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium text-green-500">{Number(order.shipping_cost) === 0 ? "Grátis" : formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Endereço de Entrega
              </h3>
              <p className="text-sm font-semibold">{order.customer_name || "N/A"}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                ID do Usuário: {order.user}<br />
                Email: {order.customer_email}<br />
                ID Endereço: {order.address}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                Pagamento
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Método: <span className="text-muted-foreground">{order.payments?.[0]?.provider || "Pix"}</span></p>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                  order.order_status === "PAID" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"
                }`}>
                  {order.order_status === "PAID" ? "Aprovado" : "Aguardando"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">ID Transação: <span className="font-mono">{order.payments?.[0]?.transaction_id || "N/A"}</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-fit">
          <h3 className="mb-6 flex items-center gap-2 font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Histórico do Pedido
          </h3>
          <div className="flex flex-col">
            <TimelineItem title="Pedido Realizado" date={new Date(order.created_at).toLocaleDateString("pt-BR")} done={true} />
            <TimelineItem 
              title="Pagamento Confirmado" 
              date={order.order_status === "PENDING" ? "--" : "Confirmado"} 
              done={order.order_status !== "PENDING"} 
              current={order.order_status === "PENDING"}
            />
            <TimelineItem 
              title="Enviado" 
              date={["SHIPPED", "DELIVERED"].includes(order.order_status) ? "Enviado" : "--"} 
              done={["SHIPPED", "DELIVERED"].includes(order.order_status)}
              current={order.order_status === "PAID"}
            />
            <TimelineItem title="Entregue" date={order.order_status === "DELIVERED" ? "Entregue" : "--"} done={order.order_status === "DELIVERED"} />
          </div>
        </div>
      </div>
    </div>
  )
}
