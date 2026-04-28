import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database } from "lucide-react"

export default function PrivacyPage() {
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
          <div className="font-serif text-lg font-bold text-foreground">Política de Privacidade</div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Política de Privacidade</h1>
          <p className="mt-4 text-muted-foreground">Última atualização: {lastUpdate}</p>
        </div>

        <div className="prose prose-pink max-w-none text-muted-foreground">
          <p className="mb-12 text-lg leading-relaxed">
            Na Pink Amazon, a sua privacidade é nossa prioridade. Esta Política de Privacidade explica como coletamos, 
            usamos, protegemos e compartilhamos suas informações pessoais ao utilizar nosso site.
          </p>

          <div className="grid gap-12 md:grid-cols-2">
            <section className="rounded-3xl border border-border p-8 transition-colors hover:border-primary/20">
              <Lock className="mb-4 h-6 w-6 text-primary" />
              <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Coleta de Informações</h2>
              <p className="text-sm leading-relaxed">
                Coletamos informações que você nos fornece diretamente, como nome, e-mail, endereço e CPF, 
                necessários para processar seus pedidos e garantir a segurança da sua conta.
              </p>
            </section>

            <section className="rounded-3xl border border-border p-8 transition-colors hover:border-primary/20">
              <EyeOff className="mb-4 h-6 w-6 text-primary" />
              <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Uso dos Dados</h2>
              <p className="text-sm leading-relaxed">
                Utilizamos seus dados para personalizar sua experiência, processar transações, enviar atualizações 
                sobre pedidos e, opcionalmente, novidades exclusivas da nossa marca.
              </p>
            </section>

            <section className="rounded-3xl border border-border p-8 transition-colors hover:border-primary/20">
              <Database className="mb-4 h-6 w-6 text-primary" />
              <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Segurança</h2>
              <p className="text-sm leading-relaxed">
                Implementamos as melhores práticas de segurança digital e criptografia para proteger seus dados 
                contra acesso não autorizado, alteração ou destruição.
              </p>
            </section>

            <section className="rounded-3xl border border-border p-8 transition-colors hover:border-primary/20">
              <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
              <h2 className="mb-3 font-serif text-xl font-bold text-foreground">Seus Direitos (LGPD)</h2>
              <p className="text-sm leading-relaxed">
                Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento, 
                conforme previsto na Lei Geral de Proteção de Dados (LGPD).
              </p>
            </section>
          </div>

          <section className="mt-16 border-t pt-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Cookies</h2>
            <p className="leading-relaxed">
              Utilizamos cookies para melhorar a funcionalidade do site e entender como você interage com nossos 
              serviços. Você pode gerenciar as preferências de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section className="mb-12 border-t mt-12 pt-12">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Contato sobre Privacidade</h2>
            <p className="leading-relaxed">
              Para qualquer questão relacionada aos seus dados, entre em contato com nosso encarregado de dados: 
              <span className="font-bold text-primary"> privacidade@pinkamazon.com.br</span>
            </p>
          </section>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="border-t bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Pink Amazon. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/privacidade" className="font-bold text-foreground">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
