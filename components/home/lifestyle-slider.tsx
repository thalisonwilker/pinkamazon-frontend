"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { getProducts, getProductImageUrl, getProductStoreHref, type Product } from "@/lib/products"

export function LifestyleSlider() {
  const [products, setProducts] = useState<Product[]>([])
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })])

  useEffect(() => {
    getProducts()
      .then(p => setProducts(p.slice(0, 3)))
      .catch(err => console.error("Error fetching slider products:", err))
  }, [])

  if (products.length === 0) return null

  return (
    <section className="w-full overflow-hidden bg-black">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {products.map((item, index) => (
            <div key={item.id} className="embla__slide relative h-[70vh] min-w-0 flex-[0_0_100%] md:h-[85vh]">
              {/* Main Image - Full Bleed to remove "borders" */}
              <div className="absolute inset-0 z-10 h-full w-full">
                {getProductImageUrl(item) && (
                  <Image
                    src={getProductImageUrl(item) as string}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
              </div>

              {/* Content Overlay - Left on Desktop, Bottom on Mobile */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 pb-12 md:justify-center md:p-16 lg:px-[8%] pointer-events-none">
                <div className="flex flex-col items-center md:items-start gap-4 pointer-events-auto">
                  <h4 className="inline-flex items-center justify-center text-white text-[24px] md:text-[32px] font-extrabold tracking-tighter transition-all hover:scale-105 uppercase italic">
                    {item.name}
                  </h4>
                  
                  <Link
                    href={getProductStoreHref(item)}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-[13px] font-bold tracking-widest uppercase text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20"
                  >
                    Comprar Agora
                  </Link>
                </div>
              </div>

              {/* Vignette for depth and text readability */}
              <div className="absolute inset-0 z-15 pointer-events-none bg-gradient-to-t from-black/80 via-black/10 to-transparent md:bg-none" />
              <div className="hidden md:block absolute inset-0 z-15 pointer-events-none bg-gradient-to-r from-black/70 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
