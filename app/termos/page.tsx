import Link from "next/link"
import { ArrowLeft, ScrollText, ShieldCheck, FileText } from "lucide-react"

export default function TermsPage() {
  const lastUpdate = "28 de Abril de 2026"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-primary transition-transform hover:scale-105">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Voltar</span>
          </Link>
          <div className="font-serif text-lg font-bold text-foreground">Termos de Serviço</div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ScrollText className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Termos de Serviço</h1>
          <p className="mt-4 text-muted-foreground">Última atualização: {lastUpdate}</p>
        </div>

        <div className="prose prose-pink max-w-none text-muted-foreground">
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">1. Aceitação dos Termos</h2>
            <p className="leading-relaxed">
              Ao acessar e utilizar o site da Pink Amazon, você concorda em cumprir e estar vinculado aos seguintes Termos de Serviço. 
              Estes termos regem seu uso do nosso site, produtos e serviços. Se você não concordar com qualquer parte destes termos, 
              por favor, não utilize nossos serviços.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">2. Uso do Site</h2>
            <p className="mb-4 leading-relaxed">
              Você concorda em usar o site apenas para fins lícitos e de maneira que não infrinja os direitos de terceiros, nem restrinja 
              ou iniba o uso e usufruto do site por qualquer outra pessoa. Comportamentos proibidos incluem assédio, causar angústia ou 
              inconveniente a qualquer pessoa, transmissão de conteúdo obsceno ou ofensivo.
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Você deve ter pelo menos 18 anos para realizar compras.</li>
              <li>As informações da sua conta devem ser precisas e atualizadas.</li>
              <li>Você é responsável por manter a confidencialidade da sua senha.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">3. Propriedade Intelectual</h2>
            <p className="leading-relaxed">
              Todo o conteúdo incluído ou disponibilizado através do site da Pink Amazon, como textos, gráficos, logotipos, ícones, imagens e 
              compilações de dados, é de propriedade da Pink Amazon ou de seus fornecedores de conteúdo e é protegido pelas leis de 
              direitos autorais brasileiras e internacionais.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">4. Pedidos e Pagamentos</h2>
            <p className="leading-relaxed">
              Todos os pedidos estão sujeitos à aceitação e disponibilidade. Os preços de nossos produtos estão sujeitos a alterações sem 
              aviso prévio. Reservamo-nos o direito de recusar qualquer pedido que você fizer conosco. No caso de fazermos uma alteração ou 
              cancelarmos um pedido, tentaremos notificá-lo através do e-mail fornecido no momento em que o pedido foi feito.
            </p>
          </section>

          <section className="mb-12 border-t pt-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Contato</h2>
            <p className="leading-relaxed">
              Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco através do e-mail: 
              <span className="font-bold text-primary"> contato@pinkamazon.com.br</span>
            </p>
          </section>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="border-t bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Pink Amazon. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <Link href="/termos" className="font-bold text-foreground">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
