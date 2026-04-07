import { apiFetch } from "./api"

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  category_name: string
  price: number
  original_price?: number
  discount_percent?: number
  images: { image: string; is_primary: boolean }[]
  colors: { name: string; hex_code: string }[]
  sizes: { size: number }[]
  rating: number
  reviews_count: number
  description: string
  details: string[]
  is_new?: boolean
  is_active?: boolean
  stock_quantity?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category ? `/api/v1/products/?category=${category}` : "/api/v1/products/"
  const response = await apiFetch<any>(path)
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
  const response = await apiFetch<any>("/api/v1/categories/")
  return response?.data?.results || response?.data || response || []
}

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
