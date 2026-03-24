"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    
    // Prepare data for API
    const { confirmPassword, ...registerData } = formData
    
    const result = await register(registerData)
    
    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/minha-conta")
      }, 2000)
    } else {
      setError(result.error ?? "Erro ao criar conta.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="mb-3 font-serif text-3xl font-bold text-foreground">Conta criada!</h1>
          <p className="mb-8 text-muted-foreground">Estamos te redirecionando para sua conta...</p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full animate-[progress_2s_ease-in-out] bg-primary" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Brand (Hidden on mobile) */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-primary">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8 h-32 w-64">
              <Image src="/images/logo.png" alt="Pink Amazon Logo" fill className="object-contain brightness-0 invert" />
            </div>
            <h2 className="mb-4 font-serif text-5xl font-bold text-white uppercase tracking-tighter">Faça parte da tribo</h2>
            <p className="max-w-md text-xl leading-relaxed text-white/90">
              Receba ofertas exclusivas, acompanhe seus pedidos e viva a experiência completa Pink Amazon.
            </p>
            
            <div className="mt-16 flex flex-wrap justify-center gap-6">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20">
                <p className="text-3xl font-bold text-white">10% OFF</p>
                <p className="text-sm font-semibold text-white/80">Na primeira compra</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20">
                <p className="text-3xl font-bold text-white">VIP</p>
                <p className="text-sm font-semibold text-white/80">Lançamentos antecipados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <div className="relative h-12 w-32">
              <Image src="/images/logo.png" alt="Pink Amazon" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Criar sua conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Preencha os dados abaixo para começar</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Ocorreu um erro:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="mb-1.5 block text-xs font-bold uppercase text-foreground/70">Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Nome"
                    required
                    className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last_name" className="mb-1.5 block text-xs font-bold uppercase text-foreground/70">Sobrenome</label>
                <div className="relative">
                  <input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Sobrenome"
                    required
                    className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase text-foreground/70">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@exemplo.com"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase text-foreground/70">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-bold uppercase text-foreground/70">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="mt-2 flex items-start gap-3">
              <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                Eu concordo com os <Link href="#" className="font-semibold text-foreground underline decoration-primary/30 underline-offset-2">Termos de Serviço</Link> e <Link href="#" className="font-semibold text-foreground underline decoration-primary/30 underline-offset-2">Política de Privacidade</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 active:scale-95 disabled:opacity-70"
            >
              {loading ? "Criando conta..." : "Criar minha conta"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-primary transition-colors hover:text-primary/80">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
