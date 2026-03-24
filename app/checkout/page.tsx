"use client"

import { ClientLayout } from "@/components/client-layout"
import { CheckoutContent } from "@/components/checkout/checkout-content"

export default function CheckoutPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
        <CheckoutContent />
      </div>
    </ClientLayout>
  )
}
