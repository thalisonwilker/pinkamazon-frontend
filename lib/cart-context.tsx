"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Product } from "./products"

const CART_STORAGE_KEY = "pinkamazon-cart"
const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000

interface PersistedCart {
  items: CartItem[]
  expiresAt: number
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return []
  }

  const rawCart = localStorage.getItem(CART_STORAGE_KEY)
  if (!rawCart) {
    return []
  }

  try {
    const parsed = JSON.parse(rawCart) as PersistedCart

    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return []
    }

    return Array.isArray(parsed.items)
      ? parsed.items.map((item) => ({
          ...item,
          size: String(item.size),
        }))
      : []
  } catch (error) {
    console.error("Erro ao recuperar carrinho salvo:", error)
    localStorage.removeItem(CART_STORAGE_KEY)
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return
    }

    const persistedCart: PersistedCart = {
      items,
      expiresAt: Date.now() + CART_TTL_MS,
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedCart))
  }, [items])

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      )
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, size, color }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size && item.color === color)
      )
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color)
        return
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
