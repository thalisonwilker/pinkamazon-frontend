"use client"

import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingProvider } from "./loading-provider"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  )
}
