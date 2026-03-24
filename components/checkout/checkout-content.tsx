"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Trash2,
  CreditCard,
  QrCode,
  Barcode,
  ShieldCheck,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"

type PaymentMethod = "pix" | "credit" | "boleto"

export function CheckoutContent() {
  const { items, removeItem, totalPrice, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [orderPlaced, setOrderPlaced] = useState(false)

  const shipping = totalPrice >= 199 ? 0 : 29.9
  const pixDiscount = paymentMethod === "pix" ? totalPrice * 0.1 : 0
  const finalTotal = totalPrice + shipping - pixDiscount

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
        {/* Left column: items + payment */}
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
                  {item.product.images?.[0]?.image ? (
                    <Image
                      src={item.product.images[0].image}
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
                    Cor: {item.color} · Tamanho: {item.size}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qtd: {item.quantity}
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
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

          {/* Payment methods */}
          <div className="mt-12">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-foreground">
              Forma de Pagamento
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
              {([
                {
                  id: "pix" as const,
                  icon: QrCode,
                  label: "Pix",
                  desc: "10% de desconto",
                },
                {
                  id: "credit" as const,
                  icon: CreditCard,
                  label: "Cartão",
                  desc: "Até 3x sem juros",
                },
                {
                  id: "boleto" as const,
                  icon: Barcode,
                  label: "Boleto",
                  desc: "Vence em 3 dias",
                },
              ]).map((method) => {
                const isActive = paymentMethod === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight text-foreground">{method.label}</p>
                      <p className="text-xs leading-tight text-muted-foreground">{method.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={shipping === 0 ? "font-semibold text-primary" : "text-foreground"}>
                    {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                  </span>
                </div>
                {pixDiscount > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-sm">
                    <span className="font-semibold text-primary">Desconto Pix</span>
                    <span className="font-bold text-primary">
                      {'- '}
                      {formatPrice(pixDiscount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t-2 border-primary/10 pt-5">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">{formatPrice(finalTotal)}</span>
              </div>

              <button
                onClick={() => {
                  setOrderPlaced(true)
                  clearCart()
                }}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
              >
                Finalizar Compra
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Compra 100% segura
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
