"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar,
  X,
  Check,
  Search,
  MoreVertical,
  Trash2,
  Shield
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeamPage() {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    whatsapp: "",
    document: "",
    is_staff: true
  })

  const getInputErrorClass = (id: string) => {
    const hasError = touched[id] && fieldErrors[id]
    if (hasError) return "border-red-500 focus:border-red-500 focus:ring-red-500/10 animate-shake"
    return "border-border focus:border-primary focus:outline-none"
  }

  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      // Usamos o endpoint de listagem de usuários filtrando por staff se a API suportar,
      // ou filtramos no frontend para esta demonstração.
      const data = await apiFetch<any>("/api/v1/users/", { requiresAuth: true })
      const results = data?.results || data || []
      setAdmins(results.filter((u: any) => u.is_staff))
    } catch (err) {
      console.error("Error fetching team:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await apiFetch("/api/v1/users/admin/", {
        method: "POST",
        body: formData,
        requiresAuth: true
      })
      
      toast({
        title: "Sucesso!",
        description: "Novo administrador cadastrado com sucesso.",
      })
      
      setIsModalOpen(false)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        whatsapp: "",
        document: "",
        is_staff: true
      })
      fetchAdmins()
    } catch (err: any) {
      // Handle DRF style errors
      if (err.data && typeof err.data === 'object' && !Array.isArray(err.data)) {
        const newFieldErrors: Record<string, string> = {}
        const newTouched: Record<string, boolean> = {}
        
        Object.entries(err.data).forEach(([field, messages]) => {
          let msg = ""
          if (Array.isArray(messages) && messages.length > 0) msg = messages[0]
          else if (typeof messages === 'string') msg = messages
          
          if (msg) {
            newFieldErrors[field] = msg
            newTouched[field] = true
          }
        })
        setFieldErrors(newFieldErrors)
        setTouched(newTouched)
      }

      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: err.message || "Verifique os dados e tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredAdmins = admins.filter(a => 
    `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Gestão da Equipe</h1>
          <p className="text-sm text-muted-foreground">Administradores e colaboradores com acesso ao painel</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Novo Administrador
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-card/50" />
          ))
        ) : filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <div key={admin.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <div className="absolute right-4 top-4">
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-tight">{admin.first_name} {admin.last_name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-green-600">Ativo</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">Admin</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {admin.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {admin.whatsapp || "N/A"}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Entrou em {new Date(admin.date_joined).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="flex border-t border-border">
                <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground border-r border-border">
                  Editar Permissões
                </button>
                <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors hover:bg-red-50">
                  Remover Acesso
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center rounded-2xl border-2 border-dashed border-border bg-secondary/10">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Nenhum administrador encontrado.</p>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-card shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-8 py-6">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Novo Administrador</h2>
                <p className="text-xs text-muted-foreground">Cadastre um novo membro para a equipe</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome</label>
                  <input 
                    required
                    type="text"
                    value={formData.first_name}
                    onBlur={() => setTouched({...touched, first_name: true})}
                    onChange={(e) => {
                      setFormData({...formData, first_name: e.target.value})
                      if (touched.first_name) setFieldErrors({...fieldErrors, first_name: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('first_name')}`}
                  />
                  {touched.first_name && fieldErrors.first_name && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.first_name}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sobrenome</label>
                  <input 
                    required
                    type="text"
                    value={formData.last_name}
                    onBlur={() => setTouched({...touched, last_name: true})}
                    onChange={(e) => {
                      setFormData({...formData, last_name: e.target.value})
                      if (touched.last_name) setFieldErrors({...fieldErrors, last_name: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('last_name')}`}
                  />
                  {touched.last_name && fieldErrors.last_name && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.last_name}</p>}
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onBlur={() => setTouched({...touched, email: true})}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value})
                      if (touched.email) setFieldErrors({...fieldErrors, email: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('email')}`}
                  />
                  {touched.email && fieldErrors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.email}</p>}
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Senha Provisória</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onBlur={() => setTouched({...touched, password: true})}
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value})
                      if (touched.password) setFieldErrors({...fieldErrors, password: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('password')}`}
                  />
                  {touched.password && fieldErrors.password && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.password}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                  <input 
                    type="text"
                    value={formData.whatsapp}
                    onBlur={() => setTouched({...touched, whatsapp: true})}
                    onChange={(e) => {
                      setFormData({...formData, whatsapp: e.target.value})
                      if (touched.whatsapp) setFieldErrors({...fieldErrors, whatsapp: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('whatsapp')}`}
                    placeholder="5511999999999"
                  />
                  {touched.whatsapp && fieldErrors.whatsapp && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.whatsapp}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CPF / Documento</label>
                  <input 
                    type="text"
                    value={formData.document}
                    onBlur={() => setTouched({...touched, document: true})}
                    onChange={(e) => {
                      setFormData({...formData, document: e.target.value})
                      if (touched.document) setFieldErrors({...fieldErrors, document: ""})
                    }}
                    className={`rounded-xl border bg-secondary/20 p-3.5 text-sm transition-all ${getInputErrorClass('document')}`}
                  />
                  {touched.document && fieldErrors.document && <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.document}</p>}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
                <Shield className="h-5 w-5 text-primary" />
                <p className="text-[10px] font-bold text-muted-foreground leading-normal">
                  Este usuário terá acesso total ao painel administrativo. Certifique-se de que ele é um membro confiável da equipe.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Finalizar Cadastro
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
