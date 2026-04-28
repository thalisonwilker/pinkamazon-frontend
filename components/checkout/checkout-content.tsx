"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ShoppingBag,
  Minus,
  Plus,
  Lock,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePublicSettings } from "@/lib/public-settings-context"
import { useCart } from "@/lib/cart-context"
import { formatPrice, getProductImageUrl } from "@/lib/products"
import { createOrder, OrderCreationPayload } from "@/lib/orders"
import { createCheckoutSession } from "@/lib/payments"
import { toast } from "@/hooks/use-toast"

export function CheckoutContent() {
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { settings } = usePublicSettings()
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const payments = [
    { id: "pix", name: "Pix", enabled: settings.stripe_enable_pix },
    { id: "card", name: "Cartão de Crédito (Stripe)", enabled: settings.stripe_enable_cards },
  ].filter((p) => p.enabled)

  const finalTotal = totalPrice

  const handleFinishOrder = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para finalizar seu pedido.",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      const orderPayload: OrderCreationPayload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
        })),
        // Para este checkout simples, usamos endereços mockados ou poderíamos pegar de um form
        shipping_address: "Endereço de Entrega Mockado, 123",
        billing_address: "Endereço de Cobrança Mockado, 123",
      }

      // 1. Create the order in our database
      const newOrder = await createOrder(orderPayload, token)

      if (!newOrder || !newOrder.id) {
        throw new Error("Não foi possível criar o pedido.")
      }

      // 2. Create Stripe Checkout Session
      try {
        const session = await createCheckoutSession(newOrder.id, token)
        if (session && session.checkout_url) {
          // Clear cart before redirecting
          clearCart()
          // Redirect to Stripe
          window.location.href = session.checkout_url
          return
        }
      } catch (paymentError) {
        console.error("Payment session creation failed:", paymentError)
        // If payment session fails, we still have the order created
        // We could redirect to a "My Orders" page or show a specific message
      }

      // 3. Fallback success state (if redirect doesn't happen)
      clearCart()
      setOrderPlaced(true)
      
      toast({
        title: "Pedido realizado!",
        description: "Seu pedido foi criado. Por favor, verifique seus e-mails para o pagamento.",
      })

    } catch (error) {
      console.error("Failed to place order:", error)
      toast({
        title: "Erro ao finalizar pedido",
        description: "Não foi possível processar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  /* ---- Order placed state ---- */
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Pedido realizado!</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Obrigado por comprar na Pink Amazon. Você receberá um e-mail com os detalhes do pedido e informações de rastreamento.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-lg"
        >
          Continuar comprando
        </Link>
      </div>
    )
  }

  /* ---- Empty cart state ---- */
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">Seu carrinho está vazio</h2>
        <p className="text-sm text-muted-foreground">Adicione produtos para continuar.</p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para loja
        </Link>
      </div>
    )
  }

  /* ---- Main checkout ---- */
  return (
    <div className="flex flex-col gap-8">
      {/* Back link */}
      <Link
        href="/"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Continuar comprando
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-foreground md:text-4xl">
        Checkout
      </h1>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Left column: items */}
        <div className="flex-1">
          {/* Items header */}
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-foreground">
            Seus Itens ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          {/* Item cards */}
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                  {getProductImageUrl(item.product) ? (
                    <Image
                      src={getProductImageUrl(item.product) as string}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/20 m-auto" />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-0.5">
                  <h3 className="text-base font-bold leading-tight text-foreground">{item.product.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.color && item.color !== "Default" ? `Cor: ${item.color} · ` : ""}Tamanho: {item.size}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id, item.size, item.color)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  aria-label="Remover item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: summary */}
        <div className="w-full lg:w-[360px]">
          <div className="sticky top-24 overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-lg shadow-primary/5">
            {/* Pink accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-primary/80" />
            
            <div className="p-6">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-foreground">
                Resumo
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t-2 border-primary/10 pt-5">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">{formatPrice(finalTotal)}</span>
              </div>

              {!isAuthenticated && !isAuthLoading && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <Lock className="h-4 w-4" />
                    Faça login para concluir a compra
                  </div>
                  <p className="mt-1.5 text-xs">
                    Você será redirecionado para a página de login.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleFinishOrder}
                  disabled={isPlacingOrder || !isAuthenticated}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-extrabold text-primary-foreground transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                  <span>{isPlacingOrder ? "Processando..." : "Finalizar Compra"}</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Pagamento seguro com Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
