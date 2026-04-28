import { API_BASE_URL, apiFetch } from "./api"

export interface ProductSizeStock {
  id?: string
  size: string
  sku_size: string
  quantity: number
}

export interface ProductImage {
  image: string
  is_primary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string | { id: string; name: string; slug: string } | null
  category_name?: string
  price: number | string
  original_price?: number
  discount_percent?: number
  images: string[] | ProductImage[]
  colors?: { name: string; hex_code: string }[]
  sizes?: { size: string | number }[]
  size_stocks?: ProductSizeStock[]
  stock_total?: number
  sku?: string
  rating?: number
  reviews_count?: number
  description: string
  details?: string[]
  is_new?: boolean
  is_active?: boolean
  is_featured?: boolean
  stock_quantity?: number
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface GetProductsOptions {
  category?: string
  includeInactive?: boolean
  requiresAuth?: boolean
}

export async function getProducts(categoryOrOptions?: string | GetProductsOptions): Promise<Product[]> {
  const options =
    typeof categoryOrOptions === "string"
      ? { category: categoryOrOptions }
      : (categoryOrOptions ?? {})

  const searchParams = new URLSearchParams()

  if (options.category) {
    searchParams.set("category", options.category)
  }

  if (options.includeInactive) {
    searchParams.set("is_active", "false")
  }

  const query = searchParams.toString()
  const path = `/api/v1/products/${query ? `?${query}` : ""}`
  const response = await apiFetch<any>(path, { requiresAuth: options.requiresAuth })
  return response?.data?.results || response?.results || response?.data || response || []
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiFetch<any>(`/api/v1/products/${id}/`)
  return response?.data?.results || response?.data || response
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await apiFetch<any>(`/api/v1/products/${slug}/`)
  return response?.data?.results || response?.data || response
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch<any>("/api/v1/products/categories/")
  return response?.data?.results || response?.results || response?.data || response || []
}

export async function getCategoryById(id: string): Promise<Category> {
  return apiFetch<Category>(`/api/v1/products/categories/${id}/`)
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  description?: string
  parent?: string | null
  is_active?: boolean
}

export async function createCategory(data: CreateCategoryPayload): Promise<Category> {
  return apiFetch<Category>("/api/v1/products/categories/", {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
    requiresAuth: true,
  })
}

export async function updateCategory(id: string, data: Partial<CreateCategoryPayload>): Promise<Category> {
  return apiFetch<Category>(`/api/v1/products/categories/${id}/`, {
    method: "PATCH",
    body: data as unknown as Record<string, unknown>,
    requiresAuth: true,
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/products/categories/${id}/`, {
    method: "DELETE",
    requiresAuth: true,
  })
}

export interface CreateProductPayload {
  name: string
  slug: string
  description?: string
  sku: string
  price: string
  is_active?: boolean
  is_featured?: boolean
  category_id?: string
  images?: string[] | ProductImage[]
  uploaded_images?: File[]
  primary_image_index?: number
  size_stocks: { size: string; sku_size?: string; quantity: number }[]
}

export async function createProduct(data: CreateProductPayload): Promise<Product> {
  return apiFetch<Product>("/api/v1/products/", {
    method: "POST",
    body: buildProductRequestBody(data),
    requiresAuth: true,
  })
}

export async function updateProduct(id: string, data: Partial<CreateProductPayload>): Promise<Product> {
  return apiFetch<Product>(`/api/v1/products/${id}/`, {
    method: "PATCH",
    body: buildProductRequestBody(data),
    requiresAuth: true,
  })
}

function buildProductRequestBody(data: Partial<CreateProductPayload>): Record<string, unknown> | FormData {
  const hasUploadedImages = Array.isArray(data.uploaded_images) && data.uploaded_images.length > 0

  if (!hasUploadedImages) {
    return data as Record<string, unknown>
  }

  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue
    }

    if (key === "uploaded_images" && Array.isArray(value)) {
      value.forEach((file: any) => {
        formData.append("uploaded_images", file as Blob)
      })
      continue
    }

    if (key === "images" || key === "size_stocks") {
      formData.append(key, JSON.stringify(value))
      continue
    }

    formData.append(key, String(value))
  }

  return formData
}

export function getProductImageUrl(product: Product): string | null {
  const firstImage = getOrderedProductImages(product)[0]

  if (!firstImage) {
    return null
  }

  return firstImage
}

export function getOrderedProductImages(product: Product): string[] {
  if (!Array.isArray(product.images)) {
    return []
  }

  const normalizedImages = product.images
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          url: normalizeProductUrl(image),
          isPrimary: index === 0,
          order: index,
        }
      }

      return {
        url: normalizeProductUrl(image.image),
        isPrimary: Boolean(image.is_primary),
        order: index,
      }
    })
    .filter((image): image is { url: string; isPrimary: boolean; order: number } => Boolean(image.url))
    .sort((left, right) => {
      if (left.isPrimary === right.isPrimary) {
        return left.order - right.order
      }

      return left.isPrimary ? -1 : 1
    })

  return normalizedImages.map((image) => image.url)
}

export function normalizeProductUrl(url?: string | null): string | null {
  if (!url) {
    return null
  }

  // Se a URL contém localhost:8000, nós a limpamos para forçar o uso de API_BASE_URL
  let cleanUrl = url.replace(/^https?:\/\/localhost:8000/i, "")

  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl
  }

  if (cleanUrl.startsWith("//")) {
    return `https:${cleanUrl}`
  }

  return `${API_BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`
}

export function getProductStoreHref(product: Pick<Product, "id">): string {
  return `/produto/${product.id}`
}

export function getProductAdminEditHref(product: Pick<Product, "id">): string {
  return `/admin/product/${product.id}/update`
}

export function getProductCategoryName(product: Product): string {
  if (!product.category) {
    return "Sem categoria"
  }

  if (typeof product.category === "object") {
    return product.category.name
  }

  return product.category_name || "Sem categoria"
}

export function formatPrice(value: number | string): string {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
