"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

// Tipagem dos Slides Híbridos
type Slide = {
  id: string
  type: "video" | "image"
  src: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  align?: "left" | "center" | "right"
  textColor?: "white" | "black"
}

// Mocks simulando campanhas da Pink Amazon
const slides: Slide[] = [
  {
    id: "campaign-01",
    type: "video",
    // Usando vídeo genérico de moda livre de royalties (exemplo placeholder)
    src: "https://player.vimeo.com/external/435674703.sd.mp4?s=1f1e78079868be22fb38de2837bc0fba3d526ea0&profile_id=164&oauth2_token_id=57447761",
    title: "ATITUDE EM MOVIMENTO",
    subtitle: "A nova coleção urbana chegou para dominar as ruas.",
    ctaText: "Comprar Lançamentos",
    ctaLink: "/#lancamentos",
    align: "left",
    textColor: "white",
  },
  {
    id: "campaign-02",
    type: "image",
    src: "/images/hero-lifestyle.jpg",
    title: "ATITUDE NEON",
    subtitle: "A noite da cidade é a sua passarela. Chinelos Urbanos desenhados para não passar despercebida.",
    ctaText: "Ver Coleção",
    ctaLink: "/#produtos",
    align: "center",
    textColor: "white",
  },
]

export function VideoHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const SLIDE_DURATION_MS = 6000 // 6 segundos por estático, o vídeo rodará por esse tempo ou mais caso editado futuramente

  // Lógica de Autoplay do Slider
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying) {
      timer = setInterval(() => {
        nextSlide()
      }, SLIDE_DURATION_MS)
    }

    return () => clearInterval(timer)
  }, [currentSlide, isPlaying])

  // Pausar ou dar Play no Vídeo atual baseado no estado global e index
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === currentSlide && isPlaying) {
        video.play().catch(() => {
          // Fallback silencioso se o browser bloquear autoplay via código
        })
      } else {
        video.pause()
      }
    })
  }, [currentSlide, isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-black group">
      
      {/* Container Principal dos Slides */}
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative h-full w-full shrink-0">
            {/* Camada de Mídia Mista */}
            {slide.type === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={slide.src}
                className="h-full w-full object-cover"
                muted
                playsInline
                loop
                poster="/images/hero-bg.jpg" // Fallback rapido
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            )}

            {/* Overlay para escurecimento em áreas de texto se necessário */}
            <div className={`absolute inset-0 bg-black/20`} />

            {/* Conteúdo (Textos e CTAs) */}
            <div className={`absolute inset-0 flex flex-col justify-end pb-24 lg:pb-32 px-6 lg:px-16
              ${slide.align === 'center' ? 'items-center text-center' : ''}
              ${slide.align === 'left' ? 'items-start text-left' : ''}
              ${slide.align === 'right' ? 'items-end text-right' : ''}
            `}>
              <h1 className={`mb-2 font-sans text-5xl font-black uppercase tracking-tight md:text-7xl lg:text-8xl ${slide.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                {slide.title}
              </h1>
              <p className={`mb-8 max-w-xl font-sans text-base font-medium sm:text-lg ${slide.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                {slide.subtitle}
              </p>
              
              <Link
                href={slide.ctaLink}
                className={`inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-[15px] font-bold tracking-wide transition-colors hover:bg-opacity-90 
                  ${slide.textColor === 'white' ? 'bg-white text-black' : 'bg-black text-white'}
                `}
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controles do Slider (Estilo Minimalista) */}
      <div className="absolute bottom-8 left-6 lg:left-16 flex items-center gap-6 z-20">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center text-white transition-opacity hover:opacity-70"
          aria-label={isPlaying ? "Pausar Slider" : "Tocar Slider"}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
        </button>

        {/* Barras de Progresso / Indicadores */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-white/30"
              aria-label={`Ir para o slide ${i + 1}`}
            >
              {/* Barra de preenchimento visível dependendo do estado atual */}
              <div 
                className={`absolute inset-y-0 left-0 bg-white transition-all 
                  ${i === currentSlide && isPlaying ? 'duration-[6000ms] w-full ease-linear' : 'duration-300 ease-out'}
                  ${i < currentSlide ? 'w-full' : ''}
                  ${i > currentSlide ? 'w-0' : ''}
                  ${i === currentSlide && !isPlaying ? 'w-full' : ''}
                `}
                style={{
                   // Hack force-reflow technique for restarts not needed with simple classes above if well tuned, 
                   // mas vamos setar o width inline para o slide atual animar certinho dependendo do `isPlaying` em libs mais soltas
                   width: i === currentSlide ? (isPlaying ? '100%' : '100%') : undefined
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Setas Laterais de Navegação (Minimalistas) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 p-2 text-white/50 transition-colors hover:text-white"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.5} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-2 text-white/50 transition-colors hover:text-white"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.5} />
      </button>

    </section>
  )
}
