import { apiFetch } from "./api"

export interface OrderItem {
  id: string
  product_id: string
  product_name_snapshot: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: string
  user: string
  address: number | null
  created_at: string
  order_status: string
  status_detail?: { code: string; description: string }
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  customer_name?: string
  customer_email?: string
  payments?: any[]
  shipments?: any[]
}

export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders/orders/", { requiresAuth: true })
}

export async function getOrderById(id: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/orders/${id}/`, { requiresAuth: true })
}

export async function payOrder(id: string, provider: string): Promise<any> {
  return apiFetch(`/api/orders/orders/${id}/pay/`, {
    method: "POST",
    body: { provider },
    requiresAuth: true
  })
}

export const statusLabel: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
}

export const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-500 text-white",
  CANCELED: "bg-red-100 text-red-700",
}
