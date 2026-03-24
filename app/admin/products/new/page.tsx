"use client"

import { useState } from "react"
import { Save, Image as ImageIcon, Trash2, ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"

export default function NewProductAdminPage() {
  const [activeTab, setActiveTab] = useState("basico")
  const [sizes] = useState([34, 35, 36, 37, 38, 39, 40])
  const [selectedSizes, setSelectedSizes] = useState<number[]>([35, 36, 37, 38])

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="rounded-full p-2 hover:bg-secondary text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Criar Novo Calçado</h1>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105">
          <Save className="h-4 w-4" />
          Publicar Produto
        </button>
      </div>

      <div className="flex gap-4">
        {/* Navigation Tabs */}
        <div className="flex w-64 shrink-0 flex-col gap-2">
          {["basico", "imagens", "precificacao", "grades"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 rounded-xl border border-border bg-card p-8 shadow-sm">
          {activeTab === "basico" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-foreground">Informações Básicas</h2>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Nome do Calçado</label>
                <input type="text" placeholder="Ex: Onça Plataforma Pink" className="w-full rounded-lg border border-border bg-background py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Categoria</label>
                  <select className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Sandálias</option>
                    <option>Rasteiras</option>
                    <option>Plataformas</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Cor Predominante</label>
                  <input type="text" placeholder="Ex: Pink Selvagem" className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Descrição do Produto</label>
                <textarea rows={4} placeholder="Poder e atitude em cada passo..." className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          )}

          {activeTab === "imagens" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-foreground">Mídia do Produto</h2>
              <div className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:bg-secondary">
                <UploadCloud className="mb-2 h-10 w-10 text-primary" />
                <p className="font-bold text-foreground">Arraste fotos profissionais aqui</p>
                <p className="text-xs text-muted-foreground">Formatos suportados: PNG, JPG (Até 5MB)</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="group relative flex h-32 items-center justify-center rounded-lg border border-border bg-background">
                    <ImageIcon className="h-6 w-6 text-muted-foreground opacity-30" />
                    <button className="absolute right-2 top-2 hidden rounded bg-red-500 p-1 text-white group-hover:block">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "precificacao" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-foreground">Precificação</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Preço de Venda (R$)</label>
                  <input type="number" placeholder="259.90" className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Preço Promocional (De/Por)</label>
                  <input type="number" placeholder="Deixe em branco se não houver promo" className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Custo (Produção)</label>
                  <input type="number" placeholder="Oculto para usuários finais" className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-foreground">Grades e SKU (Tamanhos)</h2>
              <p className="text-xs text-muted-foreground">Selecione os tamanhos fabricados para gerar a grade de estoque automaticamente.</p>
              
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size)) setSelectedSizes(selectedSizes.filter(s => s !== size))
                      else setSelectedSizes([...selectedSizes, size].sort())
                    }}
                    className={`h-10 w-10 rounded-full border text-sm font-bold transition-all ${
                      selectedSizes.includes(size) ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {selectedSizes.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Tamanho</th>
                        <th className="px-4 py-3">SKU Variante</th>
                        <th className="px-4 py-3">Estoque Inicial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {selectedSizes.map((size) => (
                        <tr key={size}>
                          <td className="px-4 py-3 font-bold">{size}</td>
                          <td className="px-4 py-3">
                            <input type="text" defaultValue={`PROD-${size}`} className="w-full rounded border border-border px-2 py-1 focus:border-primary focus:outline-none" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" defaultValue={0} className="w-full rounded border border-border px-2 py-1 focus:border-primary focus:outline-none" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
