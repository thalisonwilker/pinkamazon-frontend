"use client"

import { useState, useEffect, use, useRef } from "react"
import { Save, Trash2, ArrowLeft, Plus, Loader2, X, Check, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  getProductById,
  getCategories,
  updateProduct,
  createCategory,
  normalizeProductUrl,
  type Product,
  type Category,
  type ProductImage,
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

interface SizeStockRow {
  size: string
  sku_size: string
  quantity: number
}

interface ProductImageItem {
  id: string
  previewUrl: string
  existingUrl?: string
  file?: File
  isPrimary: boolean
}

export default function UpdateProductAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const imagesRef = useRef<ProductImageItem[]>([])

  // Form fields
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [price, setPrice] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState<ProductImageItem[]>([])

  // Inline create category
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [isSavingCat, setIsSavingCat] = useState(false)

  // Size stocks
  const availableSizes = [34, 35, 36, 37, 38, 39, 40]
  const [sizeStocks, setSizeStocks] = useState<SizeStockRow[]>([])

  useEffect(() => {
    Promise.all([
      getProductById(id),
      getCategories(),
    ])
      .then(([product, cats]) => {
        setCategories(cats)

        // Populate form from product data
        setName(product.name || "")
        setSku(product.sku || "")
        setDescription(product.description || "")
        setPrice(String(product.price || ""))
        setIsActive(product.is_active !== false)
        setIsFeatured(product.is_featured === true)

        // Category - handle both object and string formats
        if (product.category && typeof product.category === "object") {
          setCategoryId(product.category.id)
        } else if (product.category) {
          setCategoryId(String(product.category))
        }

        // Images - handle both string[] and {image, is_primary}[] formats
        if (Array.isArray(product.images)) {
          const normalizedImages = product.images.map((img, index) => {
            if (typeof img === "string") {
              return {
                id: `existing-${index}`,
                previewUrl: normalizeProductUrl(img) || img,
                existingUrl: img,
                isPrimary: index === 0,
              }
            }

            const image = img as ProductImage
            return {
              id: `existing-${index}`,
              previewUrl: normalizeProductUrl(image.image) || image.image,
              existingUrl: image.image,
              isPrimary: Boolean(image.is_primary),
            }
          })

          if (normalizedImages.length > 0 && !normalizedImages.some((image) => image.isPrimary)) {
            normalizedImages[0].isPrimary = true
          }

          setImages(normalizedImages)
        }

        // Size stocks
        if (product.size_stocks && product.size_stocks.length > 0) {
          setSizeStocks(
            product.size_stocks.map((s) => ({
              size: String(s.size),
              sku_size: s.sku_size || "",
              quantity: s.quantity || 0,
            }))
          )
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar produto:", err)
        toast({ title: "Erro", description: "Não foi possível carregar o produto.", variant: "destructive" })
      })
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.previewUrl)
        }
      })
    }
  }, [])

  function toggleSize(size: number) {
    const sizeStr = String(size)
    const exists = sizeStocks.find((s) => s.size === sizeStr)
    if (exists) {
      setSizeStocks(sizeStocks.filter((s) => s.size !== sizeStr))
    } else {
      const base = sku || "PROD"
      setSizeStocks(
        [...sizeStocks, { size: sizeStr, sku_size: `${base}-${size}`, quantity: 0 }].sort(
          (a, b) => Number(a.size) - Number(b.size)
        )
      )
    }
  }

  function updateSizeStock(size: string, field: "sku_size" | "quantity", value: string | number) {
    setSizeStocks(sizeStocks.map((s) => (s.size === size ? { ...s, [field]: value } : s)))
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length === 0) {
      return
    }

    setImages((current) => {
      const nextItems = selectedFiles.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        previewUrl: URL.createObjectURL(file),
        file,
        isPrimary: current.length === 0 && index === 0,
      }))

      return [...current, ...nextItems]
    })

    event.target.value = ""
  }

  function removeImage(imageId: string) {
    setImages((current) => {
      const removedImage = current.find((image) => image.id === imageId)

      if (removedImage?.file) {
        URL.revokeObjectURL(removedImage.previewUrl)
      }

      const nextImages = current.filter((image) => image.id !== imageId)
      if (nextImages.length > 0 && !nextImages.some((image) => image.isPrimary)) {
        nextImages[0] = { ...nextImages[0], isPrimary: true }
      }

      return nextImages
    })
  }

  function setPrimaryImage(imageId: string) {
    setImages((current) => current.map((image) => ({
      ...image,
      isPrimary: image.id === imageId,
    })))
  }

  async function handleCreateCategory() {
    if (!newCatName.trim()) return
    setIsSavingCat(true)
    try {
      const created = await createCategory({
        name: newCatName.trim(),
        slug: slugify(newCatName),
      })
      setCategories((prev) => [...prev, created])
      setCategoryId(created.id)
      setNewCatName("")
      setShowNewCategory(false)
      toast({ title: "Categoria criada!", description: `"${created.name}" foi adicionada.` })
    } catch (err: any) {
      toast({
        title: "Erro ao criar categoria",
        description: err?.message || "Verifique os dados.",
        variant: "destructive",
      })
    } finally {
      setIsSavingCat(false)
    }
  }

  async function handleSubmit() {
    if (!name.trim()) {
      toast({ title: "Campo obrigatório", description: "Preencha o nome do produto.", variant: "destructive" })
      return
    }
    if (!sku.trim()) {
      toast({ title: "Campo obrigatório", description: "Preencha o SKU do produto.", variant: "destructive" })
      return
    }
    if (!price || Number(price) <= 0) {
      toast({ title: "Campo obrigatório", description: "Informe um preço válido.", variant: "destructive" })
      return
    }
    if (sizeStocks.length === 0) {
      toast({ title: "Grade obrigatória", description: "Selecione ao menos um tamanho.", variant: "destructive" })
      return
    }
    if (images.length === 0) {
      toast({ title: "Imagem obrigatória", description: "Envie ou mantenha ao menos uma imagem do produto.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      await updateProduct(id, {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || undefined,
        sku: sku.trim(),
        price,
        is_active: isActive,
        is_featured: isFeatured,
        category_id: categoryId || undefined,
        images: images
          .filter((image) => image.existingUrl)
          .map((image) => ({ image: image.existingUrl!, is_primary: image.isPrimary })),
        uploaded_images: images.map((image) => image.file).filter((file): file is File => Boolean(file)),
        primary_image_index: images.findIndex((image) => image.isPrimary),
        size_stocks: sizeStocks.map((s) => ({
          size: s.size,
          sku_size: s.sku_size || undefined,
          quantity: Number(s.quantity),
        })),
      })
      toast({ title: "Produto atualizado!", description: "As alterações foram salvas." })
      router.push("/admin/products")
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: err?.message || "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="rounded-full p-2 hover:bg-secondary text-muted-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground">
            Editar {name || "Produto"}
          </h1>
          <span className="text-xs text-muted-foreground">ID: {id}</span>
        </div>
      </div>

      {/* Informações Básicas */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-foreground">Informações Básicas</h2>
        <div className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Nome do Calçado *</label>
            <input
              type="text"
              placeholder="Ex: Onça Plataforma Pink"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {name && (
              <p className="mt-1 text-xs text-muted-foreground">Slug: {slugify(name)}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">SKU *</label>
              <input
                type="text"
                placeholder="Ex: ONCA-PLAT-001"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Categoria</label>
              {!showNewCategory ? (
                <div className="flex gap-2">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-dashed border-primary px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
                    title="Criar nova categoria"
                  >
                    <Plus className="h-3.5 w-3.5" /> Nova
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nome da nova categoria"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateCategory())}
                    autoFocus
                    className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isSavingCat || !newCatName.trim()}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isSavingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewCategory(false); setNewCatName("") }}
                    className="flex shrink-0 items-center rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Descrição do Produto</label>
            <textarea
              rows={4}
              placeholder="Poder e atitude em cada passo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-foreground">
              Produto ativo (visível na loja)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_featured" className="text-sm font-semibold text-foreground">
              Produto em destaque
            </label>
          </div>
        </div>
      </section>

      {/* Imagens */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-foreground">Imagens do Produto</h2>
        <div className="flex flex-col gap-6">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-6 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10">
            <Upload className="h-4 w-4" />
            Enviar novas imagens
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
          <p className="text-xs text-muted-foreground">
            Você pode manter imagens existentes, remover as que não quiser mais e enviar novas. Escolha uma imagem principal antes de salvar.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className={`group relative overflow-hidden rounded-lg border bg-background ${image.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                <img src={image.previewUrl} alt={`Imagem ${index + 1}`} className="h-32 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(image.id)}
                    className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${image.isPrimary ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                  >
                    {image.isPrimary ? "Principal" : "Definir principal"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="rounded bg-red-500 p-1 text-white transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                    Principal
                  </span>
                )}
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background">
                <p className="text-sm text-muted-foreground">Nenhuma imagem disponível</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Precificação */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-foreground">Precificação</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Preço de Venda (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="259.90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Grades */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <h2 className="mb-2 text-base sm:text-lg font-bold text-foreground">Grades e SKU (Tamanhos) *</h2>
        <p className="mb-6 text-xs text-muted-foreground">Selecione os tamanhos fabricados para gerar a grade de estoque automaticamente.</p>
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`h-10 w-10 rounded-full border text-sm font-bold transition-all ${
                  sizeStocks.some((s) => s.size === String(size))
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {sizeStocks.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Tamanho</th>
                    <th className="px-4 py-3">SKU Variante</th>
                    <th className="px-4 py-3">Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {sizeStocks.map((row) => (
                    <tr key={row.size}>
                      <td className="px-4 py-3 font-bold">{row.size}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={row.sku_size}
                          onChange={(e) => updateSizeStock(row.size, "sku_size", e.target.value)}
                          className="w-full rounded border border-border px-2 py-1 focus:border-primary focus:outline-none bg-background"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={row.quantity}
                          onChange={(e) => updateSizeStock(row.size, "quantity", Number(e.target.value))}
                          className="w-full rounded border border-border px-2 py-1 focus:border-primary focus:outline-none bg-background"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Botão de submit */}
      <div className="flex justify-end pb-4 sm:pb-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 sm:px-8 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSubmitting ? "Salvando..." : "Atualizar Item"}
        </button>
      </div>
    </div>
  )
}
