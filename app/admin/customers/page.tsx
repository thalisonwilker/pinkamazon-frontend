"use client"

import { useState, useEffect } from "react"
import { Search, UserCheck, UserPlus, Users } from "lucide-react"
import { getAllUsers, type User } from "@/lib/users"
import { formatPrice } from "@/lib/products"

export default function CustomersAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(err => console.error("Error fetching admin users:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* KPI mini-cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total de Clientes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{users.length > 0 ? users.length : 0}</p>
            <p className="text-xs text-muted-foreground">Clientes Ativos</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Novos esta semana</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Documento</th>
                <th className="px-6 py-4 font-semibold">Telefone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Data Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 bg-secondary/10 h-12"></td>
                  </tr>
                ))
              ) : filtered.map((customer) => (
                <tr key={customer.id} className="transition-colors hover:bg-secondary/20">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-mono text-xs">{customer.document?.doc_number || "N/A"}</td>
                  <td className="px-6 py-4 text-foreground">{customer.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {customer.date_joined ? new Date(customer.date_joined).toLocaleDateString("pt-BR") : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
