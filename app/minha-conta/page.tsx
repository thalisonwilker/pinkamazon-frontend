"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  Copy,
  Check,
  Pencil,
  Bell,
  Shield,
  Star,
  Truck,
  Gift,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  Tag,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getOrders, statusLabel, statusColor, type Order } from "@/lib/orders"
import { formatPrice } from "@/lib/products"
import { ClientLayout } from "@/components/client-layout"

type Tab = "pedidos" | "perfil" | "enderecos" | "favoritos" | "configuracoes"

const mockFavorites: any[] = []
const mockCards: any[] = []

function OrderCard({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copy = () => {
    if (!order.shipments?.[0]?.tracking_code) return
    navigator.clipboard.writeText(order.shipments[0].tracking_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dateFormatted = new Date(order.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Pedido</p>
            <p className="text-sm font-bold text-foreground">{order.id.split("-")[0].toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Data</p>
            <p className="text-sm font-semibold text-foreground">
              {new Date(order.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-bold text-foreground">{formatPrice(order.total_amount)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[order.order_status]}`}>
            {statusLabel[order.order_status]}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Package className="h-6 w-6 m-auto text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.product_name_snapshot}</p>
                <p className="text-xs text-muted-foreground">
                  Qtd {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
          <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>

        {expanded && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-sm">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-primary font-semibold">{Number(order.shipping_cost) === 0 ? "Grátis" : formatPrice(order.shipping_cost)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="text-primary font-semibold">- {formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pagamento</span>
                <span>{order.payments?.[0]?.provider || "Pix"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endereço</span>
                <span className="text-right max-w-[60%]">Padrão</span>
              </div>
              {order.shipments?.[0]?.tracking_code && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rastreio</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{order.shipments[0].tracking_code}</span>
                    <button onClick={copy} className="rounded p-1 transition-colors hover:bg-border" aria-label="Copiar código">
                      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AccountContent() {
  const router = useRouter()
  const { user, logout, isLoading, fetchMe } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>("pedidos")
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    cpf: (typeof user?.document === 'string' ? user?.document : user?.document?.doc_number) ?? "",
    birthdate: user?.birthdate ?? "",
  })
  const [profileSaved, setProfileSaved] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    promo_emails: user?.promo_emails ?? true,
    order_updates: user?.order_updates ?? true,
    wishlist_notifications: user?.wishlist_notifications ?? true,
  })
  const [updatingNotification, setUpdatingNotification] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Address State
  const [addresses, setAddresses] = useState<any[]>([])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    id: null as number | null,
    label: "Casa",
    recipient: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: null as number | null,
    city_name: "",
    state: "",
    is_default: false,
  })
  const [isSearchingZip, setIsSearchingZip] = useState(false)

  const fetchAddresses = async () => {
    try {
      const { apiFetch } = await import("@/lib/api")
      const res = await apiFetch("/api/v1/addresses/", { requiresAuth: true }) as any
      const data = res?.data?.results || res?.results || res?.data || res || []
      setAddresses(data)
    } catch (error) {
      console.error("Erro ao carregar endereços:", error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const handleLookupZip = async (zip: string) => {
    const cleanZip = zip.replace(/\D/g, "")
    if (cleanZip.length !== 8) return
    
    setIsSearchingZip(true)
    try {
      const { apiFetch } = await import("@/lib/api")
      const res = await apiFetch(`/api/v1/addresses/lookup-zip/${cleanZip}/`, { requiresAuth: true }) as any
      const data = res?.data || res
      setAddressFormData(prev => ({
        ...prev,
        zip_code: data.zip_code,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        city_name: data.city_name,
        state: data.state
      }))
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    } finally {
      setIsSearchingZip(false)
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingAddress(true)
    try {
      const { apiFetch } = await import("@/lib/api")
      const isEditing = !!addressFormData.id
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/v1/addresses/${addressFormData.id}/` : "/api/v1/addresses/"
      
      await apiFetch(url, {
        method,
        body: addressFormData,
        requiresAuth: true
      })
      
      setIsAddressModalOpen(false)
      fetchAddresses()
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
      toast({
        variant: "destructive",
        title: "Erro no endereço",
        description: (error as Error).message || "Erro ao salvar endereço. Verifique os dados.",
      })
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return
    
    try {
      const { apiFetch } = await import("@/lib/api")
      await apiFetch(`/api/v1/addresses/${id}/`, {
        method: "DELETE",
        requiresAuth: true
      })
      fetchAddresses()
    } catch (error) {
      console.error("Erro ao remover endereço:", error)
    }
  }

  const openAddAddress = () => {
    setAddressFormData({
      id: null,
      label: "Casa",
      recipient: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
      zip_code: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: null,
      city_name: "",
      state: "",
      is_default: addresses.length === 0,
    })
    setIsAddressModalOpen(true)
  }

  const openEditAddress = (addr: any) => {
    setAddressFormData({
      id: addr.id,
      label: addr.label,
      recipient: addr.recipient,
      zip_code: addr.zip_code,
      street: addr.street,
      number: addr.number,
      complement: addr.complement || "",
      neighborhood: addr.neighborhood,
      city: addr.city,
      city_name: addr.city_detail?.name || "",
      state: addr.city_detail?.state_abbreviation || "",
      is_default: addr.is_default,
    })
    setIsAddressModalOpen(true)
  }

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        cpf: (typeof user.document === 'string' ? user.document : user.document?.doc_number) ?? "",
        birthdate: user.birthdate ?? "",
      })
      setNotificationSettings({
        promo_emails: user.preferences?.promotional_emails ?? true,
        order_updates: user.preferences?.order_updates ?? true,
        wishlist_notifications: user.preferences?.wishlist_notifications ?? true,
      })
      
      // Fetch orders
      setOrdersLoading(true)
      getOrders()
        .then(setOrders)
        .catch(err => console.error("Error fetching orders:", err))
        .finally(() => setOrdersLoading(false))
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setProfileSaved(false)
    
    try {
      const { apiFetch } = await import("@/lib/api")
      const url = user?.id ? `/api/v1/users/${user.id}/` : "/api/v1/users/me/"
      await apiFetch(url, {
        method,
        body: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone,
          birthdate: profileData.birthdate || null,
          document: {
            doc_type: "CPF",
            doc_number: profileData.cpf,
            country: "BR"
          }
        },
        requiresAuth: true
      })
      
      setProfileSaved(true)
      await fetchMe() // Refresh context data to keep UI in sync
      setTimeout(() => setProfileSaved(false), 2500)
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar perfil",
        description: (error as Error).message || "Erro ao salvar perfil. Verifique os dados e tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleNotification = async (key: keyof typeof notificationSettings) => {
    if (updatingNotification) return
    
    setUpdatingNotification(key)
    const newValue = !notificationSettings[key]
    const settingsData = { ...notificationSettings, [key]: newValue }
    
    try {
      const { apiFetch } = await import("@/lib/api")
      await apiFetch("/api/v1/users/profile/notifications/", {
        method: "PATCH",
        body: settingsData,
        requiresAuth: true
      })
      
      setNotificationSettings(prev => ({ ...prev, [key]: newValue }))
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error)
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: (error as Error).message || "Erro ao salvar configuração. Tente novamente.",
      })
    } finally {
      setUpdatingNotification(null)
    }
  }

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "pedidos", label: "Meus Pedidos", icon: ShoppingBag },
    { id: "perfil", label: "Meus Dados", icon: User },
    { id: "enderecos", label: "Endereços", icon: MapPin },
    { id: "favoritos", label: "Favoritos", icon: Heart },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-3xl">
          Minha Conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Olá, {user.first_name}! Gerencie seus pedidos e dados.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          {/* Profile card */}
          <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-sm shadow-primary/5">
            <div className="h-1.5 bg-primary" />
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Star className="h-3 w-3 fill-primary" />
                Cliente VIP · Gold
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              {[
                { label: "Pedidos", value: orders.length },
                { label: "Favoritos", value: mockFavorites.length },
                { label: "Pts VIP", value: user?.vip_points || 0 },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 px-2">
                  <p className="text-base font-extrabold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-4 flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {activeTab !== id && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sair da conta
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div key={activeTab} className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            {/* PEDIDOS */}
            {activeTab === "pedidos" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    Histórico de Pedidos
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {orders.length}
                    </span>
                  </h2>
                </div>

                {/* VIP points banner */}
                <div className="flex items-center gap-4 overflow-hidden rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Você tem <span className="text-primary">{user?.vip_points || 0} pontos VIP</span></p>
                    <p className="text-xs text-muted-foreground">Continue comprando para ganhar mais!</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total de pedidos", value: orders.length, icon: Package },
                    { label: "Entregues", value: orders.filter((o) => o.order_status === "DELIVERED").length, icon: Check },
                    { label: "Em trânsito", value: orders.filter((o) => o.order_status === "SHIPPED").length, icon: Truck },
                    {
                      label: "Total gasto",
                      value: formatPrice(orders.reduce((s, o) => s + Number(o.total_amount), 0)),
                      icon: ShoppingBag,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                      <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                      <p className="text-lg font-extrabold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {ordersLoading ? (
                    <div className="flex justify-center p-8">
                       <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-xl border-border bg-secondary/20">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                      <p className="text-muted-foreground">Você ainda não realizou nenhum pedido.</p>
                      <Link href="/" className="text-primary hover:underline mt-2 inline-block font-medium">
                        Começar a comprar →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PERFIL */}
            {activeTab === "perfil" && (
              <div className="flex flex-col gap-5">
                {/* Summary card */}
                <div className="flex flex-wrap items-center gap-5 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        {user.first_name} {user.last_name}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <BadgeCheck className="h-3 w-3" /> Verificado
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Membro desde Janeiro 2024 · Cliente VIP Gold</p>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {user.phone}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        15/06/1995
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border px-6 py-5">
                    <h2 className="font-bold text-foreground">Editar Dados Pessoais</h2>
                    <p className="text-xs text-muted-foreground">Atualize suas informações pessoais</p>
                  </div>
                  <form onSubmit={handleSaveProfile} className="p-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                       <div className="sm:col-span-1">
                          <label htmlFor="first_name" className="mb-2 block text-sm font-semibold text-foreground">Nome</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="first_name"
                              type="text"
                              value={profileData.first_name}
                              onChange={(e) => setProfileData((p) => ({ ...p, first_name: e.target.value }))}
                              className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <label htmlFor="last_name" className="mb-2 block text-sm font-semibold text-foreground">Sobrenome</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="last_name"
                              type="text"
                              value={profileData.last_name}
                              onChange={(e) => setProfileData((p) => ({ ...p, last_name: e.target.value }))}
                              className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      {[
                        { id: "email", label: "E-mail", type: "email", key: "email" as const, icon: Mail },
                        { id: "phone", label: "Telefone", type: "tel", key: "phone" as const, icon: Phone },
                        { id: "cpf", label: "CPF", type: "text", key: "cpf" as const, icon: BadgeCheck },
                        { id: "birthdate", label: "Data de nascimento", type: "date", key: "birthdate" as const, icon: Calendar },
                      ].map(({ id, label, type, key, icon: Icon }) => (
                        <div key={id}>
                          <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
                          <div className="relative">
                            <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id={id}
                              type={type}
                              value={profileData[key]}
                              onChange={(e) => setProfileData((p) => ({ ...p, [key]: e.target.value }))}
                              className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl sm:w-fit sm:px-10 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      ) : profileSaved ? (
                        <><Check className="h-4 w-4" /> Salvo!</>
                      ) : (
                        <><Pencil className="h-4 w-4" /> Salvar alterações</>
                      )}
                    </button>
                  </form>
                </div>

                {/* Saved cards */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Cartões Salvos</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-border">
                    {mockCards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-14 items-center justify-center rounded-md border border-border bg-secondary text-xs font-bold text-foreground">
                            {card.brand}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              •••• •••• •••• {card.last4}
                            </p>
                            <p className="text-xs text-muted-foreground">{card.name} · Vence {card.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {card.isDefault && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">Padrão</span>
                          )}
                          <button className="text-xs font-semibold text-muted-foreground transition-colors hover:text-red-500">Remover</button>
                        </div>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 px-6 py-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary/50">
                      + Adicionar cartão
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ENDERECOS */}
            {activeTab === "enderecos" && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      Meus Endereços
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Gerencie seus locais de entrega para compras rápidas.</p>
                  </div>
                  <button 
                    onClick={openAddAddress}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/30 p-16 text-center backdrop-blur-sm">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground/30">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">Você ainda não cadastrou nenhum endereço.</p>
                    <button 
                      onClick={openAddAddress} 
                      className="mt-6 text-xs font-bold text-primary uppercase tracking-widest hover:underline"
                    >
                      Cadastrar primeiro endereço
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                          addr.is_default 
                            ? "border-primary/30 bg-primary/[0.03] shadow-lg shadow-primary/5" 
                            : "border-border bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                        }`}
                      >
                        {/* Neon accent line */}
                        {addr.is_default && (
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        )}
                        
                        <div className="p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                                addr.is_default ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                              }`}>
                                <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-foreground">{addr.label}</h4>
                                {addr.is_default && (
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Padrão</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button 
                                onClick={() => openEditAddress(addr)}
                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              {!addr.is_default && (
                                <button 
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                  title="Remover"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">{addr.recipient}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {addr.street}, {addr.number}
                            </p>
                            {addr.complement && (
                              <p className="text-xs italic text-muted-foreground/70">{addr.complement}</p>
                            )}
                            <p className="text-xs font-medium text-muted-foreground">
                              {addr.neighborhood}
                            </p>
                            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                              <p className="text-xs font-bold text-foreground">
                                {addr.city_detail?.name}, {addr.city_detail?.state_abbreviation}
                              </p>
                              <p className="text-[10px] font-mono font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                {addr.zip_code}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAVORITOS */}
            {activeTab === "favoritos" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    Favoritos
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {mockFavorites.length}
                    </span>
                  </h2>
                </div>
                {mockFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mockFavorites.map((fav) => (
                      <div key={fav.id} className="group overflow-hidden rounded-xl border border-border bg-card">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                          {fav.badge && (
                            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
                              <Tag className="h-2.5 w-2.5" />
                              {fav.badge}
                            </div>
                          )}
                          <Image
                            src={fav.image}
                            alt={fav.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-foreground line-clamp-1">{fav.name}</h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-extrabold text-[#E91E7B]">{formatPrice(fav.price)}</span>
                            {fav.oldPrice && (
                              <span className="text-xs text-muted-foreground line-through">{formatPrice(fav.oldPrice)}</span>
                            )}
                          </div>
                          <Link
                            href={`/produto/${fav.id}`}
                            className="mt-4 flex w-full items-center justify-center rounded-lg bg-secondary py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/30 p-16 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground/20 mb-4" />
                    <p className="text-sm text-muted-foreground">Você ainda não favoritou nenhum produto.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONFIGURACOES */}
          {activeTab === "configuracoes" && (
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-foreground">Configurações</h2>

              {/* Notifications */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Notificações</h3>
                </div>
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "promo_emails" as const, label: "E-mails promocionais", desc: "Ofertas e novidades da Pink Amazon" },
                    { key: "order_updates" as const, label: "Atualizações de pedidos", desc: "Status e rastreamento de pedidos" },
                    { key: "wishlist_notifications" as const, label: "Lista de desejos", desc: "Aviso quando produtos favoritados baixarem de preço" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className={`flex items-center justify-between px-6 py-4 transition-opacity ${updatingNotification && updatingNotification !== key ? "opacity-50" : "opacity-100"}`}>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <label className={`relative inline-flex items-center ${updatingNotification ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings[key]} 
                          onChange={() => handleToggleNotification(key)}
                          disabled={!!updatingNotification}
                          className="peer sr-only" 
                        />
                        <div className="peer h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                        {updatingNotification === key && (
                          <div className="absolute -right-6 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Segurança</h3>
                </div>
                <div className="flex flex-col divide-y divide-border">
                  <button className="flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-secondary/50">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Alterar senha</p>
                      <p className="text-xs text-muted-foreground">Atualize sua senha de acesso</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-secondary/50">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Autenticação em dois fatores</p>
                      <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-red-50">
                    <div>
                      <p className="text-sm font-semibold text-red-600">Excluir conta</p>
                      <p className="text-xs text-muted-foreground">Remova permanentemente sua conta</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            )}
        </div>
      </div>

      {/* Address Modal - Portaled to avoid template overflow/stacking issues */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsAddressModalOpen(false)} 
          />
          
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between bg-secondary/50 px-8 py-6 backdrop-blur-xl">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {addressFormData.id ? "Editar Endereço" : "Novo Endereço"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Prencha os dados para entrega.</p>
              </div>
              <button 
                onClick={() => setIsAddressModalOpen(false)} 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-background transition-all hover:bg-primary hover:text-primary-foreground active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="max-h-[75vh] overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-8">
                {/* Seção 1: Identificação */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-1 w-8 rounded-full bg-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Identificação</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Apelido do Endereço</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Minha Casa, Trabalho, Mãe"
                        value={addressFormData.label}
                        onChange={(e) => setAddressFormData(p => ({ ...p, label: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome do Destinatário</label>
                      <input 
                        type="text" 
                        placeholder="Nome completo de quem receberá"
                        value={addressFormData.recipient}
                        onChange={(e) => setAddressFormData(p => ({ ...p, recipient: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Localização */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-1 w-8 rounded-full bg-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Endereço de Entrega</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="relative">
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CEP</label>
                      <input 
                        type="text" 
                        placeholder="00000-000"
                        value={addressFormData.zip_code}
                        onChange={(e) => {
                          const val = e.target.value
                          setAddressFormData(p => ({ ...p, zip_code: val }))
                          if (val.replace(/\D/g, "").length === 8) handleLookupZip(val)
                        }}
                        className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                        required
                      />
                      {isSearchingZip && (
                        <div className="absolute right-4 top-[2.4rem] h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cidade / UF</label>
                      <input 
                        type="text" 
                        value={addressFormData.city_name ? `${addressFormData.city_name} - ${addressFormData.state}` : ""}
                        className="w-full cursor-not-allowed rounded-xl border border-border bg-secondary/30 px-5 py-3.5 text-sm italic text-muted-foreground outline-none"
                        readOnly
                        placeholder="Buscando via CEP..."
                      />
                    </div>
                    
                    <div className="flex gap-3 sm:col-span-2">
                      <div className="flex-[3]">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rua / Logradouro</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Av. Principal"
                          value={addressFormData.street}
                          onChange={(e) => setAddressFormData(p => ({ ...p, street: e.target.value }))}
                          className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                          required
                        />
                      </div>
                      <div className="flex-1 min-w-[90px]">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nº</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          value={addressFormData.number}
                          onChange={(e) => setAddressFormData(p => ({ ...p, number: e.target.value }))}
                          className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Complemento</label>
                      <input 
                        type="text" 
                        placeholder="Ap, Bloco, etc."
                        value={addressFormData.complement}
                        onChange={(e) => setAddressFormData(p => ({ ...p, complement: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                      />
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bairro</label>
                      <input 
                        type="text" 
                        placeholder="Nome do bairro"
                        value={addressFormData.neighborhood}
                        onChange={(e) => setAddressFormData(p => ({ ...p, neighborhood: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background/50 px-5 py-3.5 text-sm ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
                        required
                      />
                    </div>
                    
                    <div className="pt-2 sm:col-span-2">
                      <label className="group flex cursor-pointer items-center gap-3">
                        <div className="relative flex h-6 w-6 items-center justify-center rounded-md border-2 border-border bg-background transition-all group-hover:border-primary peer-checked:bg-primary">
                          <input 
                            type="checkbox" 
                            checked={addressFormData.is_default}
                            onChange={(e) => setAddressFormData(p => ({ ...p, is_default: e.target.checked }))}
                            className="peer absolute inset-0 cursor-pointer opacity-0"
                          />
                          {addressFormData.is_default && <Check className="h-4 w-4 text-primary-foreground" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary">Definir como endereço padrão</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 rounded-2xl border border-border bg-background py-4 text-xs font-extrabold uppercase tracking-widest text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSavingAddress || isSearchingZip}
                  className="group relative flex-[2] overflow-hidden rounded-2xl bg-primary py-4 text-xs font-extrabold uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  {isSavingAddress ? (
                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    "Confirmar Endereço"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AccountPage() {
  return (
    <ClientLayout>
      <AccountContent />
    </ClientLayout>
  )
}
