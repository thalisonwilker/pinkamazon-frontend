import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-[#0d0914] text-white" id="contato">
      {/* Background Image sem Overlay Escuro (conforme solicitado, cores originais da imagem) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/footer-bg.png"
          alt="Pink Amazon Pattern"
          fill
          className="object-cover object-center"
        />
        {/* Adiciona apenas um overlay suave escurecido nas laterais para legibilidade se a logo for branca, mas como a logo eh normal, deixamos transparente */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16 pt-8">
          {/* Brand & Socials */}
          <div className="flex flex-col gap-6">
            {/* Aumentando a logo para ter mais o formato e espaço de destaque da imagem de ref */}
            <Image 
              src="/images/logo.png" 
              alt="Pink Amazon" 
              width={140} 
              height={140} 
              className="h-28 w-28 object-contain" 
            />
            <p className="max-w-[250px] text-[13px] leading-relaxed text-gray-100/90 font-medium">
              Wild, Bold & Proud. Sandálias criadas no coração da Amazônia com alma brasileira e atitude internacional.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-white/80 transition-colors hover:text-white" aria-label="Instagram">
                <Instagram className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-white/80 transition-colors hover:text-white" aria-label="Facebook">
                <Facebook className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-white/80 transition-colors hover:text-white" aria-label="YouTube">
                <Youtube className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links Navegação */}
          <div className="lg:pl-8">
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-white drop-shadow-md">Navegação</h4>
            <ul className="flex flex-col gap-3">
              {["Inicio", "Loja", "Sobre", "Contato"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[14px] text-gray-200 transition-colors hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-white drop-shadow-md">Categorias</h4>
            <ul className="flex flex-col gap-3">
              {["Plataformas", "Rasteirinhas", "Chinelos", "Anabelas", "Lançamentos"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[14px] text-gray-200 transition-colors hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-white drop-shadow-md">Atendimento</h4>
            <ul className="flex flex-col gap-3 text-[14px] text-gray-200">
              <li>Seg - Sex: 9h às 18h</li>
              <li>contato@pinkamazon.com.br</li>
              <li>(92) 99999-0000</li>
            </ul>
          </div>
        </div>

        {/* Linha separadora mais fina igual a imagem e Copyright centralizado */}
        <div className="mt-16 border-t border-white/20 pt-8 text-center relative z-10">
          <p className="text-[12px] font-medium text-gray-200/80">
            Todos os Direitos Reservados © 2026 Pink Amazon
          </p>
        </div>
      </div>
    </footer>
  )
}
