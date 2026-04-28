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
  Ruler,
} from "lucide-react"
import { type Product, formatPrice, getOrderedProductImages, getProductCategoryName, getProductImageUrl } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const DEFAULT_SIZE_CHART = [
  { br: "34", cm: "22,5 cm", us: "5" },
  { br: "35", cm: "23,0 cm", us: "5.5" },
  { br: "36", cm: "24,0 cm", us: "6" },
  { br: "37", cm: "24,5 cm", us: "7" },
  { br: "38", cm: "25,0 cm", us: "7.5" },
  { br: "39", cm: "26,0 cm", us: "8" },
  { br: "40", cm: "26,5 cm", us: "9" },
]

export function ProductDetail({ product }: { product: Product }) {
  const availableSizes = (product.size_stocks || []).filter((item) => item.quantity > 0)
  const productImages = getOrderedProductImages(product)
  const sizeChart = Array.from(new Set((product.size_stocks || []).map((item) => String(item.size))))
    .sort((left, right) => Number(left) - Number(right))
    .map((size) => DEFAULT_SIZE_CHART.find((row) => row.br === size) || { br: size, cm: "Consulte a forma", us: "-" })

  const displayedSizeChart = sizeChart.length > 0 ? sizeChart : DEFAULT_SIZE_CHART

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "Default")
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState("")
  const [shippingResult, setShippingResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const router = useRouter()
  const selectedSizeStock = availableSizes.find((item) => item.size === selectedSize)
  const maxQuantity = selectedSizeStock?.quantity || 1

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
    if (selectedSize === null) return
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (selectedSize === null) return
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
              src={productImages[selectedImage] || getProductImageUrl(product) || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3 flex-wrap">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === idx ? "border-primary shadow-sm" : "border-border"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
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
            <p className="text-sm text-muted-foreground">{getProductCategoryName(product)}</p>

            {!!product.rating && !!product.reviews_count && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
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
            )}
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
          </div>

          {/* Colors */}
          {!!product.colors?.length && (
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
          )}

          {/* Sizes */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Tamanho</p>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4">
                    <Ruler className="h-3.5 w-3.5" />
                    Tabela de medidas
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Tabela de medidas</DialogTitle>
                    <DialogDescription>
                      Use a referência abaixo para escolher o tamanho ideal. Se você estiver entre dois números, prefira o maior para um ajuste mais confortável.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold">BR</th>
                          <th className="px-4 py-3 font-semibold">Palmilha</th>
                          <th className="px-4 py-3 font-semibold">US</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                        {displayedSizeChart.map((row) => (
                          <tr key={row.br}>
                            <td className="px-4 py-3 font-semibold text-foreground">{row.br}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.cm}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-xl bg-secondary/40 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Como medir seu pé</p>
                    <p className="mt-2">
                      Apoie o pé em uma folha, marque o calcanhar e a ponta do dedo mais longo e meça a distância entre os dois pontos. Compare o resultado com a coluna de palmilha.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sizeObj) => (
                <button
                  key={sizeObj.id || sizeObj.size}
                  onClick={() => {
                    setSelectedSize(sizeObj.size)
                    setQuantity(1)
                  }}
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
            {availableSizes.length === 0 && (
              <p className="mt-2 text-xs text-destructive">Produto sem estoque disponível</p>
            )}
            {!selectedSize && availableSizes.length > 0 && (
              <p className="mt-2 text-xs text-destructive">Selecione um tamanho</p>
            )}
            {selectedSizeStock && (
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedSizeStock.quantity} unidade(s) disponíveis neste tamanho
              </p>
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
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={selectedSize === null || quantity >= maxQuantity}
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
              disabled={selectedSize === null || availableSizes.length === 0}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed md:px-7 md:py-3.5"
            >
              {addedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Adicionado ao carrinho
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Adicionar ao carrinho
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={selectedSize === null || availableSizes.length === 0}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed md:px-7 md:py-3.5"
            >
              <Zap className="h-4 w-4" />
              Comprar agora
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`}
            />
            {isFavorite(product.id) ? "Remover dos favoritos" : "Salvar como favorito"}
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
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description || "Sem descrição disponível para este produto." }}
            />
            {!!product.details?.length && (
            <ul className="mt-4 flex flex-col gap-1.5">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {detail}
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
