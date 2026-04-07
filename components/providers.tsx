"use client"

import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingProvider } from "./loading-provider"
import { Toaster } from "@/components/ui/toaster"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  )
}
