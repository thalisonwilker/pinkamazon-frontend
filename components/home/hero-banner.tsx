import Image from "next/image"
import Link from "next/link"
import { ArrowDown } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative flex min-h-[550px] w-full items-center overflow-hidden bg-[#E91E7B] lg:h-[650px]">
      {/* Background Image w/ Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-monkey.jpg"
          alt="Desperte Sua Selva Interior"
          fill
          className="object-cover object-[75%_25%] md:object-[center_20%]"
          priority
        />
        {/* Gradiente contido na esquerda para não cobrir o macaco */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#E91E7B] via-[#E91E7B]/90 to-transparent md:bg-gradient-to-r md:from-[#E91E7B] text-transparent md:via-[#E91E7B]/80 md:to-transparent md:w-2/3 lg:w-[55%]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-8">
        {/* Text Content */}
        <div className="flex w-full flex-col items-center text-center md:items-start md:text-left lg:max-w-xl xl:max-w-2xl">
          <h1 className="font-sans text-3xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-4xl lg:text-[3.5rem]">
            Desperte Sua <br />
            Selva Interior
          </h1>
          <p className="mt-6 max-w-lg text-[15px] font-medium leading-relaxed text-white/95 md:mt-8 md:text-lg">
            Inspiradas na energia da Amazônia e desenhadas para quem carrega personalidade nos pés, nossas sandálias unem conforto, ousadia e uma estética autêntica.
            <br /><br />
            Um produto que transforma cada passo em expressão, atitude e estilo.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6 md:items-start lg:gap-5">
            <Link 
              href="/#produtos" 
              className="group flex items-center gap-2 text-[13px] font-bold text-white transition-opacity hover:opacity-80"
            >
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" /> 
              Entrar na Selva
            </Link>
            <Link
              href="/#produtos"
              className="inline-flex items-center justify-center bg-[#111111] px-10 py-5 text-sm font-bold tracking-widest text-white transition-all hover:bg-black"
            >
              Entrar na Selva
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
