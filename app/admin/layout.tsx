"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  PackageSearch,
  PackagePlus,
  Boxes,
  Tags,
  Users, 
  ShoppingBag,
  CircleDollarSign,
  Settings,
  LogOut,
  Store,
  MessageSquareHeart,
  TicketPercent,
  ClipboardList,
  Truck,
  RotateCcw,
  Wallet,
  Globe,
  Layout,
  MessageSquareText,
  History,
  ShieldCheck,
  Megaphone,
  Layers,
  Menu,
  X
} from "lucide-react"
import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  // Visão Geral
  { name: 'Executivo', href: '/admin', icon: LayoutDashboard, group: 'Visão Geral' },
  { name: 'Comercial', href: '/admin/comercial', icon: ShoppingBag, group: 'Visão Geral' },
  { name: 'Financeiro', href: '/admin/financeiro', icon: CircleDollarSign, group: 'Visão Geral' },
  
  // Operação
  { name: 'Pedidos', href: '/admin/orders', icon: ClipboardList, group: 'Operação' },
  { name: 'Expedição', href: '#', icon: Truck, group: 'Operação', comingSoon: true },
  { name: 'Pagamentos', href: '/admin/payments', icon: CircleDollarSign, group: 'Operação' },
  { name: 'Conciliação', href: '#', icon: Wallet, group: 'Operação', comingSoon: true },

  // Catálogo
  { name: 'Produtos', href: '/admin/products', icon: PackageSearch, group: 'Catálogo' },
  { name: 'Categorias', href: '/admin/categories', icon: Tags, group: 'Catálogo' },
  { name: 'Coleções', href: '#', icon: Layers, group: 'Catálogo', comingSoon: true },

  // Estoque
  { name: 'Estoque Atual', href: '/admin/inventory', icon: Boxes, group: 'Estoque' },
  { name: 'Movimentações', href: '#', icon: History, group: 'Estoque', comingSoon: true },

  // Clientes
  { name: 'Clientes', href: '/admin/customers', icon: Users, group: 'Clientes' },
  { name: 'CRM', href: '#', icon: Users, group: 'Clientes', comingSoon: true },

  // Marketing
  { name: 'Promoções', href: '/admin/promotions', icon: TicketPercent, group: 'Marketing' },
  { name: 'Campanhas', href: '#', icon: Megaphone, group: 'Marketing', comingSoon: true },

  // Conteúdo
  { name: 'Banners', href: '#', icon: Layout, group: 'Conteúdo', comingSoon: true },
  { name: 'Blog', href: '#', icon: Layout, group: 'Conteúdo', comingSoon: true },

  // Atendimento
  { name: 'Avaliações', href: '/admin/reviews', icon: MessageSquareHeart, group: 'Atendimento' },
  { name: 'Tickets', href: '#', icon: MessageSquareText, group: 'Atendimento', comingSoon: true },

  // Internacional
  { name: 'Países & Moedas', href: '#', icon: Globe, group: 'Internacional', comingSoon: true },

  // Sistema
  { name: 'Configurações', href: '/admin/settings', icon: Settings, group: 'Sistema' },
  { name: 'Auditoria', href: '#', icon: ShieldCheck, group: 'Sistema', comingSoon: true },
]

export default function AdminLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated || !user?.is_staff) {
      logout()
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, logout, router, user])

  if (isLoading || !isAuthenticated || !user?.is_staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const sidebarContent = (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:h-16 lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-serif text-lg font-bold text-primary lg:text-xl">
          <Store className="h-5 w-5 lg:h-6 lg:w-6" />
          Admin Panel
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4 lg:px-4 lg:py-6">
        {["Visão Geral", "Operação", "Catálogo", "Estoque", "Clientes", "Marketing", "Conteúdo", "Atendimento", "Internacional", "Sistema"].map((group) => (
          <div key={group} className="mb-4 lg:mb-6">
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground lg:mb-2 lg:px-4 lg:text-xs">{group}</p>
            <div className="flex flex-col gap-0.5">
              {navigation.filter(item => item.group === group).map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-all lg:rounded-xl lg:px-4 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    } ${item.comingSoon ? "cursor-not-allowed opacity-70" : ""}`}
                    onClick={(e) => {
                      if (item.comingSoon) e.preventDefault()
                    }}
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.name}
                    </div>
                    {item.comingSoon && (
                      <span className="rounded bg-secondary-foreground/10 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                        Breve
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3 lg:p-4">
        <button
          onClick={() => {
            logout()
            window.location.href = "/"
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 lg:rounded-xl lg:px-4 lg:py-3"
        >
          <LogOut className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
          Sair do Painel
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — off-canvas no mobile, fixo no desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out lg:w-60 xl:w-72 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-60 xl:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:h-16 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-foreground capitalize sm:text-lg lg:text-xl">
              {navigation.find(n => n.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-full w-full rounded-full bg-green-500"></span>
            </span>
            <span className="hidden text-sm font-semibold text-foreground sm:inline">Sistema Operacional</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
