"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  PackageSearch,
  PackagePlus,
  Boxes,
  Tags,
  Users, 
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
  Layers
} from "lucide-react"
import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  // Visão Geral
  { name: 'Executivo', href: '/admin', icon: LayoutDashboard, group: 'Visão Geral' },
  { name: 'Comercial', href: '#', icon: LayoutDashboard, group: 'Visão Geral', comingSoon: true },
  { name: 'Financeiro', href: '#', icon: LayoutDashboard, group: 'Visão Geral', comingSoon: true },
  
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
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <Store className="h-6 w-6" />
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          {["Visão Geral", "Operação", "Catálogo", "Estoque", "Clientes", "Marketing", "Conteúdo", "Atendimento", "Internacional", "Sistema"].map((group) => (
            <div key={group} className="mb-6">
              <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{group}</p>
              <div className="flex flex-col gap-1">
                {navigation.filter(item => item.group === group).map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      } ${item.comingSoon ? "cursor-not-allowed opacity-70" : ""}`}
                      onClick={(e) => {
                        if (item.comingSoon) e.preventDefault()
                      }}
                    >
                      <div className="flex items-center gap-3">
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

        <div className="border-t border-border p-4">
          <button
            onClick={() => {
              logout()
              window.location.href = "/"
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-72">
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <h1 className="text-xl font-bold text-foreground capitalize">
            {navigation.find(n => n.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            {/* Quick stats/notifs could go here */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-foreground">Sistema Operacional</span>
            </div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
