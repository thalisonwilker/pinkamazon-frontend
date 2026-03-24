"use client"

import { useState } from "react"
import { Search, Plus, TicketPercent, Package } from "lucide-react"

export default function PromotionsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [promotions, setPromotions] = useState<any[]>([]) // Placeholder

  const filtered = promotions.filter(p => 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <TicketPercent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Cupons Ativos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por CÓDIGO gerado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105">
          <Plus className="h-4 w-4" />
          Novo Cupom
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Package className="h-12 w-12 opacity-10" />
          <p className="mt-4 font-bold uppercase tracking-widest text-[10px]">Central de Promoções</p>
          <p className="text-sm mt-1">Nenhuma campanha promocional ativa.</p>
        </div>
      </div>
    </div>
  )
}
