"use client"

import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-background overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg" // Substitute with your high res lifestyle shot if available
          alt="Lançamentos Pink Amazon"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Subtle gradient to ensure text readability only on the bottom where CTAs live */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative flex h-full w-full flex-col items-center justify-end pb-16 text-center text-white sm:pb-24">
        <h1 className="mb-2 font-serif text-[10vw] font-black uppercase leading-[0.85] tracking-tighter md:text-[8vw] lg:text-[7vw]">
          SELVAGEM E ORGULHOSA
        </h1>
        <p className="mb-8 max-w-xl text-balance px-4 font-sans text-base font-medium sm:px-0 sm:text-lg">
          O novo drop já chegou. Descubra plataformas e rasteiras com estampas marcantes que ditam a atitude da estação.
        </p>

        <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/#lancamentos"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            Comprar Lançamentos
          </Link>
          <Link
            href="/#produtos"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            Explorar Coleção
          </Link>
        </div>
      </div>
    </section>
  )
}
