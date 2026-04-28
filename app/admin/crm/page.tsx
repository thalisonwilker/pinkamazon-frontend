"use client"

import { useState } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  MessageCircle, 
  Mail, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Target, 
  UserPlus, 
  MoreVertical,
  ChevronRight,
  Star,
  Zap,
  Clock,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  BarChart3,
  Rocket
} from "lucide-react"

// Mocked Data for CRM
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Ana Beatriz Silva",
    email: "ana.beatriz@email.com",
    phone: "5511998877665",
    ltv: 1250.40,
    ordersCount: 8,
    lastPurchase: "2024-04-15",
    segment: "VIP",
    avgTicket: 156.30,
    tags: ["Comprador Recorrente", "Interesse: Sandálias"],
    status: "active"
  },
  {
    id: "2",
    name: "Carlos Eduardo Oliveira",
    email: "cadu.oliveira@gmail.com",
    phone: "5511988776655",
    ltv: 450.00,
    ordersCount: 2,
    lastPurchase: "2024-03-20",
    segment: "Intermediário",
    avgTicket: 225.00,
    tags: ["Promocional", "Interesse: Acessórios"],
    status: "active"
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mari.costa@outlook.com",
    phone: "5521977665544",
    ltv: 89.90,
    ordersCount: 1,
    lastPurchase: "2023-11-10",
    segment: "Risco de Churn",
    avgTicket: 89.90,
    tags: ["Um Único Pedido"],
    status: "inactive"
  },
  {
    id: "4",
    name: "Juliana Ferreira",
    email: "juju.ferreira@email.com",
    phone: "5531966554433",
    ltv: 3200.00,
    ordersCount: 15,
    lastPurchase: "2024-04-21",
    segment: "VIP",
    avgTicket: 213.33,
    tags: ["Top 1%", "Fiel"],
    status: "active"
  },
  {
    id: "5",
    name: "Roberto Almeida",
    email: "roberto.almeida@empresa.com",
    phone: "5511955443322",
    ltv: 0,
    ordersCount: 0,
    lastPurchase: null,
    segment: "Lead / Novo",
    avgTicket: 0,
    tags: ["Interesse: Masculino"],
    status: "active"
  }
]

export default function CRMPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("Todos")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("clientes")

  const segments = ["Todos", "VIP", "Intermediário", "Risco de Churn", "Lead / Novo"]

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = selectedSegment === "Todos" || c.segment === selectedSegment
    return matchesSearch && matchesSegment
  })

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-6 w-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-border flex-shrink-0">
        <button 
          onClick={() => setActiveTab("clientes")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'clientes' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </div>
          {activeTab === 'clientes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("crm")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'crm' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            CRM & Analytics
          </div>
          {activeTab === 'crm' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("automacao")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'automacao' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Automação
            <span className="ml-1 text-[8px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">BREVE</span>
          </div>
          {activeTab === 'automacao' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
      </div>

      {activeTab === "clientes" && (
        <>
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  +12% <ArrowUpRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total de Clientes</p>
              <h3 className="text-2xl font-black text-foreground">1,284</h3>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Star className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  +5% <ArrowUpRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clientes VIP</p>
              <h3 className="text-2xl font-black text-foreground">142</h3>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                  -2% <ArrowDownRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ticket Médio</p>
              <h3 className="text-2xl font-black text-foreground">R$ 184.20</h3>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  88%
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Taxa de Retenção</p>
              <h3 className="text-2xl font-black text-foreground">72.4%</h3>
            </div>
          </div>

          <div className="flex flex-1 gap-6 min-h-0">
            {/* Main List */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Buscar por nome, e-mail ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {segments.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSegment(s)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter border transition-all ${
                        selectedSegment === s 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-card text-muted-foreground border-border hover:bg-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card shadow-sm scrollbar-hide">
                <table className="w-full text-left text-sm relative">
                  <thead className="bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground sticky top-0 z-10">
                    <tr className="border-b border-border">
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">LTV</th>
                      <th className="px-6 py-4">Pedidos</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Última Compra</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCustomers.map(customer => (
                      <tr 
                        key={customer.id} 
                        onClick={() => setSelectedCustomer(customer)}
                        className={`group cursor-pointer transition-colors hover:bg-secondary/30 ${selectedCustomer?.id === customer.id ? "bg-primary/5" : ""}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs ring-4 ring-primary/5">
                              {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground leading-none">{customer.name}</span>
                              <span className="text-[10px] text-muted-foreground mt-1">{customer.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-black text-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.ltv)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{customer.ordersCount}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-black">Média R$ {customer.avgTicket.toFixed(0)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                            customer.segment === "VIP" ? "bg-orange-100 text-orange-700 border-orange-200" :
                            customer.segment === "Risco de Churn" ? "bg-red-100 text-red-700 border-red-200" :
                            "bg-blue-100 text-blue-700 border-blue-200"
                          }`}>
                            {customer.segment}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground font-medium">
                          {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('pt-BR') : "Nunca"}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Panel */}
            <div className={`w-96 rounded-2xl border border-border bg-card shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${selectedCustomer ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute pointer-events-none"}`}>
              {selectedCustomer && (
                <>
                  <div className="p-8 border-b border-border bg-secondary/20 relative">
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute right-4 top-4 p-2 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center font-black text-primary text-3xl mb-4 border-4 border-primary/20">
                        {selectedCustomer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{selectedCustomer.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{selectedCustomer.email}</p>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{selectedCustomer.segment}</span>
                        <span className={`h-2 w-2 rounded-full ${selectedCustomer.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">LTV Total</p>
                        <p className="text-lg font-black text-foreground">R$ {selectedCustomer.ltv.toFixed(2)}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Avg Ticket</p>
                        <p className="text-lg font-black text-foreground">R$ {selectedCustomer.avgTicket.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          <Target className="h-3 w-3" /> Tags & Perfil
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag: string) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-background border border-border text-[9px] font-bold text-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Atividade Recente
                        </h4>
                        <div className="space-y-3">
                          {[1, 2].map((_, i) => (
                            <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                              {i === 0 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />}
                              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 z-10">
                                <CreditCard className="h-3 w-3 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground">Pedido #{8421 - i} finalizado</p>
                                <p className="text-[10px] text-muted-foreground">Há {i + 2} dias • R$ 145,00</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-border bg-secondary/20 space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <MessageCircle className="h-4 w-4" />
                      Contatar via WhatsApp
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <Zap className="h-4 w-4" />
                      Enviar Cupom Especial
                    </button>
                    <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                      Ver Histórico Completo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "crm" && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
          <BarChart3 className="h-16 w-16 text-primary mb-6 opacity-20" />
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">Analytics Avançado</h3>
          <p className="max-w-md text-muted-foreground text-sm">
            Esta seção conterá gráficos de cohort, churn rate preditivo e análise de clusterização de clientes.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-32 rounded-2xl border border-dashed border-border bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 Gráfico de Análise #{i}
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === "automacao" && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 rounded-full bg-primary/10 text-primary mb-8 animate-bounce">
            <Rocket className="h-12 w-12" />
          </div>
          <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4">Automação de Marketing</h3>
          <p className="max-w-lg text-muted-foreground text-base mb-8">
            Em breve você poderá criar réguas de relacionamento automáticas, como:<br/>
            <span className="text-primary font-bold">"Se cliente não compra há 30 dias, enviar cupom de 10%"</span>
          </p>
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest">
                Lançamento em breve
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
