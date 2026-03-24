"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Heart,
  Share2,
  Copy,
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Check,
} from "lucide-react"
import { type Product, formatPrice } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "")
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState("")
  const [shippingResult, setShippingResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    }
  }

  const handleCalcShipping = () => {
    if (cep.length >= 8) {
      setShippingResult("Entrega em 3-7 dias úteis - Frete Grátis acima de R$ 199")
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!selectedSize) return
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    router.push("/checkout")
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={product.images?.[selectedImage]?.image || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === idx ? "border-primary shadow-sm" : "border-border"
                }`}
              >
                <Image src={img.image} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col">
          {/* Title & Rating */}
          <div className="flex flex-col gap-2">
            {product.is_new && (
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Lançamento
              </span>
            )}
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">{product.category}</p>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews_count} avaliações)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6 flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {product.discount_percent}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {'ou 3x de '}{formatPrice(product.price / 3)}{' sem juros'}
            </p>
          </div>

          {/* Colors */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Cor: <span className="font-normal text-muted-foreground">{selectedColor}</span>
            </p>
            <div className="flex gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex_code }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Tamanho</p>
              <button className="text-xs text-primary underline">Tabela de medidas</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  className={`flex h-10 w-14 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                    selectedSize === sizeObj.size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="mt-2 text-xs text-destructive">Selecione um tamanho</p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-foreground">Quantidade</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  Adicionado ao carrinho
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  Adicionar ao carrinho
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-5 w-5" />
              Comprar agora
            </button>
          </div>

          {/* Wishlist */}
          <button className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <Heart className="h-4 w-4" />
            Salvar como favorito
          </button>

          {/* Share */}
          <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
            <span className="text-xs text-muted-foreground">Compartilhar:</span>
            <button onClick={handleShare} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" aria-label="Compartilhar">
              <Share2 className="h-4 w-4" />
            </button>
            <button onClick={handleCopyLink} className="flex items-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" aria-label="Copiar link">
              <Copy className="h-4 w-4" />
              {copied && <span className="text-xs text-primary">Copiado!</span>}
            </button>
          </div>

          {/* Shipping */}
          <div className="mt-6 rounded-xl border border-border p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              Calcular frete
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                className="flex-1 rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleCalcShipping}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                Calcular
              </button>
            </div>
            {shippingResult && (
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {shippingResult}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Descrição</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
