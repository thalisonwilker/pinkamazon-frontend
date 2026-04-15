"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, X, Check, Loader2 } from "lucide-react"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface CategoryForm {
  name: string
  slug: string
  description: string
  is_active: boolean
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", is_active: true }

export default function CategoriesAdminPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Create / Edit state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  async function fetchCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error("Erro ao buscar categorias:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowCreateForm(true)
  }

  function openEdit(cat: Category) {
    setShowCreateForm(false)
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      is_active: cat.is_active ?? true,
    })
  }

  function cancelForm() {
    setShowCreateForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: editingId ? prev.slug : slugify(value),
    }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast({ title: "Campo obrigatório", description: "Preencha o nome da categoria.", variant: "destructive" })
      return
    }
    if (!form.slug.trim()) {
      toast({ title: "Campo obrigatório", description: "Preencha o slug da categoria.", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || undefined,
          is_active: form.is_active,
        })
        toast({ title: "Categoria atualizada!" })
      } else {
        await createCategory({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || undefined,
          is_active: form.is_active,
        })
        toast({ title: "Categoria criada!" })
      }
      cancelForm()
      await fetchCategories()
    } catch (err: any) {
      toast({
        title: editingId ? "Erro ao atualizar" : "Erro ao criar",
        description: err?.message || "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleActive(cat: Category) {
    try {
      await deleteCategory(cat.id)
      toast({
        title: cat.is_active ? "Categoria desativada" : "Categoria ativada",
      })
      await fetchCategories()
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message || "Não foi possível alterar o status.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-foreground">Nova Categoria</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Nome *</label>
                <input
                  type="text"
                  placeholder="Ex: Sandálias"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Slug *</label>
                <input
                  type="text"
                  placeholder="sandalias"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Descrição</label>
              <textarea
                rows={2}
                placeholder="Descrição opcional..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="create_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="create_is_active" className="text-sm text-foreground">Ativa</label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelForm}
                  className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome da Categoria</th>
                <th className="px-6 py-4 font-semibold">Slug (URL)</th>
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cat) => (
                <tr key={cat.id} className="transition-colors hover:bg-secondary/20">
                  {editingId === cat.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-sm font-bold focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-sm font-mono focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={cancelForm}
                            className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded p-2 text-primary hover:bg-primary/10 disabled:opacity-50"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-bold text-foreground">{cat.name}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">/{cat.slug}</td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                        {cat.description || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            cat.is_active !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {cat.is_active !== false ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="rounded p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(cat)}
                            className="rounded p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                            title={cat.is_active !== false ? "Desativar" : "Reativar"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
