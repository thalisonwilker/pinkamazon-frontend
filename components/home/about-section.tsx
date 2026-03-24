import Image from "next/image"

export function AboutSection() {
  return (
    <section className="relative flex min-h-[700px] w-full items-center overflow-hidden bg-[#111] py-16 lg:py-24" id="sobre">
      {/* Background Image w/ Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about-bg.jpg"
          alt="Pink Amazon Identidade"
          fill
          className="object-cover object-center"
        />
        {/* Gradiente escuro para garantir legibilidade do texto puxando para a esquerda */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/70 md:to-transparent lg:w-[70%]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        {/* Text Content */}
        <div className="flex w-full flex-col md:max-w-md lg:max-w-lg xl:max-w-xl">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E91E7B]">
            Nossa Essência
          </span>
          
          <h2 className="font-sans text-3xl font-black uppercase leading-[1.1] tracking-tighter text-white md:text-4xl lg:text-5xl mb-6">
            Mais que sandálias.<br />
            <span className="text-[#E91E7B]">Pink Amazon é Identidade.</span>
          </h2>
          
          <div className="flex flex-col gap-4 text-[13px] font-medium leading-[1.6] text-gray-200 md:text-[14px]">
            <p className="text-white text-[15px] md:text-[16px] font-bold">
              A Pink Amazon não nasceu para ser apenas uma marca de sandálias. Ela nasceu para representar um estilo de vida.
            </p>

            <p>
              Inspirada na força da Amazônia, na energia vibrante do Brasil e na ousadia de uma estética tropical com atitude urbana, a Pink Amazon transforma cada peça em expressão, presença e personalidade. Nossa essência mistura natureza, moda, conforto e autenticidade em uma identidade visual marcante, divertida e impossível de ignorar.
            </p>

            <p className="text-white font-bold border-l-4 border-[#E91E7B] pl-4 my-1">
              Cada modelo carrega mais do que design.<br/>Carrega conceito.
            </p>

            <p>
              Com estampas exclusivas, cores intensas, elementos da selva reinterpretados de forma fashion e o rosa como assinatura icônica, criamos uma marca que une o selvagem e o sofisticado, o irreverente e o premium, o Brasil e o mundo.
            </p>

            <p>
              A Pink Amazon é para quem não quer passar despercebido. Para quem pisa com estilo, veste atitude e transforma o básico em statement.
            </p>

            <p className="text-[#E91E7B] font-bold mt-1">
              Mais do que acompanhar tendências, queremos criar uma linguagem própria: tropical, urbana, ousada e original.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
