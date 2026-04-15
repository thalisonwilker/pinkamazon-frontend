"use client"

import { useState } from "react"
import { Search, Star, MessageSquareHeart, CheckCircle, XCircle } from "lucide-react"

export default function ReviewsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState<any[]>([]) // Placeholder for future API

  const filtered = reviews.filter(p => 
    p.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50">
            {/* Review content */}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <Star className="h-12 w-12 opacity-10" />
            <p className="mt-4 font-medium uppercase tracking-widest text-[10px]">Gerenciador de Avaliações</p>
            <p className="text-sm mt-1">Nenhuma avaliação recebida até o momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
