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
  status: string
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

export interface OrderCreationPayload {
  items: { product_id: string; quantity: number }[];
  shipping_address: string;
  billing_address: string;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch<any>("/api/v1/orders/", { requiresAuth: true })
  return response?.data?.results || response?.results || response?.data || response || []
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await apiFetch<any>(`/api/v1/orders/${id}/`, { requiresAuth: true })
  return response?.data || response
}

export async function payOrder(id: string, provider: string): Promise<any> {
  return apiFetch(`/api/v1/orders/${id}/pay/`, {
    method: "POST",
    body: { provider },
    requiresAuth: true
  })
}

export async function createOrder(
  payload: OrderCreationPayload,
  token: string
): Promise<Order> {
  const response = await apiFetch<any>("/api/v1/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    requiresAuth: false, // Manual auth header
  });
  return response?.data || response;
}

export const statusLabel: Record<string, string> = {
  pending: "Pagamento Pendente",
  paid: "Pagamento Confirmado",
  processing: "Em Separação",
  shipped: "Enviado/Em Trânsito",
  delivered: "Entregue",
  canceled: "Cancelado",
  refunded: "Devolvido/Reembolsado",
}

export const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  canceled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
}
