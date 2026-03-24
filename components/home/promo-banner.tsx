"use client"

import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react"

const perks = [
  { icon: Truck, label: "Frete Grátis", desc: "Para todo o Brasil acima de R$ 199" },
  { icon: ShieldCheck, label: "Compra Segura", desc: "Seus dados protegidos" },
  { icon: CreditCard, label: "Até 3x Sem Juros", desc: "No cartão de crédito" },
  { icon: RotateCcw, label: "Troca Fácil", desc: "30 dias para trocar" },
]

export function PromoBanner() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 lg:grid-cols-4 lg:gap-8 lg:px-8">
        {perks.map((perk) => (
          <div key={perk.label} className="flex items-center gap-3">
            <perk.icon className="h-6 w-6 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{perk.label}</p>
              <p className="text-[10px] text-white/70">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
